import { cache, Suspense } from "react";
import type { Metadata } from "next";
import WeddingFilms from "@/components/media/wedding-films/wedding-films";
import Instagram from "@/components/ctas/instagram";
import ContactCta from "@/components/ctas/contact-cta";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { getPageBySlug } from "@/lib/server";
import { BLOCKS, mapBlockItem } from "@/lib/directus/blocks";
import { secondaryHeroFromBlockItem } from "@/lib/directus/blocks/block_hero_secondary";
import { infoBlockFromBlockItem } from "@/lib/directus/blocks/block_info";
import SecondaryHero from "@/components/sections/heroes/secondary-hero";
import InfoBlock from "@/components/ctas/info-block";
import { videoSectionFromBlockItem } from "@/lib/directus/blocks/block_videos";
import {
  BLOCK_HERO_SECONDARY_NESTED_FIELDS,
  BLOCK_INFO_NESTED_FIELDS,
  BLOCK_VIDEOS_NESTED_FIELDS,
  buildPageBySlugQuery,
} from "@/lib/directus/page-queries";

const PAGE_SLUG = "wedding-videography";
const SEO = {
  fallbackTitle: "Wedding videography",
  pathname: "/wedding-videography",
} as const;

const PAGE_QUERY = buildPageBySlugQuery(PAGE_SLUG, {
  block_hero_secondary: BLOCK_HERO_SECONDARY_NESTED_FIELDS,
  block_info: BLOCK_INFO_NESTED_FIELDS,
  block_videos: BLOCK_VIDEOS_NESTED_FIELDS,
});

const getWeddingVideographyPage = cache(async () =>
  getPageBySlug(PAGE_SLUG, PAGE_QUERY),
);

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getWeddingVideographyPage();

    return buildSeoMetadata(page, SEO);
  } catch (error) {
    console.error(
      "[wedding-videography] Failed to load SEO metadata, using fallback",
      error,
    );
    return buildSeoMetadata(null, SEO);
  }
}

export default async function WeddingVideographyPage() {
  let page: Awaited<ReturnType<typeof getPageBySlug>> = null;

  try {
    page = await getWeddingVideographyPage();
  } catch (error) {
    console.error(
      "[wedding-videography] Directus unavailable, using fallback",
      error,
    );
  }

  const heroData = mapBlockItem(
    page,
    BLOCKS.SECONDARY_HERO,
    secondaryHeroFromBlockItem,
  );
  const infoData = mapBlockItem(
    page,
    BLOCKS.INFO_BLOCK,
    infoBlockFromBlockItem,
  );
  const videoData = mapBlockItem(
    page,
    BLOCKS.VIDEO_BLOCK,
    videoSectionFromBlockItem,
  );

  return (
    <>
      {heroData ? <SecondaryHero data={heroData} /> : null}
      {infoData ? <InfoBlock data={infoData} /> : null}
      <Suspense fallback={null}>
        <WeddingFilms isFeatured={false} noTopPadding data={videoData} />
      </Suspense>

      <Instagram />
      <ContactCta />
    </>
  );
}
