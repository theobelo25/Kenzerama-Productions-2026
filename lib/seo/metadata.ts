import type { Metadata } from "next";
import {
  APP_DESCRIPTION,
  APP_NAME,
  DEFAULT_OG_IMAGE,
  SERVER_URL,
  SITE_LOCALE,
  TWITTER_HANDLE,
} from "@/lib/constants";

type SeoMetadataInput = {
  seoTitle?: string;
  seoDescription?: string;
  title?: string;
};

type BuildSeoMetadataOptions = {
  fallbackTitle: string;
  fallbackDescription?: string;
  pathname?: string;
  canonicalUrl?: string;
  imageUrl?: string;
  noIndex?: boolean;
  openGraphType?: "website" | "article";
  twitterCard?: "summary" | "summary_large_image";
};

export function buildSeoMetadata(
  input: SeoMetadataInput | null | undefined,
  options: BuildSeoMetadataOptions,
): Metadata {
  const normalizedSeoTitle = input?.seoTitle?.trim();
  const normalizedTitle = input?.title?.trim();
  const normalizedSeoDescription = input?.seoDescription?.trim();
  const normalizedFallbackDescription = options.fallbackDescription?.trim();

  const title =
    normalizedSeoTitle || normalizedTitle || options.fallbackTitle.trim();
  const description =
    normalizedSeoDescription ||
    normalizedFallbackDescription ||
    APP_DESCRIPTION;
  const twitterCard = options.twitterCard ?? "summary_large_image";
  const noIndex = options.noIndex ?? false;
  const canonical = options.canonicalUrl
    ? new URL(options.canonicalUrl, SERVER_URL).toString()
    : new URL(options.pathname || "/", SERVER_URL).toString();
  const pageUrl = canonical;
  const imageUrl = new URL(options.imageUrl || DEFAULT_OG_IMAGE, SERVER_URL);

  const twitter: Metadata["twitter"] = {
    card: twitterCard,
    title,
    description,
    images: [imageUrl.toString()],
    creator: TWITTER_HANDLE || undefined,
  };

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: options.openGraphType ?? "website",
      locale: SITE_LOCALE,
      url: pageUrl,
      siteName: APP_NAME,
      title,
      description,
      images: [
        {
          url: imageUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter,
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    applicationName: APP_NAME,
    creator: APP_NAME,
    publisher: APP_NAME,
  };
}
