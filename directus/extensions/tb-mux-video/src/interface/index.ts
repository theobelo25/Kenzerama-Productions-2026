import { defineInterface } from "@directus/extensions-sdk";
import InterfaceComponent from "./interface.vue";

export default defineInterface({
  id: "mux-video",
  name: "Mux Video",
  icon: "movie",
  description:
    "Upload a video directly to Mux and store the resulting asset metadata (uploadId, assetId, playbackId).",
  component: InterfaceComponent,
  types: ["json"],
  group: "other",
  recommendedDisplays: ["raw"],
  options: [
    {
      field: "playbackPolicy",
      name: "Playback Policy",
      type: "string",
      meta: {
        width: "half",
        interface: "select-dropdown",
        options: {
          choices: [
            { text: "Public (recommended)", value: "public" },
            { text: "Signed", value: "signed" },
          ],
        },
        note: "Public assets play with just the playback ID. Signed assets require signed JWTs.",
      },
      schema: { default_value: "public" },
    },
    {
      field: "videoQuality",
      name: "Video Quality",
      type: "string",
      meta: {
        width: "half",
        interface: "select-dropdown",
        options: {
          choices: [
            { text: "Basic (smart encoding)", value: "basic" },
            { text: "Plus (premium encoding)", value: "plus" },
          ],
        },
      },
      schema: { default_value: "basic" },
    },
    {
      field: "maxResolution",
      name: "Max Resolution",
      type: "string",
      meta: {
        width: "half",
        interface: "select-dropdown",
        options: {
          choices: [
            { text: "1080p", value: "1080p" },
            { text: "1440p", value: "1440p" },
            { text: "2160p (4K)", value: "2160p" },
          ],
        },
      },
      schema: { default_value: "1080p" },
    },
    {
      field: "mp4Support",
      name: "MP4 Support",
      type: "string",
      meta: {
        width: "half",
        interface: "select-dropdown",
        options: {
          choices: [
            { text: "None (HLS only)", value: "none" },
            { text: "Standard MP4", value: "standard" },
            { text: "Capped 1080p MP4", value: "capped-1080p" },
          ],
        },
        note: "Enable MP4 if you need direct downloadable URLs in addition to HLS.",
      },
      schema: { default_value: "none" },
    },
    {
      field: "accent",
      name: "Player Accent Color",
      type: "string",
      meta: {
        width: "half",
        interface: "select-color",
        note: "Optional. Sets the accent color of the embedded preview player.",
      },
    },
    {
      field: "autoPoll",
      name: "Auto-poll Status",
      type: "boolean",
      meta: {
        width: "half",
        interface: "boolean",
        note: "Automatically poll Mux until the asset is ready after upload.",
      },
      schema: { default_value: true },
    },
  ],
});
