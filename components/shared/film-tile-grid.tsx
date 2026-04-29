import Poster from "@/components/shared/carousel/poster";
import { cn } from "@/lib/utils";
import type { Film } from "@/types";

const FilmTileGrid = ({
  films,
  className = "",
  ariaLabel = "Featured wedding films",
}: {
  films: Film[];
  className?: string;
  ariaLabel?: string;
}) => {
  if (films.length === 0) {
    return (
      <div className="w-full px-5 py-10 text-center text-muted-foreground md:px-10">
        No posts available right now.
      </div>
    );
  }

  return (
    <ul
      className={cn(
        "grid w-full max-w-none grid-cols-3 gap-2 px-5 sm:gap-4 md:grid-cols-3 md:gap-6 md:px-10 lg:grid-cols-6",
        className,
      )}
      aria-label={ariaLabel}
    >
      {films.map((film, index) => (
        <li key={film.slug}>
          <Poster
            film={film}
            prioritize={index < 6}
            sizes="(min-width: 1024px) 16.66vw, 33.33vw"
          />
        </li>
      ))}
    </ul>
  );
};

export default FilmTileGrid;
