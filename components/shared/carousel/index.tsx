"use client";
import { MouseEventHandler, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Poster from "./poster";
import CB from "@/public/images/C&B-Poster-colorized.webp";
import JR from "@/public/images/j&r-poster-colorized.webp";
import OJ from "@/public/images/o&j-poster-colorized.webp";
import YM from "@/public/images/y&m-poster-colorized.webp";
import KM from "@/public/images/k&m-poster-colorized.webp";
import KD from "@/public/images/k&d-poster-colorized.webp";
import AK from "@/public/images/a&k-poster-colorized.webp";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import InstagramPost from "./instagram-post";

const TEMP_WEDDINGS = [
  {
    name: "Caroline & Brennen",
    image: CB,
    date: new Date(),
    venue: "Kingston, On",
  },
  {
    name: "Jennika & Ryan",
    image: JR,
    date: new Date(),
    venue: "Hart House",
  },
  {
    name: "Olivia & Jacob",
    image: OJ,
    date: new Date(),
    venue: "Three Feathers Terrace",
  },
  {
    name: "Yasmine & Michael",
    image: YM,
    date: new Date(),
    venue: "Arlington Estate",
  },
  {
    name: "Krista & Mitch",
    image: KM,
    date: new Date(),
    venue: "Huntsville",
  },
  {
    name: "Kristina & Dan",
    image: KD,
    date: new Date(),
    venue: "Ricarda's",
  },
  {
    name: "Annie & Knickoy",
    image: AK,
    date: new Date(),
    venue: "Liuna Station",
  },
];

const TEMP_POSTS = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

const CarouselComponent = ({
  type = "default",
}: {
  type: "poster" | "instagram" | "default";
}) => {
  const data = [];
  if (type === "poster") data.push(...TEMP_WEDDINGS);
  if (type === "instagram") data.push(...TEMP_POSTS);

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
          {data.map((w, index) => (
            <CarouselItem
              key={index}
              className="basis-1/1 md:basis-1/3 lg:basis-1/5"
            >
              <div className="md:px-1 lg:px-2">
                {type === "poster" ? (
                  <Poster data={w} />
                ) : type === "instagram" ? (
                  <InstagramPost data={w} />
                ) : null}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious ref={prevRef} className="hidden" />
        <CarouselNext ref={nextRef} className="hidden" />
      </Carousel>
      <div className="flex justify-between w-[375px] m-auto p-10">
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
