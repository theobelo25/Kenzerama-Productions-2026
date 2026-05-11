import "server-only";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { access, readFile } from "fs/promises";
import { getRandomItems } from "@/lib/array/random-items";
import { isValidDate } from "@/lib/dates/validate";
import { formatError } from "@/lib/format/error";
import {
  filterCollection,
  findStringInObject,
  getUniqueCategories,
  SEARCH_PAGE_SIZE,
  sortByPublishDateDesc,
  sortBySearchOrder,
} from "@/lib/search";
import type { Post } from "@/types";

const POSTS_DIRECTORY = path.join(process.cwd(), "posts");

export async function getAllPosts() {
  const fileNames = fs.readdirSync(POSTS_DIRECTORY);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    const fullPath = path.join(POSTS_DIRECTORY, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    const publishDate = new Date(data.publishDate);

    return {
      slug,
      ...data,
      publishDate,
    } as Post;
  });

  const publishedPosts = allPostsData
    .filter((post) => !!post.publishDate && isValidDate(post.publishDate))
    .filter((post) => post.title !== "MDX_TEMPLATE");

  return publishedPosts;
}

export async function getFeaturedPost() {
  const posts = await getAllPosts();
  const featuredPost = sortByPublishDateDesc(posts)[0];

  return featuredPost;
}

export async function getPostCategories() {
  const posts = await getAllPosts();
  return getUniqueCategories(posts, (post) => post.category);
}

export async function getFilteredPosts({
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
  const postData = await getAllPosts();
  const filteredPosts = filterCollection(postData, {
    query,
    category,
    getCategory: (post) => post.category,
    matchesQuery: (post, q) => findStringInObject(post, q),
  });

  const sortedPosts = sortBySearchOrder(filteredPosts, sort);
  const currentPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const offset = (currentPage - 1) * limit;

  return sortedPosts.slice(offset, offset + limit);
}

export async function getPost(slug: string) {
  const filePath = path.resolve(path.join(POSTS_DIRECTORY, `${slug}.mdx`));

  try {
    await access(filePath);
  } catch (error) {
    throw new Error(formatError(error));
  }

  const fileContent = await readFile(filePath, { encoding: "utf8" });

  const { content, frontmatter } = await compileMDX<Post>({
    source: fileContent,
    options: { parseFrontmatter: true },
  });

  return {
    content,
    frontmatter,
  };
}

export async function getRelatedPosts(post: Post) {
  const posts = await getAllPosts();

  const authorFilter = posts.filter((data) => data.author === post.author);
  const tagsFilter = posts.filter((data) =>
    data.tags.some((tag) => post.tags.includes(tag)),
  );
  const categoryFilter = posts.filter(
    (data) => data.category === post.category,
  );

  const filterArray = getRandomItems(
    [...authorFilter, ...tagsFilter, ...categoryFilter]
      .filter((data, index, self) => {
        return index === self.findIndex((o) => o.slug === data.slug);
      })
      .filter((data) => data.slug !== post.slug),
    5,
  );

  return filterArray;
}
