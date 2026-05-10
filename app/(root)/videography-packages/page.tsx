import SecondaryHero from "@/components/shared/secondary-hero";
import PackagesSection from "./packages-section";
import ExtrasSection from "./extras-section";
import Instagram from "../instagram";
import ContactCta from "../contact-cta";
import { DirectusItemsOptions } from "@/lib/directus/client";
import { cache } from "react";
import { getPageBySlug } from "@/lib/actions/directus.actions";
import { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { secondaryHeroFromBlockItem } from "@/lib/directus/blocks/block_hero_secondary";
import { BLOCKS, getBlockContent } from "@/lib/directus/blocks";
import { infoBlockFromBlockItem } from "@/lib/directus/blocks/block_info";
import InfoBlock from "@/components/shared/info-block";
import { packagesFromBlockItem } from "@/lib/directus/blocks/block_packages";
import type { PackagesProps } from "@/lib/directus/blocks/block_packages";
import { extrasFromBlockItem } from "@/lib/directus/blocks/block_extras";
import type { ExtrasProps } from "@/lib/directus/blocks/block_extras";
import { PACKAGES, EXTRAS } from "@/info/packages";

// export const revalidate = 60; // ISR
export const dynamic = "force-dynamic";

const PAGE_SLUG = "videography-packages";

const FALLBACK_PACKAGES: PackagesProps = {
  id: "wedding-packages-heading",
  title: "Wedding Packages",
  packages: PACKAGES.map((p) => ({
    title: p.title,
    includes: p.includes,
    price: p.price,
  })),
};

const FALLBACK_EXTRAS: ExtrasProps = {
  id: "package-extras-heading",
  title: "Extras",
  extras: EXTRAS.map((e) => ({
    title: e.title,
    price: e.price,
  })),
};

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
              block_packages: [
                "*",
                {
                  packages: [
                    "*",
                    {
                      packages_id: [
                        "*",
                        {
                          /** O2M bullet lines (field name must match your Directus schema) */
                          contents: ["*"],
                        },
                      ],
                    },
                  ],
                },
              ],
              block_extras: [
                "*",
                {
                  extras: [
                    "*",
                    {
                      extras_id: ["*"],
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

export default async function VideographyPackagesPage() {
  let page: Awaited<ReturnType<typeof getPageBySlug>> = null;

  try {
    page = await getVideographyPage();
  } catch (error) {
    console.error("[home] Directus unavailable, using fallback", error);
  }

  const heroData = secondaryHeroFromBlockItem(
    getBlockContent(page, BLOCKS.SECONDARY_HERO)?.item,
  );
  const infoData = infoBlockFromBlockItem(
    getBlockContent(page, BLOCKS.INFO_BLOCK)?.item,
  );
  const packagesData = packagesFromBlockItem(
    getBlockContent(page, BLOCKS.PACKAGES_BLOCK)?.item,
  );
  const extrasData = extrasFromBlockItem(
    getBlockContent(page, BLOCKS.EXTRAS_BLOCK)?.item,
  );

  return (
    <>
      {heroData ? <SecondaryHero data={heroData} /> : null}
      {infoData ? <InfoBlock data={infoData} /> : null}
      <PackagesSection data={packagesData ?? FALLBACK_PACKAGES} />
      <ExtrasSection data={extrasData ?? FALLBACK_EXTRAS} />
      <Instagram />
      <ContactCta />
    </>
  );
}
