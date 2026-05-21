import { cache } from "react";
import type { Metadata } from "next";
import Instagram from "@/components/ctas/instagram";
import SecondaryHero from "@/components/sections/heroes/secondary-hero";
import ContactFormWrapper from "./_components/contact-form-wrapper";
import AlternateContactSection from "./_components/alternate-contact-section";
import { getPageBySlug } from "@/lib/server";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { BLOCKS, mapBlockItem } from "@/lib/directus/blocks";
import { secondaryHeroFromBlockItem } from "@/lib/directus/blocks/block_hero_secondary";
import { infoBlockFromBlockItem } from "@/lib/directus/blocks/block_info";
import { contactFormFromBlockItem } from "@/lib/directus/blocks/block_contact_form";
import InfoBlock from "@/components/ctas/info-block";
import {
  BLOCK_CONTACT_FORM_NESTED_FIELDS,
  BLOCK_HERO_SECONDARY_NESTED_FIELDS,
  BLOCK_INFO_NESTED_FIELDS,
  buildPageBySlugQuery,
} from "@/lib/directus/page-queries";

const PAGE_SLUG = "contact-us";
const SEO = { fallbackTitle: "Contact us", pathname: "/contact-us" } as const;

const PAGE_QUERY = buildPageBySlugQuery(PAGE_SLUG, {
  block_hero_secondary: BLOCK_HERO_SECONDARY_NESTED_FIELDS,
  block_info: BLOCK_INFO_NESTED_FIELDS,
  block_contact_form: BLOCK_CONTACT_FORM_NESTED_FIELDS,
});

const getContactPage = cache(async () => getPageBySlug(PAGE_SLUG, PAGE_QUERY));

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getContactPage();

    return buildSeoMetadata(page, SEO);
  } catch (error) {
    console.error(
      "[contact-us] Failed to load SEO metadata, using fallback",
      error,
    );
    return buildSeoMetadata(null, SEO);
  }
}

export default async function ContactUsPage() {
  let page: Awaited<ReturnType<typeof getPageBySlug>> = null;

  try {
    page = await getContactPage();
  } catch (error) {
    console.error("[contact-us] Directus unavailable, using fallback", error);
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
  const contactFormData = mapBlockItem(
    page,
    BLOCKS.CONTACT_FORM_BLOCK,
    contactFormFromBlockItem,
  );

  return (
    <>
      {heroData ? <SecondaryHero data={heroData} /> : null}
      {infoData ? <InfoBlock data={infoData} /> : null}
      {contactFormData ? <ContactFormWrapper data={contactFormData} /> : null}
      <AlternateContactSection />
      <Instagram />
    </>
  );
}
