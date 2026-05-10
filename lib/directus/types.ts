import type { DirectusMuxVideo } from "@/lib/video/create-mux-video-asset";

/** One row of the `pages_mux_videos` (or similar) junction with expanded mux video. */
export type DirectusFeaturedVideoLink = {
  id?: string;
  sort?: number | null;
  mux_videos_id?: DirectusMuxVideo | string | null;
};

/** One row of `pages` → `testimonials` M2M junction with expanded testimonial. */
export type DirectusTestimonial = {
  id?: string;
  names?: string | null;
  quote?: string | null;
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
