import { Suspense } from "react";
import { notFound } from "next/navigation";
import { filmData } from "@/info/films";
import PageTitle from "@/app/(root)/page-title";
import VideoComponent from "@/components/video-component";
import FilmDetails from "./film-details";
import RecentlyWatched from "./recently-watched";
import RelatedFilms from "./related-films";
import NavigationTracker from "@/components/navigation-tracker";
import Instagram from "@/app/(root)/instagram";
import ContactCta from "@/app/(root)/contact-cta";

const FilmPage = async (props: { params: Promise<{ name: string }> }) => {
  const { name } = await props.params;

  const film = filmData.filter((film) => film.slug === name)[0];
  if (!film) return notFound();

  return (
    <>
      <NavigationTracker />
      <PageTitle title={film.title} subtitle={film.details.venue.name} />
      <VideoComponent
        video={film.video}
        classNames="wrapper"
        autoplay={false}
        controls={true}
        muted={true}
        playsInline={true}
        preload="metadata"
      />
      <p className="wrapper text-center font-questrial py-10">
        {film.description}
      </p>
      <FilmDetails details={film.details} />
      <RelatedFilms currentFilm={film} />
      <Suspense fallback={null}>
        <Instagram />
      </Suspense>
      <ContactCta />
    </>
  );
};

export default FilmPage;
