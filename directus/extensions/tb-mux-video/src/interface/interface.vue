<template>
  <div class="mux-video-interface" :class="{ disabled: disabled }">
    <div v-if="phase === 'ready' && playbackId" class="player-wrap">
      <mux-player
        ref="playerRef"
        :playback-id="playbackId"
        :playback-token="playbackToken || undefined"
        :thumbnail-token="thumbnailToken || undefined"
        :thumbnail-time="0"
        stream-type="on-demand"
        disableremoteplayback
        :accent-color="accent || undefined"
        :metadata-video-title="metadataTitle"
        :metadata-viewer-user-id="viewerId || undefined"
      />
      <div class="meta-row">
        <span class="meta-pill ready">Ready</span>
        <span v-if="duration" class="meta-text">{{ formattedDuration }}</span>
        <span v-if="aspectRatio" class="meta-text">{{ aspectRatio }}</span>
        <span v-if="maxStoredResolution" class="meta-text">{{ maxStoredResolution }}</span>
        <span class="meta-text mono">{{ playbackId }}</span>
      </div>
      <div class="actions">
        <v-button :disabled="disabled" small secondary @click="startReplace">
          <v-icon name="upload_file" left />
          Replace
        </v-button>
        <v-button :disabled="disabled" small secondary danger @click="clearValue">
          <v-icon name="close" left />
          Clear
        </v-button>
      </div>
    </div>

    <div v-else-if="phase === 'preparing'" class="processing">
      <v-progress-circular indeterminate small />
      <div class="processing-text">
        <strong>Processing on Mux…</strong>
        <span class="meta-text">
          Asset {{ assetId || '—' }} {{ pollingActive ? '· checking status' : '' }}
        </span>
      </div>
      <div class="actions">
        <v-button :disabled="disabled || pollingActive" small secondary @click="pollNow">
          Refresh
        </v-button>
        <v-button :disabled="disabled" small secondary @click="startReplace">
          Replace
        </v-button>
        <v-button :disabled="disabled" small secondary danger @click="clearValue">
          Clear
        </v-button>
      </div>
    </div>

    <div v-else-if="phase === 'errored'" class="errored">
      <v-icon name="error" />
      <div class="processing-text">
        <strong>Mux processing failed</strong>
        <span v-if="errorMessage" class="meta-text">{{ errorMessage }}</span>
      </div>
      <div class="actions">
        <v-button :disabled="disabled" small secondary @click="startReplace">
          Try again
        </v-button>
        <v-button :disabled="disabled" small secondary danger @click="clearValue">
          Clear
        </v-button>
      </div>
    </div>

    <div v-else class="uploader-wrap">
      <mux-uploader
        ref="uploaderRef"
        :no-drop="disabled ? true : null"
      >
        <template>
          <div class="uploader-empty">
            <v-icon name="cloud_upload" large />
            <div class="uploader-empty-title">Upload a video to Mux</div>
            <div class="uploader-empty-sub">Drop a file here or click to browse.</div>
          </div>
        </template>
      </mux-uploader>
      <div v-if="uploadError" class="upload-error">
        <v-icon name="error" small />
        <span>{{ uploadError }}</span>
      </div>
      <div class="manual-entry">
        <div class="manual-entry-label">Or link an existing Mux video</div>
        <p class="manual-entry-hint">
          Paste an
          <strong>Asset ID</strong>
          (Mux dashboard) or a
          <strong>Playback ID</strong>
          (stream/embed URL). Asset ID is preferred when both are available.
        </p>
        <div class="manual-entry-row">
          <v-input
            v-model="manualId"
            placeholder="Asset ID or Playback ID"
            :disabled="disabled || manualLoading"
            @keyup.enter="applyManualId"
          />
          <v-button
            :disabled="disabled || manualLoading || !manualId.trim()"
            :loading="manualLoading"
            small
            @click="applyManualId"
          >
            Apply
          </v-button>
        </div>
        <div v-if="manualError" class="upload-error manual-entry-error">
          <v-icon name="error" small />
          <span>{{ manualError }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from "vue";

type MuxValue = {
  provider?: string;
  status?: "preparing" | "ready" | "errored" | string;
  providerMetadata?: {
    mux?: {
      uploadId?: string;
      assetId?: string;
      playbackId?: string;
      playbackToken?: string | null;
      thumbnailToken?: string | null;
    };
  };
  duration?: number | null;
  aspectRatio?: string | null;
  maxStoredResolution?: string | null;
  createdAt?: number | null;
  updatedAt?: number | null;
  poster?: string | null;
  sources?: Array<{ src: string; type?: string }> | null;
  error?: string | null;
} | null;

export default defineComponent({
  name: "InterfaceMuxVideo",
  props: {
    value: { type: [Object, String, null] as unknown as () => MuxValue, default: null },
    disabled: { type: Boolean, default: false },
    playbackPolicy: { type: String, default: "public" },
    videoQuality: { type: String, default: "basic" },
    maxResolution: { type: String, default: "1080p" },
    mp4Support: { type: String, default: "none" },
    accent: { type: String, default: "" },
    autoPoll: { type: Boolean, default: true },
    collection: { type: String, default: "" },
    field: { type: String, default: "" },
    primaryKey: { type: [String, Number], default: "+" },
  },
  emits: ["input"],
  setup(props, { emit }) {
    const api = inject<any>("api");
    const stores = inject<any>("stores");

    const uploaderRef = ref<HTMLElement | null>(null);
    const playerRef = ref<HTMLElement | null>(null);
    const replacing = ref(false);
    const uploadError = ref<string | null>(null);
    const pollingActive = ref(false);
    const errorMessage = ref<string | null>(null);
    const manualId = ref("");
    const manualError = ref<string | null>(null);
    const manualLoading = ref(false);
    const resumeUploadId = ref<string | null>(null);
    const resumeAssetId = ref<string | null>(null);
    const resumeAssetPlaybackId = ref<string | null>(null);
    const resumeAssetPlaybackToken = ref<string | null>(null);
    const resumeAssetThumbnailToken = ref<string | null>(null);
    let pollTimer: ReturnType<typeof setTimeout> | null = null;
    let currentUploadId: string | null = null;
    let emittingValue = false;

    const parsedValue = computed<MuxValue>(() => {
      const raw = props.value as unknown;
      if (!raw) return null;
      if (typeof raw === "string") {
        try {
          return JSON.parse(raw) as MuxValue;
        } catch {
          return null;
        }
      }
      return raw as MuxValue;
    });

    const status = computed(() => parsedValue.value?.status ?? null);
    const assetId = computed(() => parsedValue.value?.providerMetadata?.mux?.assetId ?? null);
    const uploadId = computed(() => parsedValue.value?.providerMetadata?.mux?.uploadId ?? null);
    const playbackId = computed(() => parsedValue.value?.providerMetadata?.mux?.playbackId ?? null);
    const playbackToken = computed(() => parsedValue.value?.providerMetadata?.mux?.playbackToken ?? null);
    const thumbnailToken = computed(() => parsedValue.value?.providerMetadata?.mux?.thumbnailToken ?? null);
    const duration = computed(() => parsedValue.value?.duration ?? null);
    const aspectRatio = computed(() => parsedValue.value?.aspectRatio ?? null);
    const maxStoredResolution = computed(() => parsedValue.value?.maxStoredResolution ?? null);

    const phase = computed<"empty" | "preparing" | "ready" | "errored">(() => {
      if (replacing.value) return "empty";
      if (!parsedValue.value) return "empty";
      if (status.value === "ready" && playbackId.value) return "ready";
      if (status.value === "errored") return "errored";
      if (status.value === "preparing" || assetId.value || uploadId.value) return "preparing";
      return "empty";
    });

    const formattedDuration = computed(() => {
      const d = duration.value;
      if (!d || !Number.isFinite(d)) return "";
      const totalSeconds = Math.round(d);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const pad = (n: number) => n.toString().padStart(2, "0");
      return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
    });

    const metadataTitle = computed(() => {
      const collection = props.collection ? String(props.collection) : "";
      const key = props.primaryKey != null ? String(props.primaryKey) : "";
      return collection || key ? `${collection}#${key}` : "";
    });

    const viewerId = computed(() => {
      try {
        const userStore = stores?.useUserStore?.();
        return userStore?.currentUser?.id ?? "";
      } catch {
        return "";
      }
    });

    function sessionKeyFor(collection: string, field: string, primaryKey: string | number): string {
      return `directus-extension-mux-video:${collection || "_"}:${field || "_"}:${String(primaryKey ?? "+")}`;
    }

    function storageKey(): string {
      return sessionKeyFor(props.collection, props.field, props.primaryKey ?? "+");
    }

    function clearPersistedSessionState(...extraPrimaryKeys: Array<string | number>) {
      try {
        const keys = new Set<string>([
          storageKey(),
          sessionKeyFor(props.collection, props.field, "+"),
        ]);
        for (const primaryKey of extraPrimaryKeys) {
          keys.add(sessionKeyFor(props.collection, props.field, primaryKey));
        }
        for (const key of keys) sessionStorage.removeItem(key);
      } catch {
        /* private mode / quota */
      }
    }

    function hasMuxPayload(v: MuxValue | undefined): boolean {
      if (v === null || v === undefined) return false;
      if (typeof v !== "object") return false;
      const mux = v.providerMetadata?.mux;
      return Boolean(
        v.status === "preparing" ||
          v.status === "ready" ||
          v.status === "errored" ||
          mux?.uploadId ||
          mux?.assetId ||
          mux?.playbackId,
      );
    }

    function persistSessionState(next: MuxValue) {
      try {
        const key = storageKey();
        if (next !== null && hasMuxPayload(next)) {
          sessionStorage.setItem(key, JSON.stringify(next));
        } else {
          sessionStorage.removeItem(key);
        }
      } catch {
        /* private mode / quota */
      }
    }

    function emitValue(next: MuxValue) {
      replacing.value = false;
      emittingValue = true;
      emit("input", next as unknown);
      persistSessionState(next);
      nextTick(() => {
        emittingValue = false;
      });
    }

    function apiErrorMessage(err: unknown): string {
      const e = err as { response?: { data?: { errors?: { message?: string }[] } }; message?: string };
      const msg = e?.response?.data?.errors?.[0]?.message;
      if (typeof msg === "string") return msg;
      return typeof e?.message === "string" ? e.message : "Request failed.";
    }

    async function applyManualId() {
      const id = manualId.value.trim();
      if (!id || props.disabled) return;
      manualLoading.value = true;
      manualError.value = null;
      try {
        const res = await api.post("/mux/lookup", { id });
        const asset = res?.data?.data as
          | {
              id: string;
              status: string;
              playbackId: string | null;
              playbackToken?: string | null;
              thumbnailToken?: string | null;
              duration?: number | null;
              aspectRatio?: string | null;
              maxStoredResolution?: string | null;
              createdAt?: number | null;
              updatedAt?: number | null;
              poster?: string | null;
              sources?: Array<{ src: string; type?: string }> | null;
              errors?: { messages?: string[] } | null;
            }
          | undefined;
        if (!asset) {
          throw new Error("Invalid lookup response.");
        }

        if (asset.status === "ready") {
          emitValue({
            provider: "mux",
            status: "ready",
            providerMetadata: {
              mux: {
                assetId: asset.id,
                playbackId: asset.playbackId,
                playbackToken: asset.playbackToken ?? null,
                thumbnailToken: asset.thumbnailToken ?? null,
              },
            },
            duration: asset.duration ?? null,
            aspectRatio: asset.aspectRatio ?? null,
            maxStoredResolution: asset.maxStoredResolution ?? null,
            createdAt: asset.createdAt ? Number(asset.createdAt) * 1000 : Date.now(),
            updatedAt: Date.now(),
            poster: typeof asset.poster === "string" ? asset.poster : null,
            sources: Array.isArray(asset.sources) ? asset.sources : [],
          });
          manualId.value = "";
          return;
        }

        if (asset.status === "errored") {
          const msg = Array.isArray(asset.errors?.messages)
            ? asset.errors.messages.join("; ")
            : "Mux reported an error for this asset.";
          errorMessage.value = msg;
          emitValue({
            provider: "mux",
            status: "errored",
            providerMetadata: { mux: { assetId: asset.id } },
            error: msg,
          });
          manualId.value = "";
          return;
        }

        emitValue({
          provider: "mux",
          status: "preparing",
          providerMetadata: {
            mux: {
              assetId: asset.id,
              playbackId: asset.playbackId,
              playbackToken: asset.playbackToken ?? null,
              thumbnailToken: asset.thumbnailToken ?? null,
            },
          },
          createdAt: Date.now(),
        });
        manualId.value = "";
        if (props.autoPoll) {
          beginAssetPolling(asset.id, asset.playbackId, asset.playbackToken ?? null, asset.thumbnailToken ?? null);
        }
      } catch (err: unknown) {
        manualError.value = apiErrorMessage(err);
      } finally {
        manualLoading.value = false;
      }
    }

    function clearValue() {
      stopPolling();
      currentUploadId = null;
      errorMessage.value = null;
      uploadError.value = null;
      manualId.value = "";
      manualError.value = null;
      emitValue(null);
    }

    function startReplace() {
      replacing.value = true;
      errorMessage.value = null;
      uploadError.value = null;
      nextTick(attachUploader);
    }

    async function createDirectUpload(): Promise<string> {
      const payload = {
        playbackPolicy: props.playbackPolicy,
        videoQuality: props.videoQuality,
        maxResolution: props.maxResolution,
        mp4Support: props.mp4Support,
        passthrough: metadataTitle.value || undefined,
      };
      const res = await api.post("/mux/uploads", payload);
      const data = res?.data?.data;
      if (!data?.url || !data?.id) {
        throw new Error("Mux returned an invalid upload response.");
      }
      currentUploadId = data.id;
      uploadError.value = null;

      // Optimistic preparing state with the upload id, no asset yet.
      emitValue({
        provider: "mux",
        status: "preparing",
        providerMetadata: { mux: { uploadId: data.id } },
        createdAt: Date.now(),
      });

      return data.url;
    }

    function attachUploader() {
      const el = uploaderRef.value as any;
      if (!el) return;

      el.endpoint = async () => {
        try {
          return await createDirectUpload();
        } catch (err: any) {
          uploadError.value = err?.message || "Failed to start Mux upload.";
          throw err;
        }
      };

      el.addEventListener("uploadstart", () => {
        uploadError.value = null;
      });

      el.addEventListener("uploaderror", (event: any) => {
        const detail = event?.detail;
        uploadError.value =
          (detail?.message as string) ||
          (typeof detail === "string" ? detail : null) ||
          "Upload failed.";
      });

      el.addEventListener("success", () => {
        if (!currentUploadId) return;
        // Poll for the asset id and then for asset readiness.
        beginPolling(currentUploadId);
      });
    }

    function detachUploader() {
      // Listeners are scoped to the element; when it's removed they're GC'd.
    }

    async function beginPolling(uploadIdValue: string) {
      stopPolling();
      pollingActive.value = true;
      let attempts = 0;
      const maxAttempts = 240; // ~20 minutes at 5s

      const tick = async () => {
        attempts += 1;
        try {
          const uploadRes = await api.get(`/mux/uploads/${uploadIdValue}`);
          const upload = uploadRes?.data?.data;
          if (upload?.status === "errored") {
            stopPolling();
            errorMessage.value = upload?.error?.messages?.[0] || "Upload failed on Mux.";
            emitValue({
              provider: "mux",
              status: "errored",
              providerMetadata: { mux: { uploadId: uploadIdValue } },
              error: errorMessage.value,
            });
            return;
          }

          const assetIdValue = upload?.assetId;
          if (assetIdValue) {
            const assetRes = await api.get(`/mux/assets/${assetIdValue}`);
            const asset = assetRes?.data?.data;
            if (asset?.status === "ready") {
              stopPolling();
              emitValue({
                provider: "mux",
                status: "ready",
                providerMetadata: {
                  mux: {
                    uploadId: uploadIdValue,
                    assetId: asset.id,
                    playbackId: asset.playbackId,
                    playbackToken: asset.playbackToken ?? null,
                    thumbnailToken: asset.thumbnailToken ?? null,
                  },
                },
                duration: asset.duration ?? null,
                aspectRatio: asset.aspectRatio ?? null,
                maxStoredResolution: asset.maxStoredResolution ?? null,
                createdAt: asset.createdAt ? Number(asset.createdAt) * 1000 : Date.now(),
                updatedAt: Date.now(),
                poster: typeof asset.poster === "string" ? asset.poster : null,
                sources: Array.isArray(asset.sources) ? asset.sources : [],
              });
              return;
            }
            if (asset?.status === "errored") {
              stopPolling();
              const msg = Array.isArray(asset.errors?.messages)
                ? asset.errors.messages.join("; ")
                : "Mux failed to process the asset.";
              errorMessage.value = msg;
              emitValue({
                provider: "mux",
                status: "errored",
                providerMetadata: { mux: { uploadId: uploadIdValue, assetId: asset.id } },
                error: msg,
              });
              return;
            }
            // still preparing, but write what we know now (assetId)
            emitValue({
              provider: "mux",
              status: "preparing",
              providerMetadata: { mux: { uploadId: uploadIdValue, assetId: asset.id } },
              createdAt: Date.now(),
            });
          }
        } catch {
          // Transient; keep polling unless we've exceeded attempts.
        }

        if (attempts < maxAttempts && props.autoPoll) {
          pollTimer = setTimeout(tick, 5000);
        } else {
          pollingActive.value = false;
        }
      };

      tick();
    }

    async function beginAssetPolling(
      assetIdValue: string,
      preferredPlaybackId: string | null = null,
      preferredPlaybackToken: string | null = null,
      preferredThumbnailToken: string | null = null,
    ) {
      stopPolling();
      pollingActive.value = true;
      let attempts = 0;
      const maxAttempts = 240;

      const tickAsset = async () => {
        attempts += 1;
        try {
          const assetRes = await api.get(`/mux/assets/${assetIdValue}`);
          const asset = assetRes?.data?.data;
          if (!asset) return;

          if (asset.status === "ready") {
            stopPolling();
            emitValue({
              provider: "mux",
              status: "ready",
              providerMetadata: {
                mux: {
                  assetId: asset.id,
                  playbackId: preferredPlaybackId ?? asset.playbackId,
                  playbackToken: preferredPlaybackToken ?? asset.playbackToken ?? null,
                  thumbnailToken: preferredThumbnailToken ?? asset.thumbnailToken ?? null,
                },
              },
              duration: asset.duration ?? null,
              aspectRatio: asset.aspectRatio ?? null,
              maxStoredResolution: asset.maxStoredResolution ?? null,
              createdAt: asset.createdAt ? Number(asset.createdAt) * 1000 : Date.now(),
              updatedAt: Date.now(),
              poster: typeof asset.poster === "string" ? asset.poster : null,
              sources: Array.isArray(asset.sources) ? asset.sources : [],
            });
            return;
          }

          if (asset.status === "errored") {
            stopPolling();
            const msg = Array.isArray(asset.errors?.messages)
              ? asset.errors.messages.join("; ")
              : "Mux failed to process the asset.";
            errorMessage.value = msg;
            emitValue({
              provider: "mux",
              status: "errored",
              providerMetadata: { mux: { assetId: asset.id } },
              error: msg,
            });
            return;
          }

          emitValue({
            provider: "mux",
            status: "preparing",
            providerMetadata: {
              mux: {
                assetId: asset.id,
                playbackId: preferredPlaybackId ?? asset.playbackId,
                playbackToken: preferredPlaybackToken ?? asset.playbackToken ?? null,
                thumbnailToken: preferredThumbnailToken ?? asset.thumbnailToken ?? null,
              },
            },
            createdAt: Date.now(),
          });
        } catch {
          /* transient */
        }

        if (attempts < maxAttempts && props.autoPoll) {
          pollTimer = setTimeout(tickAsset, 5000);
        } else {
          pollingActive.value = false;
        }
      };

      tickAsset();
    }

    function stopPolling() {
      if (pollTimer) {
        clearTimeout(pollTimer);
        pollTimer = null;
      }
      pollingActive.value = false;
    }

    function pollNow() {
      const uid = uploadId.value || currentUploadId;
      if (uid) {
        beginPolling(uid);
        return;
      }
      const aid = assetId.value;
      if (aid)
        beginAssetPolling(
          aid,
          playbackId.value,
          playbackToken.value,
          thumbnailToken.value,
        );
    }

    function hardDisableCasting() {
      const player = playerRef.value as any;
      if (!player) return;
      try {
        // Ensure both mux-player and internal media element disable remote playback.
        player.setAttribute("disableremoteplayback", "");
        player.disableRemotePlayback = true;
        const media = player.media;
        if (media) {
          media.setAttribute?.("disableremoteplayback", "");
          media.disableRemotePlayback = true;
        }
      } catch {
        // Best-effort only.
      }
    }

    let webComponentsLoaded = false;
    async function ensureWebComponents() {
      if (webComponentsLoaded) return;
      webComponentsLoaded = true;
      await Promise.all([
        import("@mux/mux-uploader"),
        import("@mux/mux-player"),
      ]);
    }

    onMounted(async () => {
      await ensureWebComponents();
      await nextTick();
      await new Promise<void>((r) => setTimeout(r, 0));

      if (hasMuxPayload(parsedValue.value ?? undefined)) {
        clearPersistedSessionState();
      } else {
        try {
          const raw = sessionStorage.getItem(storageKey());
          if (raw) {
            const stored = JSON.parse(raw) as MuxValue;
            if (stored != null && hasMuxPayload(stored)) {
              emitValue(stored);
              await nextTick();
              const mux = stored.providerMetadata?.mux;
              if (stored.status === "preparing" && mux?.uploadId) {
                resumeUploadId.value = mux.uploadId;
              } else if (stored.status === "preparing" && mux?.assetId && !mux?.uploadId) {
                resumeAssetId.value = mux.assetId;
                resumeAssetPlaybackId.value = mux.playbackId ?? null;
                resumeAssetPlaybackToken.value = mux.playbackToken ?? null;
                resumeAssetThumbnailToken.value = mux.thumbnailToken ?? null;
              }
            }
          }
        } catch {
          /* corrupt storage */
        }
      }

      await nextTick();
      attachUploader();
      hardDisableCasting();

      if (!props.autoPoll) return;

      const uploadPoll =
        resumeUploadId.value ||
        (parsedValue.value?.status === "preparing" && parsedValue.value?.providerMetadata?.mux?.uploadId
          ? parsedValue.value.providerMetadata.mux.uploadId
          : null);

      const assetPoll =
        resumeAssetId.value ||
        (parsedValue.value?.status === "preparing" &&
        parsedValue.value?.providerMetadata?.mux?.assetId &&
        !parsedValue.value?.providerMetadata?.mux?.uploadId
          ? parsedValue.value.providerMetadata.mux.assetId
          : null);

      if (uploadPoll) beginPolling(uploadPoll);
      else if (assetPoll)
        beginAssetPolling(
          assetPoll,
          resumeAssetPlaybackId.value,
          resumeAssetPlaybackToken.value,
          resumeAssetThumbnailToken.value,
        );
    });

    onBeforeUnmount(() => {
      stopPolling();
      detachUploader();
      clearPersistedSessionState();
    });

    watch(parsedValue, (next) => {
      if (emittingValue) return;
      if (String(props.primaryKey ?? "+") === "+") return;
      if (hasMuxPayload(next ?? undefined)) {
        clearPersistedSessionState();
      }
    });

    watch(phase, async (next) => {
      if (next === "empty") {
        await nextTick();
        attachUploader();
      } else if (next === "ready") {
        await nextTick();
        hardDisableCasting();
      }
    });

    watch(
      () => [props.collection, props.field, props.primaryKey] as const,
      (_next, prev) => {
        if (!prev?.length) return;
        const [c, f, pk] = _next;
        const [oc, of, opk] = prev;
        if (c === oc && f === of && String(opk) === "+" && String(pk) !== "+") {
          clearPersistedSessionState(pk, opk);
        }
      },
    );

    return {
      uploaderRef,
      playerRef,
      phase,
      replacing,
      uploadError,
      errorMessage,
      pollingActive,
      assetId,
      playbackId,
      playbackToken,
      thumbnailToken,
      duration,
      aspectRatio,
      maxStoredResolution,
      formattedDuration,
      metadataTitle,
      viewerId,
      clearValue,
      startReplace,
      pollNow,
      manualId,
      manualError,
      manualLoading,
      applyManualId,
    };
  },
});
</script>

<style scoped>
.mux-video-interface {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.mux-video-interface.disabled {
  opacity: 0.7;
  pointer-events: none;
}

.uploader-wrap {
  border: 2px dashed var(--theme--form--field--input--border-color, var(--border-normal));
  border-radius: var(--theme--border-radius, 6px);
  padding: 16px;
  background: var(--theme--form--field--input--background, var(--background-input));
}

mux-uploader {
  --uploader-background-color: transparent;
  --uploader-font-family: inherit;
  display: block;
  width: 100%;
  min-height: 160px;
}

.uploader-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 6px;
  padding: 24px 8px;
  color: var(--foreground-subdued);
}
.uploader-empty-title {
  font-weight: 600;
  color: var(--foreground-normal);
}
.uploader-empty-sub {
  font-size: 12px;
}

.upload-error {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--theme--danger, var(--danger));
  font-size: 13px;
}

.player-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

mux-player {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--theme--border-radius, 6px);
  overflow: hidden;
  background: #000;
  /* Hide Chromecast control; disableremoteplayback stops loading gstatic cast scripts */
  --cast-button: none;
}

.processing,
.errored {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--theme--border-radius, 6px);
  background: var(--theme--form--field--input--background, var(--background-input));
  border: 1px solid var(--theme--form--field--input--border-color, var(--border-subdued));
}
.errored {
  border-color: var(--theme--danger, var(--danger));
  color: var(--theme--danger, var(--danger));
}

.processing-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--foreground-subdued);
}
.meta-pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.meta-pill.ready {
  background: var(--theme--success, var(--success));
  color: var(--white, #fff);
}
.meta-text {
  font-size: 12px;
  color: var(--foreground-subdued);
}
.meta-text.mono {
  font-family: var(--theme--fonts--monospace--font-family, monospace);
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.manual-entry {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--theme--form--field--input--border-color, var(--border-subdued));
}
.manual-entry-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground-normal);
  margin-bottom: 4px;
}
.manual-entry-hint {
  font-size: 12px;
  color: var(--foreground-subdued);
  margin: 0 0 10px;
  line-height: 1.45;
}
.manual-entry-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
}
.manual-entry-row :deep(.v-input) {
  flex: 1;
  min-width: 160px;
}
.manual-entry-error {
  margin-top: 8px;
}
</style>
