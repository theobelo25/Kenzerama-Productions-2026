import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.INSTAGRAM_APP_ID;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Missing INSTAGRAM_APP_ID or INSTAGRAM_REDIRECT_URI" },
      { status: 500 },
    );
  }

  const state = randomUUID();

  await prisma.oAuthState.create({
    data: { state },
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "user_profile,user_media",
    response_type: "code",
    state,
  });

  return NextResponse.redirect(
    `https://api.instagram.com/oauth/authorize?${params.toString()}`,
  );
}
