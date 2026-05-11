import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const DEFAULT_SNAPSHOT_PATH = "directus/schema.snapshot.yaml";
const DIRECTUS_CLI = "directus@11";
const DOCKER_SNAPSHOT_PATH = "/tmp/directus-schema-snapshot.yaml";

type RunOptions = {
  env?: NodeJS.ProcessEnv;
  captureStdout?: boolean;
};

function resolveExecutable(command: string): string {
  if (process.platform !== "win32" || path.extname(command)) {
    return command;
  }

  if (command === "npx" || command === "npm") {
    return `${command}.cmd`;
  }

  return command;
}

function run(command: string, args: string[], options: RunOptions = {}): string {
  const result = spawnSync(resolveExecutable(command), args, {
    stdio: options.captureStdout ? "pipe" : "inherit",
    encoding: options.captureStdout ? "utf8" : undefined,
    env: {
      ...process.env,
      NPM_CONFIG_LOGLEVEL: process.env.NPM_CONFIG_LOGLEVEL ?? "error",
      ...options.env,
    },
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  return options.captureStdout ? (result.stdout ?? "").trim() : "";
}

function runNpxDirectus(args: string[], env?: NodeJS.ProcessEnv): void {
  run("npx", ["--yes", DIRECTUS_CLI, ...args], { env });
}

function isDockerDirectusRunning(): boolean {
  const containerId = run(
    "docker",
    ["compose", "ps", "directus", "--status", "running", "-q"],
    { captureStdout: true },
  );

  return containerId.length > 0;
}

function shouldUseDockerRunner(): boolean {
  const explicit = process.env.DIRECTUS_SCHEMA_DOCKER?.trim().toLowerCase();

  if (explicit === "1" || explicit === "true" || explicit === "yes") {
    return true;
  }

  if (explicit === "0" || explicit === "false" || explicit === "no") {
    return false;
  }

  return isDockerDirectusRunning();
}

function runDockerDirectusSnapshot(snapshotPath: string): void {
  const hostSnapshotPath = path.relative(process.cwd(), snapshotPath) || snapshotPath;

  console.log("Exporting Directus schema via docker compose directus service");
  run("docker", [
    "compose",
    "exec",
    "-T",
    "directus",
    "npx",
    "directus",
    "schema",
    "snapshot",
    DOCKER_SNAPSHOT_PATH,
    "--yes",
  ]);
  run("docker", ["compose", "cp", `directus:${DOCKER_SNAPSHOT_PATH}`, hostSnapshotPath]);
}

function directusDbEnv(databaseUrl: string): NodeJS.ProcessEnv {
  return {
    DB_CLIENT: "pg",
    DB_CONNECTION_STRING: databaseUrl,
  };
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function resolveDatabaseUrl(...names: string[]): string {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) {
      return value;
    }
  }

  throw new Error(`One of ${names.join(", ")} is required.`);
}

function assertSnapshotReady(snapshotPath: string): void {
  if (!existsSync(snapshotPath)) {
    throw new Error(`Schema snapshot not found at ${snapshotPath}`);
  }

  const content = readFileSync(snapshotPath, "utf8");
  if (content.trimStart().startsWith("# Directus schema snapshot placeholder.")) {
    throw new Error(
      `Schema snapshot was not exported; replace the placeholder file: ${snapshotPath}`,
    );
  }

  if (!/^version:\s*1\s*$/m.test(content)) {
    throw new Error(`Schema snapshot is missing a Directus version header: ${snapshotPath}`);
  }
}

function backupDatabase(dbUrl: string, outputFile: string): void {
  console.log(`Creating DB backup: ${outputFile}`);
  run("pg_dump", [dbUrl, "-Fc", "-f", outputFile]);
  console.log(`Backup complete: ${outputFile}`);
}

function applySchema(snapshotPath: string): void {
  const customCmd = process.env.DIRECTUS_SCHEMA_APPLY_CMD?.trim();
  if (customCmd) {
    console.log("Running custom schema apply command from DIRECTUS_SCHEMA_APPLY_CMD");
    run("bash", ["-lc", customCmd]);
    return;
  }

  const databaseUrl = resolveDatabaseUrl(
    "STAGING_DIRECTUS_DATABASE_URL",
    "DIRECTUS_DATABASE_URL",
  );

  console.log(`Applying schema from ${snapshotPath}`);
  runNpxDirectus(
    ["schema", "apply", snapshotPath, "--yes"],
    directusDbEnv(databaseUrl),
  );
  console.log("Schema apply completed");
}

function runHealthChecks(dbUrl: string): void {
  run("psql", [dbUrl, "-v", "ON_ERROR_STOP=1", "-c", "SELECT 1;"]);
  run("psql", [
    dbUrl,
    "-v",
    "ON_ERROR_STOP=1",
    "-c",
    "SELECT COUNT(*) FROM directus_collections;",
  ]);
}

function snapshot(snapshotPath: string): void {
  console.log(`Exporting Directus schema to ${snapshotPath}`);

  if (shouldUseDockerRunner()) {
    runDockerDirectusSnapshot(snapshotPath);
  } else {
    const databaseUrl = resolveDatabaseUrl("DIRECTUS_DATABASE_URL", "DATABASE_URL");
    runNpxDirectus(
      ["schema", "snapshot", snapshotPath, "--yes"],
      directusDbEnv(databaseUrl),
    );
  }

  assertSnapshotReady(snapshotPath);
  console.log(`Schema snapshot exported: ${snapshotPath}`);
}

function promoteStaging(snapshotPath: string): void {
  assertSnapshotReady(snapshotPath);

  const stagingDbUrl = requireEnv("STAGING_DB_URL");
  backupDatabase(stagingDbUrl, "staging-backup.dump");
  applySchema(snapshotPath);
  runHealthChecks(stagingDbUrl);
}

function printUsage(): void {
  console.error(
    [
      "Usage:",
      "  tsx scripts/directus/schema-promotion.ts snapshot [schema-file]",
      "  tsx scripts/directus/schema-promotion.ts promote-staging [schema-file]",
      "",
      "snapshot:",
      "  uses docker compose directus when that service is running",
      "  otherwise DIRECTUS_DATABASE_URL or DATABASE_URL",
      "  optional DIRECTUS_SCHEMA_DOCKER=true|false",
      "",
      "promote-staging:",
      "  STAGING_DB_URL",
      "  STAGING_DIRECTUS_DATABASE_URL or DIRECTUS_DATABASE_URL",
      "  optional DIRECTUS_SCHEMA_APPLY_CMD",
    ].join("\n"),
  );
}

function main(): void {
  const [, , command, snapshotArg] = process.argv;
  const snapshotPath = path.resolve(snapshotArg ?? DEFAULT_SNAPSHOT_PATH);

  switch (command) {
    case "snapshot":
      snapshot(snapshotPath);
      return;
    case "promote-staging":
      promoteStaging(snapshotPath);
      return;
    default:
      printUsage();
      process.exitCode = 1;
  }
}

main();
