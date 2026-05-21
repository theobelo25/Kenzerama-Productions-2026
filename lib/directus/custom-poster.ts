import { resolveDirectusPublicAssetBaseUrl } from "@/lib/directus/env-urls";

/** Base origin for Directus file assets (`/assets/:id`) used by `next/image`. */
export function directusAssetsBaseUrl(): string | undefined {
  return resolveDirectusPublicAssetBaseUrl();
}

/** Public asset URL for a Directus file id (`/assets/:id`), or undefined if base env is missing. */
export function directusFileAssetUrl(fileId: string): string | undefined {
  const id = fileId.trim();
  if (!id) return undefined;
  const base = directusAssetsBaseUrl();
  if (!base) return undefined;
  return `${base.replace(/\/$/, "")}/assets/${id}`;
}

function fileRefToId(ref: unknown): string | undefined {
  if (ref == null || ref === "") return undefined;
  if (typeof ref === "string") return ref;
  if (typeof ref === "number" && Number.isFinite(ref)) return String(ref);
  if (typeof ref === "object" && ref !== null && "id" in ref) {
    const id = (ref as { id: unknown }).id;
    if (typeof id === "string" && id.length > 0) return id;
    if (typeof id === "number" && Number.isFinite(id)) return String(id);
  }
  return undefined;
}

/** Resolve file id from a `mux_videos` row (`custom_poster` M2O or raw FK column). */
export function extractCustomPosterIdFromMuxRow(
  mux:
    | {
        custom_poster?: unknown;
        custom_poster_id?: unknown;
      }
    | null
    | undefined,
): string | undefined {
  if (!mux) return undefined;
  return (
    fileRefToId(mux.custom_poster) ?? fileRefToId(mux.custom_poster_id)
  );
}
