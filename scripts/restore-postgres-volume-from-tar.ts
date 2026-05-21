/**
 * Restore local Docker Compose Postgres `postgres_data` volume from a PGDATA .tgz
 * (same behavior as restore-postgres-volume-from-tar.ps1).
 *
 * Uses Node spawn (no PowerShell) so npm on Windows does not mis-handle quotes or handlers.
 *
 *   npm run restore:postgres-volume-tar -- "C:\path\to\postgres-staging-hipoe5.tgz"
 *   npx tsx scripts/restore-postgres-volume-from-tar.ts --strip 1 "C:\path\to.tgz"
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
  tarPath: string;
  stripComponents: number;
  volumeName: string;
} {
  let tarPath = "";
  let stripComponents = 0;
  let volumeName = "";

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--strip" || a === "--strip-components") {
      stripComponents = Number.parseInt(argv[++i] ?? "0", 10) || 0;
    } else if (a === "--volume") {
      volumeName = argv[++i] ?? "";
    } else if (a === "--tar") {
      tarPath = argv[++i] ?? "";
    } else if (!a.startsWith("-") && !tarPath) {
      tarPath = a;
    }
  }

  if (!tarPath) {
    console.error(
      "Usage: npm run restore:postgres-volume-tar -- <path-to.tgz>\n" +
        "   or: npx tsx scripts/restore-postgres-volume-from-tar.ts [--tar <path>] [--strip N] [--volume NAME]",
    );
    process.exit(1);
  }

  return { tarPath, stripComponents, volumeName };
}

function getPostgresContainerId(): string {
  const { status, stdout } = run("docker", ["compose", "ps", "-aq", "postgres"]);
  if (status !== 0) return "";
  return stdout
    .split(/\r?\n/)
    .map((s) => s.trim())
    .find(Boolean) ?? "";
}

type InspectMount = { Type?: string; Destination?: string; Name?: string };

async function resolvePostgresDataVolumeName(): Promise<string> {
  let cid = getPostgresContainerId();
  if (!cid) {
    console.log("No postgres container yet; running: docker compose up -d postgres");
    run("docker", ["compose", "up", "-d", "postgres"], { inherit: true });
    cid = getPostgresContainerId();
    for (let i = 0; i < 45 && !cid; i++) {
      await delay(2000);
      cid = getPostgresContainerId();
    }
  }
  if (!cid) {
    console.log("--- docker compose ps -a ---");
    run("docker", ["compose", "ps", "-a"], { inherit: true });
    console.log("--- docker compose logs postgres (last 80 lines) ---");
    run("docker", ["compose", "logs", "postgres", "--tail", "80"], {
      inherit: true,
    });
    throw new Error(
      "Could not get a postgres container id. Fix errors above, then retry.",
    );
  }

  const { status, stdout } = run("docker", ["inspect", cid]);
  if (status !== 0 || !stdout) {
    throw new Error(`docker inspect failed for container ${cid}`);
  }
  const parsed = JSON.parse(stdout) as Array<{ Mounts?: InspectMount[] }>;
  const row = Array.isArray(parsed) ? parsed[0] : parsed;
  const mounts = row?.Mounts ?? [];
  const mount = mounts.find(
    (m) => m.Type === "volume" && m.Destination === "/var/lib/postgresql/data",
  );
  if (!mount?.Name) {
    throw new Error(
      `Could not find named volume at /var/lib/postgresql/data on container ${cid}`,
    );
  }
  return mount.Name;
}

async function main() {
  const { tarPath, stripComponents, volumeName: volumeNameArg } = parseArgs(
    process.argv.slice(2),
  );

  if (!existsSync(tarPath)) {
    throw new Error(`Tar not found: ${tarPath}`);
  }

  const composeFile = resolve(repoRoot, "docker-compose.yml");
  if (!existsSync(composeFile)) {
    throw new Error(`docker-compose.yml not found under ${repoRoot}`);
  }

  const resolvedTar = resolve(tarPath);

  let volumeName = volumeNameArg.trim();
  if (!volumeName) {
    volumeName = await resolvePostgresDataVolumeName();
    console.log(`Using postgres data volume: ${volumeName}`);
  } else {
    const ins = run("docker", ["volume", "inspect", volumeName]);
    if (ins.status !== 0) {
      throw new Error(
        `Volume '${volumeName}' not found. Run: docker volume ls\n` +
          "Or omit --volume to auto-detect from the postgres service.",
      );
    }
  }

  console.log("Stopping services...");
  run("docker", ["compose", "stop", "web", "directus", "postgres"]);

  console.log(`Wiping volume ${volumeName} and extracting tarball...`);
  const sh = `find /var/lib/postgresql/data -mindepth 1 -delete; tar xzf /backup.tgz -C /var/lib/postgresql/data --strip-components=${stripComponents}`;
  const extract = run("docker", [
    "run",
    "--rm",
    "-v",
    `${volumeName}:/var/lib/postgresql/data`,
    "-v",
    `${resolvedTar}:/backup.tgz:ro`,
    "alpine:3.20",
    "sh",
    "-c",
    sh,
  ]);
  if (extract.status !== 0) {
    throw new Error(
      "tar extract failed. Adjust --strip (see script header) or check archive.",
    );
  }

  console.log("Fixing ownership for postgres:16-alpine...");
  const chown = run("docker", [
    "run",
    "--rm",
    "--user",
    "root",
    "-v",
    `${volumeName}:/var/lib/postgresql/data`,
    "postgres:16-alpine",
    "chown",
    "-R",
    "postgres:postgres",
    "/var/lib/postgresql/data",
  ]);
  if (chown.status !== 0) {
    throw new Error("chown step failed.");
  }

  console.log("Starting stack...");
  run("docker", ["compose", "up", "-d"], { inherit: true });

  console.log(
    "Done. When Postgres is healthy, open Directus and verify. If Postgres fails to start, PG major version in the backup likely mismatches postgres:16-alpine - check PG_VERSION inside the tar.",
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
