"use server";
import { filmData } from "@/data/films";
import type { Film } from "@/types";

export async function getFeaturedFilms() {
  const featured = filmData.filter((film) => film.isFeatured === true);

  return featured as Film[];
}
