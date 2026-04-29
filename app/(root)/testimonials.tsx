"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { testimonialData } from "@/info/testimonials";

const ROTATE_MS = 10_000;

const TESTIMONIAL_BG = "/images/testimonial-bg.jpg";

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/** First segment before `. ` / `! ` / `? ` (simple sentence split). */
function getFirstSentence(text: string): string {
  const t = text.trim();
  const parts = t.split(/(?<=[.!?])\s+/u);
  return (parts[0] ?? t).trim();
}

function stripOuterQuotes(s: string): string {
  return s
    .replace(/^[\s\u201C\u201D\u2018\u2019"']+/u, "")
    .replace(/[\s\u201C\u201D\u2018\u2019"']+$/u, "")
    .trim();
}

const Testimonials = () => {
  const { testimonials } = testimonialData;
  const count = testimonials.length;
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const t = testimonials[index];

  const pullText = useMemo(
    () => stripOuterQuotes(getFirstSentence(t.testimonial)),
    [t.testimonial],
  );

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
        <Image
          src={TESTIMONIAL_BG}
          alt=""
          fill
          className="object-cover object-[center_58%] grayscale"
          sizes="100vw"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-black/65"
        aria-hidden
      />
      <div className="relative z-10">
        <div className="wrapper relative h-[min(75.9vh,46.2rem)] sm:h-[min(74.25vh,42.9rem)] md:h-[23.1rem] lg:h-[20.9rem]">
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
                  <p className="text-balance font-playfair-display text-lg font-medium leading-snug text-kenzerama-pink md:text-xl">
                    <span className="font-normal" aria-hidden>
                      &ldquo;
                    </span>
                    {pullText}
                    <span className="font-normal" aria-hidden>
                      &rdquo;
                    </span>
                  </p>
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
