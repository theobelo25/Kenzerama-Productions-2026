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

    console.log("[instagram] media fetch status", {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[instagram] media fetch error body", text);
      throw new Error(`Instagram API error: ${response.status} ${text}`);
    }

    const { data } = await response.json();
    console.log("[instagram] media fetch payload summary", {
      count: Array.isArray(data) ? data.length : 0,
      sampleTypes: Array.isArray(data)
        ? data.slice(0, 5).map((item: { media_type?: string }) => item.media_type ?? "UNKNOWN")
        : [],
    });

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
