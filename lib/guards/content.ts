import type { Film, InstagramPost, Post } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function isFilm(obj: any): obj is Film {
  return typeof obj === "object" && obj !== null && obj.type === "film";
}

export function isInstagram(obj: unknown): obj is InstagramPost {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const post = obj as Record<string, unknown>;

  return (
    typeof post.permalink === "string" && typeof post.media_type === "string"
  );
}

export function isBlogPost(obj: any): obj is Post {
  return typeof obj === "object" && obj !== null && obj.type === "post";
}
/* eslint-enable @typescript-eslint/no-explicit-any */
