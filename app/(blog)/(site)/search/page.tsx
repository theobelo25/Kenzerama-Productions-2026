import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "@/components/navigation/link-component";
import {
  getAllFilms,
  getFilmCategories,
  getFilteredPosts,
  getPostCategories,
} from "@/lib/server";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { Film, Post } from "@/types";
import Results from "./_components/results";
import {
  ALL_FILTER_VALUE,
  DEFAULT_SEARCH_SORT,
  getUniqueCategories,
  SEARCH_SORT_ORDERS,
} from "@/lib/search";

const SEO = { fallbackTitle: "Search", pathname: "/search" } as const;

function formatSearchType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export async function generateMetadata(props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    type?: string;
    sort?: string;
  }>;
}): Promise<Metadata> {
  const {
    q = ALL_FILTER_VALUE,
    category = ALL_FILTER_VALUE,
    type = ALL_FILTER_VALUE,
    sort = DEFAULT_SEARCH_SORT,
  } = await props.searchParams;

  const isQuerySet = q !== ALL_FILTER_VALUE && q.trim() !== "";
  const isCategorySet =
    category !== ALL_FILTER_VALUE && category.trim() !== "";
  const isTypeSet = type !== ALL_FILTER_VALUE && type.trim() !== "";

  if (!isQuerySet && !isCategorySet && !isTypeSet) {
    return buildSeoMetadata(null, SEO);
  }

  const titleParts = ["Search"];
  if (isQuerySet) titleParts.push(q);
  if (isTypeSet) titleParts.push(formatSearchType(type));
  if (isCategorySet) titleParts.push(`Category ${category}`);

  const params = new URLSearchParams();
  if (isQuerySet) params.set("q", q);
  if (isCategorySet) params.set("category", category);
  if (isTypeSet) params.set("type", type);
  if (sort !== DEFAULT_SEARCH_SORT) params.set("sort", sort);

  return buildSeoMetadata(
    { title: titleParts.join(": ") },
    {
      ...SEO,
      pathname: `/search?${params.toString()}`,
    },
  );
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
  const results = [...filmResults, ...postResults].sort((a, b) => {
    const ta = a.publishDate?.getTime() ?? 0;
    const tb = b.publishDate?.getTime() ?? 0;
    return sort === "oldest" ? ta - tb : tb - ta;
  });

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
