import type { CtaBannerProps } from "@/lib/directus/blocks/block_cta_banner";
import contactBannerBg from "@/public/images/contact-us-bg.webp";

export const DEFAULT_CONTACT_CTA_BANNER = {
  id: "contact-cta",
  title: "We'd love to hear your story",
  button_text: "Book a consultation",
  button_href: "/contact-us",
  background_image: contactBannerBg.src,
} satisfies CtaBannerProps;
