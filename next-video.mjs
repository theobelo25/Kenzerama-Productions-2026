import { NextVideo } from "next-video/process";

export const { GET, POST, handler, withNextVideo } = NextVideo({
  // Specify the new folder name here
  folder: "/public/videos",
  // Other next-video config options can be added here
});
