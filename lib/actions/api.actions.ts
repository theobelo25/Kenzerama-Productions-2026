import { getValidInstagramAccessToken } from "@/lib/services/instagram-token";
import { formatError } from "../utils";

const INSTAGRAM_MEDIA_REVALIDATE_SECONDS = 300;

export async function getInstagramPosts() {
  try {
    const token = await getValidInstagramAccessToken();

    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=media_type,media_url,permalink,thumbnail_url,caption,timestamp&access_token=${token}`,
      { next: { revalidate: INSTAGRAM_MEDIA_REVALIDATE_SECONDS } },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Instagram API error: ${response.status} ${text}`);
    }

    const { data } = await response.json();

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
}

export async function getLatestPost() {
  try {
    const response = await getInstagramPosts();

    if (!response.success) return response;

    return {
      success: true,
      message: "Successfully retrieved instagram posts",
      data: response.data?.[0],
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
