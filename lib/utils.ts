import { Film, InstagramPost, Post } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date and times
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function getRandomItems<T>(arr: T[], numItems: number) {
  // Create a shallow copy of the array to avoid modifying the original
  const shuffled = [...arr];
  let currentIndex = shuffled.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ];
  }

  // Return the first numItems elements of the shuffled array
  return shuffled.slice(0, numItems);
}

// Format errors
/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatError(error: any) {
  return typeof error.message === "string"
    ? error.message
    : JSON.stringify(error.message);
}

export function findStringInObject(obj: any, targetString: string) {
  // Base case: if the current value is a string, check for a match
  if (typeof obj === "string") {
    return obj.includes(targetString); // Or use a regular expression for more complex matching
  }

  // Recursive case: if it's an object or array, iterate and recurse
  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (findStringInObject(obj[key], targetString)) {
          return true; // Found a match in a nested property
        }
      }
    }
  }

  // No match found in this branch
  return false;
}

export function shuffle(array: any) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
export function isValidDate(d: any) {
  return d instanceof Date && !isNaN(d);
}

export function isFilm(obj: any): obj is Film {
  return typeof obj === "object" && obj !== null && obj.type === "film";
}

export function isInstagram(obj: any): obj is InstagramPost {
  return typeof obj === "object" && obj !== null && obj.media_url;
}

export function isBlogPost(obj: any): obj is Post {
  return typeof obj === "object" && obj !== null && obj.type === "post";
}
/* eslint-enable @typescript-eslint/no-explicit-any */
