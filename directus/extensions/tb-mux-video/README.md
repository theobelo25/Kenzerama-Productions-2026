# tb-mux-video

A Directus 11 bundle extension that adds a **Mux Video** field type to the data model. Editors get a drop-zone that uploads videos *directly to Mux* (no bytes pass through Directus), and the field stores the resulting playback metadata.

## What it ships

| Entry      | Type      | Mount path / id |
| ---------- | --------- | --------------- |
| `mux`      | Endpoint  | `/mux/*`        |
| `mux-video`| Interface | Field interface |

### Endpoint routes

All routes require an authenticated Directus session.

- `POST /mux/uploads` &mdash; create a Mux direct upload, returns `{ id, url }`.
- `GET /mux/uploads/:id` &mdash; resolve an upload to its asset id.
- `GET /mux/assets/:id` &mdash; current asset status, `playbackId`, `duration`, `aspectRatio`, etc.

### Stored value (JSON)

```json
{
  "provider": "mux",
  "status": "ready",
  "providerMetadata": {
    "mux": {
      "uploadId": "bp7ev8NqGQ6j01IHtlW65a8sJqqtW6YocAY6urzpDgnE",
      "assetId":  "h1CfGqqTUAyaSyRjRUkrehcZrySU2Z8wiQdHI012ye01A",
      "playbackId": "kz02rnfBprxnnuZnuWP2KhvZT6lvvau1W15Xxu62fOps"
    }
  },
  "duration": 12.34,
  "aspectRatio": "16:9",
  "maxStoredResolution": "1080p",
  "createdAt": 1762988910240
}
```

This is intentionally compatible with the shape `next-video` produces in `videos/*.mp4.json`, so the Next.js side can reuse the same fields.

## Installing & using

1. **Set Mux credentials** (required for uploads). In `.env`:

   ```bash
   MUX_TOKEN_ID=xxx
   MUX_TOKEN_SECRET=xxx
   ```

   These get forwarded to the `directus` service via `docker-compose.yml`.

2. **Build / rebuild the Directus image** &mdash; the multi-stage build in `Dockerfile.directus` will install the extension's deps and compile `dist/` automatically:

   ```bash
   docker compose build directus
   docker compose up -d directus
   ```

3. **Add a field to a collection** in Settings &rarr; Data Model:
   - Type: **JSON**
   - Interface: **Mux Video**
   - Configure playback policy, video quality, max resolution, MP4 support, etc.

4. **Edit an item** &mdash; drop a video into the field; it streams straight to Mux. The interface polls Mux for asset readiness and saves the playback metadata when ready.

## Local development

The extension uses the `@directus/extensions-sdk` build pipeline.

```bash
cd directus/extensions/tb-mux-video
npm install
npm run build       # one-shot build
npm run dev         # watch mode (rebuilds on save)
```

The build emits two files: `dist/app.js` (interface, runs in the browser) and `dist/api.js` (endpoint, runs in Node). With the Docker image, `dist/` is produced inside the build &mdash; you don't need to commit it (see `.gitignore`).

If you're hot-iterating against a locally running Directus instance instead of Docker, point Directus at this folder via `EXTENSIONS_PATH` or symlink it into the running container's `/directus/extensions`.

## Notes & caveats

- **CORS**: by default the upload endpoint is created with `cors_origin: "*"`. Mux validates this against the request origin during upload. Tighten it server-side if you need to.
- **Signed playback**: the interface assumes public playback IDs for preview. If you select "Signed", you'll need to mint signed JWTs in your app to actually play video; preview in the admin will not work for signed assets without additional wiring.
- **Cleanup on delete**: this extension does not yet delete the Mux asset when the Directus item is deleted. If you want that behavior, add a hook that listens to `items.delete` and calls `mux.video.assets.delete(...)`.
- **Webhooks**: status is currently learned via short-poll from the admin. For long-running uploads you can extend the endpoint with a `POST /mux/webhook` route and have Mux push status changes; the interface already tolerates external updates of the value.
