import Mux from "@mux/mux-node";
import type { Asset } from "@mux/mux-node/resources/video/assets.js";

type AnyRecord = Record<string, unknown>;

type MuxUploaderValue = {
  status?: string;
  duration?: number | null;
  aspectRatio?: string | null;
  maxStoredResolution?: string | null;
  createdAt?: number | null;
  updatedAt?: number | null;
  poster?: string | null;
  sources?: Array<{ src: string; type?: string }>;
  error?: string | null;
  providerMetadata?: {
    mux?: {
      uploadId?: string;
      assetId?: string;
      playbackId?: string;
      playbackToken?: string | null;
      thumbnailToken?: string | null;
    };
  };
};

function pickEnv(env: AnyRecord, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = env[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return undefined;
}

function getMuxClient(env: AnyRecord): Mux | null {
  const tokenId = pickEnv(env, "MUX_TOKEN_ID");
  const tokenSecret = pickEnv(env, "MUX_TOKEN_SECRET");
  if (!tokenId || !tokenSecret) return null;
  return new Mux({ tokenId, tokenSecret });
}

function parseUploaderValue(value: unknown): MuxUploaderValue | null {
  if (!value) return null;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as MuxUploaderValue;
    } catch {
      return null;
    }
  }
  if (typeof value === "object") return value as MuxUploaderValue;
  return null;
}

async function signPlaybackTokens(mux: Mux, playbackId: string): Promise<{
  playbackToken: string | null;
  thumbnailToken: string | null;
}> {
  const tokens = await mux.jwt.signPlaybackId(playbackId, {
    type: ["video", ["thumbnail", { time: "0" }]],
    expiration: "1h",
  } as never);
  const tokenMap: AnyRecord | null =
    tokens && typeof tokens === "object"
      ? (tokens as unknown as AnyRecord)
      : null;

  return {
    playbackToken: (tokenMap?.["playback-token"] as string | undefined) ?? null,
    thumbnailToken: (tokenMap?.["thumbnail-token"] as string | undefined) ?? null,
  };
}

function mergeAssetFields(target: AnyRecord, asset: Asset, preferredPlaybackId?: string | null): void {
  target.id = asset.id;
  target.created_at = asset.created_at ?? null;
  target.encoding_tier = asset.encoding_tier ?? null;
  target.master_access = asset.master_access ?? null;
  target.max_resolution_tier = asset.max_resolution_tier ?? null;
  target.status = asset.status ?? null;
  target.aspect_ratio = asset.aspect_ratio ?? null;
  target.duration = asset.duration ?? null;
  target.errors = asset.errors ?? null;
  target.ingest_type = asset.ingest_type ?? null;
  target.is_live = asset.is_live ?? null;
  target.live_stream_id = asset.live_stream_id ?? null;
  target.master = asset.master ?? null;
  target.max_stored_frame_rate = asset.max_stored_frame_rate ?? null;
  target.max_stored_resolution = asset.max_stored_resolution ?? null;
  target.meta = asset.meta ?? null;
  target.mp4_support = asset.mp4_support ?? null;
  target.non_standard_input_reasons = asset.non_standard_input_reasons ?? null;
  target.normalize_audio = asset.normalize_audio ?? null;
  target.passthrough = asset.passthrough ?? null;
  target.per_title_encode = asset.per_title_encode ?? null;
  target.playback_ids = asset.playback_ids ?? null;
  target.recording_times = asset.recording_times ?? null;
  target.resolution_tier = asset.resolution_tier ?? null;
  target.source_asset_id = asset.source_asset_id ?? null;
  target.static_renditions = asset.static_renditions ?? null;
  target.test = asset.test ?? null;
  target.tracks = asset.tracks ?? null;
  target.upload_id = asset.upload_id ?? null;
  target.video_quality = asset.video_quality ?? null;

  const playbackIds = Array.isArray(asset.playback_ids) ? asset.playback_ids : [];
  const selectedPlayback =
    playbackIds.find((p) => p?.id === preferredPlaybackId) ??
    playbackIds.find((p) => p?.policy === "public") ??
    playbackIds[0];
  const playbackId = selectedPlayback?.id ?? null;
  target.playback_id = playbackId;
  target.playback_policy = selectedPlayback?.policy ?? null;
  target.playback_url = playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : null;
  target.poster = playbackId ? `https://image.mux.com/${playbackId}/thumbnail.webp` : null;
  target.sources = playbackId ? [{ src: target.playback_url, type: "application/x-mpegURL" }] : [];
}

export async function hydrateMuxVideoPayloadFromUploader(args: {
  payload: AnyRecord;
  env: AnyRecord;
  logger: { warn: (obj: unknown, msg?: string) => void };
}): Promise<AnyRecord> {
  const { payload, env, logger } = args;
  const muxValue = parseUploaderValue(payload.mux_uploader);
  if (!muxValue) return payload;

  const next: AnyRecord = { ...payload };
  const muxMeta = muxValue.providerMetadata?.mux;
  const assetId = typeof next.id === "string" && next.id ? next.id : muxMeta?.assetId ?? null;

  if (muxMeta?.uploadId) next.upload_id = muxMeta.uploadId;
  if (muxValue.status) next.status = muxValue.status;
  if (muxValue.duration != null) next.duration = muxValue.duration;
  if (muxValue.aspectRatio != null) next.aspect_ratio = muxValue.aspectRatio;
  if (muxValue.maxStoredResolution != null) next.max_stored_resolution = muxValue.maxStoredResolution;
  if (muxValue.poster != null) next.poster = muxValue.poster;
  if (Array.isArray(muxValue.sources)) next.sources = muxValue.sources;
  if (muxValue.error) next.errors = { type: "uploader_error", messages: [muxValue.error] };
  if (muxMeta?.playbackId) next.playback_id = muxMeta.playbackId;
  if (assetId && !next.id) next.id = assetId;

  const mux = getMuxClient(env);
  if (!mux || !assetId) return next;

  try {
    const asset = await mux.video.assets.retrieve(assetId);
    mergeAssetFields(next, asset, muxMeta?.playbackId ?? null);

    if (next.playback_policy === "signed" && typeof next.playback_id === "string" && next.playback_id) {
      const tokens = await signPlaybackTokens(mux, next.playback_id);
      next.playback_token = tokens.playbackToken;
      next.thumbnail_token = tokens.thumbnailToken;
    } else {
      next.playback_token = muxMeta?.playbackToken ?? null;
      next.thumbnail_token = muxMeta?.thumbnailToken ?? null;
    }
  } catch (error) {
    logger.warn({ err: error, assetId }, "[mux-video] hydrate failed, saving uploader payload only");
  }

  return next;
}

