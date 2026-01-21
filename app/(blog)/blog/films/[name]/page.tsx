import { notFound } from "next/navigation";
import { filmData } from "../../../../../data/films";
import PageTitle from "@/app/(root)/page-title";
import VideoComponent from "@/components/video-component";
import FilmDetails from "./film-details";
import RecentlyWatched from "./recently-watched";
import RelatedFilms from "./related-films";
import NavigationTracker from "@/components/navigation-tracker";
import Instagram from "@/app/(root)/instagram";
import ContactCta from "@/app/(root)/contact-cta";
import PageTransition from "@/components/motion/page-transition";

const FilmPage = async (props: { params: Promise<{ name: string }> }) => {
  const { name } = await props.params;

  const film = filmData.filter((film) => film.slug === name)[0];
  if (!film) return notFound();

  return (
    <PageTransition>
      <NavigationTracker />
      <PageTitle title={film.title} />
      <VideoComponent
        video={film.video}
        classNames="wrapper"
        autoplay={true}
        controls={true}
        muted={true}
        playsInline={true}
      />
      <p className="wrapper text-center font-questrial py-10">
        {film.description}
      </p>
      <FilmDetails details={film.details} />
      <RelatedFilms currentFilm={film} />
      <Instagram />
      <ContactCta />
    </PageTransition>
  );
};

export default FilmPage;
