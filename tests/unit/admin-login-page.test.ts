/**
 * @jest-environment node
 */
import fs from "fs";
import path from "path";

/**
 * The login page calls isAdminAuthConfigured(), which reads
 * ADMIN_SESSION_SECRET. If the route is statically prerendered that read is
 * baked in at build time, so a secret supplied only at runtime leaves the page
 * permanently showing "Admin access is not configured" and nobody can sign in.
 * This asserts the opt-out stays in place.
 */
describe("admin login page", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "app/admin/login/page.tsx"),
    "utf8",
  );

  it("opts out of static prerendering", () => {
    expect(source).toMatch(/export\s+const\s+dynamic\s*=\s*["']force-dynamic["']/);
  });

  it("is not marked static or revalidating", () => {
    expect(source).not.toMatch(/export\s+const\s+dynamic\s*=\s*["']force-static["']/);
    expect(source).not.toMatch(/export\s+const\s+revalidate\s*=/);
  });
});

describe("admin route protection", () => {
  const proxy = fs.readFileSync(path.join(process.cwd(), "proxy.ts"), "utf8");

  it("matches the login path so the signed-in redirect can run", () => {
    // The handler branches on /admin/login; if the matcher omits it that branch
    // is unreachable and a signed-in user keeps seeing the form.
    expect(proxy).toMatch(/\/admin\/login/);
    expect(proxy).toMatch(/matcher/);
  });
});
