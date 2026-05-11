import type { DirectusMuxVideo } from "@/lib/directus/types";
import type { Asset } from "next-video/dist/assets.js";

export type CreateMuxVideoAssetInput = {
  playbackId?: string | null;
  playbackUrl?: string | null;
  assetId?: string;
  uploadId?: string | null;
  poster?: string | null;
  status?: string | null;
};

function parsePlaybackIdFromMuxUrl(
  url: string | null | undefined,
): string | undefined {
  if (!url?.trim()) return undefined;
  try {
    const u = new URL(url.trim());
    if (u.hostname !== "stream.mux.com") return undefined;
    const path = u.pathname.replace(/^\//, "");
    const id = path.replace(/\.m3u8$/i, "");
    return id || undefined;
  } catch {
    return undefined;
  }
}

const MUX_STATUS = new Set(["ready", "errored", "preparing"]);

/**
 * Build a next-video Mux `Asset` for `VideoComponent` / `next-video`’s `Video`.
 * Returns `null` if a playback id cannot be resolved.
 */
export function createMuxVideoAsset(
  input: CreateMuxVideoAssetInput,
): Asset | null {
  const playbackId =
    input.playbackId?.trim() ||
    parsePlaybackIdFromMuxUrl(input.playbackUrl) ||
    undefined;
  if (!playbackId) return null;

  const src =
    input.playbackUrl?.trim() ||
    `https://stream.mux.com/${playbackId}.m3u8`;

  const poster =
    input.poster?.trim() ||
    `https://image.mux.com/${playbackId}/thumbnail.webp`;

  const status =
    input.status && MUX_STATUS.has(input.status) ? input.status : "ready";
  const now = Date.now();

  return {
    status,
    originalFilePath: "",
    provider: "mux",
    providerMetadata: {
      mux: {
        uploadId: input.uploadId ?? "",
        assetId: input.assetId ?? "",
        playbackId,
      },
    },
    createdAt: now,
    updatedAt: now,
    size: 0,
    sources: [{ src, type: "application/x-mpegURL" }],
    poster,
    src,
  } as Asset;
}

/** Map an expanded Directus `mux_videos` row from `hero_video` (or null when unset). */
export function muxVideoRowToAsset(
  row: DirectusMuxVideo | string | null | undefined,
): Asset | null {
  if (!row || typeof row === "string") return null;
  return createMuxVideoAsset({
    playbackId: row.playback_id,
    playbackUrl: row.playback_url,
    assetId: row.id,
    uploadId: row.upload_id,
    poster: row.poster,
    status: row.status,
  });
}
