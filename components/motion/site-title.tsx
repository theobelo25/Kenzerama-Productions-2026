"use client";
import { useState } from "react";
import { motion, stagger, useReducedMotion, Variants } from "motion/react";
import { SITE_TITLE_ANIMATION } from "@/lib/constants";
import HeroCtaLink from "@/components/shared/hero-cta-link";

const SiteTitle = ({
  id,
  title,
  eyebrow,
  ctaLabel,
  ctaHref,
}: {
  id?: string;
  title: string;
  eyebrow: string;
  ctaLabel?: string;
  ctaHref?: string;
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [showTitle] = useState(true);
  const [eyebrowRevealed, setEyebrowRevealed] = useState(false);
  const showEyebrow = Boolean(shouldReduceMotion) || eyebrowRevealed;
  const titleAnimationVariant = shouldReduceMotion
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { duration: 0 } },
        eyebrowVisible: { opacity: 1, transition: { duration: 0 } },
      }
    : SITE_TITLE_ANIMATION;

  return (
    <h1
      id={id}
      className="pointer-events-none relative z-10 my-5 ml-5 inline-block max-w-[min(100%,calc(100vw-2.5rem))] rounded-2xl bg-black/35 px-[1.96875rem] py-4 shadow-lg shadow-black/25 backdrop-blur-md [mask-image:radial-gradient(ellipse_95%_100%_at_50%_50%,#000_62%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_95%_100%_at_50%_50%,#000_62%,transparent_100%)] md:my-15 md:ml-15 md:px-[2.8125rem] md:py-8 lg:my-25 lg:ml-25 lg:rounded-3xl lg:px-[3.375rem] text-kenzerama-pink text-3xl md:text-4xl lg:text-5xl font-cinzel uppercase"
    >
      <span className="sr-only">
        {title} - {eyebrow}
      </span>
      <motion.span
        className="pointer-events-none"
        initial="hidden"
        animate={
          shouldReduceMotion ? "visible" : showTitle ? "eyebrowVisible" : "hidden"
        }
        transition={{
          delayChildren: shouldReduceMotion ? 0 : stagger(0.04),
        }}
        onAnimationComplete={() => {
          if (!shouldReduceMotion) setEyebrowRevealed(true);
        }}
        aria-hidden
      >
        {title.split("").map((c, i) => {
          if (c === " ") return <br key={`${i}-space`} />;
          return (
            <motion.span
              key={`${i}-${c}`}
              variants={titleAnimationVariant as Variants}
            >
              {c}
            </motion.span>
          );
        })}
      </motion.span>
      {eyebrow && (
        <motion.span
          className="eyebrow pointer-events-none text-[0.4em]"
          initial={shouldReduceMotion ? false : "hidden"}
          animate={showEyebrow ? "visible" : "hidden"}
          aria-hidden
        >
          {eyebrow.split("").map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              variants={titleAnimationVariant as Variants}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      )}
      {ctaLabel && ctaHref && (
        <span className="mt-3 block text-sm md:text-base font-playfair-display normal-case">
          <HeroCtaLink href={ctaHref} pointerEventsAuto>
            {ctaLabel}
          </HeroCtaLink>
        </span>
      )}
    </h1>
  );
};

export default SiteTitle;
