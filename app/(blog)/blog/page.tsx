import PageTitle from "../../(root)/page-title";
import FeaturedWeddings from "@/app/(root)/featured-weddings";
import FeaturedPosts from "./featured-posts";
import Instagram from "@/app/(root)/instagram";
import ContactCta from "@/app/(root)/contact-cta";
import { getAllPosts, getFeaturedPost } from "@/lib/actions/posts.actions";
import PageTransition from "@/components/motion/page-transition";

const BlogPage = async () => {
  const posts = getAllPosts();
  const featuredPost = await getFeaturedPost();

  return (
    <PageTransition>
      <PageTitle title="Our Blog" />
      <FeaturedPosts featuredPost={featuredPost} featuredPosts={[]} />
      <FeaturedWeddings />
      <ContactCta />
      <Instagram />
    </PageTransition>
  );
};

export default BlogPage;
