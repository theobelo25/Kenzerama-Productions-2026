"use client";
import { motion } from "motion/react";
import { HTMLMotionProps } from "motion/react";
import { useReducedMotion } from "motion/react";

const PageTransition = (props: HTMLMotionProps<"div">) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      {...props}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
      transition={shouldReduceMotion ? undefined : { delay: 0.5 }}
    />
  );
};

export default PageTransition;
