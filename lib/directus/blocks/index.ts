import type { PageData } from "@/lib/directus/types";
import type { DirectusBlockBrandedInfo } from "./block_branded_info";
import { DirectusBlockContactForm } from "./block_contact_form";
import { DirectusBlockExtras } from "./block_extras";
import type { DirectusBlockFaqs } from "./block_faqs";
import type { DirectusBlockHeroPrimary } from "./block_hero_primary";
import type { DirectusBlockHeroSecondary } from "./block_hero_secondary";
import { DirectusBlockInfo } from "./block_info";
import type { DirectusBlockOurTeams } from "./block_our_teams";
import { DirectusBlockPackages } from "./block_packages";
import type { DirectusBlockTestimonials } from "./block_testimonials";
import { DirectusBlockVideos } from "./block_videos";

// Register blocks
export const BLOCKS = {
  PRIMARY_HERO: "block_hero_primary",
  SECONDARY_HERO: "block_hero_secondary",
  VIDEO_BLOCK: "block_videos",
  BRANDED_INFO: "block_branded_info",
  TESTIMONIALS: "block_testimonials",
  OUR_TEAMS: "block_our_teams",
  FAQS: "block_faqs",
  INFO_BLOCK: "block_info",
  PACKAGES_BLOCK: "block_packages",
  EXTRAS_BLOCK: "block_extras",
  CONTACT_FORM_BLOCK: "block_contact_form",
} as const;

export type BlockItemByCollection = {
  block_hero_primary: DirectusBlockHeroPrimary;
  block_hero_secondary: DirectusBlockHeroSecondary;
  block_videos: DirectusBlockVideos;
  block_branded_info: DirectusBlockBrandedInfo;
  block_testimonials: DirectusBlockTestimonials;
  block_our_teams: DirectusBlockOurTeams;
  block_faqs: DirectusBlockFaqs;
  block_info: DirectusBlockInfo;
  block_packages: DirectusBlockPackages;
  block_extras: DirectusBlockExtras;
  block_contact_form: DirectusBlockContactForm;
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

export function mapBlockItem<C extends BlockCollection, T>(
  page: PageData | null,
  collection: C,
  mapper: (item: BlockItemByCollection[C] | undefined) => T | null,
): T | null {
  return mapper(getBlockContent(page, collection)?.item);
}
