import { cache, Suspense } from "react";
import type { Metadata } from "next";
import PrimaryHero from "./primary-hero";
import FeaturedWeddings from "./featured-weddings";
import WhoWeAre from "./who-we-are";
import Instagram from "./instagram";
import ContactCta from "./contact-cta";
import TestimonialsClient from "./testimonials-client";
import { getPageBySlug } from "@/lib/actions/directus.actions";
import { APP_NAME } from "@/lib/constants";
import { pageFeaturedVideosToFilms } from "@/lib/directus/page-featured-to-film";
import { muxVideoRowToAsset } from "@/lib/video/create-mux-video-asset";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import homepageHeroTeaser from "@/videos/homepage_hero_video.mp4";
import { DirectusItemsOptions } from "@/lib/directus/client";
import { BLOCKS, getBlockContent } from "@/lib/directus/blocks";
import { primaryHeroFromBlockItem } from "@/lib/directus/blocks/block_hero_primary";
import { videoSectionFromBlockItem } from "@/lib/directus/blocks/block_videos";
import { brandedInfoFromBlockItem } from "@/lib/directus/blocks/block_branded_info";
import BrandedInfoBlock from "@/components/shared/branded-info-block";
import { testimonialsFromBlockItem } from "@/lib/directus/blocks/block_testimonials";

// export const revalidate = 60; // ISR
export const dynamic = "force-dynamic";

const PAGE_SLUG = "homepage";
const PAGE_QUERY = {
  query: {
    filter: {
      slug: { _eq: PAGE_SLUG },
    },
    fields: [
      "*",
      {
        page_content: [
          "*",
          {
            item: {
              block_hero_primary: [
                "*",
                {
                  hero_video: ["*"],
                },
              ],
              block_videos: [
                "*",
                {
                  videos: [
                    "*",
                    {
                      mux_videos_id: [
                        "*",
                        {
                          custom_poster: ["id", "title"],
                        },
                      ],
                    },
                  ],
                },
              ],
              block_branded_info: ["*"],
              block_testimonials: [
                "*",
                {
                  testimonials: [
                    "*",
                    {
                      testimonials_id: ["id", "names", "quote"],
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  next: { revalidate: 60, tags: ["pages", `page:${PAGE_SLUG}`] },
} satisfies DirectusItemsOptions;

const getHomepagePage = cache(async () => getPageBySlug(PAGE_SLUG, PAGE_QUERY));

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getHomepagePage();

    return buildSeoMetadata(page, { fallbackTitle: "Homepage", pathname: "/" });
  } catch (error) {
    console.error("[home] Failed to load SEO metadata, using fallback", error);
    return buildSeoMetadata(null, { fallbackTitle: "Homepage", pathname: "/" });
  }
}

export default async function Homepage() {
  let page: Awaited<ReturnType<typeof getPageBySlug>> = null;

  try {
    page = await getHomepagePage();
  } catch (error) {
    // Log and continue with safe defaults so deploy/build isn't brittle
    console.error("[home] Directus unavailable, using fallback", error);
  }

  const heroData = primaryHeroFromBlockItem(
    getBlockContent(page, BLOCKS.PRIMARY_HERO)?.item,
  );
  const featuredWeddingsData = videoSectionFromBlockItem(
    getBlockContent(page, BLOCKS.VIDEO_BLOCK)?.item,
  );
  const brandedInfoData = brandedInfoFromBlockItem(
    getBlockContent(page, BLOCKS.BRANDED_INFO)?.item,
  );
  const testimonialsData = testimonialsFromBlockItem(
    getBlockContent(page, BLOCKS.TESTIMONIALS)?.item,
  );

  return (
    <div className="landing-page-compact">
      {heroData ? <PrimaryHero data={heroData} /> : null}

      {featuredWeddingsData ? (
        <Suspense fallback={null}>
          <FeaturedWeddings
            isFeatured
            compactSpacing
            data={featuredWeddingsData}
          />
        </Suspense>
      ) : null}

      {brandedInfoData ? <BrandedInfoBlock data={brandedInfoData} /> : null}

      {testimonialsData ? <TestimonialsClient data={testimonialsData} /> : null}

      <Instagram compactSpacing />
      <ContactCta />
    </div>
  );
}
