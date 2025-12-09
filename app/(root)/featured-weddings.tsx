import Carousel from "../../components/shared/carousel";
import { getFeaturedFilms } from "@/lib/actions/film.actions";

const FeaturedWeddings = async () => {
  const featuredFilms = await getFeaturedFilms();

  return (
    <section>
      <h2 className="relative h2-subheading mb-10">Featured Weddings</h2>
      <Carousel posts={featuredFilms} />
    </section>
  );
};

export default FeaturedWeddings;
