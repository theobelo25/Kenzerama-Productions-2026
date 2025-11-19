"use client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { InstagramPost } from "@/types";
import HoverVideoPlayer from "react-hover-video-player";

const InstagramPostComponent = ({ post }: { post: InstagramPost }) => {
  return (
    <a href={post.permalink} target="_blank" rel="noopenner noreferrer">
      <Card className="aspect-square rounded-lg border-none overflow-hidden py-0 gap-0 block bg-black">
        <CardContent className="px-0">
          <HoverVideoPlayer
            videoSrc={post.media_url}
            pausedOverlay={
              <Image
                src={post.thumbnail_url}
                alt={"temp"}
                className="w-full h-full"
                height={0}
                width={0}
                sizes="100vw"
              />
            }
          />
        </CardContent>
      </Card>
    </a>
  );
};

export default InstagramPostComponent;
