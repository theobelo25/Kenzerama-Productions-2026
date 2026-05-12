import "dotenv/config";

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  authentication,
  createDirectus,
  rest,
  schemaApply,
  schemaDiff,
  schemaSnapshot,
  staticToken,
  type RestClient,
  type SchemaDiffOutput,
  type SchemaSnapshotOutput,
} from "@directus/sdk";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

const DEFAULT_SNAPSHOT_PATH = "directus/schema.snapshot.yaml";

type ParsedArgs = {
  command?: string;
  flags: Map<string, string | boolean>;
  positionals: string[];
};

type DirectusRole = "source" | "target";

function parseArgs(argv: string[]): ParsedArgs {
  const [, , command, ...rest] = argv;
  const flags = new Map<string, string | boolean>();
  const positionals: string[] = [];

  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];

    if (arg === "--force" || arg === "--dry-run") {
      flags.set(arg.slice(2), true);
      continue;
    }

    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = rest[index + 1];

      if (next && !next.startsWith("--")) {
        flags.set(key, next);
        index += 1;
      } else {
        flags.set(key, true);
      }

      continue;
    }

    positionals.push(arg);
  }

  return { command, flags, positionals };
}

function flagString(
  flags: Map<string, string | boolean>,
  key: string,
): string | undefined {
  const value = flags.get(key);
  return typeof value === "string" ? value.trim() : undefined;
}

function flagBoolean(
  flags: Map<string, string | boolean>,
  key: string,
  envName: string,
): boolean {
  const value = flags.get(key);
  if (value === true) return true;
  if (value === false) return false;

  const env = process.env[envName]?.trim().toLowerCase();
  return env === "1" || env === "true" || env === "yes";
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function resolveEnv(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) {
      return value;
    }
  }

  return undefined;
}

function normalizeDirectusUrl(url: string): string {
  return url.replace(/\/$/, "");
}

function resolveDirectusUrl(role: DirectusRole): string {
  if (role === "source") {
    const url = resolveEnv(
      "SOURCE_DIRECTUS_URL",
      "BASE_DIRECTUS_URL",
      "DIRECTUS_URL",
    );

    if (!url) {
      throw new Error(
        "SOURCE_DIRECTUS_URL, BASE_DIRECTUS_URL, or DIRECTUS_URL is required.",
      );
    }

    return normalizeDirectusUrl(url);
  }

  return normalizeDirectusUrl(requireEnv("TARGET_DIRECTUS_URL"));
}

function resolveSnapshotPath(
  flags: Map<string, string | boolean>,
  positionals: string[],
  options: { allowPositional?: boolean; allowEnvDefault?: boolean } = {},
): string | undefined {
  const fromFlag = flagString(flags, "snapshot");
  const fromEnv = options.allowEnvDefault
    ? process.env.DIRECTUS_SCHEMA_SNAPSHOT_PATH?.trim()
    : undefined;
  const fromPositional =
    options.allowPositional && positionals[0] ? positionals[0].trim() : undefined;

  const raw = fromFlag ?? fromPositional ?? fromEnv;
  return raw ? path.resolve(raw) : undefined;
}

function resolveOutputPath(
  flags: Map<string, string | boolean>,
  key: string,
): string | undefined {
  const value = flagString(flags, key);
  return value ? path.resolve(value) : undefined;
}

function assertSnapshotReady(snapshotPath: string): void {
  const content = readFileSync(snapshotPath, "utf8");

  if (content.trimStart().startsWith("# Directus schema snapshot placeholder.")) {
    throw new Error(
      `Schema snapshot was not exported; replace the placeholder file: ${snapshotPath}`,
    );
  }

  if (!/^version:\s*1\s*$/m.test(content) && !/"version"\s*:\s*1/.test(content)) {
    throw new Error(`Schema snapshot is missing a Directus version header: ${snapshotPath}`);
  }
}

function validateSnapshot(snapshot: SchemaSnapshotOutput): void {
  if (snapshot.version !== 1) {
    throw new Error(`Unsupported schema snapshot version: ${snapshot.version}`);
  }

  if (!Array.isArray(snapshot.collections) || !Array.isArray(snapshot.fields)) {
    throw new Error("Schema snapshot is missing collections or fields.");
  }
}

function loadSnapshotFile(snapshotPath: string): SchemaSnapshotOutput {
  assertSnapshotReady(snapshotPath);

  const content = readFileSync(snapshotPath, "utf8");
  const snapshot = (
    snapshotPath.endsWith(".json")
      ? JSON.parse(content)
      : parseYaml(content)
  ) as SchemaSnapshotOutput;

  validateSnapshot(snapshot);
  return snapshot;
}

function writeSnapshotFile(snapshotPath: string, snapshot: SchemaSnapshotOutput): void {
  const payload = snapshotPath.endsWith(".json")
    ? JSON.stringify(snapshot, null, 2)
    : stringifyYaml(snapshot);

  writeFileSync(snapshotPath, payload, "utf8");
}

function writeDiffFile(diffPath: string, diff: SchemaDiffOutput): void {
  const payload = diffPath.endsWith(".json")
    ? JSON.stringify(diff, null, 2)
    : stringifyYaml(diff);

  writeFileSync(diffPath, payload, "utf8");
}

function loadDiffFile(diffPath: string): SchemaDiffOutput {
  const content = readFileSync(diffPath, "utf8");
  const diff = (
    diffPath.endsWith(".json") ? JSON.parse(content) : parseYaml(content)
  ) as SchemaDiffOutput;

  if (!diff || typeof diff.hash !== "string" || typeof diff.diff !== "object") {
    throw new Error(`Invalid schema diff file: ${diffPath}`);
  }

  return diff;
}

async function createAuthenticatedClient(
  role: DirectusRole,
): Promise<RestClient<unknown>> {
  const url = resolveDirectusUrl(role);
  const rolePrefix = role === "source" ? "SOURCE" : "TARGET";

  const token = resolveEnv(
    `${rolePrefix}_DIRECTUS_TOKEN`,
    role === "source" ? "DIRECTUS_TOKEN" : undefined,
  );
  const email = resolveEnv(
    `${rolePrefix}_DIRECTUS_ADMIN_EMAIL`,
    role === "source" ? "DIRECTUS_ADMIN_EMAIL" : undefined,
  );
  const password = resolveEnv(
    `${rolePrefix}_DIRECTUS_ADMIN_PASSWORD`,
    role === "source" ? "DIRECTUS_ADMIN_PASSWORD" : undefined,
  );

  if (token) {
    return createDirectus(url).with(rest()).with(staticToken(token));
  }

  if (!email || !password) {
    throw new Error(
      `${rolePrefix}_DIRECTUS_TOKEN or ${rolePrefix}_DIRECTUS_ADMIN_EMAIL and ${rolePrefix}_DIRECTUS_ADMIN_PASSWORD are required.`,
    );
  }

  const client = createDirectus(url).with(rest()).with(authentication());
  await client.login({ email, password });
  return client;
}

async function fetchSnapshotFromSource(
  snapshotPath?: string,
): Promise<SchemaSnapshotOutput> {
  if (snapshotPath) {
    console.log(`Loading schema snapshot from ${snapshotPath}`);
    return loadSnapshotFile(snapshotPath);
  }

  const source = await createAuthenticatedClient("source");
  const sourceUrl = resolveDirectusUrl("source");
  console.log(`Retrieving schema snapshot from ${sourceUrl}`);
  const snapshot = await source.request(schemaSnapshot());
  validateSnapshot(snapshot);
  return snapshot;
}

async function createDiff(
  snapshot: SchemaSnapshotOutput,
  force: boolean,
): Promise<SchemaDiffOutput> {
  const target = await createAuthenticatedClient("target");
  const targetUrl = resolveDirectusUrl("target");
  console.log(`Computing schema diff against ${targetUrl}`);
  return target.request(schemaDiff(snapshot, force));
}

async function applyDiff(diff: SchemaDiffOutput, force: boolean): Promise<void> {
  const target = await createAuthenticatedClient("target");
  const targetUrl = resolveDirectusUrl("target");
  console.log(`Applying schema diff to ${targetUrl}`);
  await target.request(schemaApply(diff, force));
  console.log("Schema diff applied.");
}

async function runSnapshot(flags: Map<string, string | boolean>, positionals: string[]): Promise<void> {
  const snapshotPath = resolveSnapshotPath(flags, positionals, {
    allowPositional: true,
  });
  const snapshot = await fetchSnapshotFromSource(snapshotPath);
  const outputPath = resolveOutputPath(flags, "out") ?? path.resolve(DEFAULT_SNAPSHOT_PATH);

  writeSnapshotFile(outputPath, snapshot);
  console.log(`Schema snapshot written to ${outputPath}`);
}

async function runDiff(flags: Map<string, string | boolean>, positionals: string[]): Promise<void> {
  const force = flagBoolean(flags, "force", "DIRECTUS_SCHEMA_FORCE");
  const snapshot = await fetchSnapshotFromSource(
    resolveSnapshotPath(flags, positionals, {
      allowPositional: true,
      allowEnvDefault: true,
    }),
  );
  const diff = await createDiff(snapshot, force);
  const outputPath = resolveOutputPath(flags, "out");

  if (outputPath) {
    writeDiffFile(outputPath, diff);
    console.log(`Schema diff written to ${outputPath}`);
  } else {
    console.log(JSON.stringify(diff, null, 2));
  }
}

async function runApply(flags: Map<string, string | boolean>, positionals: string[]): Promise<void> {
  const force = flagBoolean(flags, "force", "DIRECTUS_SCHEMA_FORCE");
  const diffPath = resolveOutputPath(flags, "diff");

  const diff = diffPath
    ? loadDiffFile(diffPath)
    : await createDiff(
        await fetchSnapshotFromSource(
          resolveSnapshotPath(flags, positionals, {
            allowPositional: true,
            allowEnvDefault: true,
          }),
        ),
        force,
      );

  await applyDiff(diff, force);
}

async function runMigrate(flags: Map<string, string | boolean>, positionals: string[]): Promise<void> {
  const force = flagBoolean(flags, "force", "DIRECTUS_SCHEMA_FORCE");
  const dryRun = flagBoolean(flags, "dry-run", "DIRECTUS_SCHEMA_DRY_RUN");
  const snapshot = await fetchSnapshotFromSource(
    resolveSnapshotPath(flags, positionals, {
      allowPositional: true,
      allowEnvDefault: true,
    }),
  );
  const snapshotOut = resolveOutputPath(flags, "snapshot-out");

  if (snapshotOut) {
    writeSnapshotFile(snapshotOut, snapshot);
    console.log(`Schema snapshot written to ${snapshotOut}`);
  }

  const diff = await createDiff(snapshot, force);
  const diffOut = resolveOutputPath(flags, "diff-out");

  if (diffOut) {
    writeDiffFile(diffOut, diff);
    console.log(`Schema diff written to ${diffOut}`);
  }

  if (dryRun) {
    console.log("Dry run enabled; skipping schema apply.");
    return;
  }

  await applyDiff(diff, force);
}

function printUsage(): void {
  console.error(
    [
      "Usage:",
      "  tsx scripts/directus/schema-migrate.ts migrate [--snapshot <file>] [--dry-run] [--force]",
      "  tsx scripts/directus/schema-migrate.ts snapshot [--snapshot <file>] [--out <file>]",
      "  tsx scripts/directus/schema-migrate.ts diff [--snapshot <file>] [--out <file>] [--force]",
      "  tsx scripts/directus/schema-migrate.ts apply [--snapshot <file> | --diff <file>] [--force]",
      "",
      "migrate:",
      "  snapshot from SOURCE_DIRECTUS_URL (or --snapshot file), diff against TARGET_DIRECTUS_URL, apply",
      "",
      "snapshot:",
      "  export schema from source Directus or copy --snapshot file to --out",
      "",
      "diff:",
      "  compare source snapshot with target Directus and print or write diff",
      "",
      "apply:",
      "  apply a saved diff or compute one from --snapshot and apply to target",
      "",
      "Environment:",
      "  SOURCE_DIRECTUS_URL | BASE_DIRECTUS_URL | DIRECTUS_URL",
      "  TARGET_DIRECTUS_URL",
      "  SOURCE_DIRECTUS_TOKEN | DIRECTUS_TOKEN",
      "  TARGET_DIRECTUS_TOKEN",
      "  SOURCE_DIRECTUS_ADMIN_EMAIL | DIRECTUS_ADMIN_EMAIL",
      "  SOURCE_DIRECTUS_ADMIN_PASSWORD | DIRECTUS_ADMIN_PASSWORD",
      "  TARGET_DIRECTUS_ADMIN_EMAIL",
      "  TARGET_DIRECTUS_ADMIN_PASSWORD",
      "  DIRECTUS_SCHEMA_FORCE=true",
      "  DIRECTUS_SCHEMA_DRY_RUN=true",
      "  DIRECTUS_SCHEMA_SNAPSHOT_PATH",
      "",
      "PowerShell:",
      "  Set variables in .env, or run:",
      "  $env:SOURCE_DIRECTUS_URL = 'http://localhost:8055'",
      "  $env:TARGET_DIRECTUS_URL = 'https://staging.example.com'",
      "  npm run directus:schema:migrate -- --dry-run",
      "",
      "Flags after npm run must follow -- so npm forwards them to the script.",
    ].join("\n"),
  );
}

async function main(): Promise<void> {
  const { command, flags, positionals } = parseArgs(process.argv);

  switch (command) {
    case "migrate":
      await runMigrate(flags, positionals);
      return;
    case "snapshot":
      await runSnapshot(flags, positionals);
      return;
    case "diff":
      await runDiff(flags, positionals);
      return;
    case "apply":
      await runApply(flags, positionals);
      return;
    default:
      printUsage();
      process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Directus schema migration failed:", error);
  process.exitCode = 1;
});
