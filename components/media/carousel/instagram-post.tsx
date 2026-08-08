"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { InstagramPost } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const InstagramPostComponent = ({
  post,
  className,
}: {
  post: InstagramPost;
  className?: string;
}) => {
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  const trimmedCaption = post.caption?.trim();

  const shortCaption =
    trimmedCaption && trimmedCaption.length > 120
      ? `${trimmedCaption.slice(0, 117)}...`
      : trimmedCaption;

  const linkLabel = shortCaption
    ? `View Instagram post: ${shortCaption}`
    : "View Instagram post";

  const imageAlt = shortCaption
    ? `Instagram post preview: ${shortCaption}`
    : "Instagram post preview";

  const isVideoPost =
    post.media_type === "VIDEO" || post.media_type === "REELS";

  // Instagram may return a VIDEO post with a thumbnail_url
  // but no playable media_url.
  const hasPlayableVideo = isVideoPost && Boolean(post.media_url);

  // Video posts use their thumbnail as the static preview.
  // Image posts use media_url directly.
  const previewImageSrc =
    post.thumbnail_url || (!isVideoPost ? post.media_url : undefined);

  // Only attempt video playback when Instagram actually supplied media_url.
  const shouldPlayPreviewVideo =
    hasPlayableVideo && isPreviewActive && !prefersReducedMotion;

  const showVideoLayer = shouldPlayPreviewVideo && isVideoReady;

  if (!post) {
    return null;
  }

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={linkLabel}
      className={cn("", className)}
      onMouseEnter={() => {
        if (hasPlayableVideo) {
          setIsVideoReady(false);
          setIsPreviewActive(true);
        }
      }}
      onMouseLeave={() => setIsPreviewActive(false)}
      onFocus={() => {
        if (hasPlayableVideo) {
          setIsVideoReady(false);
          setIsPreviewActive(true);
        }
      }}
      onBlur={() => setIsPreviewActive(false)}
    >
      <Card className="relative h-full w-full overflow-hidden">
        <CardContent className="relative h-full w-full p-0">
          {previewImageSrc ? (
            <Image
              src={previewImageSrc}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 20vw, 33vw"
              className={cn(
                "object-cover transition-opacity duration-150",
                showVideoLayer ? "opacity-0" : "opacity-100",
              )}
            />
          ) : null}

          {shouldPlayPreviewVideo && post.media_url ? (
            <video
              src={post.media_url}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-150",
                showVideoLayer ? "opacity-100" : "opacity-0",
              )}
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setIsVideoReady(true)}
              onPlaying={() => setIsVideoReady(true)}
              aria-hidden="true"
            />
          ) : !previewImageSrc && post.media_url ? (
            <video
              src={post.media_url}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          ) : null}
        </CardContent>
      </Card>
    </a>
  );
};

export default InstagramPostComponent;
