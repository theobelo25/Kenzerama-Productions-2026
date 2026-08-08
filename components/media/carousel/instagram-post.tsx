"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { InstagramPost } from "@/types";
import Image from "next/image";
import { cn } from "@/lib/utils";

const InstagramPostComponent = ({
  post,
  className,
}: {
  post: InstagramPost;
  className?: string;
}) => {
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

  const previewImageSrc = isVideoPost ? post.thumbnail_url : post.media_url;

  if (!previewImageSrc) {
    return null;
  }

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={linkLabel}
      className={cn("", className)}
    >
      <Card className="relative h-full w-full overflow-hidden">
        <CardContent className="relative h-full w-full p-0">
          <Image
            src={previewImageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 20vw, 33vw"
            className="object-cover"
          />
        </CardContent>
      </Card>
    </a>
  );
};

export default InstagramPostComponent;
