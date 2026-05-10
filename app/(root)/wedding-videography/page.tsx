import { cache, Suspense } from "react";
import FeaturedWeddings from "../featured-weddings";
import Instagram from "../instagram";
import ContactCta from "../contact-cta";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { Metadata } from "next";
import { getPageBySlug } from "@/lib/actions/directus.actions";
import { DirectusItemsOptions } from "@/lib/directus/client";
import { secondaryHeroFromBlockItem } from "@/lib/directus/blocks/block_hero_secondary";
import { infoBlockFromBlockItem } from "@/lib/directus/blocks/block_info";
import { BLOCKS, getBlockContent } from "@/lib/directus/blocks";
import SecondaryHero from "@/components/shared/secondary-hero";
import InfoBlock from "@/components/shared/info-block";
import { videoSectionFromBlockItem } from "@/lib/directus/blocks/block_videos";

// export const revalidate = 60; // ISR
export const dynamic = "force-dynamic";

const PAGE_SLUG = "wedding-videography";
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
              block_hero_secondary: ["*"],
              block_info: ["*"],
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
            },
          },
        ],
      },
    ],
  },
  next: { revalidate: 60, tags: ["pages", `page:${PAGE_SLUG}`] },
} satisfies DirectusItemsOptions;

const getVideographyPage = cache(async () =>
  getPageBySlug(PAGE_SLUG, PAGE_QUERY),
);

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getVideographyPage();

    return buildSeoMetadata(page, { fallbackTitle: "Homepage", pathname: "/" });
  } catch (error) {
    console.error("[home] Failed to load SEO metadata, using fallback", error);
    return buildSeoMetadata(null, { fallbackTitle: "Homepage", pathname: "/" });
  }
}

export default async function WeddingVideographyPage() {
  let page: Awaited<ReturnType<typeof getPageBySlug>> = null;

  try {
    page = await getVideographyPage();
  } catch (error) {
    // Log and continue with safe defaults so deploy/build isn't brittle
    console.error("[home] Directus unavailable, using fallback", error);
  }

  const heroData = secondaryHeroFromBlockItem(
    getBlockContent(page, BLOCKS.SECONDARY_HERO)?.item,
  );
  const infoData = infoBlockFromBlockItem(
    getBlockContent(page, BLOCKS.INFO_BLOCK)?.item,
  );
  const videoData = videoSectionFromBlockItem(
    getBlockContent(page, BLOCKS.VIDEO_BLOCK)?.item,
  );

  return (
    <>
      {heroData ? <SecondaryHero data={heroData} /> : null}
      {infoData ? <InfoBlock data={infoData} /> : null}
      {videoData ? (
        <Suspense fallback={null}>
          <FeaturedWeddings isFeatured={false} noTopPadding data={videoData} />
        </Suspense>
      ) : null}

      <Instagram />
      <ContactCta />
    </>
  );
}
