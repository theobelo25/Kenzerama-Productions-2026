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
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
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
  const previewImageSrc =
    post.thumbnail_url || (!isVideoPost ? post.media_url : undefined);
  const shouldPlayPreviewVideo =
    isVideoPost && isPreviewActive && !prefersReducedMotion;
  const showVideoLayer = shouldPlayPreviewVideo && isVideoReady;

  if (post)
    return (
      <a
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={linkLabel}
        className={cn("", className)}
        onMouseEnter={() => {
          setIsVideoReady(false);
          setIsPreviewActive(true);
        }}
        onMouseLeave={() => setIsPreviewActive(false)}
        onFocus={() => {
          setIsVideoReady(false);
          setIsPreviewActive(true);
        }}
        onBlur={() => setIsPreviewActive(false)}
      >
        <Card className="aspect-square rounded-lg border-none overflow-hidden py-0 gap-0 block bg-black">
          <CardContent className="relative h-full p-0">
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
                unoptimized
              />
            ) : null}

            {shouldPlayPreviewVideo ? (
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
            ) : !previewImageSrc ? (
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

  return null;
};

export default InstagramPostComponent;
