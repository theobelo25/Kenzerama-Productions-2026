"use server";
import { filmData } from "@/info/films";
import type { Film } from "@/types";
import { findStringInObject } from "../utils";
import { SEARCH_PAGE_SIZE } from "@/lib/constants/search";
import {
  filterCollection,
  getUniqueCategories,
  sortBySearchOrder,
} from "@/lib/search-utils";

export async function getFeaturedFilms() {
  const featured = filmData.filter((film) => film.isFeatured === true);

  return featured as Film[];
}

export async function getFilms() {
  return filmData as Film[];
}

export async function getFilmCategories() {
  return getUniqueCategories(filmData, (film) => film.category);
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
  const filteredFilms = filterCollection(filmData, {
    query,
    category,
    getCategory: (film) => film.category,
    matchesQuery: (film, q) => findStringInObject(film, q),
  });

  const sortedFilms = sortBySearchOrder(filteredFilms, sort);
  const currentPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const offset = (currentPage - 1) * limit;

  return sortedFilms.slice(offset, offset + limit);
}
