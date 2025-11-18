"use server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

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
    };
  });

  return allPostsData;
}

export async function getFeaturedPost() {
  const posts = await getAllPosts();

  const featuredPost = posts.sort((a, b) => {
    return b.publishDate.getTime() - a.publishDate.getTime();
  })[0];

  return featuredPost;
}
