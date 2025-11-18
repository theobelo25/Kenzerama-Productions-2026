import CarouselComponent from "@/components/shared/carousel";
import { filmData } from "@/data/films";
import { Film } from "@/types";
import { getRandomItems } from "@/lib/utils";

const RelatedFilms = ({ currentFilm }: { currentFilm: Film }) => {
  let films: Film[] = filmData.filter((film) => film.slug !== currentFilm.slug);
  films = films.filter((film) =>
    film.tags.some((tag) => currentFilm.tags.includes(tag))
  );

  const randomRelated = getRandomItems(films, 5);

  return (
    <section className="wrapper">
      <h2 className="h2-subheading mb-10">Related Films</h2>
      <CarouselComponent featuredFilms={randomRelated} />
    </section>
  );
};

export default RelatedFilms;
