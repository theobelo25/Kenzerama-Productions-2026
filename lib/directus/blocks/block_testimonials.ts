import type { DirectusTestimonial } from "@/lib/directus/types";
import { directusFileAssetUrl } from "@/lib/directus/custom-poster";

/** Normalized row for UI (matches {@link PageTestimonial} in `lib/directus/types`). */
export type Testimonial = {
  linkId?: string;
  sort?: number;
  names?: string;
  quote?: string;
  backgroundSrc?: string;
};

/** Raw `block_testimonials` row — `testimonials[]` is usually O2M junction slots. */
export type DirectusBlockTestimonials = {
  id?: string;
  testimonials?: unknown[] | null;
};

export type TestimonialsProps = {
  id: string;
  testimonials: Testimonial[];
};

function parseSort(raw: unknown): number | undefined {
  if (raw == null) return undefined;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function resolveTestimonialImageUrl(raw: unknown): string | undefined {
  if (raw == null) return undefined;

  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return undefined;
    if (/^https?:\/\//i.test(s)) return s;
    return directusFileAssetUrl(s);
  }

  if (typeof raw === "object" && raw !== null && "id" in raw) {
    const id = (raw as { id: unknown }).id;
    if (typeof id !== "string" || !id.trim()) return undefined;
    return directusFileAssetUrl(id.trim());
  }

  return undefined;
}

function testimonialFromDirectus(
  t: DirectusTestimonial,
  index: number,
  linkId?: string,
  sort?: number,
): Testimonial | null {
  const quote = t.quote?.trim();
  if (!quote) return null;

  return {
    linkId: linkId ?? (t.id != null ? String(t.id) : `testimonial-${index}`),
    sort,
    names: t.names?.trim() || undefined,
    quote,
    backgroundSrc: resolveTestimonialImageUrl(t.testimonial_image),
  };
}

/**
 * Resolve one `testimonials[]` element: junction `{ id, sort, testimonials_id }` or bare
 * `DirectusTestimonial`.
 */
function testimonialFromSlot(
  row: unknown,
  index: number,
): Testimonial | null {
  if (row == null || typeof row !== "object") return null;
  const o = row as Record<string, unknown>;

  const nested = o.testimonials_id;
  if (nested != null && typeof nested === "object") {
    const linkId = o.id != null ? String(o.id) : undefined;
    const sort = parseSort(o.sort);
    return testimonialFromDirectus(
      nested as DirectusTestimonial,
      index,
      linkId,
      sort,
    );
  }

  if (typeof nested === "string") {
    return null;
  }

  if ("quote" in o || "names" in o) {
    return testimonialFromDirectus(o as DirectusTestimonial, index);
  }

  for (const val of Object.values(o)) {
    if (val != null && typeof val === "object" && !Array.isArray(val)) {
      const inner = val as Record<string, unknown>;
      if ("quote" in inner || "names" in inner) {
        return testimonialFromDirectus(
          val as DirectusTestimonial,
          index,
          o.id != null ? String(o.id) : undefined,
          parseSort(o.sort),
        );
      }
    }
  }

  return null;
}

export function testimonialsFromBlockItem(
  item: DirectusBlockTestimonials | undefined | null,
): TestimonialsProps | null {
  if (!item || typeof item !== "object") return null;

  const rows = item.testimonials;
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const testimonials: Testimonial[] = [];

  for (let i = 0; i < rows.length; i++) {
    const t = testimonialFromSlot(rows[i], i);
    if (t) testimonials.push(t);
  }

  if (testimonials.length === 0) return null;

  testimonials.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

  return {
    id: String(item.id ?? ""),
    testimonials,
  };
}
