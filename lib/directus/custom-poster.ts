/** Base origin for Directus file assets (`/assets/:id`) used by `next/image`. */
export function directusAssetsBaseUrl(): string | undefined {
  const raw =
    process.env.NEXT_PUBLIC_DIRECTUS_URL?.trim() ||
    process.env.DIRECTUS_IMAGE_ORIGIN?.trim() ||
    process.env.DIRECTUS_URL?.trim();
  if (!raw) return undefined;
  try {
    const u = new URL(raw);
    return `${u.origin}${u.pathname.replace(/\/$/, "")}`;
  } catch {
    return raw.replace(/\/$/, "");
  }
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
