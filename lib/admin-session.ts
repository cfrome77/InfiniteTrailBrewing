/**
 * Runtime-agnostic admin session tokens.
 *
 * Uses Web Crypto only so the same verification logic works in the Edge
 * middleware and in Node Server Actions. No `node:crypto` import here.
 */

export const ADMIN_SESSION_COOKIE = "itb-admin-session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

interface SessionPayload {
  exp: number;
}

const encoder = new TextEncoder();

export function isAdminAuthConfigured(): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return typeof secret === "string" && secret.length >= 32;
}

function getSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), "="));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmac(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return new Uint8Array(signature);
}

/** Constant-time byte comparison; length mismatch is not timing-safe by nature. */
function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** Returns null when no signing secret is configured, so callers fail closed. */
export async function createSessionToken(now: number = Date.now()): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;

  const payload: SessionPayload = {
    exp: Math.floor(now / 1000) + ADMIN_SESSION_MAX_AGE,
  };
  const encoded = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = toBase64Url(await hmac(secret, encoded));
  return `${encoded}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
  now: number = Date.now(),
): Promise<boolean> {
  const secret = getSecret();
  if (!secret || !token) return false;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return false;

  const encoded = token.slice(0, separator);
  const providedSignature = token.slice(separator + 1);

  let expected: Uint8Array;
  let provided: Uint8Array;
  try {
    expected = await hmac(secret, encoded);
    provided = fromBase64Url(providedSignature);
  } catch {
    return false;
  }

  if (!bytesEqual(expected, provided)) return false;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(fromBase64Url(encoded)),
    ) as SessionPayload;
    return typeof payload?.exp === "number" && payload.exp * 1000 > now;
  } catch {
    return false;
  }
}
