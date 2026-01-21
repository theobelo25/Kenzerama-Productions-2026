"use client";
import Video from "next-video";
import { cn } from "@/lib/utils";
import type { Asset } from "next-video/dist/assets.js";

const VideoComponent = ({
  video,
  autoplay = true,
  muted = true,
  loop = true,
  playsInline = true,
  controls = false,
  classNames,
}: {
  video: Asset;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  classNames?: string;
}) => {
  return (
    <div className={cn("", classNames)}>
      <Video
        src={video}
        autoplay={autoplay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        controls={controls}
        className="object-contain"
        poster={`https://image.mux.com/${video.providerMetadata?.mux.playbackId}/thumbnail.webp?width=300&time=0`}
      />
    </div>
  );
};

export default VideoComponent;
