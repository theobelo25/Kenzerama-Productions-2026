import FilmDetailVideo from "./film-detail-video";
import FilmDetailDescription from "./film-detail-description";
import FilmDetails from "./film-details";
import RelatedFilms from "./related-films";
import NavigationTracker from "./navigation-tracker";
import Instagram from "@/components/ctas/instagram";
import ContactCta from "@/components/ctas/contact-cta";
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
      {!film ? <FilmDetailTitleSkeleton /> : null}
      <FilmDetailVideo film={film} />
      <FilmDetailDescription film={film} />
      {film ? (
        <>
          {film.details?.vendors?.length ? (
            <FilmDetails details={{ vendors: film.details.vendors }} />
          ) : null}
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
