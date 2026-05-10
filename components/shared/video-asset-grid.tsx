"use client";

import Image from "next/image";
import Link from "@/components/link-component";
import type { VideoBlockTile } from "@/lib/directus/blocks/block_videos";
import { cn } from "@/lib/utils";

/** Featured-style grid of poster images only (no video player). */
export default function VideoAssetGrid({
  videos,
  ariaLabel,
  className,
  posterSizes = "(min-width: 1024px) 16.66vw, 33.33vw",
}: {
  videos: VideoBlockTile[];
  ariaLabel: string;
  className?: string;
  posterSizes?: string;
}) {
  if (videos.length === 0) {
    return (
      <div className="w-full px-5 py-10 text-center text-muted-foreground md:px-10">
        No videos available right now.
      </div>
    );
  }

  return (
    <ul
      className={cn(
        "grid w-full max-w-none grid-cols-3 gap-2 px-5 sm:gap-4 md:grid-cols-3 md:gap-6 md:px-10 lg:grid-cols-6",
        className,
      )}
      aria-label={ariaLabel}
    >
      {videos.map((tile, index) => (
        <li key={tile.id}>
          <VideoPosterTile
            tile={tile}
            prioritize={index < 3}
            posterSizes={posterSizes}
          />
        </li>
      ))}
    </ul>
  );
}

function VideoPosterTile({
  tile,
  prioritize,
  posterSizes,
}: {
  tile: VideoBlockTile;
  prioritize: boolean;
  posterSizes: string;
}) {
  const { posterSrc, alt, subtitle, href } = tile;

  const inner = (
    <div className="flex flex-col overflow-hidden">
      <div className="relative aspect-poster w-full shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image
          src={posterSrc}
          alt={alt}
          fill
          sizes={posterSizes}
          className="object-cover transition-transform scale-(--scale-value)"
          priority={prioritize}
          quality={70}
          placeholder="empty"
          loading={prioritize ? "eager" : "lazy"}
        />
      </div>
      <div className="flex flex-col items-center gap-0.5 px-2 py-2.5 text-center md:px-3 md:py-3">
        <span className="font-cinzel text-sm leading-snug text-foreground md:text-base">
          {alt}
        </span>
        {subtitle ? (
          <span className="font-playfair-display text-[0.6875rem] leading-snug text-foreground md:text-xs">
            {subtitle}
          </span>
        ) : null}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="[--scale-value:1] hover:[--scale-value:1.02]"
        withTransition
      >
        {inner}
      </Link>
    );
  }

  return <div>{inner}</div>;
}
