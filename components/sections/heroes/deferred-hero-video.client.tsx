"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import VideoComponent from "@/components/media/video-component";
import homepageHeroTeaser from "@/videos/homepage_hero_video.mp4";
import { Asset } from "next-video/dist/assets.js";

/** Poster only; parent supplies `absolute inset-0` shell + bg so layout never changes when video mounts. */
const HeroPoster = () => {
  const poster = homepageHeroTeaser.poster;
  if (!poster) return null;
  return (
    <Image
      src={poster}
      alt=""
      fill
      sizes="100vw"
      quality={70}
      priority
      fetchPriority="high"
      aria-hidden
      className="object-cover object-center"
    />
  );
};

const DeferredHeroVideo = ({ video }: { video: Asset }) => {
  const [heroCoverVisible, setHeroCoverVisible] = useState(true);
  const onHeroStaticCoverChange = useCallback((visible: boolean) => {
    setHeroCoverVisible(visible);
  }, []);

  useEffect(() => {
    void import("next-video");
    void import("@mux/mux-video/react");
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black" aria-hidden>
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <VideoComponent
            video={video}
            autoplay
            loop
            showPlayPauseButton
            lcpHero
            heroStaticCover
            onHeroStaticCoverChange={onHeroStaticCoverChange}
            classNames="absolute inset-0 h-full w-full"
            videoClassName="absolute inset-0 !block !h-full !w-full !max-w-none min-h-full min-w-full object-cover [--media-object-fit:cover] [--media-object-position:center_center]"
          />
        </Suspense>
      </div>
      {heroCoverVisible ? (
        <div className="pointer-events-none absolute inset-0 z-1">
          <HeroPoster />
        </div>
      ) : null}
    </div>
  );
};

export default DeferredHeroVideo;
