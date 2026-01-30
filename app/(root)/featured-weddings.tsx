import Carousel from "../../components/shared/carousel";
import { getFeaturedFilms, getFilms } from "@/lib/actions/film.actions";

const FeaturedWeddings = async ({ isFeatured }: { isFeatured: boolean }) => {
  let films;
  if (isFeatured) {
    films = await getFeaturedFilms();
  } else {
    films = await getFilms();
  }

  return (
    <section>
      <h2 className="relative h2-subheading mb-10">Featured Weddings</h2>
      <Carousel posts={films} />
    </section>
  );
};

export default FeaturedWeddings;
