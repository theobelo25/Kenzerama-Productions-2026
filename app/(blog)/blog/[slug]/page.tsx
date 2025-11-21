import { getPost } from "@/lib/actions/posts.actions";
import { notFound } from "next/navigation";
import PostComponent from "./post";
import ContactCta from "@/app/(root)/contact-cta";
import Instagram from "@/app/(root)/instagram";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const { frontmatter } = await getPost(slug);

  return {
    title: frontmatter.title,
    description: frontmatter.description,
  };
}

const PostPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;

  const post = await getPost(slug);

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
