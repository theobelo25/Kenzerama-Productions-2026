import { defineEndpoint } from "@directus/extensions-sdk";
import Mux from "@mux/mux-node";
import type { Asset } from "@mux/mux-node/resources/video/assets.js";

type AnyRecord = Record<string, unknown>;

type CreateUploadBody = {
  corsOrigin?: string;
  playbackPolicy?: "public" | "signed";
  videoQuality?: "basic" | "plus";
  mp4Support?: "none" | "standard" | "capped-1080p";
  maxResolution?: "1080p" | "1440p" | "2160p";
  passthrough?: string;
  test?: boolean;
};

const DEFAULTS = {
  playbackPolicy: "public" as const,
  videoQuality: "basic" as const,
  mp4Support: "none" as const,
  maxResolution: "1080p" as const,
  corsOrigin: "*",
};

function pickEnv(env: AnyRecord, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = env[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return undefined;
}

function getMuxClient(env: AnyRecord): Mux {
  const tokenId = pickEnv(env, "MUX_TOKEN_ID");
  const tokenSecret = pickEnv(env, "MUX_TOKEN_SECRET");
  if (!tokenId || !tokenSecret) {
    throw new Error(
      "Missing Mux credentials. Set MUX_TOKEN_ID and MUX_TOKEN_SECRET in the Directus environment.",
    );
  }
  return new Mux({ tokenId, tokenSecret });
}

function isAuthenticated(req: unknown): boolean {
  if (!req || typeof req !== "object") return false;
  const accountability = (req as { accountability?: { user?: string | null } | null })
    .accountability;
  return Boolean(accountability && accountability.user);
}

function normalizePolicy(value: unknown): "public" | "signed" {
  return value === "signed" ? "signed" : "public";
}

function normalizeQuality(value: unknown): "basic" | "plus" {
  return value === "plus" ? "plus" : "basic";
}

function normalizeMp4Support(value: unknown): "none" | "standard" | "capped-1080p" {
  if (value === "standard" || value === "capped-1080p") return value;
  return "none";
}

function normalizeMaxResolution(value: unknown): "1080p" | "1440p" | "2160p" {
  if (value === "1440p" || value === "2160p") return value;
  return "1080p";
}

/** Shape returned by GET /assets/:id and POST /lookup for the Directus app. */
function assetToClientPayload(asset: Asset) {
  const playbackIds = Array.isArray(asset.playback_ids) ? asset.playback_ids : [];
  const publicPlayback = playbackIds.find((p) => p?.policy === "public") ?? playbackIds[0];
  const playbackId = publicPlayback?.id ?? null;
  const playbackUrl = playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : null;
  const poster = playbackId ? `https://image.mux.com/${playbackId}/thumbnail.webp` : null;
  return {
    id: asset.id,
    status: asset.status,
    playbackId,
    playbackPolicy: publicPlayback?.policy ?? null,
    duration: asset.duration ?? null,
    aspectRatio: asset.aspect_ratio ?? null,
    maxStoredResolution: asset.max_stored_resolution ?? null,
    createdAt: asset.created_at ?? null,
    updatedAt: asset.created_at ?? null,
    sources: playbackUrl ? [{ src: playbackUrl, type: "application/x-mpegURL" }] : [],
    poster,
    errors: asset.errors ?? null,
  };
}

function isNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const status = (error as { status?: number }).status;
  return status === 404;
}

async function signPlaybackTokens(mux: Mux, playbackId: string): Promise<{
  playbackToken: string | null;
  thumbnailToken: string | null;
}> {
  // `mux-player` expects `playback-token` for the video URL and `thumbnail-token`
  // for the poster URL. We mint a thumbnail token for `thumbnail-time=0`.
  const tokens = await mux.jwt.signPlaybackId(playbackId, {
    type: ["video", ["thumbnail", { time: "0" }]],
    expiration: "1h",
  } as any);
  const tokenMap: AnyRecord | null =
    tokens && typeof tokens === "object"
      ? (tokens as unknown as AnyRecord)
      : null;

  return {
    playbackToken: (tokenMap?.["playback-token"] as string | undefined) ?? null,
    thumbnailToken: (tokenMap?.["thumbnail-token"] as string | undefined) ?? null,
  };
}

export default defineEndpoint((router, { env, logger }) => {
  router.post("/uploads", async (req, res) => {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ errors: [{ message: "Unauthorized" }] });
    }

    let mux: Mux;
    try {
      mux = getMuxClient(env as AnyRecord);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Mux client unavailable";
      logger.error({ err: error }, "[mux-video] failed to initialize Mux client");
      return res.status(500).json({ errors: [{ message }] });
    }

    const body = (req.body ?? {}) as CreateUploadBody;
    const playbackPolicy = normalizePolicy(body.playbackPolicy ?? DEFAULTS.playbackPolicy);
    const videoQuality = normalizeQuality(body.videoQuality ?? DEFAULTS.videoQuality);
    const mp4Support = normalizeMp4Support(body.mp4Support ?? DEFAULTS.mp4Support);
    const maxResolution = normalizeMaxResolution(body.maxResolution ?? DEFAULTS.maxResolution);
    const corsOrigin = typeof body.corsOrigin === "string" && body.corsOrigin.length > 0
      ? body.corsOrigin
      : DEFAULTS.corsOrigin;

    const newAssetSettings: AnyRecord = {
      playback_policy: [playbackPolicy],
      video_quality: videoQuality,
      max_resolution_tier: maxResolution,
    };
    if (mp4Support !== "none") {
      newAssetSettings.mp4_support = mp4Support;
    }
    if (typeof body.passthrough === "string" && body.passthrough.length > 0) {
      newAssetSettings.passthrough = body.passthrough;
    }

    try {
      const upload = await mux.video.uploads.create({
        cors_origin: corsOrigin,
        new_asset_settings: newAssetSettings,
        test: body.test === true,
      } as Parameters<typeof mux.video.uploads.create>[0]);

      return res.json({
        data: {
          id: upload.id,
          url: upload.url,
          timeout: upload.timeout,
          status: upload.status,
          test: upload.test ?? false,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create upload";
      logger.error({ err: error }, "[mux-video] failed to create direct upload");
      return res.status(502).json({ errors: [{ message }] });
    }
  });

  router.get("/uploads/:id", async (req, res) => {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ errors: [{ message: "Unauthorized" }] });
    }
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ errors: [{ message: "Missing upload id" }] });
    }
    try {
      const mux = getMuxClient(env as AnyRecord);
      const upload = await mux.video.uploads.retrieve(id);
      return res.json({
        data: {
          id: upload.id,
          status: upload.status,
          assetId: upload.asset_id ?? null,
          error: upload.error ?? null,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to retrieve upload";
      logger.error({ err: error }, "[mux-video] failed to retrieve upload");
      return res.status(502).json({ errors: [{ message }] });
    }
  });

  router.get("/assets/:id", async (req, res) => {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ errors: [{ message: "Unauthorized" }] });
    }
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ errors: [{ message: "Missing asset id" }] });
    }
    try {
      const mux = getMuxClient(env as AnyRecord);
      const asset = await mux.video.assets.retrieve(id);
      const payload: any = assetToClientPayload(asset);

      if (payload.status === "ready" && payload.playbackPolicy === "signed" && payload.playbackId) {
        const tokens = await signPlaybackTokens(mux, payload.playbackId);
        payload.playbackToken = tokens.playbackToken;
        payload.thumbnailToken = tokens.thumbnailToken;
      }

      return res.json({ data: payload });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to retrieve asset";
      logger.error({ err: error }, "[mux-video] failed to retrieve asset");
      return res.status(502).json({ errors: [{ message }] });
    }
  });

  /**
   * Resolve either an Asset ID or a Playback ID to asset details.
   * Prefer pasting the Asset ID when possible; Playback ID is supported for embed URLs.
   */
  router.post("/lookup", async (req, res) => {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ errors: [{ message: "Unauthorized" }] });
    }

    const rawId = typeof (req.body as { id?: unknown })?.id === "string"
      ? (req.body as { id: string }).id.trim()
      : "";
    if (!rawId) {
      return res.status(400).json({ errors: [{ message: "Missing id" }] });
    }

    let mux: Mux;
    try {
      mux = getMuxClient(env as AnyRecord);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Mux client unavailable";
      logger.error({ err: error }, "[mux-video] failed to initialize Mux client");
      return res.status(500).json({ errors: [{ message }] });
    }

    let asset: Asset | null = null;

    try {
      asset = await mux.video.assets.retrieve(rawId);
    } catch (error: unknown) {
      if (!isNotFoundError(error)) {
        const message = error instanceof Error ? error.message : "Failed to retrieve asset";
        logger.error({ err: error }, "[mux-video] lookup asset failed");
        return res.status(502).json({ errors: [{ message }] });
      }
    }

    if (!asset) {
      try {
        const pb = await mux.video.playbackIds.retrieve(rawId);
        if (pb.object.type === "live_stream") {
          return res.status(422).json({
            errors: [{ message: "This playback ID is for a live stream, not a video asset." }],
          });
        }
        const playbackIdFromInput = pb.id;
        const playbackPolicyFromInput = pb.policy;
        asset = await mux.video.assets.retrieve(pb.object.id);

        const payload: any = assetToClientPayload(asset);
        // Preserve the exact playback id the user provided (especially important for
        // non-public policies like `signed`).
        payload.playbackId = playbackIdFromInput;
        payload.playbackPolicy = playbackPolicyFromInput;

        if (playbackPolicyFromInput === "signed" && playbackIdFromInput) {
          const tokens = await signPlaybackTokens(mux, playbackIdFromInput);
          payload.playbackToken = tokens.playbackToken;
          payload.thumbnailToken = tokens.thumbnailToken;
        }
        return res.json({ data: payload });
      } catch (error: unknown) {
        if (isNotFoundError(error)) {
          return res.status(404).json({
            errors: [{ message: "No Mux asset or playback ID matched that value." }],
          });
        }
        const message = error instanceof Error ? error.message : "Lookup failed";
        logger.error({ err: error }, "[mux-video] lookup playback id failed");
        return res.status(502).json({ errors: [{ message }] });
      }
    }

    const payload: any = assetToClientPayload(asset);
    if (payload.playbackPolicy === "signed" && payload.playbackId) {
      const tokens = await signPlaybackTokens(mux, payload.playbackId);
      payload.playbackToken = tokens.playbackToken;
      payload.thumbnailToken = tokens.thumbnailToken;
    }

    return res.json({ data: payload });
  });
});
