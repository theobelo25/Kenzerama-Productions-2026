"use client";
import { Film, Post } from "@/types";
import { motion, AnimatePresence } from "motion/react";
import Poster from "@/components/shared/carousel/poster";
import FeaturedPostMenuItem from "@/components/shared/header/featured-post-menu-item";

const Results = ({ results }: { results: (Post | Film)[] }) => {
  return (
    <div>
      {results.length === 0 ? (
        <div>No results found</div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {results.map((result) => {
              if (result.type === "film") {
                return (
                  <motion.li
                    key={result.slug}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Poster film={result as Film} />
                  </motion.li>
                );
              } else if (result.type === "post") {
                return (
                  <motion.li
                    key={result.slug}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <FeaturedPostMenuItem
                      key={result.slug}
                      post={result as Post}
                      className="aspect-poster"
                    />
                  </motion.li>
                );
              }
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

export default Results;
