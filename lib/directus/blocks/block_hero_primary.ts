import type { DirectusMuxVideo } from "@/lib/directus/types";
import { muxVideoRowToAsset } from "@/lib/video/create-mux-video-asset";
import { Asset } from "next-video/dist/assets.js";

export type DirectusBlockHeroPrimary = {
  id?: string;
  title?: string | null;
  eyebrow?: string | null;
  hero_video?: DirectusMuxVideo | string | null;
};

export type PrimaryHeroProps = {
  id: string;
  title: string;
  eyebrow: string;
  hero_video: Asset;
};

export function primaryHeroFromBlockItem(
  item: DirectusBlockHeroPrimary | undefined | null,
): PrimaryHeroProps | null {
  if (!item || typeof item !== "object") return null;

  const o = item as Record<string, unknown>;
  const hero = muxVideoRowToAsset(o.hero_video as DirectusMuxVideo);

  if (hero == null || typeof hero !== "object") return null;

  return {
    id: String(o.id ?? ""),
    title: String(o.title ?? ""),
    eyebrow: String(o.eyebrow ?? ""),
    hero_video: hero,
  };
}
