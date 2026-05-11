import { cache } from "react";
import type { Metadata } from "next";
import { getAllPosts, getPost } from "@/lib/server";
import { notFound } from "next/navigation";
import PostComponent from "./_components/post";
import ContactCta from "@/components/ctas/contact-cta";
import Instagram from "@/components/ctas/instagram";
import { buildSeoMetadata } from "@/lib/seo/metadata";

const getPostBySlug = cache(async (slug: string) => getPost(slug));

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { frontmatter } = await getPostBySlug(slug);
    const heroImage = frontmatter.heroImage?.trim();

    return buildSeoMetadata(
      {
        title: frontmatter.title,
        seoDescription: frontmatter.description,
      },
      {
        fallbackTitle: frontmatter.title,
        pathname: `/blog/${slug}`,
        openGraphType: "article",
        imageUrl: heroImage || undefined,
      },
    );
  } catch (error) {
    console.error(
      `[post:${slug}] Failed to load SEO metadata, using fallback`,
      error,
    );
    return buildSeoMetadata(null, {
      fallbackTitle: "Blog post",
      pathname: `/blog/${slug}`,
      openGraphType: "article",
    });
  }
}

const PostPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;

  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <>
      <PostComponent data={post.frontmatter} content={post.content} />
      <ContactCta />
      <Instagram />
    </>
  );
};

export default PostPage;
