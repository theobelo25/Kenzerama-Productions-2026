import type { Metadata } from "next";
import AboutHero from "./about-hero";
import MessageFromKenzerama from "./message-from-kenzerama";
import OurTeams from "./our-teams";
import Instagram from "../instagram";
import ContactCta from "../contact-cta";
import FrequentlyAskedQuestions from "./faq";
import { DirectusItemsOptions } from "@/lib/directus/client";
import { cache } from "react";
import { getPageBySlug } from "@/lib/actions/directus.actions";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { secondaryHeroFromBlockItem } from "@/lib/directus/blocks/block_hero_secondary";
import { BLOCKS, getBlockContent } from "@/lib/directus/blocks";
import { brandedInfoFromBlockItem } from "@/lib/directus/blocks/block_branded_info";
import { ourTeamsFromBlockItem } from "@/lib/directus/blocks/block_our_teams";
import { faqsFromBlockItem } from "@/lib/directus/blocks/block_faqs";
import SecondaryHero from "@/components/shared/secondary-hero";
import BrandedInfoBlock from "@/components/shared/branded-info-block";

// export const revalidate = 60; // ISR
export const dynamic = "force-dynamic";

const PAGE_SLUG = "about-us";
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
              block_hero_secondary: [
                "*",
                {
                  hero_image: ["id", "title"],
                },
              ],
              block_branded_info: ["*"],
              block_our_teams: [
                "*",
                {
                  our_teams: [
                    "*",
                    {
                      teams_id: [
                        "*",
                        {
                          image: ["id", "title"],
                        },
                      ],
                    },
                  ],
                },
              ],
              block_faqs: [
                "*",
                {
                  faqs: [
                    "*",
                    {
                      faqs_id: ["id", "question", "answer", "sort"],
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

const getAboutPage = cache(async () => getPageBySlug(PAGE_SLUG, PAGE_QUERY));

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getAboutPage();

    return buildSeoMetadata(page, {
      fallbackTitle: "About us",
      pathname: "/about-us",
    });
  } catch (error) {
    console.error("[home] Failed to load SEO metadata, using fallback", error);
    return buildSeoMetadata(null, {
      fallbackTitle: "About us",
      pathname: "/about-us",
    });
  }
}

export default async function AboutUsPage() {
  let page: Awaited<ReturnType<typeof getPageBySlug>> = null;

  try {
    page = await getAboutPage();
  } catch (error) {
    // Log and continue with safe defaults so deploy/build isn't brittle
    console.error("[home] Directus unavailable, using fallback", error);
  }

  const heroData = secondaryHeroFromBlockItem(
    getBlockContent(page, BLOCKS.SECONDARY_HERO)?.item,
  );
  const brandedInfoData = brandedInfoFromBlockItem(
    getBlockContent(page, BLOCKS.BRANDED_INFO)?.item,
  );
  const ourTeamsData = ourTeamsFromBlockItem(
    getBlockContent(page, BLOCKS.OUR_TEAMS)?.item,
  );
  const faqsData = faqsFromBlockItem(getBlockContent(page, BLOCKS.FAQS)?.item);

  return (
    <>
      {heroData ? <SecondaryHero data={heroData} /> : null}
      {brandedInfoData ? <BrandedInfoBlock data={brandedInfoData} /> : null}
      {ourTeamsData ? <OurTeams data={ourTeamsData} /> : null}
      {faqsData ? <FrequentlyAskedQuestions data={faqsData} /> : null}
      <Instagram />
      <ContactCta />
    </>
  );
}
