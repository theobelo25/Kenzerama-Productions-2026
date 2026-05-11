import "server-only";

import {
  cmsCacheTags,
  muxVideoCacheTags,
  pageByIdCacheTags,
} from "@/lib/cache/tags";
import {
  directusItem,
  directusItems,
  DirectusItemsOptions,
} from "@/lib/directus/client";
import { DIRECTUS_COLLECTIONS } from "@/lib/directus/collections";
import { muxVideoRowToFilm } from "@/lib/directus/page-featured-to-film";
import {
  FEATURED_VIDEOS_RELATION_FIELDS,
  HERO_VIDEO_RELATION_FIELDS,
  MUX_VIDEO_ITEM_FIELDS,
  TESTIMONIAL_RELATION_FIELDS,
} from "@/lib/directus/page-query-fields";
import type { DirectusMuxVideo, DirectusPage, PageData } from "@/lib/directus/types";
import { formatError } from "@/lib/format/error";
import type { Film } from "@/types";

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

export async function getMuxFilmBySlug(slug: string): Promise<Film | null> {
  try {
    const rows = await directusItems<DirectusMuxVideo>(
      DIRECTUS_COLLECTIONS.MUX_VIDEOS,
      {
        query: {
          filter: { slug: { _eq: slug } },
          fields: MUX_VIDEO_ITEM_FIELDS,
          limit: 1,
        },
        next: {
          revalidate: 60,
          tags: muxVideoCacheTags(slug),
        },
      },
    );

    const row = rows[0];
    if (!row) return null;
    return muxVideoRowToFilm(row);
  } catch (error) {
    throw new Error(`Failed to fetch film "${slug}": ${formatError(error)}`);
  }
}

export async function getPageById(id: string): Promise<PageData | null> {
  try {
    const row = await directusItem<DirectusPage>(
      DIRECTUS_COLLECTIONS.PAGES,
      id,
      {
        query: { fields: PAGE_FIELDS },
        next: { revalidate: 60, tags: pageByIdCacheTags(id) },
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
          tags: [cmsCacheTags.pagesCollection],
        },
      },
    );

    return rows.map((r) => r.slug).filter(Boolean);
  } catch (error) {
    throw new Error(`Failed to fetch page slugs: ${formatError(error)}`);
  }
}

export async function getAllMuxFilmSlugs(): Promise<string[]> {
  try {
    const rows = await directusItems<Pick<DirectusMuxVideo, "slug">>(
      DIRECTUS_COLLECTIONS.MUX_VIDEOS,
      {
        query: {
          fields: ["slug"],
          filter: { slug: { _nnull: true } },
          limit: -1,
        },
        next: {
          revalidate: 300,
          tags: [cmsCacheTags.muxVideos],
        },
      },
    );

    return rows
      .map((row) => row.slug?.trim())
      .filter((slug): slug is string => Boolean(slug));
  } catch (error) {
    throw new Error(`Failed to fetch film slugs: ${formatError(error)}`);
  }
}

export async function getAllMuxFilms(): Promise<Film[]> {
  try {
    const rows = await directusItems<DirectusMuxVideo>(
      DIRECTUS_COLLECTIONS.MUX_VIDEOS,
      {
        query: {
          fields: MUX_VIDEO_ITEM_FIELDS,
          filter: { slug: { _nnull: true } },
          limit: -1,
        },
        next: {
          revalidate: 300,
          tags: [cmsCacheTags.muxVideos],
        },
      },
    );

    return rows
      .map((row) => muxVideoRowToFilm(row))
      .filter((film): film is Film => film !== null);
  } catch (error) {
    throw new Error(`Failed to fetch films: ${formatError(error)}`);
  }
}

export async function getMuxFilmsBySlugs(slugs: string[]): Promise<Film[]> {
  const normalizedSlugs = slugs
    .map((slug) => slug.trim())
    .filter((slug, index, all) => slug.length > 0 && all.indexOf(slug) === index);

  if (normalizedSlugs.length === 0) return [];

  try {
    const rows = await directusItems<DirectusMuxVideo>(
      DIRECTUS_COLLECTIONS.MUX_VIDEOS,
      {
        query: {
          fields: MUX_VIDEO_ITEM_FIELDS,
          filter: { slug: { _in: normalizedSlugs } },
          limit: normalizedSlugs.length,
        },
        next: {
          revalidate: 300,
          tags: [cmsCacheTags.muxVideos],
        },
      },
    );

    const filmsBySlug = new Map<string, Film>();
    for (const row of rows) {
      const film = muxVideoRowToFilm(row);
      if (film) filmsBySlug.set(film.slug, film);
    }

    return normalizedSlugs
      .map((slug) => filmsBySlug.get(slug))
      .filter((film): film is Film => film !== undefined);
  } catch (error) {
    throw new Error(`Failed to fetch films by slug: ${formatError(error)}`);
  }
}

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
