"use server";
import { filmData } from "@/info/films";
import type { Film } from "@/types";
import { findStringInObject } from "../utils";

export async function getFeaturedFilms() {
  const featured = filmData.filter((film) => film.isFeatured === true);

  return featured as Film[];
}

export async function getFilmCategories() {
  const categories: string[] = [];

  filmData.map((film) => {
    if (!categories.includes(film.category)) categories.push(film.category);
  });

  return categories;
}

const PAGE_SIZE = 10;

export async function getAllFilms({
  query,
  limit = PAGE_SIZE,
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
  let filteredData = [...filmData];
  if (category !== "all")
    filteredData = filteredData.filter((film) => film.category === category);
  if (query !== "all")
    filteredData = filteredData.filter((film) =>
      findStringInObject(film, query),
    );

  return filteredData;
}
