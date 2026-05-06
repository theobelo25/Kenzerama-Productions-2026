/**
 * Maps a couple display string (e.g. `"Devon & Graham"`) to the testimonial
 * background asset under `/public/images/testimonials/`.
 *
 * Pattern: first letter of each partner’s first name, lowercase, joined with
 * `-and-`, then `-testimonial.webp` (e.g. `d-and-g-testimonial.webp`).
 * Ignores any `*-review-image*` naming — only `*-testimonial.webp` files apply.
 */
export function testimonialBackgroundSrc(names: string): string {
  const parts = names
    .split(/\s*&\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length !== 2) return "/images/testimonial-bg.jpg";

  const firstInitial = (segment: string): string | null => {
    const firstName = (segment.split(/\s+/)[0] ?? segment).trim();
    const ch = firstName.charAt(0);
    if (!ch || !/[a-z]/i.test(ch)) return null;
    return ch.toLowerCase();
  };

  const a = firstInitial(parts[0]!);
  const b = firstInitial(parts[1]!);
  if (!a || !b) return "/images/testimonial-bg.jpg";

  return `/images/testimonials/${a}-and-${b}-testimonial.webp`;
}
