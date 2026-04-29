"use client";

import { ArrowDown } from "lucide-react";
import { useRef } from "react";

const HeroScrollCue = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleScrollDown = () => {
    if (typeof window === "undefined") return;

    const currentSection = buttonRef.current?.closest("section");
    const nextSection = currentSection?.nextElementSibling;

    if (nextSection instanceof HTMLElement) {
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // Fallback if section structure changes unexpectedly.
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleScrollDown}
      aria-label="Scroll down to more content"
      className="group absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/40 bg-white/10 p-2 text-white/95 backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 motion-safe:animate-[bounce_2.4s_infinite] motion-reduce:animate-none"
    >
      <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
    </button>
  );
};

export default HeroScrollCue;
