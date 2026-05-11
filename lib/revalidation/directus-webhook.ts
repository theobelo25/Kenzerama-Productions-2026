import "server-only";

import {
  cmsCacheTags,
  muxVideoBySlugCacheTag,
  pageByIdCacheTag,
  pageBySlugCacheTag,
} from "@/lib/cache/tags";
import { directusItem } from "@/lib/directus/client";
import { DIRECTUS_COLLECTIONS } from "@/lib/directus/collections";

type DirectusWebhookBody = {
  collection?: string;
  event?: string;
  keys?: Array<string | number>;
  payload?: unknown;
  tags?: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readSlug(value: unknown): string | undefined {
  return readString(value);
}

function readKeys(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((key) => (typeof key === "string" || typeof key === "number" ? String(key) : ""))
    .map((key) => key.trim())
    .filter(Boolean);
}

function readTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
    .filter(Boolean);
}

function tagsForPagesCollection(
  keys: string[],
  payload: unknown,
): Set<string> {
  const tags = new Set<string>([cmsCacheTags.pages, cmsCacheTags.pagesCollection]);

  const payloadSlug = isRecord(payload) ? readSlug(payload.slug) : undefined;
  if (payloadSlug) {
    tags.add(pageBySlugCacheTag(payloadSlug));
  }

  for (const key of keys) {
    tags.add(pageByIdCacheTag(key));
  }

  return tags;
}

function tagsForMuxVideosCollection(
  keys: string[],
  payload: unknown,
): Set<string> {
  const tags = new Set<string>([cmsCacheTags.muxVideos, cmsCacheTags.pages]);

  const payloadSlug = isRecord(payload) ? readSlug(payload.slug) : undefined;
  if (payloadSlug) {
    tags.add(muxVideoBySlugCacheTag(payloadSlug));
  }

  return tags;
}

async function enrichPageTags(tags: Set<string>, keys: string[]) {
  for (const key of keys) {
    try {
      const row = await directusItem<{ slug?: string | null }>(
        DIRECTUS_COLLECTIONS.PAGES,
        key,
        {
          query: { fields: ["slug"] },
          cache: "no-store",
        },
      );

      const slug = readSlug(row.slug);
      if (slug) {
        tags.add(pageBySlugCacheTag(slug));
      }
    } catch (error) {
      console.warn(`[revalidate] Failed to resolve page slug for ${key}`, error);
    }
  }
}

async function enrichMuxVideoTags(tags: Set<string>, keys: string[]) {
  for (const key of keys) {
    try {
      const row = await directusItem<{ slug?: string | null }>(
        DIRECTUS_COLLECTIONS.MUX_VIDEOS,
        key,
        {
          query: { fields: ["slug"] },
          cache: "no-store",
        },
      );

      const slug = readSlug(row.slug);
      if (slug) {
        tags.add(muxVideoBySlugCacheTag(slug));
      }
    } catch (error) {
      console.warn(`[revalidate] Failed to resolve mux video slug for ${key}`, error);
    }
  }
}

export async function resolveDirectusRevalidationTags(
  body: unknown,
): Promise<string[]> {
  if (!isRecord(body)) {
    return [];
  }

  const webhook = body as DirectusWebhookBody;
  const explicitTags = readTags(webhook.tags);
  if (explicitTags.length > 0) {
    return explicitTags;
  }

  const collection = readString(webhook.collection);
  if (!collection) {
    return [];
  }

  const keys = readKeys(webhook.keys);
  const payload = webhook.payload;
  const tags =
    collection === DIRECTUS_COLLECTIONS.PAGES
      ? tagsForPagesCollection(keys, payload)
      : collection === DIRECTUS_COLLECTIONS.MUX_VIDEOS
        ? tagsForMuxVideosCollection(keys, payload)
        : new Set<string>();

  if (collection === DIRECTUS_COLLECTIONS.PAGES) {
    await enrichPageTags(tags, keys);
  } else if (collection === DIRECTUS_COLLECTIONS.MUX_VIDEOS) {
    await enrichMuxVideoTags(tags, keys);
  }

  return [...tags];
}
