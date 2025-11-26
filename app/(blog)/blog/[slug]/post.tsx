import { Post } from "@/types";
import { ReactElement } from "react";
import BlogHeader from "./blog-header";
import BlogFooter from "./blog-footer";

const PostComponent = ({
  data,
  content,
}: {
  data: Post;
  content: ReactElement;
}) => {
  return (
    <article className="wrapper">
      <BlogHeader data={data} />
      <section className="prose mx-auto py-10">{content}</section>
      <BlogFooter data={data} />
    </article>
  );
};

export default PostComponent;
