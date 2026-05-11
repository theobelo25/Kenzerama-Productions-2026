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
  /**
   * Parent renders a single persistent hero poster (outside Suspense). Avoids reload flash when
   * fallback unmounts and this tree’s poster `Image` mounts (cold chunk load).
   */
  heroStaticCover = false,
  onHeroStaticCoverChange,
  /**
   * Omit outer `relative` + `wrapper` shell; parent must supply `relative wrapper` > `relative w-full`
   * so loading placeholders and the player share the same box (reduces layout shift).
   */
  nestShell = false,
  /** Main above-the-fold poster (not homepage hero): Next/Image `priority` + eager load for LCP. */
  priorityPoster = false,
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
  heroStaticCover?: boolean;
  onHeroStaticCoverChange?: (coverVisible: boolean) => void;
  nestShell?: boolean;
  priorityPoster?: boolean;
}) => {
  const heroMuxCap = useHeroMuxMaxResolution();
  const embedMuxCap = useEmbedMuxMaxResolution();
  const muxMaxResolution = lcpHero ? heroMuxCap : embedMuxCap;

  const prefersReducedMotion = usePrefersReducedMotion();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [playbackSession, setPlaybackSession] = useState(0);
  const [hasLoadedFrame, setHasLoadedFrame] = useState(false);
  const [hasEverPlayedHero, setHasEverPlayedHero] = useState(false);
  /** MuxVideo is lazy-imported inside next-video; remount after errors / failed chunk. */
  const mediaErrorRetriesRef = useRef(0);
  /** Mux player is lazy-loaded inside next-video; ref may be a custom element with `play()`. */
  const mediaHostRef = useRef<HTMLMediaElement | null>(null);
  const mediaHostListenersCleanupRef = useRef<(() => void) | null>(null);

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
  /** Prefer asset `poster` so Next/Image URL matches Mux JSON (mux thumbnail adds params → reload/flash). */
  const posterSrc = video.poster ?? muxPoster;
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

  /** Hero fills an absolute inset-0 slot; embeds rely on next-video's aspect-ratio box (avoid % heights vs flex/h-screen ancestors). */
  const videoRootStyle = lcpHero
    ? ({
        width: "100%",
        height: "100%",
        maxWidth: "none",
        minWidth: "100%",
        minHeight: "100%",
        objectFit: "cover",
        objectPosition: "center",
      } as const)
    : ({ width: "100%" } as const);

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
    setHasEverPlayedHero(false);
    mediaErrorRetriesRef.current = 0;
  }, [video]);

  const staticHeroCoverVisible =
    heroStaticCover && lcpHero && (!hasEverPlayedHero || showPosterOverlay);

  useEffect(() => {
    if (!heroStaticCover || !lcpHero || !onHeroStaticCoverChange) return;
    onHeroStaticCoverChange(staticHeroCoverVisible);
  }, [
    heroStaticCover,
    lcpHero,
    staticHeroCoverVisible,
    onHeroStaticCoverChange,
  ]);

  /** Warm the Mux chunk before next-video’s Suspense needs it (reduces empty player when the lazy import races). */
  useEffect(() => {
    if (lcpHero || !muxPlaybackId) return;
    void import("@mux/mux-video/react");
  }, [lcpHero, muxPlaybackId]);

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

  const markMediaReady = useCallback(() => {
    setHasLoadedFrame(true);
  }, []);

  const handleLoadedData = useCallback(() => {
    if (!lcpHero) markMediaReady();
    tryPlay();
  }, [lcpHero, markMediaReady, tryPlay]);

  const handleCanPlay = useCallback(() => {
    if (!lcpHero) markMediaReady();
    tryPlay();
  }, [lcpHero, markMediaReady, tryPlay]);

  const handlePlaying = useCallback(() => {
    if (heroStaticCover && lcpHero) setHasEverPlayedHero(true);
    markMediaReady();
  }, [heroStaticCover, lcpHero, markMediaReady]);

  const handleMediaError = useCallback(() => {
    setHasLoadedFrame(false);
    if (mediaErrorRetriesRef.current >= 2) return;
    mediaErrorRetriesRef.current += 1;
    window.setTimeout(() => {
      setPlaybackSession((s) => s + 1);
    }, 400);
  }, []);

  /**
   * React `onLoadedData` / etc. are not always wired for lazy `mux-video` inside next-video’s theme.
   * Listen on the host element directly so the placeholder can clear.
   */
  const setMediaHostRef = useCallback(
    (node: HTMLMediaElement | null) => {
      mediaHostListenersCleanupRef.current?.();
      mediaHostListenersCleanupRef.current = null;
      mediaHostRef.current = node;
      if (!node) return;

      if (process.env.NODE_ENV !== "production") {
        const inspect = () => {
          const el = mediaHostRef.current as
            | (HTMLMediaElement & {
                disableRemotePlayback?: boolean;
              })
            | null;
          if (!el) return;
          console.debug("[video-component] remote playback guards", {
            disableremoteplaybackAttr: el.hasAttribute("disableremoteplayback"),
            disableRemotePlaybackProp: el.disableRemotePlayback,
            tagName: el.tagName.toLowerCase(),
          });
        };
        inspect();
        requestAnimationFrame(inspect);
      }

      const reveal = () => setHasLoadedFrame(true);
      const onReveal = () => reveal();

      if (lcpHero) {
        /**
         * Hero: `loadedmetadata` / `timeupdate` / `readyState` can fire before the first *painted* frame,
         * so hiding the poster early reads as a flash/tear. Wait for actual playback.
         */
        node.addEventListener("playing", onReveal);
        mediaHostListenersCleanupRef.current = () => {
          node.removeEventListener("playing", onReveal);
        };
        return;
      }

      const events = [
        "loadeddata",
        "canplay",
        "canplaythrough",
        "playing",
      ] as const;
      for (const evt of events) {
        node.addEventListener(evt, onReveal);
      }
      mediaHostListenersCleanupRef.current = () => {
        for (const evt of events) {
          node.removeEventListener(evt, onReveal);
        }
      };
    },
    [lcpHero],
  );

  /** Last resort: don’t leave the Next poster covering a ready player on film pages. */
  useEffect(() => {
    if (lcpHero || showPlayPauseButton) return;
    const id = window.setTimeout(() => {
      setHasLoadedFrame(true);
    }, 3500);
    return () => clearTimeout(id);
  }, [videoKey, lcpHero, showPlayPauseButton]);

  const posterHidden = hasLoadedFrame && !showPosterOverlay;

  /** Next/Image poster on top (z-10); player fades in underneath for a crossfade instead of a hard cut. */
  const hasPosterOverlayLayer = Boolean(
    posterSrc && !(lcpHero && heroStaticCover),
  );
  const crossfadeClass =
    "transition-opacity duration-500 ease-in-out motion-reduce:transition-none motion-reduce:duration-0";

  // Keep both forms so custom-element hydration has the no-remote flag from first paint.
  const remotePlaybackGuardProps: Record<string, unknown> = {
    disableRemotePlayback: true,
    disableremoteplayback: "",
  };

  const muxVideo = (
    <Video
      key={videoKey}
      ref={setMediaHostRef}
      src={video}
      autoplay={showPlayPauseButton ? isPlaying : effectiveAutoplay}
      muted={muted}
      loop={shouldLoop}
      playsInline={playsInline}
      controls={controls}
      preload={effectivePreload}
      {...remotePlaybackGuardProps}
      className={videoClassName}
      {...(muxMaxResolution ? { maxResolution: muxMaxResolution } : {})}
      style={videoRootStyle}
      poster={lcpHero ? undefined : posterSrc}
      onLoadedData={handleLoadedData}
      onCanPlay={handleCanPlay}
      onPlaying={handlePlaying}
      onError={handleMediaError}
    />
  );

  // `fill` poster aligns to the padding box; the player sits in the content box (e.g. `wrapper` padding). Inner `relative` matches their boxes.
  const playerShell = (
    <>
      {hasPosterOverlayLayer ? (
        <div
          className={cn(
            "absolute inset-0 z-0",
            crossfadeClass,
            posterHidden
              ? "opacity-100"
              : "pointer-events-none opacity-0",
          )}
        >
          {muxVideo}
        </div>
      ) : (
        muxVideo
      )}
      {posterSrc && !(lcpHero && heroStaticCover) ? (
        <Image
          src={posterSrc}
          alt=""
          fill
          sizes={lcpHero ? "100vw" : "(min-width: 1280px) 80rem, 100vw"}
          quality={lcpHero ? 70 : 45}
          priority={lcpHero || priorityPoster}
          loading={lcpHero || priorityPoster ? "eager" : undefined}
          fetchPriority={lcpHero || priorityPoster ? "high" : undefined}
          aria-hidden={true}
          className={cn(
            videoClassName,
            "pointer-events-none z-10 h-full w-full",
            crossfadeClass,
            posterHidden ? "opacity-0" : "opacity-100",
          )}
        />
      ) : null}
    </>
  );

  const useNestShell = nestShell && !lcpHero && !showPlayPauseButton;

  if (useNestShell) {
    return <>{playerShell}</>;
  }

  return (
    <div
      className={cn("relative", lcpHero && "bg-black", classNames)}
      aria-hidden={decorative && !showPlayPauseButton ? true : undefined}
    >
      {lcpHero ? (
        playerShell
      ) : (
        <div className="relative w-full">{playerShell}</div>
      )}
      {showPlayPauseButton ? (
        <button
          type="button"
          onClick={togglePlayback}
          className={cn(
            "pointer-events-auto absolute right-3 bottom-3 z-20 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-medium text-white shadow-md shadow-black/20 backdrop-blur-md transition hover:bg-black/65",
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
