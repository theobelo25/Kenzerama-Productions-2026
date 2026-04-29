"use client";
import { useEffect, useState } from "react";
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
  const [showEyebrow, setShowEyebrow] = useState(shouldReduceMotion);
  useEffect(() => {
    if (shouldReduceMotion) setShowEyebrow(true);
  }, [shouldReduceMotion]);
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
      className="pointer-events-none relative z-10 inline-block my-5 ml-5 md:my-15 md:ml-15 lg:my-25 lg:ml-25 py-4 md:py-8 text-kenzerama-pink md:text-2xl lg:text-4xl font-cinzel uppercase"
    >
      <span className="sr-only">
        {title} - {eyebrow}
      </span>
      <motion.span
        className="pointer-events-none"
        initial="hidden"
        animate={shouldReduceMotion ? "visible" : showTitle ? "eyebrowVisible" : "hidden"}
        transition={{
          delayChildren: shouldReduceMotion ? 0 : stagger(0.04),
        }}
        onAnimationComplete={() => {
          if (!shouldReduceMotion) setShowEyebrow(true);
        }}
        aria-hidden
      >
        {title.split("").map((c, i) => {
          if (c === " ") return <br key={i + c} />;
          return (
            <motion.span
              key={i + c}
              variants={titleAnimationVariant as Variants}
            >
              {c}
            </motion.span>
          );
        })}
      </motion.span>
      {eyebrow && (
        <motion.span
          className="eyebrow pointer-events-none text-[0.5em]"
          initial={shouldReduceMotion ? false : "hidden"}
          animate={showEyebrow ? "visible" : "hidden"}
          aria-hidden
        >
          {eyebrow.split("").map((char, index) => (
            <motion.span
              key={char + index}
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
