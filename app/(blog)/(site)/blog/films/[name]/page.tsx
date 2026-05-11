import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllMuxFilmSlugs, getMuxFilmBySlug } from "@/lib/server";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import PageTitle from "@/components/sections/heroes/page-title";
import FilmDetailVideo from "./_components/film-detail-video";
import FilmDetailDescription from "./_components/film-detail-description";
import FilmDetails from "./_components/film-details";
import RelatedFilms from "./_components/related-films";
import Instagram from "@/components/ctas/instagram";
import ContactCta from "@/components/ctas/contact-cta";

const getFilmBySlug = cache(async (slug: string) => getMuxFilmBySlug(slug));

export async function generateStaticParams() {
  try {
    const slugs = await getAllMuxFilmSlugs();
    return slugs.map((name) => ({ name }));
  } catch (error) {
    console.error(
      "[films] Failed to load film slugs for static generation, falling back to on-demand ISR",
      error,
    );
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;

  try {
    const film = await getFilmBySlug(name);
    if (!film) notFound();

    return buildSeoMetadata(
      {
        title: film.title,
        seoDescription: film.description,
      },
      {
        fallbackTitle: film.title,
        pathname: `/blog/films/${name}`,
        imageUrl: film.posterUrl || undefined,
      },
    );
  } catch (error) {
    console.error(
      `[film:${name}] Failed to load SEO metadata, using fallback`,
      error,
    );
    return buildSeoMetadata(null, {
      fallbackTitle: "Wedding film",
      pathname: `/blog/films/${name}`,
    });
  }
}

const FilmPage = async (props: { params: Promise<{ name: string }> }) => {
  const { name } = await props.params;

  const film = await getFilmBySlug(name);
  if (!film) return notFound();

  const { title, location } = film;
  const vendors = film.details?.vendors;
  return (
    <>
      {film ? <PageTitle title={title} subtitle={location} /> : null}
      {film ? <FilmDetailVideo film={film} /> : null}
      {film ? <FilmDetailDescription film={film} /> : null}
      {vendors?.length ? <FilmDetails details={{ vendors }} /> : null}
      {film ? <RelatedFilms currentFilm={film} /> : null}
      <Instagram tightTop />
      <ContactCta />
    </>
  );
};

export default FilmPage;
