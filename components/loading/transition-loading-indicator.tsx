"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { usePathname } from "next/navigation";
import LoadingPill from "@/components/loading/loading-pill";

const TRANSITION_START_EVENT = "kp:route-transition-start";

const TransitionLoadingIndicator = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const onTransitionStart = useEffectEvent(() => {
    setIsLoading(true);
  });

  const onTransitionSettle = useEffectEvent(() => {
    setIsLoading(false);
  });

  useEffect(() => {
    const handleStart = () => onTransitionStart();
    window.addEventListener(TRANSITION_START_EVENT, handleStart);
    return () =>
      window.removeEventListener(TRANSITION_START_EVENT, handleStart);
  }, []);

  useEffect(() => {
    onTransitionSettle();
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <LoadingPill
      aria-live="polite"
      aria-label="Loading page"
      className="fixed bottom-4 right-4 z-60"
    />
  );
};

export default TransitionLoadingIndicator;
