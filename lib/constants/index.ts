// NEXT APP INFO
export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || "Kenzerama Productions";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "Toronto-based wedding videographers capturing your love story with cinematic artistry and heartfelt emotion. Relive every smile, glance and dance as we craft timeless films of your special day.";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
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
