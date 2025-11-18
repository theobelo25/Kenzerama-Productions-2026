"use client";
import { useState } from "react";
import { motion, stagger, Variants } from "motion/react";
import { SITE_TITLE_ANIMATION } from "@/lib/constants";

const SiteTitle = ({ title, eyebrow }: { title: string; eyebrow: string }) => {
  const [showTitle] = useState(true);
  const [showEyebrow, setShowEyebrow] = useState(false);

  return (
    <h1 className="relative z-2 m-5 md:m-15 lg:m-25 text-kenzerama-pink md:text-2xl lg:text-4xl font-cinzel uppercase">
      <span className="sr-only">
        {title} - {eyebrow}
      </span>
      <motion.span
        initial="hidden"
        animate={showTitle ? "eyebrowVisible" : "hidden"}
        transition={{
          delayChildren: stagger(0.04),
        }}
        onAnimationComplete={() => setShowEyebrow(true)}
        aria-hidden
      >
        {title.split("").map((c, i) => {
          if (c === " ") return <br key={i} />;
          return (
            <motion.span
              key={i + c}
              variants={SITE_TITLE_ANIMATION as Variants}
            >
              {c}
            </motion.span>
          );
        })}
      </motion.span>
      {eyebrow && (
        <motion.span
          className="eyebrow text-[0.5em]"
          initial="hidden"
          animate={showEyebrow ? "visible" : "hidden"}
          aria-hidden
        >
          {eyebrow.split("").map((char, index) => (
            <motion.span
              key={char + index}
              variants={SITE_TITLE_ANIMATION as Variants}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      )}
    </h1>
  );
};

export default SiteTitle;
