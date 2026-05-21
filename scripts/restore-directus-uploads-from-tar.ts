/**
 * Restore the local Docker Compose Directus uploads volume (`directus_uploads`)
 * from a tarball (e.g. directus-staging-uploads.tgz).
 *
 *   npm run restore:directus-uploads-tar -- "C:\path\to\directus-staging-uploads.tgz"
 *   npx tsx scripts/restore-directus-uploads-from-tar.ts --strip 1 "C:\path\to.tgz"
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
      "Usage: npm run restore:directus-uploads-tar -- <path-to.tgz>\n" +
        "   or: npx tsx scripts/restore-directus-uploads-from-tar.ts [--tar <path>] [--strip N] [--volume NAME]",
    );
    process.exit(1);
  }

  return { tarPath, stripComponents, volumeName };
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

async function resolveDirectusUploadsVolumeName(): Promise<string> {
  let cid = getDirectusContainerId();
  if (!cid) {
    console.log("No directus container yet; running: docker compose up -d directus");
    run("docker", ["compose", "up", "-d", "directus"], { inherit: true });
    cid = getDirectusContainerId();
    for (let i = 0; i < 45 && !cid; i++) {
      await delay(2000);
      cid = getDirectusContainerId();
    }
  }
  if (!cid) {
    console.log("--- docker compose ps -a ---");
    run("docker", ["compose", "ps", "-a"], { inherit: true });
    console.log("--- docker compose logs directus (last 80 lines) ---");
    run("docker", ["compose", "logs", "directus", "--tail", "80"], {
      inherit: true,
    });
    throw new Error(
      "Could not get a directus container id. Fix errors above, then retry.",
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
    (m) => m.Type === "volume" && m.Destination === "/directus/uploads",
  );
  if (!mount?.Name) {
    throw new Error(
      `Could not find named volume at /directus/uploads on container ${cid}`,
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
    volumeName = await resolveDirectusUploadsVolumeName();
    console.log(`Using Directus uploads volume: ${volumeName}`);
  } else {
    const ins = run("docker", ["volume", "inspect", volumeName]);
    if (ins.status !== 0) {
      throw new Error(
        `Volume '${volumeName}' not found. Run: docker volume ls\n` +
          "Or omit --volume to auto-detect from the directus service.",
      );
    }
  }

  console.log("Stopping web and directus (avoid file locks on uploads)...");
  run("docker", ["compose", "stop", "web", "directus"]);

  console.log(`Wiping volume ${volumeName} and extracting tarball...`);
  const sh = `find /data -mindepth 1 -delete; tar xzf /backup.tgz -C /data --strip-components=${stripComponents}`;
  const extract = run("docker", [
    "run",
    "--rm",
    "-v",
    `${volumeName}:/data`,
    "-v",
    `${resolvedTar}:/backup.tgz:ro`,
    "alpine:3.20",
    "sh",
    "-c",
    sh,
  ]);
  if (extract.status !== 0) {
    throw new Error(
      "tar extract failed. Adjust --strip (archive may use a top-level folder) or check the archive.",
    );
  }

  console.log("Fixing ownership for Directus (node:node in official image)...");
  const chown = run("docker", [
    "run",
    "--rm",
    "--user",
    "root",
    "-v",
    `${volumeName}:/uploads`,
    "directus/directus:11",
    "chown",
    "-R",
    "node:node",
    "/uploads",
  ]);
  if (chown.status !== 0) {
    throw new Error("chown step failed.");
  }

  console.log("Starting web and directus...");
  run("docker", ["compose", "up", "-d", "web", "directus"], { inherit: true });

  console.log("Done. Files under /directus/uploads should match the backup.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
