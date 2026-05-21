import type { DirectusMuxVideo } from "@/lib/directus/types";
import {
  directusFileAssetUrl,
  extractCustomPosterIdFromMuxRow,
} from "@/lib/directus/custom-poster";

/** One tile in the CMS video block: poster image only (no inline player). */
export type VideoBlockTile = {
  id: string;
  posterSrc: string;
  alt: string;
  /** Optional caption under the poster (e.g. location). */
  subtitle?: string;
  /** Link when `mux_videos.slug` is set. */
  href?: string;
};

export type VideoBlockProps = {
  id: string;
  title: string;
  videos: VideoBlockTile[];
  button_text?: string;
  button_href?: string;
};

/** Slotted row from Directus: bare mux row, junction row, or UUID string (needs expanded query). */
export type DirectusBlockVideoRow = unknown;

/** Raw `block_videos` row; align fields with your Directus data model. */
export type DirectusBlockVideos = {
  id: string;
  title: string | null;
  videos: DirectusBlockVideoRow[];
  button_text?: string | null;
  /** Legacy / alt CMS field name */
  button_href?: string | null;
  /** Directus field (path or full URL) */
  button_link?: string | null;
};

function isMuxShape(o: Record<string, unknown>): boolean {
  return (
    typeof o.playback_id === "string" ||
    typeof o.playback_url === "string"
  );
}

/**
 * Resolve one `videos[]` element to something `muxVideoRowToAsset` accepts.
 * Handles junction rows (FK to `mux_videos`), bare mux rows, and common FK field names.
 */
function muxRowFromVideoSlot(
  row: DirectusBlockVideoRow | null | undefined,
): DirectusMuxVideo | string | null | undefined {
  if (row == null) return null;
  if (typeof row === "string") return row;
  if (typeof row !== "object") return null;

  const o = row as Record<string, unknown>;

  if (isMuxShape(o)) {
    return o as DirectusMuxVideo;
  }

  const fkKeys = [
    "mux_videos_id",
    "videos_mux_videos_id",
    "mux_video",
    "video",
    "videos_id",
  ];

  for (const key of fkKeys) {
    if (!(key in o)) continue;
    const v = o[key];
    if (v != null && typeof v === "object" && isMuxShape(v as Record<string, unknown>)) {
      return v as DirectusMuxVideo;
    }
    if (typeof v === "string") {
      return v;
    }
  }

  for (const val of Object.values(o)) {
    if (val != null && typeof val === "object" && !Array.isArray(val)) {
      const inner = val as Record<string, unknown>;
      if (isMuxShape(inner)) {
        return val as DirectusMuxVideo;
      }
    }
  }

  return o as DirectusMuxVideo;
}

/** Turn CMS path `wedding-videography` into `/wedding-videography` for `next/link`. */
function normalizeButtonHref(raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return s.startsWith("/") ? s : `/${s}`;
}

function muxThumbnailFromPlaybackId(playbackId: string): string {
  const id = playbackId.trim();
  if (!id) return "";
  return `https://image.mux.com/${id}/thumbnail.webp`;
}

/** Prefer Directus `custom_poster`, then mux `poster`, then generated Mux thumbnail. */
function posterUrlForMuxRow(mux: DirectusMuxVideo): string | null {
  const customId = extractCustomPosterIdFromMuxRow(mux);
  if (customId) {
    const url = directusFileAssetUrl(customId);
    if (url) return url;
  }
  const muxPoster = mux.poster?.trim();
  if (muxPoster) return muxPoster;
  const pid = mux.playback_id?.trim();
  if (pid) return muxThumbnailFromPlaybackId(pid);
  return null;
}

export function videoSectionFromBlockItem(
  item: DirectusBlockVideos | undefined | null,
): VideoBlockProps | null {
  if (!item || typeof item !== "object") return null;

  const rows = item.videos;

  if (!Array.isArray(rows) || rows.length === 0) return null;

  const videos: VideoBlockTile[] = [];

  for (const row of rows) {
    const resolved = muxRowFromVideoSlot(row);
    if (!resolved || typeof resolved === "string") continue;

    const mux = resolved as DirectusMuxVideo;
    const posterSrc = posterUrlForMuxRow(mux);
    if (!posterSrc) continue;

    const title = mux.title?.trim() || "Wedding film";
    const slug = mux.slug?.trim();

    videos.push({
      id: mux.id,
      posterSrc,
      alt: title,
      subtitle: mux.location?.trim() || undefined,
      href: slug ? `/blog/films/${slug}` : undefined,
    });
  }

  if (videos.length === 0) return null;

  const props: VideoBlockProps = {
    id: String(item.id ?? ""),
    title: String(item.title ?? ""),
    videos,
  };

  const buttonText = item.button_text;
  if (buttonText != null && String(buttonText).trim() !== "") {
    props.button_text = String(buttonText);
  }

  const linkSource = item.button_href ?? item.button_link;
  if (linkSource != null && String(linkSource).trim() !== "") {
    props.button_href = normalizeButtonHref(String(linkSource));
  }

  return props;
}
