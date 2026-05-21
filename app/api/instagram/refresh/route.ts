import { refreshInstagramTokenIfNeeded } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updated = await refreshInstagramTokenIfNeeded(true);
  return NextResponse.json({
    ok: true,
    expiresAt: updated.expiresAt,
    refreshedAt: updated.lastRefreshedAt,
  });
}
