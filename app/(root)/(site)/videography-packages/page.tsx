import { cache } from "react";
import type { Metadata } from "next";
import SecondaryHero from "@/components/sections/heroes/secondary-hero";
import PackagesSection from "./_components/packages-section";
import ExtrasSection from "./_components/extras-section";
import Instagram from "@/components/ctas/instagram";
import CtaBanner from "@/components/ctas/cta-banner";
import { DEFAULT_CONTACT_CTA_BANNER } from "@/lib/constants/contact-cta-banner";
import { getPageBySlug } from "@/lib/server";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { BLOCKS, mapBlockItem } from "@/lib/directus/blocks";
import { secondaryHeroFromBlockItem } from "@/lib/directus/blocks/block_hero_secondary";
import { infoBlockFromBlockItem } from "@/lib/directus/blocks/block_info";
import InfoBlock from "@/components/ctas/info-block";
import { packagesFromBlockItem } from "@/lib/directus/blocks/block_packages";
import type { PackagesProps } from "@/lib/directus/blocks/block_packages";
import { extrasFromBlockItem } from "@/lib/directus/blocks/block_extras";
import type { ExtrasProps } from "@/lib/directus/blocks/block_extras";
import { PACKAGES, EXTRAS } from "@/info/packages";
import {
  BLOCK_EXTRAS_NESTED_FIELDS,
  BLOCK_HERO_SECONDARY_NESTED_FIELDS,
  BLOCK_INFO_NESTED_FIELDS,
  BLOCK_PACKAGES_NESTED_FIELDS,
  buildPageBySlugQuery,
} from "@/lib/directus/page-queries";

const PAGE_SLUG = "videography-packages";
const SEO = {
  fallbackTitle: "Investment",
  pathname: "/videography-packages",
} as const;

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

const PAGE_QUERY = buildPageBySlugQuery(PAGE_SLUG, {
  block_hero_secondary: BLOCK_HERO_SECONDARY_NESTED_FIELDS,
  block_info: BLOCK_INFO_NESTED_FIELDS,
  block_packages: BLOCK_PACKAGES_NESTED_FIELDS,
  block_extras: BLOCK_EXTRAS_NESTED_FIELDS,
});

const getPackagesPage = cache(async () => getPageBySlug(PAGE_SLUG, PAGE_QUERY));

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getPackagesPage();

    return buildSeoMetadata(page, SEO);
  } catch (error) {
    console.error(
      "[videography-packages] Failed to load SEO metadata, using fallback",
      error,
    );
    return buildSeoMetadata(null, SEO);
  }
}

export default async function VideographyPackagesPage() {
  let page: Awaited<ReturnType<typeof getPageBySlug>> = null;

  try {
    page = await getPackagesPage();
  } catch (error) {
    console.error(
      "[videography-packages] Directus unavailable, using fallback",
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
  const packagesData = mapBlockItem(
    page,
    BLOCKS.PACKAGES_BLOCK,
    packagesFromBlockItem,
  );
  const extrasData = mapBlockItem(
    page,
    BLOCKS.EXTRAS_BLOCK,
    extrasFromBlockItem,
  );

  return (
    <>
      {heroData ? <SecondaryHero data={heroData} /> : null}
      {infoData ? <InfoBlock data={infoData} /> : null}
      <PackagesSection data={packagesData ?? FALLBACK_PACKAGES} />
      <ExtrasSection data={extrasData ?? FALLBACK_EXTRAS} />
      <Instagram />
      <CtaBanner data={DEFAULT_CONTACT_CTA_BANNER} />
    </>
  );
}
