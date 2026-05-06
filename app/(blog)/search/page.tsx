import { Button } from "@/components/ui/button";
import Link from "@/components/link-component";
import { getAllFilms, getFilmCategories } from "@/lib/actions/film.actions";
import {
  getFilteredPosts,
  getPostCategories,
} from "@/lib/actions/posts.actions";
import { Film, Post } from "@/types";
import Results from "./results";
import {
  ALL_FILTER_VALUE,
  DEFAULT_SEARCH_SORT,
  SEARCH_SORT_ORDERS,
} from "@/lib/constants/search";
import { getUniqueCategories, sortBySearchOrder } from "@/lib/search-utils";

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = ALL_FILTER_VALUE,
    category = ALL_FILTER_VALUE,
    price = ALL_FILTER_VALUE,
    rating = ALL_FILTER_VALUE,
  } = await props.searchParams;

  const isQuerySet = q && q !== ALL_FILTER_VALUE && q.trim() !== "";
  const isCategorySet =
    category && category !== ALL_FILTER_VALUE && category.trim() !== "";
  const isPriceSet = price && price !== ALL_FILTER_VALUE && price.trim() !== "";
  const isRatingSet =
    rating && rating !== ALL_FILTER_VALUE && rating.trim() !== "";

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
      Search ${isQuerySet ? q : ""} 
      ${isCategorySet ? `: Category ${category}` : ""}
      ${isPriceSet ? `: Price ${price}` : ""}
      ${isRatingSet ? `: Rating ${rating}` : ""}`,
    };
  } else {
    return {
      title: "Search Products",
    };
  }
}

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
    type?: string;
  }>;
}) => {
  const {
    q = ALL_FILTER_VALUE,
    category = ALL_FILTER_VALUE,
    type = ALL_FILTER_VALUE,
    sort = DEFAULT_SEARCH_SORT,
    page = "1",
  } = await props.searchParams;

  // Construct filter url
  const getFilterUrl = ({
    c,
    t,
    s,
    pg,
  }: {
    c?: string;
    t?: string;
    s?: string;
    pg?: string;
  }) => {
    const params = { q, category, type, sort, page };
    if (c) params.category = c;
    if (t) params.type = t;
    if (s) params.sort = s;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const types = ["Film", "Post"];
  const filmCategories = await getFilmCategories();
  const postCategories = await getPostCategories();
  const categories = getUniqueCategories(
    [...filmCategories, ...postCategories],
    (categoryText) => categoryText,
  );

  const filmResults: Film[] = [];
  if (type === "film" || type === ALL_FILTER_VALUE) {
    const tempFilms = await getAllFilms({
      query: q,
      category,
      sort,
      page: Number(page),
    });
    filmResults.push(...tempFilms);
  }

  const postResults: Post[] = [];
  if (type === "post" || type === ALL_FILTER_VALUE) {
    const tempPosts = await getFilteredPosts({
      query: q,
      category,
      sort,
      page: Number(page),
    });
    postResults.push(...tempPosts);
  }
  const results = sortBySearchOrder([...filmResults, ...postResults], sort);

  return (
    <>
      <div className="wrapper grid md:grid-cols-5 md:gap-5">
        <div className="filter-links flex space-x-5 md:col-span-1 md:flex-col">
          {/* Type Links */}
          <div className="text-xl mb-2 mt-3">
            <h2 className="text-kenzerama-pink">Post Type</h2>
            <ul className="space-y-1">
              <li>
                <Link
                  href={getFilterUrl({ t: ALL_FILTER_VALUE })}
                  withTransition
                  className={`${
                    (type === ALL_FILTER_VALUE || type === "") && "font-bold"
                  }`}
                >
                  Any
                </Link>
              </li>
              {types.map((typeText) => (
                <li key={typeText}>
                  <Link
                    withTransition
                    className={`${
                      type === typeText.toLowerCase() && "font-bold"
                    }`}
                    href={getFilterUrl({ t: typeText.toLowerCase() })}
                  >
                    {typeText}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Category Links */}
          <div className="text-xl mb-2 mt-3">
            <h2 className="text-kenzerama-pink">Category</h2>
            <ul className="space-y-1">
              <li>
                <Link
                  href={getFilterUrl({ c: ALL_FILTER_VALUE })}
                  withTransition
                  className={`${
                    (category === ALL_FILTER_VALUE || category === "") &&
                    "font-bold"
                  }`}
                >
                  Any
                </Link>
              </li>
              {categories.map((categoryText) => (
                <li key={categoryText}>
                  <Link
                    withTransition
                    className={`${category === categoryText && "font-bold"}`}
                    href={getFilterUrl({ c: categoryText })}
                  >
                    {categoryText}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="md:col-span-4 space-y-4">
          <div className="flex-between flex-col my-4 md:flex-row">
            <div className="flex items-center">
              {q !== ALL_FILTER_VALUE && q !== "" && "Query: " + q + ", "}
              {type !== ALL_FILTER_VALUE && type !== "" && "Type: " + type + ", "}
              {category !== ALL_FILTER_VALUE &&
                category !== "" &&
                "Category: " + category + ", "}
              &nbsp;
              {(q !== ALL_FILTER_VALUE && q !== "") ||
              (category !== ALL_FILTER_VALUE && category !== "") ||
              (type !== ALL_FILTER_VALUE && type !== "") ? (
                <Button variant={"link"} asChild>
                  <Link href={"/search"} withTransition>
                    Clear
                  </Link>
                </Button>
              ) : null}
            </div>
            <div>
              Sort by{" "}
              {SEARCH_SORT_ORDERS.map((s) => (
                <Link
                  key={s}
                  withTransition
                  className={`mx-2${sort == s && " font-bold"}`}
                  href={getFilterUrl({ s })}
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
          <Results results={results} />
        </div>
      </div>
    </>
  );
};

export default SearchPage;
