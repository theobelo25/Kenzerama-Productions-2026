"use client";

import { useEffect, useRef, useState } from "react";
import CarouselComponent from "@/components/shared/carousel";
import SectionWithHeading from "@/components/shared/section-with-heading";
import { cn } from "@/lib/utils";
import type { InstagramPost } from "@/types";

type InstagramProps = {
  compactSpacing?: boolean;
  /** Halve default section top padding (e.g. film page directly under Related Films). */
  tightTop?: boolean;
};

const Instagram = ({
  compactSpacing = false,
  tightTop = false,
}: InstagramProps = {}) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [posts, setPosts] = useState<InstagramPost[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const controller = new AbortController();

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        fetch("/api/instagram/media", { signal: controller.signal })
          .then((r) => r.json())
          .then((res: { success?: boolean; data?: InstagramPost[] }) => {
            if (res.success && res.data?.length) {
              setPosts(res.data.slice(0, 5));
            } else {
              setFailed(true);
            }
          })
          .catch(() => {
            if (!controller.signal.aborted) setFailed(true);
          });
      },
      { rootMargin: "320px", threshold: 0 },
    );

    io.observe(el);
    return () => {
      controller.abort();
      io.disconnect();
    };
  }, []);

  const hasPosts = Boolean(posts && posts.length > 0);

  return (
    <div ref={sentinelRef}>
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
        {hasPosts ? (
          <CarouselComponent posts={posts!} />
        ) : failed ? (
          <p className="text-center text-sm text-muted-foreground font-questrial">
            Instagram posts are temporarily unavailable.
          </p>
        ) : (
          <div
            className="min-h-[200px] w-full"
            aria-busy="true"
            aria-hidden
          />
        )}
      </SectionWithHeading>
    </div>
  );
};

export default Instagram;
