import crypto from "crypto";
import { constantTimeStringEquals } from "@/lib/constant-time";

/**
 * Header Sanity uses for GROQ-powered webhook signatures.
 * @see https://github.com/sanity-io/webhook-toolkit
 */
export const SANITY_SIGNATURE_HEADER = "sanity-webhook-signature";

/** Sanity has only sent signed payloads since 2021-01-01T00:00:00.000Z. */
const MINIMUM_TIMESTAMP = 1609459200000;

/** Format is `t=<unix ms>,v1=<base64url hmac>`. */
const SIGNATURE_HEADER_REGEX = /^t=(\d+)[, ]+v1=([^, ]+)$/;

export type SanitySignatureResult =
  | { ok: true }
  | { ok: false; reason: "malformed" | "mismatch" };

/**
 * Verifies a Sanity webhook signature the way `@sanity/webhook` does:
 * HMAC-SHA256 over `${timestamp}.${rawBody}`, base64url encoded, compared in
 * constant time.
 *
 * The raw request body must be passed through untouched; re-serialising the
 * parsed JSON changes key order and whitespace and will not verify.
 */
export function verifySanitySignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): SanitySignatureResult {
  if (!signatureHeader) return { ok: false, reason: "malformed" };

  const match = signatureHeader.trim().match(SIGNATURE_HEADER_REGEX);
  if (!match) return { ok: false, reason: "malformed" };

  const [, rawTimestamp, provided] = match;
  const timestamp = Number.parseInt(rawTimestamp, 10);
  if (!Number.isFinite(timestamp) || timestamp < MINIMUM_TIMESTAMP) {
    return { ok: false, reason: "malformed" };
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("base64url");

  return constantTimeStringEquals(expected, provided)
    ? { ok: true }
    : { ok: false, reason: "mismatch" };
}

/**
 * Sanity sends the slug as `{ _type: "slug", current: "..." }`. Accept either
 * that or a plain string so a default webhook projection still yields a
 * per-document cache tag.
 */
export function extractSlug(value: unknown): string | null {
  if (typeof value === "string" && value.length > 0) return value;
  if (
    value &&
    typeof value === "object" &&
    typeof (value as { current?: unknown }).current === "string" &&
    (value as { current: string }).current.length > 0
  ) {
    return (value as { current: string }).current;
  }
  return null;
}

/** Draft saves fire on every keystroke in Studio and must not purge the cache. */
export function isDraftDocument(id: unknown): boolean {
  return typeof id === "string" && id.startsWith("drafts.");
}
