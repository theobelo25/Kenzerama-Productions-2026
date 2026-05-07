import { notFound } from "next/navigation";
import { filmData } from "@/info/films";
import FilmDetailBody from "./film-detail-body";

const FilmPage = async (props: { params: Promise<{ name: string }> }) => {
  const { name } = await props.params;

  const film = filmData.filter((film) => film.slug === name)[0];
  if (!film) return notFound();

  return <FilmDetailBody film={film} />;
};

export default FilmPage;
