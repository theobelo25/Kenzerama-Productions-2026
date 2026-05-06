import { prisma } from "@/lib/prisma";

const PROVIDER = "instagram-basic-display";
const REFRESH_BUFFER_SECONDS = 3 * 24 * 60 * 60; // refresh ~3 days early

type RefreshResponse = {
  access_token: string;
  token_type?: string;
  expires_in: number;
};

function toExpiresAt(expiresInSeconds: number) {
  return new Date(Date.now() + expiresInSeconds * 1000);
}

function shouldRefresh(expiresAt: Date) {
  const secondsLeft = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
  return secondsLeft <= REFRESH_BUFFER_SECONDS;
}

export async function getStoredInstagramCredential() {
  return prisma.instagramCredential.findUnique({
    where: { provider: PROVIDER },
  });
}

export async function saveInstagramCredential(input: {
  accessToken: string;
  tokenType?: string;
  expiresIn: number;
}) {
  return prisma.instagramCredential.upsert({
    where: { provider: PROVIDER },
    update: {
      accessToken: input.accessToken,
      tokenType: input.tokenType ?? "bearer",
      expiresAt: toExpiresAt(input.expiresIn),
      lastRefreshedAt: new Date(),
    },
    create: {
      provider: PROVIDER,
      accessToken: input.accessToken,
      tokenType: input.tokenType ?? "bearer",
      expiresAt: toExpiresAt(input.expiresIn),
      lastRefreshedAt: new Date(),
    },
  });
}

export async function refreshInstagramTokenIfNeeded(force = false) {
  const existing = await getStoredInstagramCredential();

  if (!existing) {
    throw new Error("No Instagram credential found. Run OAuth connect first.");
  }

  if (!force && !shouldRefresh(existing.expiresAt)) {
    return existing;
  }

  const params = new URLSearchParams({
    grant_type: "ig_refresh_token",
    access_token: existing.accessToken,
  });

  const res = await fetch(
    `https://graph.instagram.com/refresh_access_token?${params.toString()}`,
    { method: "GET", cache: "no-store" },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Instagram refresh failed: ${res.status} ${err}`);
  }

  const data = (await res.json()) as RefreshResponse;

  return saveInstagramCredential({
    accessToken: data.access_token,
    tokenType: data.token_type,
    expiresIn: data.expires_in,
  });
}

export async function getValidInstagramAccessToken() {
  try {
    const cred = await refreshInstagramTokenIfNeeded(false);
    return cred.accessToken;
  } catch (error) {
    const fallbackToken = process.env.INSTAGRAM_APP_TOKEN;
    if (fallbackToken) {
      return fallbackToken;
    }
    throw error;
  }
}
