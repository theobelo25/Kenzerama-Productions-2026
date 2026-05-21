import type { MetadataRoute } from "next";
import { SERVER_URL } from "@/lib/constants";
import { formatError } from "@/lib/format/error";
import {
  getAllMuxFilmSlugs,
  getAllPageSlugs,
  getAllPosts,
} from "@/lib/server";

const STATIC_PATHS = [
  "/",
  "/about-us",
  "/contact-us",
  "/videography-packages",
  "/wedding-videography",
  "/blog",
  "/search",
] as const;

function pageSlugToPath(slug: string): string {
  if (slug === "homepage") return "/";
  return `/${slug}`;
}

function siteUrl(pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(normalized, SERVER_URL).toString();
}

export async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  const addEntry = (pathname: string, lastModified?: Date) => {
    const normalized = pathname === "" ? "/" : pathname;
    if (seen.has(normalized)) return;

    seen.add(normalized);
    entries.push({
      url: siteUrl(normalized),
      lastModified: lastModified ?? new Date(),
    });
  };

  for (const pathname of STATIC_PATHS) {
    addEntry(pathname);
  }

  try {
    const pageSlugs = await getAllPageSlugs();
    for (const slug of pageSlugs) {
      addEntry(pageSlugToPath(slug));
    }
  } catch (error) {
    console.error(
      "[sitemap] Failed to load CMS page slugs, using static routes only",
      formatError(error),
    );
  }

  try {
    const posts = await getAllPosts();
    for (const post of posts) {
      addEntry(`/blog/${post.slug}`, post.publishDate);
    }
  } catch (error) {
    console.error(
      "[sitemap] Failed to load blog posts, omitting post URLs",
      formatError(error),
    );
  }

  try {
    const filmSlugs = await getAllMuxFilmSlugs();
    for (const slug of filmSlugs) {
      addEntry(`/blog/films/${slug}`);
    }
  } catch (error) {
    console.error(
      "[sitemap] Failed to load film slugs, omitting film URLs",
      formatError(error),
    );
  }

  return entries;
}
