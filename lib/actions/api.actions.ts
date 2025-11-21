import { formatError } from "../utils";

export async function getInstagramPosts() {
  try {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=media_url,permalink,thumbnail_url,caption,timestamp&access_token=${process.env.INSTAGRAM_APP_TOKEN}`
    );
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
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=media_url,permalink,thumbnail_url,caption,timestamp&access_token=${process.env.INSTAGRAM_APP_TOKEN}`
    );
    const { data } = await response.json();

    return {
      success: true,
      message: "Successfully retrieved instagram posts",
      data: data[0],
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
