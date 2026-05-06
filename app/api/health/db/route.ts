import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const row = await prisma.instagramCredential.findUnique({
      where: { provider: "instagram-basic-display" },
      select: { id: true, expiresAt: true, lastRefreshedAt: true },
    });

    return NextResponse.json({
      ok: true,
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      credentialRowExists: row !== null,
      expiresAt: row?.expiresAt?.toISOString() ?? null,
      lastRefreshedAt: row?.lastRefreshedAt?.toISOString() ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        ok: false,
        hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
        error: message,
      },
      { status: 500 },
    );
  }
}
