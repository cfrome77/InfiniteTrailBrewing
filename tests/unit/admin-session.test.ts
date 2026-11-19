/**
 * @jest-environment node
 */
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createSessionToken,
  isAdminAuthConfigured,
  verifySessionToken,
} from "../../lib/admin-session";

const SECRET = "a".repeat(32);

describe("lib/admin-session", () => {
  const originalSecret = process.env.ADMIN_SESSION_SECRET;

  afterEach(() => {
    if (originalSecret === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = originalSecret;
  });

  it("reports configuration state based on secret presence and length", () => {
    delete process.env.ADMIN_SESSION_SECRET;
    expect(isAdminAuthConfigured()).toBe(false);

    process.env.ADMIN_SESSION_SECRET = "too-short";
    expect(isAdminAuthConfigured()).toBe(false);

    process.env.ADMIN_SESSION_SECRET = SECRET;
    expect(isAdminAuthConfigured()).toBe(true);
  });

  it("refuses to mint a token when no secret is configured", async () => {
    delete process.env.ADMIN_SESSION_SECRET;
    await expect(createSessionToken()).resolves.toBeNull();
  });

  it("round-trips a freshly issued token", async () => {
    process.env.ADMIN_SESSION_SECRET = SECRET;

    const token = await createSessionToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
    await expect(verifySessionToken(token)).resolves.toBe(true);
  });

  it("rejects a token signed with a different secret", async () => {
    process.env.ADMIN_SESSION_SECRET = SECRET;
    const token = await createSessionToken();

    process.env.ADMIN_SESSION_SECRET = "b".repeat(32);
    await expect(verifySessionToken(token)).resolves.toBe(false);
  });

  it("rejects a tampered payload", async () => {
    process.env.ADMIN_SESSION_SECRET = SECRET;
    const token = (await createSessionToken())!;
    const [payload, signature] = token.split(".");

    const forgedPayload = Buffer.from(
      JSON.stringify({ exp: 9_999_999_999 }),
      "utf8",
    ).toString("base64url");

    expect(forgedPayload).not.toBe(payload);
    await expect(verifySessionToken(`${forgedPayload}.${signature}`)).resolves.toBe(false);
  });

  it("rejects an expired token", async () => {
    process.env.ADMIN_SESSION_SECRET = SECRET;

    const issuedAt = Date.now() - (ADMIN_SESSION_MAX_AGE + 60) * 1000;
    const token = await createSessionToken(issuedAt);

    await expect(verifySessionToken(token)).resolves.toBe(false);
    // Still valid at a moment inside the window.
    await expect(
      verifySessionToken(token, issuedAt + 1000),
    ).resolves.toBe(true);
  });

  it("rejects malformed and missing tokens without throwing", async () => {
    process.env.ADMIN_SESSION_SECRET = SECRET;

    await expect(verifySessionToken(undefined)).resolves.toBe(false);
    await expect(verifySessionToken(null)).resolves.toBe(false);
    await expect(verifySessionToken("")).resolves.toBe(false);
    await expect(verifySessionToken("no-dot")).resolves.toBe(false);
    await expect(verifySessionToken(".onlysignature")).resolves.toBe(false);
    await expect(verifySessionToken("garbage.!!!not-base64!!!")).resolves.toBe(false);
  });

  it("exposes a cookie name that matches what middleware reads", () => {
    expect(ADMIN_SESSION_COOKIE).toBe("itb-admin-session");
  });
});
