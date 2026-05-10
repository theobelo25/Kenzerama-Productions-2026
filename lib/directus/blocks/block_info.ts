export type DirectusBlockInfo = {
  id?: string;
  title?: string | null;
  description?: string | null;
};

export type InfoBlockProps = {
  id: string;
  title: string;
  description: string;
};

export function infoBlockFromBlockItem(
  item: DirectusBlockInfo | undefined | null,
): InfoBlockProps | null {
  if (!item || typeof item !== "object") return null;

  const o = item as Record<string, unknown>;
  const raw = o.description;
  const description = typeof raw === "string" ? raw.trim() : "";
  if (!description) return null;

  return {
    id: String(o.id ?? "").trim() || "info-block",
    title: String(o.title ?? "").trim(),
    description,
  };
}
