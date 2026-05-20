import { Asset } from "next-video/dist/assets.js";
import { StaticImageData } from "next/image";

export type Venue = {
  name: string;
  location: string;
  url: string;
  image: StaticImageData;
};

export type Vendor = {
  name: string;
  url: string;
  /** Vendor role/type from Directus `vendors[].type`. */
  title: string;
};

export type Post = {
  type: string;
  slug: string;
  publishDate: Date;
  title: string;
  author: string;
  description: string;
  tags: string[];
  category: string;
  isFeatured: boolean;
  layout: string;
  heroImage: string;
};

/**
 * Wedding film — maps to `mux_videos` (+ optional junction metadata) from Directus.
 * CMS rows typically use `posterUrl` / `customPosterId`, `location`, and optional `details`.
 */
export type Film = {
  /** `mux_videos.id` (Mux asset id) from Directus; legacy static data may use numeric ids */
  id: string | number;
  /** Discriminator for carousel/search (`isFilm` checks `type === "film"`) */
  type: "film";
  slug: string;
  title: string;
  /** From `mux_videos.location` when using Directus */
  location?: string;
  video: Asset;
  /** Mux thumbnail URL or other remote poster URL from CMS */
  posterUrl?: string | null;
  /** `directus_files` id for uploaded custom poster */
  customPosterId?: string;
  isFeatured?: boolean;
  category?: string;
  tags?: string[];
  description?: string;
  /** Local poster import (legacy bundled films) */
  poster?: {
    image: StaticImageData;
    alt: string;
  };
  /** Rich venue + vendors (legacy static data often has both; CMS may supply vendors only) */
  details?: {
    venue?: Venue;
    vendors?: Vendor[];
  };
  date?: Date;
  publishDate?: Date;
  /** Curated related films from Directus `mux_videos.related_films`. */
  relatedFilms?: Film[];
};

export type InstagramPost = {
  caption: string;
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | "REELS";
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
};

export type PostMetadata = {};
