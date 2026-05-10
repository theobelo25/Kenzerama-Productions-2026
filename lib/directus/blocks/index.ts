import { PageData } from "../../actions/directus.actions";
import type { DirectusBlockBrandedInfo } from "./block_branded_info";
import type { DirectusBlockHeroPrimary } from "./block_hero_primary";
import type { DirectusBlockTestimonials } from "./block_testimonials";
import { DirectusBlockVideos } from "./block_videos";

// Register blocks
export const BLOCKS = {
  PRIMARY_HERO: "block_hero_primary",
  VIDEO_BLOCK: "block_videos",
  BRANDED_INFO: "block_branded_info",
  TESTIMONIALS: "block_testimonials",
} as const;

export type BlockItemByCollection = {
  block_hero_primary: DirectusBlockHeroPrimary;
  block_videos: DirectusBlockVideos;
  block_branded_info: DirectusBlockBrandedInfo;
  block_testimonials: DirectusBlockTestimonials;
};

export type BlockCollection = (typeof BLOCKS)[keyof typeof BLOCKS];

export type PageContentRow<K extends BlockCollection = BlockCollection> = {
  id?: number | string;
  pages_id?: string;
  sort?: number;
  collection: K;
  item?: BlockItemByCollection[K];
};

export function getBlockContent<C extends BlockCollection>(
  page: PageData | null,
  collection: C,
): PageContentRow<C> | undefined {
  const blocks = page?.page_content;

  if (!Array.isArray(blocks)) return undefined;

  const blockData = blocks.find(
    (d): d is PageContentRow<C> =>
      typeof d === "object" &&
      d !== null &&
      "collection" in d &&
      (d as PageContentRow).collection === collection,
  );

  return blockData;
}
