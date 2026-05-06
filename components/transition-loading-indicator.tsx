"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const TRANSITION_START_EVENT = "kp:route-transition-start";

const TransitionLoadingIndicator = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    window.addEventListener(TRANSITION_START_EVENT, handleStart);
    return () => window.removeEventListener(TRANSITION_START_EVENT, handleStart);
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Loading page"
      className="pointer-events-none fixed bottom-4 right-4 z-60 flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-2 text-xs text-white backdrop-blur-md"
    >
      <span className="size-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      <span className="font-questrial">Loading</span>
    </div>
  );
};

export default TransitionLoadingIndicator;
