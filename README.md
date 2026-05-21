# Kenzerama Productions (2026)

Next.js site with Directus CMS. Local development:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker Compose port layouts

| Stack | Compose file | Web | Postgres | Directus | Redis |
| --- | --- | --- | --- | --- | --- |
| Local dev | `docker-compose.yml` | 3000 | 5432 | 8055 | 6379 |
| Staging (+1) | `docker-compose.staging.yml` | 3001 | 5433 | 8056 | 6380 |
| Production / Dokploy (+2) | `docker-compose.production.yml` | 3002 | 5434 | 8057 | 6381 |

Container-internal ports are unchanged; only **host** bindings differ. For **Dokploy** on the same machine as local dev, set **Compose file** to `docker-compose.production.yml` (not the default `docker-compose.yml`).

```bash
docker compose -f docker-compose.production.yml up -d --build
```

---

## Backup, schema snapshots, and migrations

Paths are from the **repository root**. On Windows, prefer **`npm run …`** and **`tsx`** scripts so native CLI addons (for example `isolated-vm`) are not loaded on the host Node version.

### Canonical Directus schema workflow (CLI + YAML + DB)

**Contributors and CI:** use the official **Directus 11 CLI** against PostgreSQL, with **`directus/schema.snapshot.yaml`** as the committed artifact. This matches GitHub Actions.

| Step | What to run |
| --- | --- |
| Export schema from an environment | `npm run directus:schema:snapshot` (`scripts/directus/schema-promotion.ts` → `npx directus@11 schema snapshot`) |
| Apply the committed file to a DB | `bash scripts/directus/apply-schema.sh directus/schema.snapshot.yaml` (requires `DIRECTUS_DATABASE_URL`, or `DIRECTUS_SCHEMA_APPLY_CMD`) |
| Backup staging + apply snapshot (machine) | `npm run directus:schema:promote-staging` (same script family; `pg_dump` then CLI apply) |

Do not hand-edit `directus/schema.snapshot.yaml`; export, review the diff, commit.

### Export the snapshot file (`directus/schema.snapshot.yaml`)

This file is what CI applies to staging/production and what you should commit when the data model changes.

1. Ensure Postgres and Directus can see the DB you want to export (for example `docker compose up -d` for local).
2. Run:

```bash
npm run directus:schema:snapshot
```

- If **`docker compose` has a running `directus` service**, the script exports via **`docker compose exec`** (avoids host `npx directus` / Node ABI issues).
- Otherwise set **`DIRECTUS_DATABASE_URL`** or **`DATABASE_URL`** to a PostgreSQL URL Directus uses, and the script runs the CLI against that DB.

Optional: **`DIRECTUS_SCHEMA_DOCKER=true`** forces the Docker path.

---

### Migrate schema snapshot to **staging**

**GitHub (recommended):** merge or push to **`development`** with an updated `directus/schema.snapshot.yaml`. The workflow **Schema Dev to Staging** backs up staging Postgres, applies the snapshot, builds extensions, and runs checks. Required **staging** environment secrets: `STAGING_DB_URL`, `STAGING_DIRECTUS_DATABASE_URL` (or `STAGING_DIRECTUS_SCHEMA_APPLY_CMD`). The runner must be able to reach Postgres on the network (firewall / allowlist).

**From your machine (same steps as CI):** backup + apply:

```bash
set STAGING_DB_URL=postgresql://...
set STAGING_DIRECTUS_DATABASE_URL=postgresql://...
npm run directus:schema:promote-staging
```

(`scripts/directus/schema-promotion.ts` — `pg_dump` then `directus schema apply` via `scripts/directus/apply-schema.sh`.)

**Apply only** (no backup), if you already have a dump:

```bash
set DIRECTUS_DATABASE_URL=postgresql://...same-as-staging-directus-db...
bash scripts/directus/apply-schema.sh directus/schema.snapshot.yaml
```

Custom apply command (tunnel, bastion, etc.): set **`DIRECTUS_SCHEMA_APPLY_CMD`**; `apply-schema.sh` runs it instead of `npx directus schema apply`.

---

### Migrate schema snapshot to **local**

Point **`DIRECTUS_DATABASE_URL`** at the **same database** your local Directus container uses (see `docker-compose.yml` — typically `postgresql://postgres:postgres@localhost:5432/kenzerama` when Postgres is published on `5432`).

```bash
set DIRECTUS_DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/kenzerama
bash scripts/directus/apply-schema.sh directus/schema.snapshot.yaml
```

Restart Directus after apply if it does not reload schema.

---

### Restore Postgres from a **`.tgz`** into **local Docker** volume

Use when you have a **volume-style** archive of PGDATA (for example Fly.io volume dumps), not a plain `pg_dump` custom-format file.

1. Inspect layout: `tar -tzf your-backup.tgz | head`
2. From repo root:

```bash
npm run restore:postgres-volume-tar -- "C:\path\to\postgres-staging-....tgz"
```

Optional: **`--strip 1`** if paths are nested under a top directory. The script stops Compose, recreates the **`postgres_data`** volume, extracts the archive, fixes ownership, and starts the stack again. The archive should match **PostgreSQL 16** (or change the Postgres image in Compose to match **`PG_VERSION`** inside the tarball).

A PowerShell variant lives at `scripts/restore-postgres-volume-from-tar.ps1`; the **`npm run`** path is the one maintained for CI-friendly quoting.

---

### Restore Postgres from a **`.tgz`** on **staging**

There is **no** separate “upload tar to remote IP” command in this repo. Staging restore depends on **where Postgres runs**:

- **Same layout as local (Docker volume on a host you SSH into):** copy the `.tgz` to that host and run **`npm run restore:postgres-volume-tar`** there against the staging compose project (adjust compose file / service names if they differ).
- **Managed cloud Postgres (RDS, Supabase, etc.):** use the provider’s restore flow or **`pg_restore` / `psql`** from a machine that is allowed to connect — not the volume-tar script.
- **Plain `pg_dump -Fc` file:** use **`pg_restore`** (or `directus database` flows) per PostgreSQL docs, not the volume-tar script.

---

### Restore **Directus uploads** from a **`.tar`**

```bash
npm run restore:directus-uploads-tar -- "C:\path\to\uploads.tar"
```

Targets the **`directus_uploads`** Docker volume used by Compose. See also **`npm run check:directus-uploads-volume`**.

---

### Migrate **content** between environments

Use the **Migration bundle** Directus extension (Settings → migrate, or your deployed module URL): configure **destination base URL**, **static token** (admin), and **scope** (schema, users, content, etc.). It streams progress in the UI.

Dry-run fixtures for a second local stack: see **`docker-compose.migration-dry-run.yml`** and **`npm run directus:migration-dry-run:seed`**.

For **business data** SQL/CSV style exports (not the migration bundle), see **`scripts/db/export-business-data.sh`** and **`scripts/db/import-business-data.sh`**.

---

### Scripts quick reference

| Script / npm script | Role |
| --- | --- |
| `npm run directus:schema:snapshot` | Write `directus/schema.snapshot.yaml` (Docker exec or DB URL). |
| `npm run directus:schema:promote-staging` | `pg_dump` staging + apply snapshot to staging DB. |
| `scripts/directus/apply-schema.sh` | `directus schema apply` (Docker on GHA, else `npx`); honors `DIRECTUS_SCHEMA_APPLY_CMD`. |
| `scripts/ci/apply-directus-schema.sh` | CI: skip if snapshot missing/placeholder; else delegates to `apply-schema.sh`. |
| `npm run restore:postgres-volume-tar` | Replace local Compose Postgres volume from PGDATA `.tgz`. |
| `npm run restore:directus-uploads-tar` | Restore uploads volume from `.tar`. |
| `npm run directus:extensions:build-migration-bundle` | Build vendored migration bundle `dist/`. |

---

### GitHub Actions (schema)

- **PR → `development`:** `schema-pr-checks.yml` validates `directus/schema.snapshot.yaml`.
- **Push `development`:** `promote-dev-to-staging.yml` — backup, apply schema, extension build, health checks.
- **Push `main`:** `promote-staging-to-production.yml` — same pattern for production secrets (`PROD_DB_URL`, `PROD_DIRECTUS_DATABASE_URL` or apply cmd).

Do not edit schema only in staging/production; export from the canonical environment and commit the YAML.
