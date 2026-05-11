export const ALL_FILTER_VALUE = "all";
export const SEARCH_PAGE_SIZE = 10;
export const DEFAULT_SEARCH_SORT = "newest";
export const SEARCH_SORT_ORDERS = ["newest", "oldest"] as const;

export type SearchSortOrder = (typeof SEARCH_SORT_ORDERS)[number];
