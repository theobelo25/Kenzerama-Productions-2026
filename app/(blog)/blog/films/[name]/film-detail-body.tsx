import Image from "next/image";
import loader from "@/assets/fade-stagger-circles.svg";
import PageTitle from "@/app/(root)/page-title";
import VideoComponent from "@/components/video-component";
import FilmDetails from "./film-details";
import RelatedFilms from "./related-films";
import NavigationTracker from "@/components/navigation-tracker";
import Instagram from "@/app/(root)/instagram";
import ContactCta from "@/app/(root)/contact-cta";
import type { Film } from "@/types";

/** Title block while `film` is unknown — skeleton only so we never flash another couple’s names. */
function FilmDetailTitleSkeleton() {
  return (
    <section
      className="flex min-h-fit flex-col items-center overflow-hidden text-center"
      aria-busy="true"
      aria-live="polite"
    >
      <h1 className="sr-only">Loading film</h1>
      <div className="flex w-full flex-col items-center gap-0 pb-5 pt-0">
        <div
          className="h-8 w-[min(100%,22rem)] rounded-md bg-muted/45 md:h-10 lg:h-11"
          aria-hidden
        />
        <div
          className="h-4 w-[min(100%,18rem)] rounded-md bg-muted/35 md:h-5"
          aria-hidden
        />
      </div>
    </section>
  );
}

/**
 * Shared by `page.tsx` and `loading.tsx` so the loading and loaded trees match.
 * Video uses `nestShell` inside `aspect-video` so height is reserved before Mux reports dimensions.
 */
export default function FilmDetailBody({ film }: { film: Film | null }) {
  return (
    <>
      <NavigationTracker />
      {film ? (
        <PageTitle
          title={film.title}
          subtitle={film.details.venue.name}
          headingClassName="pt-0"
        />
      ) : (
        <FilmDetailTitleSkeleton />
      )}
      <div className="relative wrapper">
        <div className="relative aspect-video w-full overflow-hidden bg-black">
          {film ? (
            <VideoComponent
              nestShell
              priorityPoster
              video={film.video}
              autoplay={false}
              controls={true}
              muted={true}
              playsInline={true}
              preload="metadata"
              videoClassName="absolute inset-0 h-full w-full object-contain"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center bg-muted/40"
              aria-busy="true"
              aria-live="polite"
            >
              <Image
                src={loader}
                alt="Loading"
                width={120}
                height={120}
                className="shrink-0"
                priority
              />
            </div>
          )}
        </div>
      </div>
      {film ? (
        <>
          <p className="wrapper text-center font-questrial py-10">
            {film.description}
          </p>
          <FilmDetails details={film.details} />
          <RelatedFilms currentFilm={film} />
          <Instagram tightTop />
          <ContactCta />
        </>
      ) : (
        <div
          className="mt-2 min-h-[42rem] w-full rounded-md bg-muted/10 md:min-h-[48rem]"
          aria-hidden
        />
      )}
    </>
  );
}
