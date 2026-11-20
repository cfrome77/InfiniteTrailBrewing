import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { constantTimeStringEquals } from "@/lib/constant-time";
import {
  SANITY_SIGNATURE_HEADER,
  extractSlug,
  isDraftDocument,
  verifySanitySignature,
} from "@/lib/sanity-webhook";

const REVALIDATABLE_TYPES = new Set(["beer", "post"]);

export async function POST(req: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  // Fail closed: an unset secret would otherwise disable verification entirely
  // and let anyone purge the cache.
  if (!secret) {
    console.error("Revalidation rejected: SANITY_REVALIDATE_SECRET is not configured.");
    return NextResponse.json({ message: "Revalidation is not configured" }, { status: 503 });
  }

  const body = await req.text();

  const sanitySignature = req.headers.get(SANITY_SIGNATURE_HEADER);
  if (sanitySignature) {
    const result = verifySanitySignature(body, sanitySignature, secret);
    if (!result.ok) {
      return NextResponse.json(
        { message: result.reason === "malformed" ? "Malformed signature header" : "Invalid signature" },
        { status: 401 },
      );
    }
  } else {
    // Legacy header kept so an existing webhook configured against the old
    // format keeps working while it is migrated to Sanity's own signing.
    const legacySignature = req.headers.get("content-signature");
    if (!legacySignature) {
      return NextResponse.json(
        { message: `Missing signature header (${SANITY_SIGNATURE_HEADER})` },
        { status: 401 },
      );
    }

    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
    if (!constantTimeStringEquals(expected, legacySignature)) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
  }

  let payload: { _type?: unknown; _id?: unknown; slug?: unknown };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ message: "Malformed JSON body" }, { status: 400 });
  }

  const { _type, _id } = payload;

  if (typeof _type !== "string" || !REVALIDATABLE_TYPES.has(_type)) {
    return NextResponse.json({ message: "Unsupported document _type" }, { status: 400 });
  }

  // Studio autosaves drafts continuously; purging on those would thrash the
  // cache and serve unapproved copy. Only published documents revalidate.
  if (isDraftDocument(_id)) {
    return NextResponse.json({ revalidated: false, reason: "draft", type: _type });
  }

  // Slug is attacker-influenced only after signature verification, but a
  // non-string would still corrupt the tag, so narrow it before use.
  const tagSlug = extractSlug(payload.slug);

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
