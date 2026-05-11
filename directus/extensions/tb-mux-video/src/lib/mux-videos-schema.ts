/**
 * Directus field definitions for storing Mux Video `Asset` API data plus derived playback
 * fields matching the extension's `/assets` and `/lookup` client payload.
 *
 * @see https://docs.mux.com/api-reference/video#tag/assets
 * @see `@mux/mux-node/resources/video/assets`.Asset
 */

export const MUX_VIDEOS_COLLECTION = "mux_videos";

type RawField = {
  field: string;
  type: string;
  meta: Record<string, unknown>;
  schema?: Record<string, unknown>;
};

function groupAccordion(
  field: string,
  name: string,
  opts: { note?: string; accordionMode?: boolean; start?: "all-closed" | "first-opened" } = {},
): RawField {
  return {
    field,
    type: "alias",
    meta: {
      interface: "group-accordion",
      special: ["alias", "no-data", "group"],
      note: opts.note ?? name,
      width: "full",
      options: {
        accordionMode: opts.accordionMode ?? false,
        start: opts.start ?? "all-closed",
      },
    },
  };
}

function str(
  field: string,
  note: string,
  opts: { maxLength?: number; width?: string } = {},
): RawField {
  return {
    field,
    type: "string",
    meta: {
      interface: "input",
      note,
      width: opts.width ?? "full",
    },
    schema: {
      is_nullable: true,
      ...(opts.maxLength ? { max_length: opts.maxLength } : {}),
    },
  };
}

function floatField(field: string, note: string): RawField {
  return {
    field,
    type: "float",
    meta: {
      interface: "input",
      note,
      width: "half",
    },
    schema: { is_nullable: true },
  };
}

function bool(field: string, note: string): RawField {
  return {
    field,
    type: "boolean",
    meta: {
      interface: "boolean",
      note,
      width: "half",
    },
    schema: { is_nullable: true },
  };
}

function jsonField(field: string, note: string): RawField {
  return {
    field,
    type: "json",
    meta: {
      interface: "input-code",
      note,
      width: "full",
      options: { language: "json", lineNumber: true },
    },
    schema: { is_nullable: true },
  };
}

function muxUploaderField(): RawField {
  return {
    field: "mux_uploader",
    type: "json",
    meta: {
      interface: "mux-video",
      note:
        "Upload to Mux and preview/playback in Directus. Stores upload/asset/playback metadata (extension: tb-mux-video).",
      width: "full",
    },
    schema: { is_nullable: true },
  };
}

/** Primary key: Mux asset id. */
export const muxVideosIdField: RawField = {
  field: "id",
  type: "string",
  meta: {
    interface: "input",
    note: "Mux asset id (same as Asset.id from the Mux API).",
    width: "full",
    readonly: true,
  },
  schema: {
    is_primary_key: true,
    is_unique: true,
    is_nullable: false,
    max_length: 255,
  },
};

export const muxVideosGroupMux = groupAccordion(
  "mux_api",
  "Mux API",
  {
    note: "Raw fields from the Mux Asset API response.",
    accordionMode: true,
    start: "first-opened",
  },
);

export const muxVideosGroupPlayback = groupAccordion(
  "playback_derived",
  "Playback",
  {
    note: "Derived playback fields used by the Directus UI and player preview.",
    accordionMode: true,
    start: "all-closed",
  },
);

export const muxVideosFields: RawField[] = [
  muxUploaderField(),
  muxVideosGroupMux,
  muxVideosGroupPlayback,
  muxVideosIdField,
  str("created_at", "Asset.created_at — Unix timestamp string from Mux."),
  str("encoding_tier", "Deprecated encoding tier (smart | baseline | premium)."),
  str("master_access", "Master access mode: temporary | none."),
  str("max_resolution_tier", "Max resolution tier for encoding (1080p | 1440p | 2160p).", {
  }),
  str("status", "preparing | ready | errored"),
  str("aspect_ratio", 'e.g. "16:9"'),
  floatField("duration", "Duration in seconds."),
  jsonField("errors", "Asset.errors — type and messages."),
  str(
    "ingest_type",
    "on_demand_url | on_demand_direct_upload | on_demand_clip | live_rtmp | live_srt",
    {},
  ),
  bool("is_live", "Whether the source live stream is active."),
  str("live_stream_id", "Live stream id when applicable."),
  jsonField("master", "Master MP4 access object (status, url)."),
  floatField("max_stored_frame_rate", "Max stored frame rate (-1 if unknown)."),
  str(
    "max_stored_resolution",
    "Deprecated stored resolution (Audio only | SD | HD | FHD | UHD).",
    {},
  ),
  jsonField("meta", "Customer meta: title, creator_id, external_id."),
  str("mp4_support", "Legacy MP4 support flags from Mux."),
  jsonField(
    "non_standard_input_reasons",
    "Reasons the input was considered non-standard.",
  ),
  bool("normalize_audio", "Audio loudness normalization."),
  str("passthrough", "Passthrough string from Mux (max 255).", { maxLength: 255 }),
  bool("per_title_encode", "Deprecated per-title encode flag."),
  jsonField("playback_ids", "Array of Mux playback id objects (id, policy, drm_configuration_id)."),
  jsonField("recording_times", "Live recording session segments."),
  str("resolution_tier", "audio-only | 720p | 1080p | 1440p | 2160p"),
  str("source_asset_id", "Source asset when this asset is a clip."),
  jsonField("static_renditions", "Static MP4 renditions status and files."),
  bool("test", "Test asset flag."),
  jsonField("tracks", "Media tracks (video, audio, text) from Mux."),
  str("upload_id", "Direct upload id when created from direct upload."),
  str("video_quality", "basic | plus | premium"),
  jsonField(
    "progress",
    "Ingest progress object (state, progress) when returned by Mux.",
  ),
  str("playback_id", "Resolved playback id used for HLS (extension /lookup payload).", {
  }),
  str("playback_policy", "public | signed | drm — for playback_id."),
  str("playback_url", "HLS manifest URL (e.g. https://stream.mux.com/{id}.m3u8)."),
  str("poster", "Thumbnail image URL (extension-derived)."),
  jsonField("sources", "Player sources array from the extension payload."),
  str("playback_token", "Signed JWT for playback (signed policy only)."),
  str("thumbnail_token", "Signed JWT for poster/thumbnail (signed policy only)."),
  jsonField(
    "vendors",
    "Film detail credits: JSON array of { name, url?, title? } for the public film page.",
  ),
];
