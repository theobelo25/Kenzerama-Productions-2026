"use client";

import type { MaxResolutionValue } from "@mux/playback-core";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Video from "next-video";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Asset } from "next-video/dist/assets.js";

const REDUCED_MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";
const HERO_NARROW_MQ = "(max-width: 899px)";
const EMBED_MOBILE_MQ = "(max-width: 767px)";

function subscribeMq(query: string, onChange: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useHeroMuxMaxResolution(): MaxResolutionValue {
  return useSyncExternalStore(
    (cb) => subscribeMq(HERO_NARROW_MQ, cb),
    () => (window.matchMedia(HERO_NARROW_MQ).matches ? "720p" : "1080p"),
    () => "1080p",
  );
}

function useEmbedMuxMaxResolution(): MaxResolutionValue | undefined {
  return useSyncExternalStore(
    (cb) => subscribeMq(EMBED_MOBILE_MQ, cb),
    () =>
      window.matchMedia(EMBED_MOBILE_MQ).matches ? "720p" : undefined,
    () => undefined,
  );
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (cb) => subscribeMq(REDUCED_MOTION_MEDIA_QUERY, cb),
    () => window.matchMedia(REDUCED_MOTION_MEDIA_QUERY).matches,
    () => false,
  );
}

const muxThumbnailUrl = (
  playbackId: string,
  opts: { width: number; quality: number },
) =>
  `https://image.mux.com/${playbackId}/thumbnail.webp?width=${opts.width}&quality=${opts.quality}&fit_mode=preserve&time=0`;

const VideoComponent = ({
  video,
  autoplay = false,
  muted = true,
  loop = false,
  playsInline = true,
  controls = false,
  preload,
  classNames,
  videoClassName = "object-contain",
  decorative = false,
  showPlayPauseButton = false,
  playPauseButtonClassName,
  /** Above-the-fold hero: viewport-sized poster, high fetch priority, video preload=metadata for LCP. */
  lcpHero = false,
}: {
  video: Asset;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  preload?: "none" | "metadata" | "auto";
  classNames?: string;
  videoClassName?: string;
  decorative?: boolean;
  showPlayPauseButton?: boolean;
  playPauseButtonClassName?: string;
  lcpHero?: boolean;
}) => {
  const heroMuxCap = useHeroMuxMaxResolution();
  const embedMuxCap = useEmbedMuxMaxResolution();
  const muxMaxResolution = lcpHero ? heroMuxCap : embedMuxCap;

  const prefersReducedMotion = usePrefersReducedMotion();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [playbackSession, setPlaybackSession] = useState(0);
  const [hasLoadedFrame, setHasLoadedFrame] = useState(false);
  /** Mux player is lazy-loaded inside next-video; ref may be a custom element with `play()`. */
  const mediaHostRef = useRef<HTMLMediaElement | null>(null);

  const muxPlaybackId = video.providerMetadata?.mux?.playbackId;
  const heroPosterWidth = muxMaxResolution === "720p" ? 960 : 1280;
  const muxPoster = muxPlaybackId
    ? muxThumbnailUrl(
        muxPlaybackId,
        lcpHero
          ? { width: heroPosterWidth, quality: 70 }
          : { width: 240, quality: 35 },
      )
    : undefined;
  const posterSrc = muxPoster ?? video.poster;
  const shouldAutoplay = autoplay && !prefersReducedMotion;
  const effectiveAutoplay = shouldAutoplay && !isPausedByUser;
  const shouldLoop = loop && (showPlayPauseButton ? isPlaying : effectiveAutoplay);
  const showPosterOverlay = showPlayPauseButton && !isPlaying;
  const effectivePreload = lcpHero
    ? effectiveAutoplay
      ? "auto"
      : "metadata"
    : (preload ?? (effectiveAutoplay ? "auto" : "metadata"));
  const videoKey = useMemo(
    () => `${video.src}-${playbackSession}`,
    [video.src, playbackSession],
  );

  const tryPlay = useCallback(() => {
    if (!effectiveAutoplay) return;
    const el = mediaHostRef.current;
    if (el && typeof el.play === "function") {
      void el.play().catch(() => {});
    }
  }, [effectiveAutoplay]);

  useLayoutEffect(() => {
    if (!effectiveAutoplay) return;
    tryPlay();
    const retryMs = [80, 250, 700];
    const ids = retryMs.map((ms) => window.setTimeout(tryPlay, ms));
    return () => ids.forEach((id) => clearTimeout(id));
  }, [effectiveAutoplay, tryPlay, videoKey]);

  useEffect(() => {
    setIsPausedByUser(false);
    setPlaybackSession(0);
    setHasLoadedFrame(false);
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

  const handleLoadedData = useCallback(() => {
    setHasLoadedFrame(true);
    tryPlay();
  }, [tryPlay]);

  const handleCanPlay = useCallback(() => {
    tryPlay();
  }, [tryPlay]);

  const shouldShowPosterLayer =
    (showPosterOverlay || !hasLoadedFrame) && Boolean(posterSrc);

  return (
    <div
      className={cn("relative", classNames)}
      aria-hidden={decorative && !showPlayPauseButton ? true : undefined}
    >
      <Video
        key={videoKey}
        ref={mediaHostRef as React.Ref<HTMLVideoElement>}
        src={video}
        autoplay={showPlayPauseButton ? isPlaying : effectiveAutoplay}
        muted={muted}
        loop={shouldLoop}
        playsInline={playsInline}
        controls={controls}
        preload={effectivePreload}
        className={videoClassName}
        {...(muxMaxResolution ? { maxResolution: muxMaxResolution } : {})}
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
        onLoadedData={handleLoadedData}
        onCanPlay={handleCanPlay}
      />
      {shouldShowPosterLayer && posterSrc ? (
        <Image
          src={posterSrc}
          alt=""
          fill
          sizes="100vw"
          quality={lcpHero ? 70 : 45}
          priority={lcpHero}
          fetchPriority={lcpHero ? "high" : undefined}
          aria-hidden={true}
          className={cn(videoClassName, "pointer-events-none h-full w-full")}
        />
      ) : null}
      {showPlayPauseButton ? (
        <button
          type="button"
          onClick={togglePlayback}
          className={cn(
            "pointer-events-auto absolute right-3 bottom-3 z-20 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-medium text-white shadow-md shadow-black/20 backdrop-blur-md transition hover:bg-black/45",
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
