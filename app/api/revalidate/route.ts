import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

/**
 * Sanity posts the whole document, so `slug` arrives as `{_type, current}`.
 * Older webhook configs may project it to a string instead; handle both.
 */
function readSlug(payload: Record<string, unknown>): string | null {
  const slug = payload.slug;
  if (typeof slug === "string") return slug;
  if (slug && typeof slug === "object" && "current" in slug) {
    const current = (slug as { current?: unknown }).current;
    if (typeof current === "string") return current;
  }
  return null;
}

export async function POST(req: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    console.error("SANITY_REVALIDATE_SECRET is not configured; refusing to revalidate.");
    return NextResponse.json({ message: "Revalidation is not configured" }, { status: 503 });
  }

  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature) {
    return NextResponse.json({ message: "Missing signature header" }, { status: 401 });
  }

  const body = await req.text();

  if (!(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const type = payload._type;
  if (typeof type !== "string") {
    return NextResponse.json({ message: "Missing document _type" }, { status: 400 });
  }

  const slug = readSlug(payload);
  const revalidated: string[] = [];

  if (type === "beer") {
    revalidateTag("beers", "max");
    revalidated.push("beers");
    if (slug) {
      revalidateTag(`beer:${slug}`, "max");
      revalidated.push(`beer:${slug}`);
    }
  } else if (type === "post") {
    revalidateTag("posts", "max");
    revalidated.push("posts");
    if (slug) {
      revalidateTag(`post:${slug}`, "max");
      revalidated.push(`post:${slug}`);
    }
  }

  return NextResponse.json({
    revalidated: revalidated.length > 0,
    tags: revalidated,
    type,
    slug,
    now: Date.now(),
  });
}
