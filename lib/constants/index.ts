// NEXT APP INFO
export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || "Kenzerama Productions";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "Toronto-based wedding videographers capturing your love story with cinematic artistry and heartfelt emotion. Relive every smile, glance and dance as we craft timeless films of your special day.";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "https://www.kenzeramaproductions.com";
export const APP_DESCRIPTION_SHORT =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION_SHORT || "Wedding Videographers";

// MOTION
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

// GOOGLE API
export const CAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY || "";

// STUDIO NINJA
export const SN_SRC_URL =
  process.env.SN_SRC_URL ||
  "https://app.studioninja.co/contactform/parser/0a800fc8-8f7c-14c2-818f-7f50b7024e52/0a800fc8-8f7c-14c2-818f-7f50b7214e54";

// APP CONSTANTS
export const SORT_ORDERS = ["newest", "oldest"];
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
