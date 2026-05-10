// NEXT APP INFO
export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || "Kenzerama Productions";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "Toronto-based wedding videographers capturing your love story with cinematic artistry and heartfelt emotion. Relive every smile, glance and dance as we craft timeless films of your special day.";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "https://www.kenzeramaproductions.com";
export const SITE_LOCALE = process.env.NEXT_PUBLIC_SITE_LOCALE || "en_CA";
export const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE || "";
export const DEFAULT_OG_IMAGE =
  process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE || "/kp-opengraph-rec.png";
export const APP_DESCRIPTION_SHORT =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION_SHORT || "Wedding Videographers";

// MOTION
/** Hero overlay CTA (`SiteTitle`) — semi-transparent dark pill on video */
export const HERO_CTA_LINK_CLASSNAME =
  "inline-flex items-center justify-center rounded-full border border-kenzerama-pink bg-black/55 px-4 py-1.5 font-playfair-display text-[10px] uppercase tracking-wide text-white shadow-md shadow-black/20 backdrop-blur-md transition-colors duration-300 hover:bg-kenzerama-pink hover:text-background-grey md:px-5 md:py-2 md:text-sm";

/** Section CTA — glass pill on light backgrounds, white label */
export const SECTION_CTA_LINK_CLASSNAME =
  "inline-flex items-center justify-center rounded-full border border-kenzerama-pink bg-black/55 px-4 py-1.5 font-playfair-display text-[10px] uppercase tracking-wide text-white shadow-md shadow-black/20 backdrop-blur-md transition-colors duration-300 hover:bg-kenzerama-pink hover:text-background-grey md:px-5 md:py-2 md:text-sm";

export const SITE_TITLE_ANIMATION = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeIn",
    },
  },
  eyebrowVisible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

// STUDIO NINJA
export const SN_SRC_URL =
  process.env.SN_SRC_URL ||
  "https://app.studioninja.co/contactform/parser/0a800fc8-8f7c-14c2-818f-7f50b7024e52/0a800fc8-8f7c-14c2-818f-7f50b7214e54";

// APP CONSTANTS
export { SEARCH_SORT_ORDERS as SORT_ORDERS } from "./search";
export const ANIMATION_VARIANTS = {
  initial: (direction: string) => ({
    x: direction === "next" ? 10 : -10,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: string) => ({
    x: direction === "next" ? -10 : 10,
    opacity: 0,
  }),
};
