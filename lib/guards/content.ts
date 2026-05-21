import type { Film, InstagramPost, Post } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function isFilm(obj: any): obj is Film {
  return typeof obj === "object" && obj !== null && obj.type === "film";
}

export function isInstagram(obj: any): obj is InstagramPost {
  return typeof obj === "object" && obj !== null && obj.media_url;
}

export function isBlogPost(obj: any): obj is Post {
  return typeof obj === "object" && obj !== null && obj.type === "post";
}
/* eslint-enable @typescript-eslint/no-explicit-any */
