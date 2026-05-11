import { filmData } from "@/info/films";
import CarouselComponent from "@/components/shared/carousel";
import { getHistory } from "@/lib/actions/cookies.actions";

const RecentlyWatched = async () => {
  const slugs = await getHistory();
  const recentlyWatched = filmData.filter((film) => slugs.includes(film.slug));

  return (
    <section className="wrapper [--display-controls:hidden]">
      <h2 className="h2-subheading mb-10">Recently Viewed</h2>
      <CarouselComponent posts={recentlyWatched} />
    </section>
  );
};

export default RecentlyWatched;
