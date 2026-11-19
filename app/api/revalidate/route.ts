import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { constantTimeStringEquals } from "@/lib/constant-time";

const REVALIDATABLE_TYPES = new Set(["beer", "post"]);

export async function POST(req: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  // Fail closed: an unset secret would otherwise disable verification entirely
  // and let anyone purge the cache.
  if (!secret) {
    console.error("Revalidation rejected: SANITY_REVALIDATE_SECRET is not configured.");
    return NextResponse.json({ message: "Revalidation is not configured" }, { status: 503 });
  }

  const signature = req.headers.get("content-signature");
  if (!signature) {
    return NextResponse.json({ message: "Missing signature header" }, { status: 401 });
  }

  const body = await req.text();
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");

  if (!constantTimeStringEquals(expected, signature)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  let payload: { _type?: unknown; slug?: unknown };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ message: "Malformed JSON body" }, { status: 400 });
  }

  const { _type, slug } = payload;

  if (typeof _type !== "string" || !REVALIDATABLE_TYPES.has(_type)) {
    return NextResponse.json({ message: "Unsupported document _type" }, { status: 400 });
  }

  // Slug is attacker-influenced only after signature verification, but a
  // non-string would still corrupt the tag, so narrow it before use.
  const tagSlug = typeof slug === "string" && slug.length > 0 ? slug : null;

  if (_type === "beer") {
    revalidateTag("beers", "max");
    if (tagSlug) revalidateTag(`beer:${tagSlug}`, "max");
  } else {
    revalidateTag("posts", "max");
    if (tagSlug) revalidateTag(`post:${tagSlug}`, "max");
  }

  return NextResponse.json({
    revalidated: true,
    type: _type,
    slug: tagSlug,
    now: Date.now(),
  });
}
