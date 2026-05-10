import type { PageFeaturedVideo } from "@/lib/actions/directus.actions";
import { extractCustomPosterIdFromMuxRow } from "@/lib/directus/custom-poster";
import type { Film } from "@/types";
import { muxVideoRowToAsset } from "@/lib/video/create-mux-video-asset";

/** Map homepage `featured_videos` from Directus into `Film` for `FilmTileGrid` / carousel. */
export function pageFeaturedVideosToFilms(
  items: PageFeaturedVideo[] | undefined,
): Film[] | undefined {
  if (!items?.length) return undefined;

  const films: Film[] = [];

  for (const item of items) {
    const video = muxVideoRowToAsset(item.muxVideo);
    if (!video) continue;

    const slug =
      item.slug?.trim() ||
      item.muxVideo.slug?.trim() ||
      item.muxVideo.id;
    const title =
      item.title?.trim() ||
      item.muxVideo.title?.trim() ||
      slug;

    const customPosterId =
      item.customPosterId ?? extractCustomPosterIdFromMuxRow(item.muxVideo);

    films.push({
      id: item.muxVideo.id,
      type: "film",
      slug,
      title,
      location: item.location ?? item.muxVideo.location ?? undefined,
      video,
      posterUrl: item.muxVideo.poster ?? null,
      customPosterId,
      isFeatured: true,
    });
  }

  return films.length ? films : undefined;
}
