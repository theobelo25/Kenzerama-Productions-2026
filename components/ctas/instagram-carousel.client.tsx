"use client";

import CarouselComponent from "@/components/media/carousel";
import type { InstagramPost } from "@/types";

type InstagramCarouselProps = {
  posts: InstagramPost[];
};

const InstagramCarousel = ({ posts }: InstagramCarouselProps) => {
  return <CarouselComponent posts={posts} />;
};

export default InstagramCarousel;
