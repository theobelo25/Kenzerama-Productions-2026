"use client";
import {
  useEffect,
  useEffectEvent,
  type KeyboardEventHandler,
  useState,
} from "react";
import Poster from "./poster";
import { cn, isBlogPost, isFilm, isInstagram } from "@/lib/utils";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Film, InstagramPost, Post } from "@/types";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Link from "@/components/link-component";
import InstagramPostComponent from "./instagram-post";
import FeaturedPostMenuItem from "../header/featured-post-menu-item";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

const CarouselComponent = ({
  posts,
}: {
  posts: Film[] | InstagramPost[] | Post[];
}) => {
  if (posts.length === 0) {
    return (
      <div className="wrapper py-10 text-center text-muted-foreground">
        No posts available right now.
      </div>
    );
  }

  const firstPost = posts[0];
  const firstPostIsInstagram = isInstagram(firstPost);
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const path = usePathname();
  const isBlog = path.includes("blog");
  const carouselLabel = isBlog
    ? "Related posts carousel"
    : firstPostIsInstagram
      ? "Instagram posts carousel"
      : "Films carousel";

  const setActiveSlide = useEffectEvent(() =>
    setActive(api!.selectedScrollSnap())
  );
  const setScrollState = useEffectEvent(() => {
    setCanScrollPrev(api!.canScrollPrev());
    setCanScrollNext(api!.canScrollNext());
  });
  const handleControlKeyDown: KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      api?.scrollPrev();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      api?.scrollNext();
    }
  };

  useEffect(() => {
    if (api) {
      setActiveSlide();
      setScrollState();
      api.on("select", setActiveSlide);
      api.on("select", setScrollState);
      api.on("reInit", setScrollState);

      return () => {
        api.off("select", setActiveSlide);
        api.off("select", setScrollState);
        api.off("reInit", setScrollState);
      };
    }
  }, [api, setActiveSlide, setScrollState]);

  return (
    <>
      <Carousel
        className="m-auto fade-horizontal-sm md:fade-horizontal px-5"
        aria-label={carouselLabel}
        opts={{
          loop: !firstPostIsInstagram,
        }}
        setApi={setApi}
      >
        <CarouselContent className="px-10">
          {posts.map((post, index) => {
            if (isFilm(post)) {
              return (
                <CarouselItem
                  key={post.slug}
                  aria-current={active === index ? "true" : undefined}
                  className={cn(
                    "basis-1/2 sm:basis-1/3 md:basis-1/2 lg:basis-1/4",
                    active !== index ? "inactive" : ""
                  )}
                >
                  <div className="md:px-1 lg:px-2">
                    <Poster film={post} prioritize={index === 0} />
                  </div>
                </CarouselItem>
              );
            } else if (isInstagram(post)) {
              return (
                <CarouselItem
                  key={post.id}
                  aria-current={active === index ? "true" : undefined}
                  className="basis-1/3 lg:basis-1/5"
                >
                  <InstagramPostComponent post={post} />
                </CarouselItem>
              );
            } else if (isBlogPost(post)) {
              return (
                <CarouselItem
                  key={post.slug}
                  aria-current={active === index ? "true" : undefined}
                  className="basis-1/1 md:basis-1/3 lg:basis-1/5"
                >
                  <FeaturedPostMenuItem post={post} />
                </CarouselItem>
              );
            }
          })}
        </CarouselContent>
      </Carousel>
      {!firstPostIsInstagram && (
        <div
          className={cn(
            "grid md:grid-flow-col grid-cols-4 md:grid-cols-10 gap-2 py-10 wrapper",
            (posts.length <= 1
              ? "hidden"
              : posts.length <= 3
              ? "md:hidden"
              : posts.length <= 5
              ? "lg:hidden"
              : "") + (firstPostIsInstagram ? " pb-0" : "")
          )}
        >
          <Button
            variant={"outline"}
            aria-label={
              isBlog ? "Previous post" : firstPostIsInstagram ? "Previous Instagram post" : "Previous film"
            }
            disabled={!canScrollPrev}
            aria-disabled={!canScrollPrev}
            className={cn(
              "grid-cols-1 self-center cursor-pointer col-start-2 md:col-start-4",
              ""
            )}
            onClick={() => api?.scrollPrev()}
            onKeyDown={handleControlKeyDown}
          >
            <ArrowBigLeft />
          </Button>
          {!firstPostIsInstagram && (
            <div
              className={cn(
                "order-3 md:order-2 mt-5 md:mt-0 col-span-1 md:col-span-2 md:col-start-3",
                path.includes("blog/films") ? " hidden!" : ""
              )}
            >
              {isBlog && (
                <Link href={`/search/`} withTransition>
                  <Card className="h-full py-3">
                    <CardContent className="flex justify-center items-center h-full text-2xl font-playfair-display text-kenzerama-pink">
                      View all Films
                    </CardContent>
                  </Card>
                </Link>
              )}
            </div>
          )}

          <Button
            variant={"outline"}
            aria-label={
              isBlog ? "Next post" : firstPostIsInstagram ? "Next Instagram post" : "Next film"
            }
            disabled={!canScrollNext}
            aria-disabled={!canScrollNext}
            className={cn(
              "grid-cols-1 self-center cursor-pointer",
              "md:col-start-7"
            )}
            onClick={() => api?.scrollNext()}
            onKeyDown={handleControlKeyDown}
          >
            <ArrowBigRight />
          </Button>
        </div>
      )}
    </>
  );
};

export default CarouselComponent;
