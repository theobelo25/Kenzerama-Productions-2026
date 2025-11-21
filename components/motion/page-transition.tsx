"use client";
import { motion } from "motion/react";
import { HTMLMotionProps } from "motion/react";

const PageTransition = (props: HTMLMotionProps<"div">) => {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    />
  );
};

export default PageTransition;
