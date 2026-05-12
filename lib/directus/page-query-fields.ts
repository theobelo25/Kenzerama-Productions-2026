/** Core `mux_videos` columns shared by hero + featured nested queries. */
export const MUX_VIDEO_ROOT_FIELDS =
  "id,playback_id,playback_url,playback_policy,poster,sources,playback_token,thumbnail_token,status,upload_id";

const RELATED_MUX_PREFIX = "related_films.related_mux_videos_id";

/** M2M `mux_videos` → `mux_videos` via `mux_videos_mux_videos`. */
export const RELATED_FILMS_RELATION_FIELDS = [
  "related_films.id",
  ...MUX_VIDEO_ROOT_FIELDS.split(",").map((f) => `${RELATED_MUX_PREFIX}.${f}`),
  `${RELATED_MUX_PREFIX}.slug`,
  `${RELATED_MUX_PREFIX}.title`,
  `${RELATED_MUX_PREFIX}.location`,
  `${RELATED_MUX_PREFIX}.custom_poster.id`,
  `${RELATED_MUX_PREFIX}.custom_poster.title`,
];

/** Top-level `mux_videos` read (film detail, etc.) — editorial fields + custom poster file. */
export const MUX_VIDEO_ITEM_FIELDS = [
  ...MUX_VIDEO_ROOT_FIELDS.split(","),
  "slug",
  "title",
  "location",
  "description",
  "vendors",
  "custom_poster.id",
  "custom_poster.title",
  ...RELATED_FILMS_RELATION_FIELDS,
].join(",");

/** Nested `mux_videos` fields for `pages.hero_video` M2O — keep in sync with Directus. */
export const HERO_VIDEO_RELATION_FIELDS = MUX_VIDEO_ROOT_FIELDS.split(",")
  .map((f) => `hero_video.${f}`)
  .join(",");

const FEATURED_MUX_PREFIX = "featured_videos.mux_videos_id";

/** M2M `pages` → `mux_videos` via junction; FK field must match Data Model (`mux_videos_id`). */
export const FEATURED_VIDEOS_RELATION_FIELDS = [
  "featured_videos.id",
  ...MUX_VIDEO_ROOT_FIELDS.split(",").map((f) => `${FEATURED_MUX_PREFIX}.${f}`),
  `${FEATURED_MUX_PREFIX}.slug`,
  `${FEATURED_MUX_PREFIX}.title`,
  `${FEATURED_MUX_PREFIX}.location`,
  `${FEATURED_MUX_PREFIX}.custom_poster`,
  `${FEATURED_MUX_PREFIX}.custom_poster.id`,
  `${FEATURED_MUX_PREFIX}.custom_poster.title`,
].join(",");

export const TESTIMONIAL_MUX_PREFIX = "testimonials.testimonials_id";

export const TESTIMONIAL_RELATION_FIELDS = [
  "testimonials.id",
  `${TESTIMONIAL_MUX_PREFIX}.id`,
  `${TESTIMONIAL_MUX_PREFIX}.names`,
  `${TESTIMONIAL_MUX_PREFIX}.quote`,
  `${TESTIMONIAL_MUX_PREFIX}.testimonial_image`,
  `${TESTIMONIAL_MUX_PREFIX}.testimonial_image.id`,
  `${TESTIMONIAL_MUX_PREFIX}.testimonial_image.title`,
].join(",");
