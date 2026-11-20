/**
 * @jest-environment node
 */
import { loginAdmin } from "../../app/actions/admin-auth";
import { failedAdminLogins } from "../../lib/admin-login-limiter";

const PASSWORD = "correct-horse-battery-staple";

jest.mock("server-only", () => ({}));

jest.mock("next/headers", () => ({
  headers: async () => new Map([["x-forwarded-for", "198.51.100.7"]]),
  cookies: async () => ({ set: jest.fn(), delete: jest.fn() }),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn((url: string) => {
    // Next throws on redirect; mimic that so control flow matches production.
    const err = new Error(`NEXT_REDIRECT:${url}`);
    (err as { digest?: string }).digest = `NEXT_REDIRECT;replace;${url};307;`;
    throw err;
  }),
}));

jest.mock("../../lib/admin-auth", () => ({
  ADMIN_SESSION_COOKIE: "itb_admin",
  ADMIN_SESSION_MAX_AGE: 3600,
  createSessionToken: async () => "signed-token",
  isAdminAuthConfigured: () => true,
}));

function form(password: string): FormData {
  const data = new FormData();
  data.set("password", password);
  return data;
}

async function attempt(password: string) {
  try {
    return await loginAdmin(null, form(password));
  } catch (err) {
    // A redirect means the login succeeded.
    return { success: true, message: "redirect", err };
  }
}

describe("loginAdmin throttling", () => {
  const original = process.env.ADMIN_LOGIN_PASSWORD;

  beforeEach(() => {
    process.env.ADMIN_LOGIN_PASSWORD = PASSWORD;
    jest.spyOn(console, "error").mockImplementation(() => {});
    failedAdminLogins.reset("198.51.100.7");
  });

  afterEach(() => {
    if (original === undefined) delete process.env.ADMIN_LOGIN_PASSWORD;
    else process.env.ADMIN_LOGIN_PASSWORD = original;
    jest.restoreAllMocks();
  });

  it("allows the correct password", async () => {
    const result = await attempt(PASSWORD);
    expect(result.success).toBe(true);
  });

  it("rejects a wrong password", async () => {
    const result = await attempt("nope");
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/incorrect password/i);
  });

  it("throttles after repeated failures", async () => {
    for (let i = 0; i < 5; i++) {
      await attempt("nope");
    }
    const blocked = await attempt("nope");
    expect(blocked.success).toBe(false);
    expect(blocked.message).toMatch(/too many/i);
  });

  it("clears the failure window after a successful login", async () => {
    // Stay below the cap so the login is still allowed.
    for (let i = 0; i < 4; i++) {
      await attempt("nope");
    }

    const result = await attempt(PASSWORD);
    expect(result.success).toBe(true);

    // The earlier failures must no longer count, or the next typo would trip
    // the cap immediately.
    for (let i = 0; i < 4; i++) {
      const again = await attempt("nope");
      expect(again.message).toMatch(/incorrect password/i);
    }
  });

  it("keeps the lockout in place even for the correct password", async () => {
    // Brute-force protection must not be bypassable by finally guessing right.
    for (let i = 0; i < 5; i++) {
      await attempt("nope");
    }

    const result = await attempt(PASSWORD);
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/too many/i);
  });
});
