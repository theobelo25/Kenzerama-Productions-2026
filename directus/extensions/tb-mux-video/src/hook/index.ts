import { defineHook } from "@directus/extensions-sdk";
import { ensureMuxVideosSchema } from "../lib/ensure-mux-videos-schema";
import { MUX_VIDEOS_COLLECTION } from "../lib/mux-videos-schema";
import { hydrateMuxVideoPayloadFromUploader } from "../lib/hydrate-mux-video-item";

export default defineHook(({ action, filter }, ctx) => {
  action("server.start", async () => {
    const env = ctx.env as Record<string, string | undefined>;
    const skip =
      env.MUX_EXTENSION_SKIP_MUX_VIDEOS_SCHEMA === "true" ||
      env.MUX_EXTENSION_SKIP_MUX_VIDEOS_SCHEMA === "1";
    if (skip) {
      ctx.logger.info("[mux-video] Skipping MuxVideos schema bootstrap (MUX_EXTENSION_SKIP_MUX_VIDEOS_SCHEMA).");
      return;
    }

    try {
      await ensureMuxVideosSchema(ctx);
    } catch (error) {
      ctx.logger.error({ err: error }, "[mux-video] Failed to ensure mux_videos collection schema");
    }
  });

  filter("items.create", async (payload, meta) => {
    if (meta.collection !== MUX_VIDEOS_COLLECTION) return payload;
    return hydrateMuxVideoPayloadFromUploader({
      payload: (payload ?? {}) as Record<string, unknown>,
      env: ctx.env as Record<string, unknown>,
      logger: { warn: ctx.logger.warn.bind(ctx.logger) },
    });
  });

  filter("items.update", async (payload, meta) => {
    if (meta.collection !== MUX_VIDEOS_COLLECTION) return payload;
    if (!(payload as Record<string, unknown>)?.mux_uploader) return payload;
    return hydrateMuxVideoPayloadFromUploader({
      payload: (payload ?? {}) as Record<string, unknown>,
      env: ctx.env as Record<string, unknown>,
      logger: { warn: ctx.logger.warn.bind(ctx.logger) },
    });
  });
});
