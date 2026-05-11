import FilmTileGrid from "@/components/media/wedding-films/film-tile-grid";
import { Film } from "@/types";
import { getRandomItems } from "@/lib/utils";
import SectionWithHeading from "@/components/sections/section-with-heading";

const RelatedFilms = ({ currentFilm }: { currentFilm: Film }) => {
  const curatedRelated = currentFilm.relatedFilms?.filter(
    (film) => film.slug !== currentFilm.slug,
  );

  const films = curatedRelated ?? [];
  const randomRelated = getRandomItems(films, 3);

  if (randomRelated.length === 0) return null;

  return (
    <SectionWithHeading
      headingId="related-films-heading"
      heading="Related Films"
      headingClassName="mb-10"
    >
      <FilmTileGrid
        films={randomRelated}
        ariaLabel="Related wedding films"
        className="lg:grid-cols-3"
        posterSizes="(min-width: 1024px) 33vw, 33.33vw"
      />
    </SectionWithHeading>
  );
};

export default RelatedFilms;
