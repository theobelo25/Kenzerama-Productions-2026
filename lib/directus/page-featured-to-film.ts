import { extractCustomPosterIdFromMuxRow } from "@/lib/directus/custom-poster";
import type {
  DirectusMuxVideo,
  DirectusRelatedFilmLink,
  PageFeaturedVideo,
} from "@/lib/directus/types";
import type { Film, Vendor } from "@/types";
import { muxVideoRowToAsset } from "@/lib/video/create-mux-video-asset";

type MuxFilmOverrides = Partial<
  Pick<
    Film,
    | "slug"
    | "title"
    | "location"
    | "isFeatured"
    | "category"
    | "tags"
    | "description"
    | "customPosterId"
    | "details"
  >
>;

function muxVendorsJsonToVendors(raw: unknown): Vendor[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: Vendor[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const name =
      typeof rec.name === "string" ? rec.name.trim() : String(rec.name ?? "").trim();
    if (!name) continue;
    const url = typeof rec.url === "string" ? rec.url.trim() : "";
    const title =
      typeof rec.type === "string"
        ? rec.type.trim()
        : String(rec.type ?? "").trim();
    out.push({ name, url, title });
  }
  return out.length ? out : undefined;
}

function muxRelatedFilmsToFilms(raw: unknown): Film[] | undefined {
  if (!Array.isArray(raw)) return undefined;

  const films: Film[] = [];

  for (const link of raw) {
    if (!link || typeof link !== "object") continue;
    const mux = (link as DirectusRelatedFilmLink).related_mux_videos_id;
    if (!mux || typeof mux === "string" || typeof mux.id !== "string") continue;

    const film = muxVideoRowToFilm(mux);
    if (film) films.push(film);
  }

  return films.length ? films : undefined;
}

/** Map one expanded `mux_videos` row to `Film` for grids and film detail. */
export function muxVideoRowToFilm(
  mux: DirectusMuxVideo,
  overrides?: MuxFilmOverrides,
): Film | null {
  const video = muxVideoRowToAsset(mux);
  if (!video) return null;

  const slug =
    overrides?.slug?.trim() ||
    mux.slug?.trim() ||
    mux.id;
  const title =
    overrides?.title?.trim() ||
    mux.title?.trim() ||
    slug;

  const customPosterId =
    overrides?.customPosterId ?? extractCustomPosterIdFromMuxRow(mux);

  const vendorsFromMux = muxVendorsJsonToVendors(mux.vendors);
  const mergedDetails =
    overrides?.details?.venue ||
    overrides?.details?.vendors?.length ||
    vendorsFromMux?.length
      ? {
          ...overrides?.details,
          ...(vendorsFromMux?.length ? { vendors: vendorsFromMux } : {}),
        }
      : undefined;

  return {
    id: mux.id,
    type: "film",
    slug,
    title,
    location: overrides?.location ?? mux.location ?? undefined,
    video,
    posterUrl: mux.poster ?? null,
    customPosterId,
    isFeatured: overrides?.isFeatured,
    category: overrides?.category,
    tags: overrides?.tags,
    description:
      overrides?.description ??
      (mux.description?.trim() || undefined),
    details: mergedDetails,
    relatedFilms: muxRelatedFilmsToFilms(mux.related_films),
  };
}

/** Map homepage `featured_videos` from Directus into `Film` for `FilmTileGrid` / carousel. */
export function pageFeaturedVideosToFilms(
  items: PageFeaturedVideo[] | undefined,
): Film[] | undefined {
  if (!items?.length) return undefined;

  const films: Film[] = [];

  for (const item of items) {
    const film = muxVideoRowToFilm(item.muxVideo, {
      slug: item.slug?.trim() || undefined,
      title: item.title?.trim() || undefined,
      location: item.location ?? undefined,
      customPosterId: item.customPosterId,
      isFeatured: true,
    });
    if (film) films.push(film);
  }

  return films.length ? films : undefined;
}
