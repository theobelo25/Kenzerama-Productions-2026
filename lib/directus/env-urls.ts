/**
 * Single place for Directus URL env semantics.
 *
 * - **Server / SDK** (`DIRECTUS_URL`): where Node reaches the REST API (often a Docker hostname).
 * - **Public asset base** (`NEXT_PUBLIC_DIRECTUS_URL` → `DIRECTUS_IMAGE_ORIGIN` → `DIRECTUS_URL`):
 *   origin embedded in `/assets/:id` links and `next/image` `src`; must be reachable from the browser when set.
 * - **Image allowlist** (`NEXT_PUBLIC_DIRECTUS_URL`, `DIRECTUS_URL`, `DIRECTUS_IMAGE_ORIGIN`):
 *   every distinct origin Next may fetch for optimization (can include internal build-time hosts).
 */

/** Raw base URL strings to derive `remotePatterns` entries for Directus `/assets/**`. */
export function directusImageAllowlistRawUrls(): string[] {
  return [
    process.env.NEXT_PUBLIC_DIRECTUS_URL,
    process.env.DIRECTUS_URL,
    process.env.DIRECTUS_IMAGE_ORIGIN,
  ]
    .filter((s): s is string => Boolean(s?.trim()))
    .map((s) => s.trim());
}

/**
 * Browser-facing base for Directus files (`/assets/:id`).
 * Prefer the public env so SSR HTML does not point at internal Docker hostnames when both are set.
 */
export function resolveDirectusPublicAssetBaseUrl(): string | undefined {
  const raw =
    process.env.NEXT_PUBLIC_DIRECTUS_URL?.trim() ||
    process.env.DIRECTUS_IMAGE_ORIGIN?.trim() ||
    process.env.DIRECTUS_URL?.trim();
  if (!raw) return undefined;
  try {
    const u = new URL(raw);
    return `${u.origin}${u.pathname.replace(/\/$/, "")}`;
  } catch {
    return raw.replace(/\/$/, "");
  }
}

/** Normalized base URL for `@directus/sdk` and server-side REST calls. */
export function requireDirectusServerUrl(): string {
  const url = process.env.DIRECTUS_URL?.trim();
  if (!url) {
    throw new Error("Missing DIRECTUS_URL");
  }
  return url.replace(/\/$/, "");
}
