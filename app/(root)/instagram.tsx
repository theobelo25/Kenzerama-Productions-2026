import { getInstagramPosts } from "@/lib/actions/api.actions";
import CarouselComponent from "@/components/shared/carousel";
import SectionWithHeading from "@/components/shared/section-with-heading";
import { cn } from "@/lib/utils";

type InstagramProps = {
  compactSpacing?: boolean;
};

const Instagram = async ({ compactSpacing = false }: InstagramProps = {}) => {
  const response = await getInstagramPosts();
  const instagramPosts = response?.data?.slice(0, 5);
  const hasPosts = Boolean(instagramPosts && instagramPosts.length > 0);

  return (
    <SectionWithHeading
      headingId="instagram-carousel-heading"
      heading="Follow us on Instagram!"
      sectionClassName="bg-background pt-12 pb-20 md:pt-16 md:pb-24"
      wrapperClassName="py-0"
      headingClassName="relative text-foreground"
      contentClassName={cn(compactSpacing ? "pt-5" : "pt-10")}
    >
      {hasPosts ? (
        <CarouselComponent posts={instagramPosts} />
      ) : (
        <p className="text-center text-sm text-muted-foreground font-questrial">
          Instagram posts are temporarily unavailable.
        </p>
      )}
    </SectionWithHeading>
  );
};

export default Instagram;
