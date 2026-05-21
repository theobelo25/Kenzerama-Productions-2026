export type DirectusBlockContactForm = {
  id?: string;
  iframe_url?: string | null;
};

export type ContactFormProps = {
  id?: string;
  iframe_url: string;
};

const QUOTE_OR_BACKTICK = new Set(['"', "'", "`"]);

/**
 * Directus sometimes stores URLs wrapped in JSON-style or mixed quotes, e.g.
 * `'"https://example.com"'` — browsers then request an invalid `src`.
 */
export function normalizeIframeUrl(raw: string): string {
  let out = raw.trim();
  for (;;) {
    const before = out;
    if (out.length > 0 && QUOTE_OR_BACKTICK.has(out[0]!)) {
      out = out.slice(1).trim();
    }
    if (out.length > 0 && QUOTE_OR_BACKTICK.has(out[out.length - 1]!)) {
      out = out.slice(0, -1).trim();
    }
    if (out === before) break;
  }
  return out;
}

export function contactFormFromBlockItem(
  item: DirectusBlockContactForm | undefined | null,
): ContactFormProps | null {
  if (!item || typeof item !== "object") return null;

  const o = item as Record<string, unknown>;
  const raw = o.iframe_url;
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  if (!trimmed) return null;

  const iframe_url = normalizeIframeUrl(trimmed);
  if (!iframe_url) return null;

  const idRaw = o.id;
  const id =
    typeof idRaw === "string" || typeof idRaw === "number"
      ? String(idRaw).trim()
      : "";

  return {
    ...(id ? { id } : {}),
    iframe_url,
  };
}
