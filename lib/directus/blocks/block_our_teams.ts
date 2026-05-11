import { directusAssetsBaseUrl } from "@/lib/directus/custom-poster";

/** One team row from Directus (or nested under a junction). */
export type DirectusTeam = {
  id?: string;
  sort?: number | string | null;
  names?: string | null;
  name?: string | null;
  titles?: string | null;
  title?: string | null;
  description?: string | null;
  content?: string | null;
  bio?: string | null;
  image?: string | number | { id?: string | number | null } | null;
};

export type DirectusBlockOurTeams = {
  id?: string;
  title?: string | null;
  our_teams?: unknown[] | null;
  teams?: unknown[] | null;
  members?: unknown[] | null;
};

export type TeamMemberProps = {
  id: string;
  sort: number;
  name: string;
  title: string;
  about: string;
  imageSrc: string;
};

export type OurTeamsProps = {
  id: string;
  /** Section heading (e.g. “Our Teams”). */
  title: string;
  members: TeamMemberProps[];
};

function fileIdFromRef(raw: unknown): string | undefined {
  if (raw == null || raw === "") return undefined;
  if (typeof raw === "string") return raw.trim() || undefined;
  if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
  if (typeof raw === "object" && raw !== null && "id" in raw) {
    const id = (raw as { id: unknown }).id;
    if (typeof id === "string" && id.trim()) return id.trim();
    if (typeof id === "number" && Number.isFinite(id)) return String(id);
  }
  return undefined;
}

function resolveImageUrl(raw: unknown): string | null {
  if (raw == null) return null;

  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return null;
    if (/^https?:\/\//i.test(s)) return s;
    const base = directusAssetsBaseUrl();
    if (!base) return null;
    return `${base.replace(/\/$/, "")}/assets/${s}`;
  }

  if (typeof raw === "number" && Number.isFinite(raw)) {
    const base = directusAssetsBaseUrl();
    if (!base) return null;
    return `${base.replace(/\/$/, "")}/assets/${raw}`;
  }

  const id = fileIdFromRef(raw);
  if (id) {
    const base = directusAssetsBaseUrl();
    if (!base) return null;
    return `${base.replace(/\/$/, "")}/assets/${id}`;
  }

  return null;
}

function parseSort(raw: unknown): number {
  if (raw == null) return 0;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = Number(raw);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function isTeamShape(o: Record<string, unknown>): boolean {
  return (
    typeof o.names === "string" ||
    typeof o.name === "string" ||
    typeof o.description === "string" ||
    typeof o.content === "string" ||
    o.image != null
  );
}

function teamFromDirectusRow(
  row: DirectusTeam,
  index: number,
  linkId?: string,
  linkSort?: number,
): TeamMemberProps | null {
  const name = row.names?.trim() || row.name?.trim() || "";
  if (!name) return null;

  const title = row.titles?.trim() || row.title?.trim() || "";

  const about =
    row.description?.trim() || row.content?.trim() || row.bio?.trim() || "";
  if (!about) return null;

  const imageSrc = resolveImageUrl(row.image);
  if (!imageSrc) return null;

  return {
    id: linkId ?? (row.id != null ? String(row.id) : `team-${index}`),
    sort: linkSort ?? parseSort(row.sort),
    name,
    title,
    about,
    imageSrc,
  };
}

const TEAM_JUNCTION_FK_KEYS = [
  "our_teams_id",
  "our_team_id",
  "teams_id",
  "team_id",
  "team",
];

/** Resolve one `our_teams[]` / `teams[]` slot (bare row or junction). */
function teamFromSlot(row: unknown, index: number): TeamMemberProps | null {
  if (row == null || typeof row !== "object") return null;
  const o = row as Record<string, unknown>;

  for (const key of TEAM_JUNCTION_FK_KEYS) {
    if (!(key in o)) continue;
    const inner = o[key];
    if (inner != null && typeof inner === "object") {
      const linkId = o.id != null ? String(o.id) : undefined;
      const linkSort = parseSort(o.sort ?? (o as { Sort?: unknown }).Sort);
      return teamFromDirectusRow(
        inner as DirectusTeam,
        index,
        linkId,
        linkSort,
      );
    }
    if (typeof inner === "string") {
      return null;
    }
  }

  if (isTeamShape(o)) {
    return teamFromDirectusRow(o as DirectusTeam, index);
  }

  for (const val of Object.values(o)) {
    if (val != null && typeof val === "object" && !Array.isArray(val)) {
      const inner = val as Record<string, unknown>;
      if (isTeamShape(inner)) {
        return teamFromDirectusRow(
          val as DirectusTeam,
          index,
          o.id != null ? String(o.id) : undefined,
          parseSort(o.sort ?? (o as { Sort?: unknown }).Sort),
        );
      }
    }
  }

  return null;
}

/**
 * Directus M2A `page_content.item` is often nested: `{ block_our_teams: { … } }`.
 * Flat `{ id, title, our_teams }` also appears depending on SDK/version.
 */
function normalizeOurTeamsPayload(item: unknown): DirectusBlockOurTeams | null {
  if (!item || typeof item !== "object") return null;
  const o = item as Record<string, unknown>;

  const nested = o.block_our_teams;
  if (nested != null && typeof nested === "object" && !Array.isArray(nested)) {
    return nested as DirectusBlockOurTeams;
  }

  return o as DirectusBlockOurTeams;
}

function pickTeamRows(item: DirectusBlockOurTeams): unknown[] | null {
  if (Array.isArray(item.our_teams)) return item.our_teams;
  if (Array.isArray(item.teams)) return item.teams;
  if (Array.isArray(item.members)) return item.members;
  return null;
}

export function ourTeamsFromBlockItem(
  item: DirectusBlockOurTeams | Record<string, unknown> | undefined | null,
): OurTeamsProps | null {
  const block = normalizeOurTeamsPayload(item);
  if (!block) return null;

  const rows = pickTeamRows(block);
  if (!rows || rows.length === 0) return null;

  const members: TeamMemberProps[] = [];

  for (let i = 0; i < rows.length; i++) {
    const m = teamFromSlot(rows[i], i);
    if (m) members.push(m);
  }

  if (members.length === 0) return null;

  members.sort((a, b) => a.sort - b.sort);

  const blockTitle = block.title?.trim();
  const title = blockTitle && blockTitle.length > 0 ? blockTitle : "Our Teams";

  return {
    id: String(block.id ?? ""),
    title,
    members,
  };
}
