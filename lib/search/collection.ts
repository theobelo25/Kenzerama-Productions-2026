import {
  ALL_FILTER_VALUE,
  DEFAULT_SEARCH_SORT,
  type SearchSortOrder,
} from "@/lib/search/constants";

type FilterCollectionOptions<T> = {
  query?: string;
  category?: string;
  getCategory: (item: T) => string;
  matchesQuery: (item: T, query: string) => boolean;
};

type HasPublishDate = {
  publishDate?: Date;
};

function publishTime(date?: Date) {
  return date?.getTime() ?? 0;
}

export function filterCollection<T>(
  items: T[],
  {
    query = ALL_FILTER_VALUE,
    category = ALL_FILTER_VALUE,
    getCategory,
    matchesQuery,
  }: FilterCollectionOptions<T>,
) {
  let filteredData = [...items];

  if (category !== ALL_FILTER_VALUE) {
    filteredData = filteredData.filter((item) => getCategory(item) === category);
  }

  if (query !== ALL_FILTER_VALUE) {
    filteredData = filteredData.filter((item) => matchesQuery(item, query));
  }

  return filteredData;
}

export function getUniqueCategories<T>(
  items: T[],
  getCategory: (item: T) => string,
) {
  return Array.from(new Set(items.map((item) => getCategory(item))));
}

export function sortByPublishDateDesc<T extends HasPublishDate>(items: T[]) {
  return [...items].sort(
    (a, b) => publishTime(b.publishDate) - publishTime(a.publishDate),
  );
}

export function sortByPublishDateAsc<T extends HasPublishDate>(items: T[]) {
  return [...items].sort(
    (a, b) => publishTime(a.publishDate) - publishTime(b.publishDate),
  );
}

export function sortBySearchOrder<T extends HasPublishDate>(
  items: T[],
  sort: string = DEFAULT_SEARCH_SORT,
) {
  const sortOrder = sort as SearchSortOrder;
  return sortOrder === "oldest"
    ? sortByPublishDateAsc(items)
    : sortByPublishDateDesc(items);
}
