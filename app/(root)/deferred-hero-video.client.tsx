"use client";

import { Suspense, useEffect, useState } from "react";
import VideoComponent from "@/components/video-component";
import homepageHeroTeaser from "@/videos/homepage_hero_video.mp4";

const HeroVideoFallback = () => (
  <div className="absolute inset-0 z-0 bg-black/70" aria-hidden />
);

const DeferredHeroVideo = () => {
  const [shouldRenderVideo, setShouldRenderVideo] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;

    const enableVideo = () => {
      setShouldRenderVideo(true);
    };

    const scheduleVideoStart = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(enableVideo, { timeout: 1500 });
      } else {
        timeoutId = setTimeout(enableVideo, 1200);
      }
    };

    if (document.readyState === "complete") {
      scheduleVideoStart();
    } else {
      const onLoad = () => scheduleVideoStart();
      window.addEventListener("load", onLoad, { once: true });
      timeoutId = setTimeout(enableVideo, 2500);
      return () => {
        window.removeEventListener("load", onLoad);
        if (timeoutId) clearTimeout(timeoutId);
        if (idleId !== null && "cancelIdleCallback" in window) {
          window.cancelIdleCallback(idleId);
        }
      };
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (idleId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  if (!shouldRenderVideo) {
    return <HeroVideoFallback />;
  }

  return (
    <Suspense fallback={<HeroVideoFallback />}>
      <VideoComponent
        video={homepageHeroTeaser}
        autoplay
        loop
        showPlayPauseButton
        lcpHero
        classNames="absolute inset-0 h-full w-full z-0"
        videoClassName="absolute inset-0 !block !h-full !w-full !max-w-none min-h-full min-w-full object-cover [--media-object-fit:cover] [--media-object-position:center_center]"
      />
    </Suspense>
  );
};

export default DeferredHeroVideo;
