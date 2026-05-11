import { Post } from "@/types";
import { getRelatedPosts } from "@/lib/server";
import { Button } from "@/components/ui/button";
import Link from "@/components/navigation/link-component";
import Carousel from "@/components/media/carousel";
import SectionWithHeading from "@/components/sections/section-with-heading";

const RelatedPosts = async ({ post }: { post: Post }) => {
  const related = await getRelatedPosts(post);

  return (
    <SectionWithHeading
      headingId="related-posts-heading"
      heading="Related Posts"
      headingClassName="mb-10"
    >
      {related.length > 0 ? (
        <Carousel posts={related} />
      ) : (
        <div className="flex flex-col justify-center items-center py-10 space-y-2">
          <h3>No related articles found!</h3>
          <Button asChild variant={"outline"}>
            <Link href="/search" withTransition>
              View all Posts
            </Link>
          </Button>
        </div>
      )}
    </SectionWithHeading>
  );
};

export default RelatedPosts;
