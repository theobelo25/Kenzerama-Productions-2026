function normalizeButtonHref(raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return s.startsWith("/") ? s : `/${s}`;
}

/** Map Directus `block_branded_info` → props for branded sections (no mux / hero logic). */
export function brandedInfoFromBlockItem(
  item: DirectusBlockBrandedInfo | undefined | null,
): BrandedInfoProps | null {
  if (!item || typeof item !== "object") return null;

  const rawContent = item.content;
  const content =
    rawContent != null && String(rawContent).trim() !== ""
      ? String(rawContent).trim()
      : "";

  if (!content) return null;

  const linkSource = item.button_href ?? item.button_link;
  let button_href: string | null = null;
  if (linkSource != null && String(linkSource).trim() !== "") {
    button_href = normalizeButtonHref(String(linkSource));
  }

  const buttonText = item.button_text;
  const button_text =
    buttonText != null && String(buttonText).trim() !== ""
      ? String(buttonText)
      : null;

  return {
    ...(item.id != null && String(item.id) !== ""
      ? { id: String(item.id) }
      : {}),
    info_title_before_brand: item.info_title_before_brand ?? null,
    info_title_after_brand: item.info_title_after_brand ?? null,
    content,
    button_text,
    button_href,
  };
}
