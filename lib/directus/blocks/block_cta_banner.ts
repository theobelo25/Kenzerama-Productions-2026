import { directusAssetsBaseUrl } from "@/lib/directus/custom-poster";

/** Raw `block_cta_banner` row — `background_image` is usually a Directus files M2O. */
export type DirectusBlockCtaBanner = {
  id?: string;
  sort?: number;
  title?: string | null;
  button_text?: string | null;
  button_href?: string | null;
  /** UUID, `/assets`-relative id, expanded `{ id }`, or absolute image URL. */
  background_image?: string | { id?: string | null } | null;
};

export type CtaBannerProps = {
  id: string;
  title?: string | null;
  button_text?: string | null;
  button_href?: string | null;
  background_image?: string | null;
  backgroundPosition?: string;
  className?: string;
};

function pickText(raw: unknown): string | null {
  if (raw == null) return null;
  const s = String(raw).trim();
  return s || null;
}

function normalizeButtonHref(raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return s.startsWith("/") ? s : `/${s}`;
}

function resolveBackgroundImageUrl(raw: unknown): string | null {
  if (raw == null) return null;

  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return null;
    if (/^https?:\/\//i.test(s)) return s;
    const base = directusAssetsBaseUrl();
    if (!base) return null;
    return `${base.replace(/\/$/, "")}/assets/${s}`;
  }

  if (typeof raw === "object" && raw !== null && "id" in raw) {
    const id = (raw as { id: unknown }).id;
    if (typeof id !== "string" || !id.trim()) return null;
    const base = directusAssetsBaseUrl();
    if (!base) return null;
    return `${base.replace(/\/$/, "")}/assets/${id.trim()}`;
  }

  return null;
}

export function ctaBannerFromBlockItem(
  item: DirectusBlockCtaBanner | undefined | null,
): CtaBannerProps | null {
  if (!item || typeof item !== "object") return null;

  const id = pickText(item.id);
  if (!id) return null;

  const title = pickText(item.title);
  const background_image = resolveBackgroundImageUrl(item.background_image);
  const button_text = pickText(item.button_text);

  const linkSource = item.button_href;
  let button_href: string | null = null;
  if (linkSource != null && String(linkSource).trim() !== "") {
    button_href = normalizeButtonHref(String(linkSource));
  }

  if (!title && !background_image && !(button_text && button_href)) {
    return null;
  }

  return {
    id,
    title,
    button_text,
    button_href,
    background_image,
  };
}
