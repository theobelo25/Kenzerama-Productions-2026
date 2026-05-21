export const FILM_DETAIL_PATH = /^\/blog\/films\/[^/]+\/?$/;

export function isFilmDetailPath(pathname: string): boolean {
  return FILM_DETAIL_PATH.test(pathname);
}
