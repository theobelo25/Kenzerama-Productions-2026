import { prisma } from "@/lib/prisma";
import { saveInstagramCredential } from "@/lib/services/instagram-token";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type ShortLivedResponse = {
  access_token: string;
  user_id: number;
};

type LongLivedResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const clientId = process.env.INSTAGRAM_APP_ID;
  const clientSecret = process.env.INSTAGRAM_APP_SECRET;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code/state" }, { status: 400 });
  }

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: "Missing Instagram env vars" },
      { status: 500 },
    );
  }

  const existingState = await prisma.oAuthState.findUnique({
    where: { state },
  });
  if (!existingState) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  // one-time use state
  await prisma.oAuthState.delete({ where: { state } });

  // 1) Exchange code -> short-lived token
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code,
  });

  const shortRes = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    body,
    cache: "no-store",
  });

  if (!shortRes.ok) {
    const err = await shortRes.text();
    return NextResponse.json(
      { error: `Short-lived exchange failed: ${err}` },
      { status: 400 },
    );
  }

  const shortData = (await shortRes.json()) as ShortLivedResponse;

  // 2) Exchange short-lived -> long-lived token
  const longParams = new URLSearchParams({
    grant_type: "ig_exchange_token",
    client_secret: clientSecret,
    access_token: shortData.access_token,
  });

  const longRes = await fetch(
    `https://graph.instagram.com/access_token?${longParams.toString()}`,
    { method: "GET", cache: "no-store" },
  );

  if (!longRes.ok) {
    const err = await longRes.text();
    return NextResponse.json(
      { error: `Long-lived exchange failed: ${err}` },
      { status: 400 },
    );
  }

  const longData = (await longRes.json()) as LongLivedResponse;

  await saveInstagramCredential({
    accessToken: longData.access_token,
    tokenType: longData.token_type,
    expiresIn: longData.expires_in,
  });

  return NextResponse.redirect(new URL("/?instagram=connected", req.url));
}
