import Image from "next/image";
import type { Film } from "@/types";
import Link from "@/components/link-component";
import type { StaticImageData } from "next/image";
import { directusAssetsBaseUrl } from "@/lib/directus/custom-poster";

/** Prefer uploaded poster, then Mux thumbnail, then legacy static import. */
function resolvePosterSrc(film: Film): StaticImageData | string | null {
  const base = directusAssetsBaseUrl();
  if (film.customPosterId && base) {
    return `${base.replace(/\/$/, "")}/assets/${film.customPosterId}`;
  }
  if (film.posterUrl) return film.posterUrl;
  if (film.poster?.image) return film.poster.image;
  return null;
}

const Poster = ({
  film,
  prioritize = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
}: {
  film: Film;
  prioritize?: boolean;
  sizes?: string;
}) => {
  const { slug, title } = film;
  const subtitle = film.details?.venue?.name ?? film.location ?? "";
  const src = resolvePosterSrc(film);
  const alt = film.poster?.alt ?? title;
  const isStaticImport = typeof src === "object" && src !== null;

  if (!src) {
    return (
      <Link
        href={`/blog/films/${slug}`}
        className="[--scale-value:1] hover:[--scale-value:1.02]"
        withTransition
      >
        <div className="flex flex-col overflow-hidden">
          <div className="relative aspect-poster w-full shrink-0 overflow-hidden rounded-lg bg-muted" />
          <div className="flex flex-col items-center gap-0.5 px-2 py-2.5 text-center md:px-3 md:py-3">
            <span className="font-cinzel text-sm leading-snug text-foreground md:text-base">
              {title}
            </span>
            {subtitle ? (
              <span className="font-playfair-display text-[0.6875rem] leading-snug text-foreground md:text-xs">
                {subtitle}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/films/${slug}`}
      className="[--scale-value:1] hover:[--scale-value:1.02]"
      withTransition
    >
      <div className="flex flex-col overflow-hidden">
        <div className="relative aspect-poster w-full shrink-0 overflow-hidden rounded-lg">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover transition-transform scale-(--scale-value)"
            priority={prioritize}
            quality={70}
            {...(isStaticImport
              ? { placeholder: "blur" as const }
              : { placeholder: "empty" as const })}
            loading={prioritize ? "eager" : "lazy"}
          />
        </div>
        <div className="flex flex-col items-center gap-0.5 px-2 py-2.5 text-center md:px-3 md:py-3">
          <span className="font-cinzel text-sm leading-snug text-foreground md:text-base">
            {title}
          </span>
          {subtitle ? (
            <span className="font-playfair-display text-[0.6875rem] leading-snug text-foreground md:text-xs">
              {subtitle}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

export default Poster;
