import { directusFileAssetUrl } from "@/lib/directus/custom-poster";

/** Raw `block_hero_secondary` row — `hero_image` is usually a Directus files M2O. */
export type DirectusBlockHeroSecondary = {
  id?: string;
  title?: string | null;
  /** UUID, `/assets`-relative id, expanded `{ id }`, or absolute image URL. */
  hero_image?: string | { id?: string | null } | null;
  image_position?: string | null;
  /** Directus may send numbers as strings from JSON. */
  image_shift?: number | string | null;
};

export type SecondaryHeroProps = {
  id: string;
  title: string;
  /** Absolute URL suitable for `next/image` `src`. */
  hero_image: string;
  /** Passed through for layout (e.g. `center`, `top`, or partial for `object-[…]`). */
  image_position: string;
  image_shift: number;
};

function resolveHeroImageUrl(raw: unknown): string | null {
  if (raw == null) return null;

  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return null;
    if (/^https?:\/\//i.test(s)) return s;
    return directusFileAssetUrl(s) ?? null;
  }

  if (typeof raw === "object" && raw !== null && "id" in raw) {
    const id = (raw as { id: unknown }).id;
    if (typeof id !== "string" || !id.trim()) return null;
    return directusFileAssetUrl(id.trim()) ?? null;
  }

  return null;
}

function parseImageShift(raw: unknown): number {
  if (raw == null) return 0;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = Number(raw);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function parseImagePosition(raw: unknown): string {
  if (raw == null) return "center";
  const s = String(raw).trim();
  return s || "center";
}

export function secondaryHeroFromBlockItem(
  item: DirectusBlockHeroSecondary | undefined | null,
): SecondaryHeroProps | null {
  if (!item || typeof item !== "object") return null;

  const titleRaw = item.title;
  const title =
    titleRaw != null && String(titleRaw).trim() !== ""
      ? String(titleRaw).trim()
      : "";

  if (!title) return null;

  const hero_image = resolveHeroImageUrl(item.hero_image);
  if (!hero_image) return null;

  return {
    id: String(item.id ?? ""),
    title,
    hero_image,
    image_position: parseImagePosition(item.image_position),
    image_shift: parseImageShift(item.image_shift),
  };
}
