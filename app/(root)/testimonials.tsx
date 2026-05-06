"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { testimonialData } from "@/info/testimonials";

const ROTATE_MS = 10_000;

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const Testimonials = () => {
  const { testimonials } = testimonialData;
  const count = testimonials.length;
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const t = testimonials[index];
  const backgroundPositionClass =
    t.names === "Jocilea & Justin"
      ? "object-cover object-[center_58%] md:object-bottom"
      : t.names === "Devon & Graham"
        ? "object-cover object-[center_58%] lg:object-[center_40%]"
        : t.names === "Kristen & Jesse"
          ? "object-cover object-[center_58%] md:object-bottom"
        : "object-cover object-[center_58%]";

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [count]);

  return (
    <section
      className="relative isolate overflow-hidden landing-section-y"
      aria-label="Client testimonials"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={t.names}
            variants={fadeVariants}
            initial={reduceMotion ? "animate" : "initial"}
            animate="animate"
            exit={reduceMotion ? "animate" : "exit"}
            transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
            aria-hidden
          >
            <Image
              src={t.backgroundSrc}
              alt={t.alt || ""}
              fill
              className={`${backgroundPositionClass} grayscale`}
              sizes="100vw"
              quality={40}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-black/65"
        aria-hidden
      />
      <div className="relative z-10">
        <div className="wrapper relative h-[min(66vh,38rem)] sm:h-[min(64vh,35rem)] md:h-[19rem] lg:h-[18.5rem]">
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            Testimonial {index + 1} of {count}: {t.names}. {t.testimonial}
          </p>
          <AnimatePresence initial={false} mode="wait">
            <motion.article
              key={t.names}
              variants={fadeVariants}
              initial={reduceMotion ? "animate" : "initial"}
              animate="animate"
              exit={reduceMotion ? "animate" : "exit"}
              transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] pr-1 [scrollbar-color:rgba(255,255,255,0.35)_transparent]"
            >
              <div className="flex min-h-full w-full flex-col items-center justify-center px-2 py-4 md:px-1">
                <blockquote className="flex w-full max-w-[44rem] flex-col items-center gap-4 px-2 text-center md:gap-5 md:px-0">
                  <p className="text-balance text-sm font-normal leading-relaxed text-white/90 font-questrial md:text-base">
                    {t.testimonial}
                  </p>
                  <p className="pt-1 font-cinzel text-sm font-medium tracking-wide text-white md:text-base">
                    &ndash; {t.names}
                  </p>
                </blockquote>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
