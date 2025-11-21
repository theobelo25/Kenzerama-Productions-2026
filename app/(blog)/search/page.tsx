import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllFilms, getFilmCategories } from "@/lib/actions/film.actions";
import {
  getFilteredPosts,
  getPostCategories,
} from "@/lib/actions/posts.actions";
import { Film, Post } from "@/types";
import Poster from "@/components/shared/carousel/poster";
import FeaturedPostMenuItem from "@/components/shared/header/featured-post-menu-item";
import { shuffle } from "@/lib/utils";

const SORT_ORDERS = ["newest", "oldest"];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

  const isQuerySet = q && q !== "all" && q.trim() !== "";
  const isCategorySet =
    category && category !== "all" && category.trim() !== "";
  const isPriceSet = price && price !== "all" && price.trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

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
    q = "all",
    category = "all",
    type = "all",
    sort = "newest",
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
  const categories = [...filmCategories, ...postCategories];

  const filmResults: Film[] = [];
  if (type === "film" || type === "all") {
    const tempFilms = await getAllFilms({
      query: q,
      category,
      sort,
      page: Number(page),
    });
    filmResults.push(...tempFilms);
  }

  const postResults: Post[] = [];
  if (type === "post" || type === "all") {
    const tempPosts = await getFilteredPosts({
      query: q,
      category,
      sort,
      page: Number(page),
    });
    postResults.push(...tempPosts);
  }
  let results = [...filmResults, ...postResults];

  if (sort === "oldest") {
    results = results.sort(
      (a, b) => a.publishDate.getTime() - b.publishDate.getTime()
    );
  } else {
    results = results.sort(
      (a, b) => b.publishDate.getTime() - a.publishDate.getTime()
    );
  }

  return (
    <div className="wrapper grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* Type Links */}
        <div className="text-xl mb-2 mt-3">Post Type</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                href={getFilterUrl({ t: "all" })}
                className={`${(type === "all" || type === "") && "font-bold"}`}
              >
                Any
              </Link>
            </li>
            {types.map((typeText) => (
              <li key={typeText}>
                <Link
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
        <div className="text-xl mb-2 mt-3">Category</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                href={getFilterUrl({ c: "all" })}
                className={`${
                  (category === "all" || category === "") && "font-bold"
                }`}
              >
                Any
              </Link>
            </li>
            {categories.map((categoryText) => (
              <li key={categoryText}>
                <Link
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
            {q !== "all" && q !== "" && "Query: " + q + ", "}
            {type !== "all" && type !== "" && "Type: " + type + ", "}
            {category !== "all" &&
              category !== "" &&
              "Category: " + category + ", "}
            &nbsp;
            {(q !== "all" && q !== "") ||
            (category !== "all" && category !== "") ||
            (type !== "all" && type !== "") ? (
              <Button variant={"link"} asChild>
                <Link href={"/search"}>Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Sort by{" "}
            {SORT_ORDERS.map((s) => (
              <Link
                key={s}
                className={`mx-2${sort == s && " font-bold"}`}
                href={getFilterUrl({ s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {results.length === 0 && <div>No results found</div>}
          {results.map((result) => {
            if (result.type === "film") {
              return <Poster key={result.slug} film={result as Film} />;
            } else if (result.type === "post") {
              return (
                <FeaturedPostMenuItem
                  key={result.slug}
                  post={result as Post}
                  className="aspect-poster"
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
