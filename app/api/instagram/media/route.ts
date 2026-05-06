import { NextResponse } from "next/server";
import { getInstagramPosts } from "@/lib/actions/api.actions";

export async function GET() {
  const result = await getInstagramPosts();
  return NextResponse.json(result);
}
