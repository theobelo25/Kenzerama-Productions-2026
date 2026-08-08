import "server-only";

import { cache } from "react";
import { getValidInstagramAccessToken } from "@/lib/services/instagram-token";
import { formatError } from "@/lib/utils";
import type { InstagramPost } from "@/types";

const INSTAGRAM_MEDIA_REVALIDATE_SECONDS = 300;

type InstagramPostsSuccess = {
  success: true;
  message: string;
  data: InstagramPost[];
};

type InstagramPostsFailure = {
  success: false;
  message: string;
  data?: undefined;
};

export type InstagramPostsResult =
  | InstagramPostsSuccess
  | InstagramPostsFailure;

export const getInstagramPosts = async (): Promise<InstagramPostsResult> => {
  try {
    const token = await getValidInstagramAccessToken();

    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=media_type,media_url,permalink,thumbnail_url,caption,timestamp&access_token=${token}`,
      {
        next: {
          revalidate: 300,
        },
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Instagram API error: ${response.status} ${text}`);
    }

    const { data } = (await response.json()) as { data: InstagramPost[] };

    console.log(
      data.map((post) => ({
        type: post.media_type,
        permalink: post.permalink,
        hasThumbnail: !!post.thumbnail_url,
        mediaUrl: post.media_url,
      })),
    );

    return {
      success: true,
      message: "Successfully retrieved instagram posts",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export async function getLatestPost() {
  try {
    const response = await getInstagramPosts();

    if (!response.success) return response;

    return {
      success: true as const,
      message: "Successfully retrieved instagram posts",
      data: response.data[0],
    };
  } catch (error) {
    return {
      success: false as const,
      message: formatError(error),
    };
  }
}
