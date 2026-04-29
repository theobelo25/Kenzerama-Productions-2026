"use client";

import { useEffect, useMemo, useState } from "react";
import Video from "next-video";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Asset } from "next-video/dist/assets.js";

const REDUCED_MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

const VideoComponent = ({
  video,
  autoplay = false,
  muted = true,
  loop = false,
  playsInline = true,
  controls = false,
  classNames,
  videoClassName = "object-contain",
  decorative = false,
  showPlayPauseButton = false,
  playPauseButtonClassName,
}: {
  video: Asset;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  classNames?: string;
  videoClassName?: string;
  decorative?: boolean;
  showPlayPauseButton?: boolean;
  playPauseButtonClassName?: string;
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [playbackSession, setPlaybackSession] = useState(0);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(REDUCED_MOTION_MEDIA_QUERY);
    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQueryList.matches);
    };

    updateMotionPreference();
    mediaQueryList.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQueryList.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  const muxPlaybackId = video.providerMetadata?.mux?.playbackId;
  const muxPoster = muxPlaybackId
    ? `https://image.mux.com/${muxPlaybackId}/thumbnail.webp?width=300&time=0`
    : undefined;
  const posterSrc = video.poster ?? muxPoster;
  const shouldAutoplay = autoplay && !prefersReducedMotion;
  const effectiveAutoplay = shouldAutoplay && !isPausedByUser;
  const shouldLoop = loop && (showPlayPauseButton ? isPlaying : effectiveAutoplay);
  const showPosterOverlay = showPlayPauseButton && !isPlaying;
  const videoKey = useMemo(
    () => `${video.src}-${playbackSession}`,
    [video.src, playbackSession],
  );

  useEffect(() => {
    setIsPausedByUser(false);
    setPlaybackSession(0);
  }, [video]);

  useEffect(() => {
    if (!showPlayPauseButton) {
      setIsPlaying(effectiveAutoplay);
      return;
    }
    setIsPlaying(effectiveAutoplay);
  }, [effectiveAutoplay, showPlayPauseButton]);

  const togglePlayback = () => {
    if (!isPlaying) {
      setIsPausedByUser(false);
      setIsPlaying(true);
      setPlaybackSession((session) => session + 1);
      return;
    }

    setIsPausedByUser(true);
    setIsPlaying(false);
  };

  return (
    <div
      className={cn("relative", classNames)}
      aria-hidden={decorative && !showPlayPauseButton ? true : undefined}
    >
      {showPosterOverlay ? (
        posterSrc ? (
          <Image
            src={posterSrc}
            alt=""
            fill
            sizes="100vw"
            aria-hidden={true}
            className={cn(videoClassName, "h-full w-full")}
          />
        ) : (
          <div
            aria-hidden
            className="h-full w-full bg-black"
          />
        )
      ) : (
        <Video
          key={videoKey}
          src={video}
          autoplay={showPlayPauseButton ? isPlaying : effectiveAutoplay}
          muted={muted}
          loop={shouldLoop}
          playsInline={playsInline}
          controls={controls}
          className={videoClassName}
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "none",
            minWidth: "100%",
            minHeight: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
          poster={posterSrc}
        />
      )}
      {showPlayPauseButton ? (
        <button
          type="button"
          onClick={togglePlayback}
          className={cn(
            "pointer-events-auto absolute right-3 bottom-3 z-20 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-black/85",
            playPauseButtonClassName,
          )}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      ) : null}
    </div>
  );
};

export default VideoComponent;
