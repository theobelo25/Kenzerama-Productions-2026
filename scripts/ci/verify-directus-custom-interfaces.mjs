import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const extensionsRoot = join(repoRoot, "directus", "extensions");
const schemaPath = join(repoRoot, "directus", "schema.snapshot.yaml");

function readInterfaceIdsFromBundleDist(distPath) {
  const source = readFileSync(distPath, "utf8");
  const ids = new Set();
  for (const match of source.matchAll(/id:"([^"]+)"/g)) {
    ids.add(match[1]);
  }
  return [...ids];
}

function readInterfaceIdsFromPackage(packagePath) {
  const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
  const extension = pkg["directus:extension"];
  if (!extension) {
    return [];
  }

  if (extension.type === "bundle") {
    return (extension.entries ?? [])
      .filter((entry) => entry.type === "interface")
      .map((entry) => entry.name);
  }

  const distPath = join(dirname(packagePath), extension.path ?? "dist/index.js");
  if (!existsSync(distPath)) {
    return [];
  }

  return readInterfaceIdsFromBundleDist(distPath);
}

function collectExtensionInterfaces() {
  const interfaces = new Map();

  for (const folder of readdirSync(extensionsRoot, { withFileTypes: true })) {
    if (!folder.isDirectory()) {
      continue;
    }

    const packagePath = join(extensionsRoot, folder.name, "package.json");
    if (!existsSync(packagePath)) {
      continue;
    }

    for (const id of readInterfaceIdsFromPackage(packagePath)) {
      interfaces.set(id, folder.name);
    }
  }

  return interfaces;
}

function collectSchemaInterfaces() {
  const source = readFileSync(schemaPath, "utf8");
  const interfaces = new Set();

  for (const match of source.matchAll(/^\s+interface:\s+(\S+)\s*$/gm)) {
    const value = match[1];
    if (value !== "null") {
      interfaces.add(value);
    }
  }

  return interfaces;
}

const extensionInterfaces = collectExtensionInterfaces();
const schemaInterfaces = collectSchemaInterfaces();
const missing = [];

for (const interfaceId of schemaInterfaces) {
  const extensionFolder = extensionInterfaces.get(interfaceId);
  if (!extensionFolder) {
    continue;
  }

  const packagePath = join(extensionsRoot, extensionFolder, "package.json");
  const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
  const extension = pkg["directus:extension"];
  const distPaths =
    extension.type === "bundle"
      ? Object.values(extension.path ?? {})
      : [extension.path ?? "dist/index.js"];

  const missingArtifacts = distPaths.filter(
    (relativePath) => !existsSync(join(extensionsRoot, extensionFolder, relativePath)),
  );

  if (missingArtifacts.length > 0) {
    missing.push({
      interfaceId,
      extensionFolder,
      missingArtifacts,
    });
  }
}

if (missing.length > 0) {
  console.error("Schema references custom Directus interfaces without built artifacts:");
  for (const entry of missing) {
    console.error(
      `  - ${entry.interfaceId} (${entry.extensionFolder}): missing ${entry.missingArtifacts.join(", ")}`,
    );
  }
  process.exit(1);
}

const requiredOnRuntime = [...schemaInterfaces].filter((interfaceId) =>
  extensionInterfaces.has(interfaceId),
);

if (requiredOnRuntime.length > 0) {
  console.log(
    `Schema requires custom Directus interfaces: ${requiredOnRuntime.join(", ")}`,
  );
  console.log(
    "Redeploy the Directus runtime from Dockerfile.directus after schema promotion so staging loads these extensions.",
  );
}
