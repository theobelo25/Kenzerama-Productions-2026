"use client";
import { MouseEventHandler, useRef } from "react";
import Poster from "./poster";
import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Film } from "@/types";

const CarouselComponent = ({ featuredFilms }: { featuredFilms: Film[] }) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const target = e.target as HTMLButtonElement;

    if (target.value === "prev") {
      prevRef.current?.click();
    } else if (target.value === "next") {
      nextRef.current?.click();
    }
  };

  return (
    <>
      <Carousel
        className="m-auto fade-horizontal-sm md:fade-horizontal"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="px-10">
          {featuredFilms.map((film) => (
            <CarouselItem
              key={film.slug}
              className="basis-1/1 md:basis-1/3 lg:basis-1/5"
            >
              <div className="md:px-1 lg:px-2">
                <Poster film={film} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious ref={prevRef} className="hidden" />
        <CarouselNext ref={nextRef} className="hidden" />
      </Carousel>
      <div
        className={cn(
          "flex justify-between w-[375px] m-auto p-10",
          featuredFilms.length <= 3
            ? "md:hidden"
            : featuredFilms.length <= 5
            ? "lg:hidden"
            : ""
        )}
      >
        <Button
          value={"prev"}
          variant={"outline"}
          className="w-[90px]"
          onClick={handleClick}
        >
          Previous
        </Button>
        <Button
          value={"next"}
          variant={"outline"}
          className="w-[90px]"
          onClick={handleClick}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default CarouselComponent;
