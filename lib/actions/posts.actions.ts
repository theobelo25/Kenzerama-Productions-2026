"use server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post } from "@/types";
import { findStringInObject, formatError, getRandomItems } from "../utils";
import { readFile, access } from "fs/promises";
import { compileMDX } from "next-mdx-remote/rsc";
import { isValidDate } from "../utils";
import { SEARCH_PAGE_SIZE } from "@/lib/constants/search";
import {
  filterCollection,
  getUniqueCategories,
  sortByPublishDateDesc,
} from "@/lib/search-utils";

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
  return filterCollection(postData, {
    query,
    category,
    getCategory: (post) => post.category,
    matchesQuery: (post, q) => findStringInObject(post, q),
  });
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

  // Match Author
  const authorFilter = posts.filter((data) => data.author === post.author);
  // Match Tags
  const tagsFilter = posts.filter((data) =>
    data.tags.some((tag) => post.tags.includes(tag))
  );
  // Match Category
  const categoryFilter = posts.filter(
    (data) => data.category === post.category
  );

  const filterArray = getRandomItems(
    [...authorFilter, ...tagsFilter, ...categoryFilter]
      .filter((data, index, self) => {
        return index === self.findIndex((o) => o.slug === data.slug);
      })
      .filter((data) => data.slug !== post.slug),
    5
  );

  return filterArray;
}
