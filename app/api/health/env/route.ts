import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    nodeEnv: process.env.NODE_ENV ?? "unknown",
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    hasInstagramAppToken: Boolean(process.env.INSTAGRAM_APP_TOKEN),
    hasCronSecret: Boolean(process.env.CRON_SECRET),
  });
}
