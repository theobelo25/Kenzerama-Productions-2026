import { Suspense, type ReactNode } from "react";
import SectionWithHeading from "@/components/sections/section-with-heading";
import { getInstagramPosts } from "@/lib/services/instagram-media";
import { cn } from "@/lib/utils";
import InstagramCarousel from "@/components/ctas/instagram-carousel.client";

type InstagramProps = {
  compactSpacing?: boolean;
  /** Halve default section top padding (e.g. film page directly under Related Films). */
  tightTop?: boolean;
};

const INSTAGRAM_POST_LIMIT = 15;

function InstagramSectionShell({
  compactSpacing = false,
  tightTop = false,
  children,
}: InstagramProps & { children: ReactNode }) {
  return (
    <SectionWithHeading
      headingId="instagram-carousel-heading"
      heading="Follow us on Instagram!"
      sectionClassName={cn(
        "bg-background pb-20 md:pb-24",
        tightTop ? "pt-6 md:pt-8" : "pt-12 md:pt-16",
      )}
      wrapperClassName="py-0"
      headingClassName="relative text-foreground"
      contentClassName={cn(compactSpacing ? "pt-5" : "pt-10")}
    >
      {children}
    </SectionWithHeading>
  );
}

function InstagramFallback(props: InstagramProps) {
  return (
    <InstagramSectionShell {...props}>
      <div className="min-h-[200px] w-full" aria-busy="true" aria-hidden />
    </InstagramSectionShell>
  );
}

async function InstagramPosts(props: InstagramProps) {
  const result = await getInstagramPosts();
  const posts =
    result.success && result.data.length > 0
      ? result.data.slice(0, INSTAGRAM_POST_LIMIT)
      : null;

  return (
    <InstagramSectionShell {...props}>
      {posts ? (
        <InstagramCarousel posts={posts} />
      ) : (
        <p className="text-center text-sm text-muted-foreground font-questrial">
          Instagram posts are temporarily unavailable.
        </p>
      )}
    </InstagramSectionShell>
  );
}

const Instagram = (props: InstagramProps = {}) => {
  return (
    <Suspense fallback={<InstagramFallback {...props} />}>
      <InstagramPosts {...props} />
    </Suspense>
  );
};

export default Instagram;
