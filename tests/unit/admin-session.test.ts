import crypto from "crypto";
import {
  ADMIN_SESSION_MAX_AGE,
  createSessionToken,
  verifyCredentials,
  verifySessionToken,
} from "../../lib/admin-session";

const SECRET = "a".repeat(32);

function scryptHash(password: string): string {
  const salt = crypto.randomBytes(16);
  const digest = crypto.scryptSync(password, salt, 64);
  return `scrypt:${salt.toString("hex")}:${digest.toString("hex")}`;
}

describe("session tokens", () => {
  const original = process.env.ADMIN_SESSION_SECRET;

  afterEach(() => {
    if (original === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = original;
  });

  it("round-trips a valid token", () => {
    process.env.ADMIN_SESSION_SECRET = SECRET;
    const token = createSessionToken("brewer");
    expect(verifySessionToken(token)).toEqual({ user: "brewer" });
  });

  it("rejects a token signed with a different secret", () => {
    process.env.ADMIN_SESSION_SECRET = SECRET;
    const token = createSessionToken("brewer");
    process.env.ADMIN_SESSION_SECRET = "b".repeat(32);
    expect(verifySessionToken(token)).toBeNull();
  });

  it("rejects a token whose payload was edited", () => {
    process.env.ADMIN_SESSION_SECRET = SECRET;
    const token = createSessionToken("brewer");
    const [, signature] = token.split(".");
    const forged = Buffer.from(
      JSON.stringify({ u: "attacker", exp: Date.now() + 10_000 }),
    ).toString("base64url");
    expect(verifySessionToken(`${forged}.${signature}`)).toBeNull();
  });

  it("rejects an expired token", () => {
    process.env.ADMIN_SESSION_SECRET = SECRET;
    const issuedAt = Date.now() - (ADMIN_SESSION_MAX_AGE + 60) * 1000;
    const token = createSessionToken("brewer", issuedAt);
    expect(verifySessionToken(token)).toBeNull();
  });

  it("rejects malformed and missing tokens", () => {
    process.env.ADMIN_SESSION_SECRET = SECRET;
    expect(verifySessionToken(undefined)).toBeNull();
    expect(verifySessionToken("")).toBeNull();
    expect(verifySessionToken("nodot")).toBeNull();
    expect(verifySessionToken("a.b")).toBeNull();
  });

  it("refuses to sign when the secret is too short", () => {
    process.env.ADMIN_SESSION_SECRET = "short";
    expect(() => createSessionToken("brewer")).toThrow(/ADMIN_SESSION_SECRET/);
    expect(verifySessionToken("anything.here")).toBeNull();
  });
});

describe("verifyCredentials", () => {
  const saved = { ...process.env };

  beforeEach(() => {
    process.env.ADMIN_USERNAME = "brewer";
  });

  afterEach(() => {
    process.env = { ...saved };
  });

  it("accepts a correct scrypt hash", () => {
    process.env.ADMIN_PASSWORD_HASH = scryptHash("correct horse");
    expect(verifyCredentials("brewer", "correct horse")).toBe(true);
  });

  it("rejects a wrong password against a scrypt hash", () => {
    process.env.ADMIN_PASSWORD_HASH = scryptHash("correct horse");
    expect(verifyCredentials("brewer", "wrong horse")).toBe(false);
  });

  it("rejects a wrong username even with the right password", () => {
    process.env.ADMIN_PASSWORD_HASH = scryptHash("correct horse");
    expect(verifyCredentials("intruder", "correct horse")).toBe(false);
  });

  it("accepts a plaintext password fallback", () => {
    process.env.ADMIN_PASSWORD = "plaintext-secret";
    expect(verifyCredentials("brewer", "plaintext-secret")).toBe(true);
    expect(verifyCredentials("brewer", "nope")).toBe(false);
  });

  it("fails closed when no credentials are configured", () => {
    delete process.env.ADMIN_PASSWORD_HASH;
    delete process.env.ADMIN_PASSWORD;
    expect(verifyCredentials("brewer", "anything")).toBe(false);
  });
});
