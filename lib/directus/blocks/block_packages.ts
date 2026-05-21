export type DirectusPackage = {
  id?: string;
  name?: string | null;
  price?: string | null;
  package_contents?: string[] | null;
};

/** Junction row from M2M (block_packages ↔ packages) or inline package row. */
export type DirectusBlockPackages = {
  id?: string;
  title?: string | null;
  packages?: DirectusPackageJunction[] | DirectusPackage[] | null;
};

export type DirectusPackageJunction = {
  id?: number | string;
  sort?: number | null;
  block_packages_id?: string;
  packages_id?: DirectusPackage | number | string | null;
};

/** Normalized row for {@link PackageItem} (`name` from Directus → `title`). */
export type PackageCardProps = {
  title: string;
  includes: string[];
  price: string;
};

export type PackagesProps = {
  id: string;
  title: string;
  packages: PackageCardProps[];
};

function resolveNestedRecord(
  row: Record<string, unknown>,
  relationKey: string,
): Record<string, unknown> | null {
  const rel = row[relationKey];
  if (rel == null) return null;
  if (Array.isArray(rel)) {
    const first = rel[0];
    if (first && typeof first === "object" && !Array.isArray(first)) {
      return first as Record<string, unknown>;
    }
    return null;
  }
  if (typeof rel === "object" && !Array.isArray(rel)) {
    return rel as Record<string, unknown>;
  }
  return null;
}

const CONTENT_LINE_KEYS = [
  "content",
  "text",
  "title",
  "label",
  "item",
  "value",
  "line",
  "description",
  "name",
] as const;

function lineFromRecord(o: Record<string, unknown>): string | null {
  for (const key of CONTENT_LINE_KEYS) {
    const v = o[key];
    if (typeof v === "string") {
      const t = v.trim();
      if (t) return t;
    }
  }
  for (const [k, v] of Object.entries(o)) {
    if (k === "id" || k.endsWith("_id")) continue;
    if (typeof v === "string") {
      const t = v.trim();
      if (t) return t;
    }
  }
  return null;
}

/** Single bullet / line from string, object row, or junction row with nested relation. */
function coerceContentLine(entry: unknown): string | null {
  if (typeof entry === "string") {
    const t = entry.trim();
    return t || null;
  }
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
  const row = entry as Record<string, unknown>;
  const direct = lineFromRecord(row);
  if (direct) return direct;
  const nested =
    resolveNestedRecord(row, "contents_id") ??
    resolveNestedRecord(row, "package_contents_id") ??
    resolveNestedRecord(row, "items_id") ??
    resolveNestedRecord(row, "item_id");
  if (nested) {
    const fromNested = lineFromRecord(nested);
    if (fromNested) return fromNested;
  }
  return null;
}

function linesFromArray(raw: unknown[]): string[] {
  const out: string[] = [];
  for (const entry of raw) {
    const line = coerceContentLine(entry);
    if (line) out.push(line);
  }
  return out;
}

function linesFromString(raw: string): string[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return linesFromArray(parsed);
    } catch {
      /* fall through */
    }
  }
  const byNewline = trimmed
    .split(/\r?\n/)
    .map((s) => s.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
  if (byNewline.length > 1) return byNewline;
  const byComma = trimmed.split(",").map((s) => s.trim()).filter(Boolean);
  if (byComma.length > 1) return byComma;
  return trimmed ? [trimmed] : [];
}

/**
 * Reads bullet lists from Directus: string[], repeater objects, JSON strings,
 * CSV/text fields, or common alternate keys (`includes`, `contents`, …).
 */
function includesFromPayload(payload: Record<string, unknown>): string[] {
  const keys = [
    "package_contents",
    "includes",
    "contents",
    "features",
    "items",
    "bullets",
    "lines",
  ] as const;

  for (const key of keys) {
    const raw = payload[key];
    if (raw == null) continue;

    if (Array.isArray(raw)) {
      const lines = linesFromArray(raw);
      if (lines.length > 0) return lines;
      continue;
    }

    if (typeof raw === "string") {
      const lines = linesFromString(raw);
      if (lines.length > 0) return lines;
    }
  }

  return [];
}

function packagePayloadToCard(
  payload: Record<string, unknown>,
): PackageCardProps | null {
  const title = String(payload.name ?? "").trim();
  const price = String(payload.price ?? "").trim();
  if (!title || !price) return null;

  const includes = includesFromPayload(payload);

  return { title, includes, price };
}

function packageFromDirectusRow(row: unknown): {
  sort: number;
  card: PackageCardProps | null;
} {
  if (!row || typeof row !== "object") {
    return { sort: 0, card: null };
  }
  const junction = row as Record<string, unknown>;
  const nested = resolveNestedRecord(junction, "packages_id");
  const payload = nested ?? junction;

  const sortRaw = junction.sort;
  const sort =
    typeof sortRaw === "number" && !Number.isNaN(sortRaw) ? sortRaw : 0;

  const card = packagePayloadToCard(payload);
  return { sort, card };
}

export function packagesFromBlockItem(
  item: DirectusBlockPackages | undefined | null,
): PackagesProps | null {
  if (!item || typeof item !== "object") return null;

  const o = item as Record<string, unknown>;
  const raw = o.packages;
  if (!Array.isArray(raw)) return null;

  const packages = [...raw]
    .map(packageFromDirectusRow)
    .sort((a, b) => a.sort - b.sort)
    .map((p) => p.card)
    .filter((p): p is PackageCardProps => p !== null);

  if (packages.length === 0) return null;

  return {
    id: String(o.id ?? "").trim() || "packages-block",
    title: String(o.title ?? "").trim(),
    packages,
  };
}
