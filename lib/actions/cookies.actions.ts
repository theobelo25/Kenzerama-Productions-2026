"use server";
import { cookies } from "next/headers";

const HISTORY_KEY = "visited_pages";
const MAX_HISTORY_LENGTH = 5;

export async function getHistory() {
  const cookieStore = await cookies();
  const hasCookie = cookieStore.has(HISTORY_KEY);
  const slugs: string[] = [];

  if (hasCookie) {
    const cookie = cookieStore.get(HISTORY_KEY);
    const history = JSON.parse(cookie!.value);
    history.map((path: string) => {
      slugs.push(path.split("/").pop()!);
    });
  }

  return slugs;
}

export async function addPageToHistory(path: string) {
  const cookieStore = await cookies();
  const hasCookie = cookieStore.has(HISTORY_KEY);

  if (!hasCookie) {
    cookieStore.set(HISTORY_KEY, JSON.stringify([path]));
  } else {
    const cookie = cookieStore.get(HISTORY_KEY)!.value;
    let history = JSON.parse(cookie).filter((p: string) => p !== path);
    history.push(path);

    // Trim length to max
    if (history.length > MAX_HISTORY_LENGTH) {
      history = history.slice(history.length - MAX_HISTORY_LENGTH);
    }

    cookieStore.set(HISTORY_KEY, JSON.stringify(history));
  }

  return {
    success: true,
    message: "Cookie Successfully set",
  };
}
