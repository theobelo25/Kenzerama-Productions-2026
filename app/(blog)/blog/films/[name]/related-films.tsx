import CarouselComponent from "@/components/shared/carousel";
import { filmData } from "@/info/films";
import { Film } from "@/types";
import { getRandomItems } from "@/lib/utils";
import SectionWithHeading from "@/components/shared/section-with-heading";

const RelatedFilms = ({ currentFilm }: { currentFilm: Film }) => {
  let films: Film[] = filmData.filter((film) => film.slug !== currentFilm.slug);
  films = films.filter((film) =>
    film.tags.some((tag) => currentFilm.tags.includes(tag)),
  );

  const randomRelated = getRandomItems(films, 5);

  return (
    <SectionWithHeading
      headingId="related-films-heading"
      heading="Related Films"
      headingClassName="mb-10"
    >
      <CarouselComponent posts={randomRelated} />
    </SectionWithHeading>
  );
};

export default RelatedFilms;
