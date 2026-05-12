/** Expanded `directus_files` row (minimal) for image fields like `custom_poster`. */
export type DirectusFileRef = {
  id: string;
  title?: string | null;
};

/** Subset of `mux_videos` used to build a next-video `Asset`. */
export type DirectusMuxVideo = {
  id: string;
  playback_id?: string | null;
  playback_url?: string | null;
  playback_policy?: string | null;
  poster?: string | null;
  sources?: unknown;
  playback_token?: string | null;
  thumbnail_token?: string | null;
  status?: string | null;
  upload_id?: string | null;
  slug?: string | null;
  title?: string | null;
  location?: string | null;
  description?: string | null;
  vendors?: unknown;
  custom_poster?: DirectusFileRef | string | null;
  custom_poster_id?: string | null;
  related_films?: DirectusRelatedFilmLink[] | null;
};

/** One row of the `pages_mux_videos` (or similar) junction with expanded mux video. */
export type DirectusFeaturedVideoLink = {
  id?: string;
  sort?: number | null;
  mux_videos_id?: DirectusMuxVideo | string | null;
};

/** One row of `mux_videos_mux_videos` with expanded related mux video. */
export type DirectusRelatedFilmLink = {
  id?: string | number;
  related_mux_videos_id?: DirectusMuxVideo | string | null;
};

/** One row of `pages` → `testimonials` M2M junction with expanded testimonial. */
export type DirectusTestimonial = {
  id?: string;
  names?: string | null;
  quote?: string | null;
  testimonial_image?: DirectusFileRef | string | null;
};

export type DirectusTestimonialLink = {
  id?: string;
  sort?: number | null;
  testimonials_id?: DirectusTestimonial | string | null;
};

export type DirectusPage = {
  id: string;
  slug: string;
  title: string;
  status?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  og_image?: string | null;
  page_content?: unknown[] | null;
  date_updated?: string | null;
};

/** Normalized featured mux item for the homepage / page UI. */
export type PageFeaturedVideo = {
  linkId?: string;
  sort?: number;
  slug?: string;
  title?: string;
  location?: string;
  customPosterId?: string;
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
  backgroundSrc?: string;
};
