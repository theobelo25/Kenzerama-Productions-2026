import { pageCacheTags } from "@/lib/cache/tags";
import type { DirectusItemsOptions } from "./client";

export const DIRECTUS_FILE_MIN_FIELDS = ["id", "title"] as const;

export const BLOCK_HERO_PRIMARY_NESTED_FIELDS = [
  "*",
  {
    hero_video: ["*"],
  },
] as const;

export const BLOCK_HERO_SECONDARY_NESTED_FIELDS = [
  "*",
  {
    hero_image: [...DIRECTUS_FILE_MIN_FIELDS],
  },
] as const;

export const BLOCK_BRANDED_INFO_NESTED_FIELDS = ["*"] as const;

export const BLOCK_INFO_NESTED_FIELDS = ["*"] as const;

export const BLOCK_CONTACT_FORM_NESTED_FIELDS = ["*"] as const;

export const BLOCK_CTA_BANNER_NESTED_FIELDS = [
  "*",
  {
    background_image: [...DIRECTUS_FILE_MIN_FIELDS],
  },
] as const;

export const BLOCK_OUR_TEAMS_NESTED_FIELDS = [
  "*",
  {
    our_teams: [
      "*",
      {
        teams_id: [
          "*",
          {
            image: [...DIRECTUS_FILE_MIN_FIELDS],
          },
        ],
      },
    ],
  },
] as const;

export const BLOCK_FAQS_NESTED_FIELDS = [
  "*",
  {
    faqs: [
      "*",
      {
        faqs_id: ["id", "question", "answer", "sort"],
      },
    ],
  },
] as const;

export const BLOCK_PACKAGES_NESTED_FIELDS = [
  "*",
  {
    packages: [
      "*",
      {
        packages_id: [
          "*",
          {
            contents: ["*"],
          },
        ],
      },
    ],
  },
] as const;

export const BLOCK_EXTRAS_NESTED_FIELDS = [
  "*",
  {
    extras: [
      "*",
      {
        extras_id: ["*"],
      },
    ],
  },
] as const;

export const MUX_VIDEO_WITH_POSTER_FIELDS = [
  "*",
  {
    custom_poster: [...DIRECTUS_FILE_MIN_FIELDS],
  },
] as const;

export const BLOCK_VIDEOS_NESTED_FIELDS = [
  "*",
  {
    videos: [
      "*",
      {
        mux_videos_id: MUX_VIDEO_WITH_POSTER_FIELDS,
      },
    ],
  },
] as const;

export const BLOCK_TESTIMONIALS_NESTED_FIELDS = [
  "*",
  {
    testimonials: [
      "*",
      {
        testimonials_id: [
          "id",
          "names",
          "quote",
          {
            testimonial_image: [...DIRECTUS_FILE_MIN_FIELDS],
          },
        ],
      },
    ],
  },
] as const;

export function buildPageBySlugQuery(
  slug: string,
  itemFields: Record<string, unknown>,
  revalidateSeconds = 60,
): DirectusItemsOptions {
  return {
    query: {
      filter: {
        slug: { _eq: slug },
      },
      fields: [
        "*",
        {
          page_content: [
            "*",
            {
              item: itemFields,
            },
          ],
        },
      ],
    },
    next: { revalidate: revalidateSeconds, tags: pageCacheTags(slug) },
  };
}
