"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { testimonialData } from "@/data/testimonials";

const ANIMATION_VARIANTS = {
  initial: (direction: string) => ({
    x: direction === "next" ? 10 : -10,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: string) => ({
    x: direction === "next" ? -10 : 10,
    opacity: 0,
  }),
};

const Testimonials = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const { testimonials } = testimonialData;

  const handleNext = () => {
    setDirection("next");
    if (currentPosition < testimonials.length - 1)
      setCurrentPosition(currentPosition + 1);
    else setCurrentPosition(0);
  };

  const handlePrev = () => {
    setDirection("prev");
    if (currentPosition > 0) setCurrentPosition(currentPosition - 1);
    else setCurrentPosition(testimonials.length - 1);
  };

  return (
    <section className="py-10">
      <h2 className="sr-only">Testimonials</h2>
      <h2 className="py-0 wrapper relative text-right text-xl font-questrial after:content-[''] after:absolute after:right-0 after:-bottom-1 after:bg-kenzerama-pink after:w-[80%] after:h-px">
        See what our clients are saying!
      </h2>
      <div className="wrapper grid grid-cols-1 md:grid-cols-5">
        <div className="md:flex md:flex-col md:justify-center pt-10 md:pt-0 md:pr-10 col-span-1 md:col-span-4">
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <motion.blockquote
              key={currentPosition}
              custom={direction}
              variants={ANIMATION_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center font-questrial"
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {testimonials[currentPosition].testimonial}
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            key={currentPosition}
            custom={direction}
            variants={ANIMATION_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="max-md:order-first h-fit col-span-1 md:col-span-1 rounded-sm overflow-hidden"
          >
            <Image src={testimonials[currentPosition].image} alt={"TENP"} />
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between items-center col-span-1 md:col-span-5 md:pt-10 w-full md:min-w-[400px] md:w-[50%] m-auto mt-5">
          <Button
            variant={"outline"}
            onClick={handlePrev}
            className="cursor-pointer"
          >
            <ArrowBigLeft />
            <span className="sr-only">Previous</span>
          </Button>
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <motion.span
              key={currentPosition}
              custom={direction}
              variants={ANIMATION_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-2xl font-cinzel"
            >
              {testimonials[currentPosition].names}
            </motion.span>
          </AnimatePresence>
          <Button
            variant={"outline"}
            onClick={handleNext}
            className="cursor-pointer"
          >
            <ArrowBigRight />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
