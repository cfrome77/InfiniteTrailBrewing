import crypto from "crypto";

export const ADMIN_SESSION_COOKIE = "itb_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

interface SessionPayload {
  u: string;
  exp: number;
}

function getSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return secret;
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

// Hashing both sides keeps the comparison constant-time regardless of length.
function timingSafeEquals(a: string, b: string): boolean {
  const left = crypto.createHash("sha256").update(a).digest();
  const right = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(left, right);
}

export function createSessionToken(user: string, now = Date.now()): string {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  const payload: SessionPayload = { u: user, exp: now + ADMIN_SESSION_MAX_AGE * 1000 };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded, secret)}`;
}

export function verifySessionToken(
  token: string | undefined | null,
  now = Date.now(),
): { user: string } | null {
  const secret = getSecret();
  if (!secret || !token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  if (!timingSafeEquals(signature, sign(encoded, secret))) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()) as SessionPayload;
    if (typeof payload?.u !== "string") return null;
    if (typeof payload?.exp !== "number" || payload.exp < now) return null;
    return { user: payload.u };
  } catch {
    return null;
  }
}

/**
 * Accepts either ADMIN_PASSWORD_HASH ("scrypt:<salt-hex>:<hash-hex>") or a
 * plaintext ADMIN_PASSWORD. The hash form is preferred; plaintext is only
 * supported to keep local setup friction low.
 */
export function verifyCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const plaintext = process.env.ADMIN_PASSWORD;
  if (!expectedUser || (!hash && !plaintext)) return false;

  // Always run both comparisons so a wrong username does not short-circuit faster.
  const userOk = timingSafeEquals(username, expectedUser);

  let passwordOk = false;
  if (hash) {
    const [scheme, salt, digest] = hash.split(":");
    if (scheme === "scrypt" && salt && digest) {
      const derived = crypto.scryptSync(password, Buffer.from(salt, "hex"), 64).toString("hex");
      passwordOk = timingSafeEquals(derived, digest);
    }
  } else if (plaintext) {
    passwordOk = timingSafeEquals(password, plaintext);
  }

  return userOk && passwordOk;
}
