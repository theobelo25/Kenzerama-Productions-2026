import CarouselComponent from "@/components/media/carousel";
import { getHistory } from "@/lib/actions/cookies.actions";
import { getMuxFilmsBySlugs } from "@/lib/server";

const RecentlyWatched = async () => {
  const slugs = await getHistory();
  const recentlyWatched = await getMuxFilmsBySlugs(slugs);

  if (recentlyWatched.length === 0) return null;

  return (
    <section
      className="wrapper [--display-controls:hidden]"
      aria-labelledby="recently-viewed-heading"
    >
      <h2 id="recently-viewed-heading" className="h2-subheading mb-10">
        Recently Viewed
      </h2>
      <CarouselComponent posts={recentlyWatched} />
    </section>
  );
};

export default RecentlyWatched;
