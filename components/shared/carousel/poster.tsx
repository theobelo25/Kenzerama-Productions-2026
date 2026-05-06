import Image from "next/image";
import type { Film } from "@/types";
import Link from "@/components/link-component";

const Poster = ({
  film: {
    slug,
    title,
    details: { venue },
    poster,
  },
  prioritize = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
}: {
  film: Film;
  prioritize?: boolean;
  sizes?: string;
}) => {
  return (
    <Link
      href={`/blog/films/${slug}`}
      className="[--scale-value:1] hover:[--scale-value:1.02]"
      withTransition
    >
      <div className="flex flex-col overflow-hidden">
        <div className="relative aspect-poster w-full shrink-0 overflow-hidden">
          <Image
            src={poster.image}
            alt={title}
            fill
            sizes={sizes}
            className="object-cover transition-transform scale-(--scale-value)"
            priority={prioritize}
            quality={70}
            placeholder="blur"
            loading={prioritize ? "eager" : "lazy"}
          />
        </div>
        <div className="flex flex-col items-center gap-0.5 px-2 py-2.5 text-center md:px-3 md:py-3">
          <span className="font-cinzel text-sm leading-snug text-foreground md:text-base">
            {title}
          </span>
          <span className="font-playfair-display text-[0.6875rem] leading-snug text-foreground md:text-xs">
            {venue.name}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Poster;
