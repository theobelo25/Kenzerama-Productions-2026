import { Post } from "@/types";
import { getRelatedPosts } from "@/lib/actions/posts.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Carousel from "@/components/shared/carousel";

const RelatedPosts = async ({ post }: { post: Post }) => {
  const related = await getRelatedPosts(post);

  return (
    <section>
      <h2 className="h2-subheading mb-10">Related Posts</h2>
      {related.length > 0 ? (
        <Carousel posts={related} />
      ) : (
        <div className="flex flex-col justify-center items-center py-10 space-y-2">
          <h3>No related articles found!</h3>
          <Button asChild variant={"outline"}>
            <Link href="/search">View all Posts</Link>
          </Button>
        </div>
      )}
    </section>
  );
};

export default RelatedPosts;
