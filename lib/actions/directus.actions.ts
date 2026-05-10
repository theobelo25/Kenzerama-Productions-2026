"use server";

import {
  directusItem,
  directusItems,
  DirectusItemsOptions,
} from "../directus/client";
import { DIRECTUS_COLLECTIONS } from "../directus/collections";
import { extractCustomPosterIdFromMuxRow } from "../directus/custom-poster";
import {
  FEATURED_VIDEOS_RELATION_FIELDS,
  HERO_VIDEO_RELATION_FIELDS,
  TESTIMONIAL_RELATION_FIELDS,
} from "../directus/page-query-fields";
import { DirectusPage } from "../directus/types";
import type { DirectusMuxVideo } from "../video/create-mux-video-asset";
import { formatError } from "../utils";

/** Normalized featured mux item for the homepage / page UI. */
export type PageFeaturedVideo = {
  linkId?: string;
  sort?: number;
  slug?: string;
  title?: string;
  location?: string;
  /** `directus_files` id when `custom_poster` is set */
  customPosterId?: string;
  /** Expanded `mux_videos` row (playback + editorial fields) */
  muxVideo: DirectusMuxVideo;
};

export type PageData = {
  id: string;
  slug: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  page_content: unknown[];
  updatedAt?: string;
};

export type PageTestimonial = {
  linkId?: string;
  sort?: number;
  names?: string;
  quote?: string;
};

const PAGE_FIELDS = `id,slug,title,status,seo_title,seo_description,og_image,date_updated,${HERO_VIDEO_RELATION_FIELDS},${FEATURED_VIDEOS_RELATION_FIELDS},${TESTIMONIAL_RELATION_FIELDS}`;

export async function getPageBySlug(
  slug: string,
  query: DirectusItemsOptions,
): Promise<PageData | null> {
  try {
    const rows = await directusItems<DirectusPage>("pages", query);

    return rows[0] ? mapPage(rows[0]) : null;
  } catch (error) {
    throw new Error(`Failed to fetch page "${slug}": ${formatError(error)}`);
  }
}

export async function getPageById(id: string): Promise<PageData | null> {
  try {
    const row = await directusItem<DirectusPage>(
      DIRECTUS_COLLECTIONS.PAGES,
      id,
      {
        query: { fields: PAGE_FIELDS },
        next: { revalidate: 60, tags: ["pages", `page:${id}`] },
      },
    );

    return row ? mapPage(row) : null;
  } catch (error) {
    throw new Error(`Failed to fetch page id ${id}: ${formatError(error)}`);
  }
}

export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const rows = await directusItems<Pick<DirectusPage, "slug">>(
      DIRECTUS_COLLECTIONS.PAGES,
      {
        query: {
          fields: "slug",
          filter: { status: { _eq: "published" } },
          limit: -1,
        },
        next: {
          revalidate: 300,
          tags: [DIRECTUS_COLLECTIONS.PAGES],
        },
      },
    );

    return rows.map((r) => r.slug).filter(Boolean);
  } catch (error) {
    throw new Error(`Failed to fetch page slugs: ${formatError(error)}`);
  }
}

// function mapFeaturedVideos(row: DirectusPage): PageFeaturedVideo[] {
//   const raw = row.featured_videos;
//   if (!Array.isArray(raw)) return [];

//   const mapped: PageFeaturedVideo[] = [];

//   for (const link of raw) {
//     if (!link || typeof link !== "object") continue;
//     const mux = link.mux_videos_id;
//     if (!mux || typeof mux === "string" || typeof mux.id !== "string") {
//       continue;
//     }

//     const customPosterId = extractCustomPosterIdFromMuxRow(mux);

//     const sortRaw = link.sort;
//     const sortParsed = sortRaw == null ? undefined : Number(sortRaw);
//     const sort =
//       sortParsed !== undefined && Number.isFinite(sortParsed)
//         ? sortParsed
//         : undefined;

//     mapped.push({
//       linkId: link.id,
//       sort,
//       slug: mux.slug ?? undefined,
//       title: mux.title ?? undefined,
//       location: mux.location ?? undefined,
//       customPosterId,
//       muxVideo: mux,
//     });
//   }

//   mapped.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
//   return mapped;
// }

// function mapTestimonials(row: DirectusPage): PageTestimonial[] {
//   const raw = row.testimonials;
//   if (!Array.isArray(raw)) return [];

//   const mapped: PageTestimonial[] = [];

//   for (const link of raw) {
//     if (!link || typeof link !== "object") continue;
//     const testimonial = link.testimonials_id;
//     if (!testimonial || typeof testimonial !== "object") continue;

//     const sortRaw = link.sort;
//     const sortParsed = sortRaw == null ? undefined : Number(sortRaw);
//     const sort =
//       sortParsed !== undefined && Number.isFinite(sortParsed)
//         ? sortParsed
//         : undefined;

//     mapped.push({
//       linkId: link.id,
//       sort,
//       names: testimonial.names ?? undefined,
//       quote: testimonial.quote ?? undefined,
//     });
//   }

//   mapped.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
//   return mapped;
// }

function mapPage(row: DirectusPage): PageData {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    page_content: row.page_content ?? [],
    updatedAt: row.date_updated ?? undefined,
  };
}
