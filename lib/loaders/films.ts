import "server-only";

import { getAllMuxFilms } from "@/lib/loaders/directus";
import {
  filterCollection,
  findStringInObject,
  getUniqueCategories,
  SEARCH_PAGE_SIZE,
  sortBySearchOrder,
} from "@/lib/search";
import type { Film } from "@/types";

async function loadFilms(): Promise<Film[]> {
  try {
    return await getAllMuxFilms();
  } catch {
    return [];
  }
}

export async function getFeaturedFilms() {
  const films = await loadFilms();
  return films.filter((film) => film.isFeatured === true);
}

export async function getFilms() {
  return loadFilms();
}

export async function getFilmCategories() {
  const films = await loadFilms();
  return getUniqueCategories(films, (film) => film.category ?? "");
}

export async function getAllFilms({
  query,
  limit = SEARCH_PAGE_SIZE,
  page,
  category,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  sort?: string;
}) {
  const films = await loadFilms();
  const filteredFilms = filterCollection(films, {
    query,
    category,
    getCategory: (film) => film.category ?? "",
    matchesQuery: (film, q) => findStringInObject(film, q),
  });

  const sortedFilms = sortBySearchOrder(filteredFilms, sort);
  const currentPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const offset = (currentPage - 1) * limit;

  return sortedFilms.slice(offset, offset + limit);
}
