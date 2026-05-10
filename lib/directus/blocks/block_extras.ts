export type DirectusExtra = {
  id?: string;
  sort?: number | null;
  name?: string | null;
  price?: string | null;
};

/** Junction row from M2M (block_extras ↔ extras) or inline extra row. */
export type DirectusBlockExtras = {
  id?: string;
  title?: string | null;
  extras?: DirectusExtraJunction[] | DirectusExtra[] | null;
};

export type DirectusExtraJunction = {
  id?: number | string;
  sort?: number | null;
  block_extras_id?: string;
  extras_id?: DirectusExtra | number | string | null;
};

/** Normalized row for {@link ExtraItem} (`name` from Directus → `title`). */
export type ExtraCardProps = {
  title: string;
  price: string;
};

export type ExtrasProps = {
  id: string;
  title: string;
  extras: ExtraCardProps[];
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

function parseExtraRow(row: unknown): {
  sort: number;
  extra: ExtraCardProps | null;
} {
  if (!row || typeof row !== "object") {
    return { sort: 0, extra: null };
  }
  const junction = row as Record<string, unknown>;
  const nested = resolveNestedRecord(junction, "extras_id");
  const payload = nested ?? junction;

  const sortRaw = junction.sort ?? payload.sort;
  const sort =
    typeof sortRaw === "number" && !Number.isNaN(sortRaw) ? sortRaw : 0;

  const title = String(payload.name ?? "").trim();
  const price = String(payload.price ?? "").trim();
  if (!title || !price) return { sort, extra: null };

  return { sort, extra: { title, price } };
}

export function extrasFromBlockItem(
  item: DirectusBlockExtras | undefined | null,
): ExtrasProps | null {
  if (!item || typeof item !== "object") return null;

  const o = item as Record<string, unknown>;
  const raw = o.extras;
  if (!Array.isArray(raw)) return null;

  const extras = [...raw]
    .map(parseExtraRow)
    .sort((a, b) => a.sort - b.sort)
    .map((p) => p.extra)
    .filter((e): e is ExtraCardProps => e !== null);

  if (extras.length === 0) return null;

  return {
    id: String(o.id ?? "").trim() || "extras-block",
    title: String(o.title ?? "").trim(),
    extras,
  };
}
