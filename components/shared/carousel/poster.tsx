import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { Film } from "@/types";
import Link from "@/components/link-component";

const Poster = ({
  film: {
    slug,
    title,
    date,
    details: { venue },
    poster,
  },
}: {
  film: Film;
}) => {
  return (
    <Link
      href={`/blog/films/${slug}`}
      className="[--scale-value:1] hover:[--scale-value:1.02]"
    >
      <Card className="relative aspect-poster overflow-hidden rounded-none">
        <Image
          src={poster.image}
          alt={poster.alt}
          width={0}
          height={0}
          sizes="50vw,100vw"
          className="absolute transition-transform inset-0 z-0 scale-(--scale-value)"
          fetchPriority="high"
          placeholder="blur"
          loading="eager"
        />
        <div className="absolute inset-0 z-1 bg-black opacity-45" />
        <CardContent className="z-2 flex flex-col justify-between items-center h-full text-white">
          <span className="text-xl text-center font-playfair-display">
            {venue.name}
          </span>
          <div className="flex flex-col items-center font-cinzel">
            <span className="text-2xl text-center font-cinzel text-kenzerama-pink-light">
              {title}
            </span>
            <span>
              {date.toLocaleString("default", { month: "long" })}{" "}
              {date.getFullYear()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Poster;
