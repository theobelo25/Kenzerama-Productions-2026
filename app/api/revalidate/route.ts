import { resolveDirectusRevalidationTags } from "@/lib/revalidation/directus-webhook";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function isAuthorized(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;

  const headerSecret = req.headers.get("x-revalidate-secret");
  if (headerSecret === secret) return true;

  const authorization = req.headers.get("authorization");
  return authorization === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  if (!process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET is not configured" },
      { status: 503 },
    );
  }

  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const tags = await resolveDirectusRevalidationTags(body);
  if (tags.length === 0) {
    return NextResponse.json(
      { error: "No cache tags resolved from webhook payload" },
      { status: 400 },
    );
  }

  const revalidated = [...new Set(tags)];
  for (const tag of revalidated) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({
    ok: true,
    revalidated,
  });
}
