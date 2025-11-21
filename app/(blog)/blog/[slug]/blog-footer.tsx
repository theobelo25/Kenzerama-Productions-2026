import { Post } from "@/types";
import RelatedPosts from "./related-posts";

const BlogFooter = ({ data }: { data: Post }) => {
  return (
    <footer>
      <RelatedPosts post={data} />
    </footer>
  );
};

export default BlogFooter;
