/**
 * Report whether Directus upload files exist on the Docker volume and (optionally)
 * compare counts to `directus_files` in Postgres.
 *
 *   npm run check:directus-uploads-volume
 *   npm run check:directus-uploads-volume -- --volume myproject_directus_uploads
 *   npm run check:directus-uploads-volume -- --no-db
 */

import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const scriptDir =
  typeof import.meta.dirname === "string"
    ? import.meta.dirname
    : dirname(fileURLToPath(import.meta.url));

const repoRoot = resolve(scriptDir, "..");

function run(
  command: string,
  args: string[],
  options: { cwd?: string; inherit?: boolean } = {},
): { status: number | null; stdout: string; stderr: string } {
  const inherit = options.inherit ?? false;
  const r = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    encoding: "utf-8",
    shell: false,
    stdio: inherit ? "inherit" : "pipe",
  });
  const stdout = typeof r.stdout === "string" ? r.stdout : "";
  const stderr = typeof r.stderr === "string" ? r.stderr : "";
  if (!inherit && r.status !== 0 && stderr.trim()) {
    console.error(stderr.trimEnd());
  }
  return { status: r.status, stdout, stderr };
}

function parseArgs(argv: string[]): {
  volumeName: string;
  noDb: boolean;
  database: string;
} {
  let volumeName = "";
  let noDb = false;
  let database =
    process.env.DIRECTUS_DB_DATABASE?.trim() ||
    process.env.POSTGRES_DB?.trim() ||
    "kenzerama";

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--volume") volumeName = argv[++i] ?? "";
    else if (a === "--database") database = argv[++i] ?? database;
    else if (a === "--no-db") noDb = true;
  }

  return { volumeName, noDb, database };
}

function getDirectusContainerId(): string {
  const { status, stdout } = run("docker", ["compose", "ps", "-aq", "directus"]);
  if (status !== 0) return "";
  return stdout
    .split(/\r?\n/)
    .map((s) => s.trim())
    .find(Boolean) ?? "";
}

type InspectMount = { Type?: string; Destination?: string; Name?: string };

async function resolveVolumeFromDirectus(): Promise<string> {
  let cid = getDirectusContainerId();
  if (!cid) {
    console.log("(directus not running; starting for volume discovery…)");
    run("docker", ["compose", "up", "-d", "directus"], { inherit: true });
    cid = getDirectusContainerId();
    for (let i = 0; i < 20 && !cid; i++) {
      await delay(1500);
      cid = getDirectusContainerId();
    }
  }
  if (!cid) {
    throw new Error(
      "No directus container id. Start the stack: docker compose up -d directus",
    );
  }
  const { status, stdout } = run("docker", ["inspect", cid]);
  if (status !== 0 || !stdout) {
    throw new Error(`docker inspect failed for ${cid}`);
  }
  const parsed = JSON.parse(stdout) as Array<{ Mounts?: InspectMount[] }>;
  const row = Array.isArray(parsed) ? parsed[0] : parsed;
  const mount = (row?.Mounts ?? []).find(
    (m) => m.Type === "volume" && m.Destination === "/directus/uploads",
  );
  if (!mount?.Name) {
    throw new Error("No volume mount at /directus/uploads on directus container.");
  }
  return mount.Name;
}

function guessVolumeFromDockerLs(): string | null {
  const { status, stdout } = run("docker", ["volume", "ls", "--format", "{{.Name}}"]);
  if (status !== 0) return null;
  const names = stdout
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((n) => n.endsWith("_directus_uploads"));
  if (names.length === 1) return names[0]!;
  return null;
}

async function main() {
  const { volumeName: volArg, noDb, database } = parseArgs(process.argv.slice(2));

  const composeFile = resolve(repoRoot, "docker-compose.yml");
  if (!existsSync(composeFile)) {
    throw new Error(`docker-compose.yml not found under ${repoRoot}`);
  }

  let volumeName = volArg.trim();
  if (!volumeName) {
    try {
      volumeName = await resolveVolumeFromDirectus();
    } catch {
      const guessed = guessVolumeFromDockerLs();
      if (!guessed) {
        throw new Error(
          "Could not determine uploads volume. Pass --volume <name> (see: docker volume ls).",
        );
      }
      volumeName = guessed;
      console.log(`(using guessed volume from docker volume ls: ${volumeName})`);
    }
  } else {
    const ins = run("docker", ["volume", "inspect", volumeName]);
    if (ins.status !== 0) {
      throw new Error(`Volume not found: ${volumeName}`);
    }
  }

  console.log(`\nVolume: ${volumeName}\n`);

  const countSh =
    "echo -n 'Files on disk (recursive): '; find /data -type f 2>/dev/null | wc -l";
  const sampleSh =
    "echo '--- sample (up to 15 paths under /data) ---'; find /data -type f 2>/dev/null | head -15";

  const count = run("docker", [
    "run",
    "--rm",
    "-v",
    `${volumeName}:/data:ro`,
    "alpine:3.20",
    "sh",
    "-c",
    countSh,
  ]);
  if (count.status !== 0) {
    throw new Error("docker run (count files) failed.");
  }
  console.log(count.stdout.trimEnd());

  const sample = run("docker", [
    "run",
    "--rm",
    "-v",
    `${volumeName}:/data:ro`,
    "alpine:3.20",
    "sh",
    "-c",
    sampleSh,
  ]);
  console.log(sample.stdout.trimEnd());

  if (noDb) {
    console.log("\n(--no-db: skipped Postgres / directus_files counts)\n");
    return;
  }

  console.log("\n--- Postgres (directus_files) ---\n");
  const sql =
    "SELECT COUNT(*) AS file_rows FROM directus_files; " +
    "SELECT id, filename_disk FROM directus_files ORDER BY id DESC LIMIT 5;";
  const db = run("docker", [
    "compose",
    "exec",
    "-T",
    "postgres",
    "psql",
    "-U",
    "postgres",
    "-d",
    database,
    "-c",
    sql,
  ]);
  if (db.status !== 0) {
    console.log(
      "Could not query Postgres (is postgres up? wrong --database?). Use --no-db to skip.\n",
    );
    return;
  }
  console.log(db.stdout.trimEnd());
  console.log(
    "\nIf file_rows > 0 but disk count is 0, restore uploads (npm run restore:directus-uploads-tar).",
  );
  console.log(
    "If disk has files but /assets returns FORBIDDEN, fix Public read on directus_files (or private flag).\n",
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
