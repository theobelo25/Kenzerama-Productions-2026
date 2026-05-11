import type { Metadata } from "next";
import { cache } from "react";
import OurTeams from "./_components/our-teams";
import Instagram from "@/components/ctas/instagram";
import ContactCta from "@/components/ctas/contact-cta";
import FrequentlyAskedQuestions from "./_components/faq";
import { getPageBySlug } from "@/lib/server";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { BLOCKS, mapBlockItem } from "@/lib/directus/blocks";
import { secondaryHeroFromBlockItem } from "@/lib/directus/blocks/block_hero_secondary";
import { brandedInfoFromBlockItem } from "@/lib/directus/blocks/block_branded_info";
import { ourTeamsFromBlockItem } from "@/lib/directus/blocks/block_our_teams";
import { faqsFromBlockItem } from "@/lib/directus/blocks/block_faqs";
import SecondaryHero from "@/components/sections/heroes/secondary-hero";
import BrandedInfoBlock from "@/components/ctas/branded-info-block";
import {
  BLOCK_BRANDED_INFO_NESTED_FIELDS,
  BLOCK_FAQS_NESTED_FIELDS,
  BLOCK_HERO_SECONDARY_NESTED_FIELDS,
  BLOCK_OUR_TEAMS_NESTED_FIELDS,
  buildPageBySlugQuery,
} from "@/lib/directus/page-queries";

const PAGE_SLUG = "about-us";
const SEO = { fallbackTitle: "About us", pathname: "/about-us" } as const;

const PAGE_QUERY = buildPageBySlugQuery(PAGE_SLUG, {
  block_hero_secondary: BLOCK_HERO_SECONDARY_NESTED_FIELDS,
  block_branded_info: BLOCK_BRANDED_INFO_NESTED_FIELDS,
  block_our_teams: BLOCK_OUR_TEAMS_NESTED_FIELDS,
  block_faqs: BLOCK_FAQS_NESTED_FIELDS,
});

const getAboutPage = cache(async () => getPageBySlug(PAGE_SLUG, PAGE_QUERY));

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getAboutPage();

    return buildSeoMetadata(page, SEO);
  } catch (error) {
    console.error(
      "[about-us] Failed to load SEO metadata, using fallback",
      error,
    );
    return buildSeoMetadata(null, SEO);
  }
}

export default async function AboutUsPage() {
  let page: Awaited<ReturnType<typeof getPageBySlug>> = null;

  try {
    page = await getAboutPage();
  } catch (error) {
    console.error("[about-us] Directus unavailable, using fallback", error);
  }

  const heroData = mapBlockItem(
    page,
    BLOCKS.SECONDARY_HERO,
    secondaryHeroFromBlockItem,
  );
  const brandedInfoData = mapBlockItem(
    page,
    BLOCKS.BRANDED_INFO,
    brandedInfoFromBlockItem,
  );
  const ourTeamsData = mapBlockItem(
    page,
    BLOCKS.OUR_TEAMS,
    ourTeamsFromBlockItem,
  );
  const faqsData = mapBlockItem(page, BLOCKS.FAQS, faqsFromBlockItem);

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
