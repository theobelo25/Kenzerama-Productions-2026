"use client";

import dynamic from "next/dynamic";
import type { Film } from "@/types";

const CarouselComponent = dynamic(
  () => import("@/components/shared/carousel"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[280px] w-full" aria-busy="true" aria-hidden />
    ),
  },
);

const RelatedFilmsCarousel = ({ films }: { films: Film[] }) => (
  <CarouselComponent posts={films} />
);

export default RelatedFilmsCarousel;
