import { MUX_VIDEOS_COLLECTION, muxVideosFields } from "./mux-videos-schema";

type KnexLike = {
  schema: { hasTable: (name: string) => Promise<boolean> };
};

type KnexQueryBuilder = {
  select: (columns: string) => {
    where: (condition: Record<string, unknown>) => {
      first: () => Promise<{ id?: number } | undefined>;
    };
  };
  where: (condition: Record<string, unknown>) => KnexQueryBuilder & {
    whereIn: (column: string, values: string[]) => {
      update: (patch: Record<string, unknown>) => Promise<number>;
    };
    update: (patch: Record<string, unknown>) => Promise<number>;
  };
};

type KnexDatabase = KnexLike & {
  (table: string): KnexQueryBuilder;
};

type BootstrapContext = {
  services: {
    CollectionsService: new (opts: Record<string, unknown>) => {
      createOne: (payload: Record<string, unknown>) => Promise<unknown>;
      deleteOne: (collection: string) => Promise<unknown>;
    };
    FieldsService: new (opts: Record<string, unknown>) => {
      createField: (collection: string, field: Record<string, unknown>) => Promise<unknown>;
    };
  };
  database: unknown;
  getSchema: () => Promise<{
    collections: Record<string, { fields?: Record<string, unknown> } | undefined>;
  }>;
  logger: {
    info: (msg: string) => void;
    error: (obj: unknown, msg?: string) => void;
  };
};

export async function ensureMuxVideosSchema(ctx: BootstrapContext): Promise<void> {
  const { services, database, getSchema, logger } = ctx;
  const { CollectionsService, FieldsService } = services;
  const knex = database as KnexLike;
  const db = database as KnexDatabase;

  let schema = await getSchema();
  const accountability = null;

  let coll = schema.collections[MUX_VIDEOS_COLLECTION];
  const fieldKeys = coll?.fields ? Object.keys(coll.fields) : [];
  let hasTable = await knex.schema.hasTable(MUX_VIDEOS_COLLECTION);

  /**
   * Data Studio "folder" collections exist in directus_collections but have no physical
   * table and no field metadata. `FieldsService.createField` cannot run on them; delete
   * and recreate as a real table-backed collection.
   */
  if (coll && fieldKeys.length === 0 && !hasTable) {
    logger.info(
      `[mux-video] Removing empty/folder collection "${MUX_VIDEOS_COLLECTION}" so it can be recreated with fields.`,
    );
    const collectionsService = new CollectionsService({
      knex: database,
      schema,
      accountability,
    });
    await collectionsService.deleteOne(MUX_VIDEOS_COLLECTION);
    schema = await getSchema();
    coll = schema.collections[MUX_VIDEOS_COLLECTION];
    hasTable = await knex.schema.hasTable(MUX_VIDEOS_COLLECTION);
  }

  if (!schema.collections[MUX_VIDEOS_COLLECTION]) {
    const collectionsService = new CollectionsService({
      knex: database,
      schema,
      accountability,
    });

    await collectionsService.createOne({
      collection: MUX_VIDEOS_COLLECTION,
      schema: {},
      meta: {
        icon: "movie",
        note:
          "Mux Video assets — fields aligned with the Mux Video Asset API and the tb-mux-video endpoint client payload. Created by the tb-mux-video extension hook.",
        display_template: "{{status}} · {{playback_id}}",
      },
      fields: muxVideosFields,
    });

    logger.info(`[mux-video] Created collection ${MUX_VIDEOS_COLLECTION}`);
  }

  for (const field of muxVideosFields) {
    schema = await getSchema();
    const existing = schema.collections[MUX_VIDEOS_COLLECTION]?.fields ?? {};
    if (existing[field.field]) continue;
    const fieldRow = await db("directus_fields")
      .select("id")
      .where({ collection: MUX_VIDEOS_COLLECTION, field: field.field })
      .first();
    if (fieldRow) continue;

    const fieldsService = new FieldsService({
      knex: database,
      schema,
      accountability,
    });

    await fieldsService.createField(MUX_VIDEOS_COLLECTION, field);
    logger.info(`[mux-video] Added field ${MUX_VIDEOS_COLLECTION}.${field.field}`);
  }

  // Normalize grouping and field sort order (safe to run repeatedly).
  // In Directus, `directus_fields.group` must reference an existing alias "group" field.
  const muxApiGroupField = "mux_api";
  const playbackGroupField = "playback_derived";

  const muxApiFields = [
    "created_at",
    "encoding_tier",
    "master_access",
    "max_resolution_tier",
    "status",
    "aspect_ratio",
    "duration",
    "errors",
    "ingest_type",
    "is_live",
    "live_stream_id",
    "master",
    "max_stored_frame_rate",
    "max_stored_resolution",
    "meta",
    "mp4_support",
    "non_standard_input_reasons",
    "normalize_audio",
    "passthrough",
    "per_title_encode",
    "playback_ids",
    "recording_times",
    "resolution_tier",
    "source_asset_id",
    "static_renditions",
    "test",
    "tracks",
    "upload_id",
    "video_quality",
    "progress",
  ];

  const playbackFields = [
    "playback_id",
    "playback_policy",
    "playback_url",
    "poster",
    "sources",
    "playback_token",
    "thumbnail_token",
  ];

  // 1) Clear old invalid group refs, if any (from earlier revisions).
  await db("directus_fields")
    .where({ collection: MUX_VIDEOS_COLLECTION })
    .whereIn("group", ["mux_api", "playback_derived"])
    .update({ group: null });

  // 2) Apply correct grouping.
  await db("directus_fields")
    .where({ collection: MUX_VIDEOS_COLLECTION })
    .whereIn("field", muxApiFields)
    .update({ group: muxApiGroupField });

  await db("directus_fields")
    .where({ collection: MUX_VIDEOS_COLLECTION })
    .whereIn("field", playbackFields)
    .update({ group: playbackGroupField });

  // 3) Ensure the uploader field uses the custom interface (and stays at the top).
  await db("directus_fields")
    .where({ collection: MUX_VIDEOS_COLLECTION, field: "mux_uploader" })
    .update({ interface: "mux-video", width: "full" });

  // 4) Set a stable sort order for top-level fields and group contents.
  const sortOrder = [
    "mux_uploader",
    "id",
    muxApiGroupField,
    playbackGroupField,
    ...muxApiFields,
    ...playbackFields,
  ];

  for (let i = 0; i < sortOrder.length; i++) {
    await db("directus_fields")
      .where({ collection: MUX_VIDEOS_COLLECTION, field: sortOrder[i] })
      .update({ sort: i + 1 });
  }

  logger.info("[mux-video] Ensured mux_videos field groups + ordering");
}
