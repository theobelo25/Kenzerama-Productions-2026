import { DIRECTUS_COLLECTIONS } from "@/lib/directus/collections";

export const cmsCacheTags = {
  pages: "pages",
  pagesCollection: DIRECTUS_COLLECTIONS.PAGES,
  muxVideos: DIRECTUS_COLLECTIONS.MUX_VIDEOS,
} as const;

export function pageBySlugCacheTag(slug: string) {
  return `page:${slug}`;
}

export function pageByIdCacheTag(id: string | number) {
  return `page:${id}`;
}

export function muxVideoBySlugCacheTag(slug: string) {
  return `mux_video:${slug}`;
}

export function pageCacheTags(slug: string) {
  return [cmsCacheTags.pages, pageBySlugCacheTag(slug)];
}

export function pageByIdCacheTags(id: string | number) {
  return [cmsCacheTags.pages, pageByIdCacheTag(id)];
}

export function muxVideoCacheTags(slug: string) {
  return [cmsCacheTags.muxVideos, muxVideoBySlugCacheTag(slug)];
}
