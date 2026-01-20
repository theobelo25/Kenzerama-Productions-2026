"use client";
import {
  MouseEventHandler,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import Poster from "./poster";
import { cn, isBlogPost, isFilm, isInstagram } from "@/lib/utils";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const path = usePathname();
  const isBlog = path.includes("blog");

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const target = e.target as HTMLButtonElement;

    if (target.value === "prev") {
      prevRef.current?.click();
    } else if (target.value === "next") {
      nextRef.current?.click();
    }
  };

  const setActiveSlide = useEffectEvent(() =>
    setActive(api!.selectedScrollSnap())
  );

  useEffect(() => {
    if (api) {
      api.on("select", () => {
        setActiveSlide();
      });
    }
  }, [api]);

  return (
    <>
      <Carousel
        className="m-auto fade-horizontal-sm md:fade-horizontal px-5"
        opts={{
          loop: true,
        }}
        setApi={setApi}
      >
        <CarouselContent className="px-10">
          {posts.map((post, index) => {
            if (isFilm(post)) {
              return (
                <CarouselItem
                  key={post.slug}
                  className={cn(
                    "basis-1/1 min-[450px]:basis-1/2 md:basis-1/2 lg:basis-1/4",
                    active !== index ? "inactive" : ""
                  )}
                >
                  <div className="md:px-1 lg:px-2">
                    <Poster film={post} />
                  </div>
                </CarouselItem>
              );
            } else if (isInstagram(post)) {
              return (
                <CarouselItem
                  key={post.id}
                  className="basis-1/1 sm:basis-1/3 lg:basis-1/5"
                >
                  <InstagramPostComponent post={post} />
                </CarouselItem>
              );
            } else if (isBlogPost(post)) {
              return (
                <CarouselItem
                  key={post.slug}
                  className="basis-1/1 md:basis-1/3 lg:basis-1/5"
                >
                  <FeaturedPostMenuItem post={post} />
                </CarouselItem>
              );
            }
          })}
        </CarouselContent>
        <CarouselPrevious ref={prevRef} className="hidden" />
        <CarouselNext ref={nextRef} className="hidden" />
      </Carousel>
      {!isInstagram(posts[0]) && (
        <div
          className={cn(
            "grid md:grid-flow-col grid-cols-4 md:grid-cols-10 gap-2 py-10 wrapper",
            (posts.length <= 1
              ? "hidden"
              : posts.length <= 3
              ? "md:hidden"
              : posts.length <= 5
              ? "lg:hidden"
              : "") + (isInstagram(posts[0]) ? " pb-0" : "")
          )}
        >
          <Button
            value={"prev"}
            variant={"outline"}
            className={cn(
              "grid-cols-1 self-center cursor-pointer col-start-2 md:col-start-4",
              ""
            )}
            onClick={handleClick}
          >
            <ArrowBigLeft />
          </Button>
          {!isInstagram(posts[0]) && (
            <div
              className={cn(
                "order-3 md:order-2 mt-5 md:mt-0 col-span-1 md:col-span-2 md:col-start-3",
                path.includes("blog/films") ? " hidden!" : ""
              )}
            >
              {isBlog && (
                <Link href={`/search/`}>
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
            value={"next"}
            variant={"outline"}
            className={cn(
              "grid-cols-1 self-center cursor-pointer",
              "md:col-start-7"
            )}
            onClick={handleClick}
          >
            <ArrowBigRight />
          </Button>
        </div>
      )}
    </>
  );
};

export default CarouselComponent;
