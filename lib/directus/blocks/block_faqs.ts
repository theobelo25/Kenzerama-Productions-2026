/** One FAQ row from Directus (or nested under a junction). */
export type DirectusFaq = {
  id?: string;
  sort?: number | string | null;
  question?: string | null;
  answer?: string | null;
};

export type DirectusBlockFaqs = {
  id?: string;
  title?: string | null;
  faqs?: unknown[] | null;
};

export type FaqItemProps = {
  id: string;
  sort: number;
  question: string;
  answer: string;
};

export type FaqsProps = {
  id: string;
  title: string;
  items: FaqItemProps[];
};

function parseSort(raw: unknown): number {
  if (raw == null) return 0;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = Number(raw);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function isFaqShape(o: Record<string, unknown>): boolean {
  return typeof o.question === "string" || typeof o.answer === "string";
}

function faqFromDirectusRow(
  row: DirectusFaq,
  index: number,
  linkId?: string,
  linkSort?: number,
): FaqItemProps | null {
  const question = row.question?.trim() ?? "";
  const answer = row.answer?.trim() ?? "";
  if (!question || !answer) return null;

  return {
    id: linkId ?? (row.id != null ? String(row.id) : `faq-${index}`),
    sort: linkSort ?? parseSort(row.sort),
    question,
    answer,
  };
}

function faqFromSlot(row: unknown, index: number): FaqItemProps | null {
  if (row == null || typeof row !== "object") return null;
  const o = row as Record<string, unknown>;

  const fkKeys = ["faqs_id", "faq_id", "questions_id"];

  for (const key of fkKeys) {
    if (!(key in o)) continue;
    const inner = o[key];
    if (inner != null && typeof inner === "object") {
      const linkId = o.id != null ? String(o.id) : undefined;
      const linkSort = parseSort(o.sort);
      return faqFromDirectusRow(inner as DirectusFaq, index, linkId, linkSort);
    }
    if (typeof inner === "string") {
      return null;
    }
  }

  if (isFaqShape(o)) {
    return faqFromDirectusRow(o as DirectusFaq, index);
  }

  for (const val of Object.values(o)) {
    if (val != null && typeof val === "object" && !Array.isArray(val)) {
      const inner = val as Record<string, unknown>;
      if (isFaqShape(inner)) {
        return faqFromDirectusRow(
          val as DirectusFaq,
          index,
          o.id != null ? String(o.id) : undefined,
          parseSort(o.sort),
        );
      }
    }
  }

  return null;
}

export function faqsFromBlockItem(
  item: DirectusBlockFaqs | undefined | null,
): FaqsProps | null {
  if (!item || typeof item !== "object") return null;

  const rows = item.faqs;
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const items: FaqItemProps[] = [];

  for (let i = 0; i < rows.length; i++) {
    const faq = faqFromSlot(rows[i], i);
    if (faq) items.push(faq);
  }

  if (items.length === 0) return null;

  items.sort((a, b) => a.sort - b.sort);

  const blockTitle = item.title?.trim();
  const title =
    blockTitle && blockTitle.length > 0
      ? blockTitle
      : "Frequently Asked Questions";

  return {
    id: String(item.id ?? ""),
    title,
    items,
  };
}
