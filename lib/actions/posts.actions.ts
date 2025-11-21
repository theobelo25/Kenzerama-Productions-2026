"use server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post } from "@/types";
import { findStringInObject, formatError, getRandomItems } from "../utils";
import { readFile, access } from "fs/promises";
import { compileMDX } from "next-mdx-remote/rsc";
import { isValidDate } from "../utils";

const POSTS_DIRECTORY = path.join(process.cwd(), "posts");
const PAGE_SIZE = 10;

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

  const featuredPost = posts.sort((a, b) => {
    return b.publishDate.getTime() - a.publishDate.getTime();
  })[0];

  return featuredPost;
}

export async function getPostCategories() {
  const posts = await getAllPosts();
  const categories: string[] = [];

  posts.map((post) => {
    if (!categories.includes(post.category)) categories.push(post.category);
  });

  return categories;
}

export async function getFilteredPosts({
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
  const postData = await getAllPosts();

  let filteredData = [...postData];
  if (category !== "all")
    filteredData = filteredData.filter((post) => post.category === category);
  if (query !== "all")
    filteredData = filteredData.filter((film) =>
      findStringInObject(film, query)
    );
  return filteredData;
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
