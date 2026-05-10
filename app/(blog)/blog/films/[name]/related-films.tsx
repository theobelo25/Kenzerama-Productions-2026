import FilmTileGrid from "@/components/shared/film-tile-grid";
import { filmData } from "@/info/films";
import { Film } from "@/types";
import { getRandomItems } from "@/lib/utils";
import SectionWithHeading from "@/components/shared/section-with-heading";

const RelatedFilms = ({ currentFilm }: { currentFilm: Film }) => {
  let films: Film[] = filmData.filter((film) => film.slug !== currentFilm.slug);
  const currentTags = currentFilm.tags ?? [];
  films = films.filter((film) =>
    (film.tags ?? []).some((tag) => currentTags.includes(tag)),
  );

  const randomRelated = getRandomItems(films, 3);

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
