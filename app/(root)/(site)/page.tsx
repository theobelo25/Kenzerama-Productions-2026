import { cache, Suspense } from "react";
import type { Metadata } from "next";
import PrimaryHero from "@/components/sections/heroes/primary-hero";
import WeddingFilms from "@/components/media/wedding-films/wedding-films";
import Instagram from "@/components/ctas/instagram";
import ContactCta from "@/components/ctas/contact-cta";
import TestimonialsClient from "@/components/sections/testimonials/testimonials-client";
import BrandedInfoBlock from "@/components/ctas/branded-info-block";
import { getPageBySlug } from "@/lib/server";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { BLOCKS, mapBlockItem } from "@/lib/directus/blocks";
import { primaryHeroFromBlockItem } from "@/lib/directus/blocks/block_hero_primary";
import { videoSectionFromBlockItem } from "@/lib/directus/blocks/block_videos";
import { brandedInfoFromBlockItem } from "@/lib/directus/blocks/block_branded_info";
import { testimonialsFromBlockItem } from "@/lib/directus/blocks/block_testimonials";
import {
  BLOCK_BRANDED_INFO_NESTED_FIELDS,
  BLOCK_HERO_PRIMARY_NESTED_FIELDS,
  BLOCK_TESTIMONIALS_NESTED_FIELDS,
  BLOCK_VIDEOS_NESTED_FIELDS,
  buildPageBySlugQuery,
} from "@/lib/directus/page-queries";

const PAGE_SLUG = "homepage";
const SEO = { fallbackTitle: "Homepage", pathname: "/" } as const;

const PAGE_QUERY = buildPageBySlugQuery(PAGE_SLUG, {
  block_hero_primary: BLOCK_HERO_PRIMARY_NESTED_FIELDS,
  block_videos: BLOCK_VIDEOS_NESTED_FIELDS,
  block_branded_info: BLOCK_BRANDED_INFO_NESTED_FIELDS,
  block_testimonials: BLOCK_TESTIMONIALS_NESTED_FIELDS,
});

const getHomepagePage = cache(async () => getPageBySlug(PAGE_SLUG, PAGE_QUERY));

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getHomepagePage();

    return buildSeoMetadata(page, SEO);
  } catch (error) {
    console.error(
      "[homepage] Failed to load SEO metadata, using fallback",
      error,
    );
    return buildSeoMetadata(null, SEO);
  }
}

export default async function Homepage() {
  let page: Awaited<ReturnType<typeof getPageBySlug>> = null;

  try {
    page = await getHomepagePage();
  } catch (error) {
    console.error("[homepage] Directus unavailable, using fallback", error);
  }

  const heroData = mapBlockItem(
    page,
    BLOCKS.PRIMARY_HERO,
    primaryHeroFromBlockItem,
  );
  const weddingFilmsData = mapBlockItem(
    page,
    BLOCKS.VIDEO_BLOCK,
    videoSectionFromBlockItem,
  );
  const brandedInfoData = mapBlockItem(
    page,
    BLOCKS.BRANDED_INFO,
    brandedInfoFromBlockItem,
  );
  const testimonialsData = mapBlockItem(
    page,
    BLOCKS.TESTIMONIALS,
    testimonialsFromBlockItem,
  );

  return (
    <div className="landing-page-compact">
      {heroData ? <PrimaryHero data={heroData} /> : null}

      <Suspense fallback={null}>
        <WeddingFilms isFeatured compactSpacing data={weddingFilmsData} />
      </Suspense>

      {brandedInfoData ? <BrandedInfoBlock data={brandedInfoData} /> : null}

      {testimonialsData ? <TestimonialsClient data={testimonialsData} /> : null}

      <Instagram compactSpacing />
      <ContactCta />
    </div>
  );
}
