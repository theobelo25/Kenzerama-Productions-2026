import Instagram from "../instagram";
import SecondaryHero from "@/components/shared/secondary-hero";
import ContactFormWrapper from "./contact-form-wrapper";
import AlternateContactSection from "./alternate-contact-section";
import { DirectusItemsOptions } from "@/lib/directus/client";
import { cache } from "react";
import { getPageBySlug } from "@/lib/actions/directus.actions";
import { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { secondaryHeroFromBlockItem } from "@/lib/directus/blocks/block_hero_secondary";
import { BLOCKS, getBlockContent } from "@/lib/directus/blocks";
import { infoBlockFromBlockItem } from "@/lib/directus/blocks/block_info";
import { contactFormFromBlockItem } from "@/lib/directus/blocks/block_contact_form";
import InfoBlock from "@/components/shared/info-block";

// export const revalidate = 60; // ISR
export const dynamic = "force-dynamic";

const PAGE_SLUG = "contact-us";

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
              block_contact_form: ["*"],
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

    return buildSeoMetadata(page, {
      fallbackTitle: "Investment",
      pathname: "/videography-packages",
    });
  } catch (error) {
    console.error("[home] Failed to load SEO metadata, using fallback", error);
    return buildSeoMetadata(null, {
      fallbackTitle: "Investment",
      pathname: "/videography-packages",
    });
  }
}

export default async function ContactUsPage() {
  let page: Awaited<ReturnType<typeof getPageBySlug>> = null;

  try {
    page = await getVideographyPage();
    console.log(page);
  } catch (error) {
    console.error("[home] Directus unavailable, using fallback", error);
  }

  const heroData = secondaryHeroFromBlockItem(
    getBlockContent(page, BLOCKS.SECONDARY_HERO)?.item,
  );

  const infoData = infoBlockFromBlockItem(
    getBlockContent(page, BLOCKS.INFO_BLOCK)?.item,
  );
  const contactFormData = contactFormFromBlockItem(
    getBlockContent(page, BLOCKS.CONTACT_FORM_BLOCK)?.item,
  );
  console.log(contactFormData);
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
