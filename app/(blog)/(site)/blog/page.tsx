import type { Metadata } from "next";
import PageTitle from "@/components/sections/heroes/page-title";
import WeddingFilms from "@/components/media/wedding-films/wedding-films";
import FeaturedPosts from "./_components/featured-posts";
import Instagram from "@/components/ctas/instagram";
import CtaBanner from "@/components/ctas/cta-banner";
import { DEFAULT_CONTACT_CTA_BANNER } from "@/lib/constants/contact-cta-banner";
import { getAllPosts, getFeaturedPost } from "@/lib/server";
import { buildSeoMetadata } from "@/lib/seo/metadata";
import { getRandomItems } from "@/lib/utils";

const SEO = { fallbackTitle: "Our Blog", pathname: "/blog" } as const;

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata(null, SEO);
}

const BlogPage = async () => {
  const posts = await getAllPosts();
  const randPosts = getRandomItems(posts, 3);
  const featuredPost = await getFeaturedPost();

  return (
    <>
      <PageTitle title="Our Blog" />
      <FeaturedPosts featuredPost={featuredPost} featuredPosts={randPosts} />
      <WeddingFilms isFeatured={true} />
      <CtaBanner data={DEFAULT_CONTACT_CTA_BANNER} />
      <Instagram />
    </>
  );
};

export default BlogPage;
