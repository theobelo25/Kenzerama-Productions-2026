import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
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
  sizes = "100vw",
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
      <Card className="relative aspect-poster overflow-hidden rounded-none">
        <Image
          src={poster.image}
          alt={title}
          fill
          sizes={sizes}
          className="absolute inset-0 z-0 h-full w-full object-cover transition-transform scale-(--scale-value)"
          priority={prioritize}
          quality={95}
          placeholder="blur"
          loading={prioritize ? "eager" : "lazy"}
        />
        <div className="absolute inset-0 z-1 bg-gray-900 opacity-30" />
        <CardContent className="z-2 flex flex-col justify-between items-center h-full text-white">
          <span className="text-[clamp(0.75rem,1.3vw,1.25rem)] text-center font-playfair-display leading-tight">
            {venue.name}
          </span>
          <div className="flex flex-col items-center font-cinzel">
            <span className="text-[clamp(0.9rem,1.8vw,1.5rem)] text-center font-cinzel text-kenzerama-pink leading-tight">
              {title}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Poster;
