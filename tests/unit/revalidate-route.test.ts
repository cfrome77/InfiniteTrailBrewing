/**
 * @jest-environment node
 */
import { POST } from "../../app/api/revalidate/route";
import { verifySanitySignature, extractSlug, isDraftDocument } from "../../lib/sanity-webhook";

const SECRET = "test-revalidate-secret";

jest.mock("server-only", () => ({}));

jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));

jest.mock("../../lib/constant-time", () => ({
  constantTimeStringEquals: (a: string, b: string) => a === b,
}));

const { revalidateTag } = jest.requireMock("next/cache") as {
  revalidateTag: jest.Mock;
};

/**
 * Build a signature header exactly as `@sanity/webhook` does, but with Web
 * Crypto rather than node:crypto so the test does not share an implementation
 * with the code under test.
 */
async function sanitySignature(
  body: string,
  secret = SECRET,
  timestamp = Date.now(),
): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`${timestamp}.${body}`));
  const b64url = Buffer.from(new Uint8Array(sig)).toString("base64url");
  return `t=${timestamp},v1=${b64url}`;
}

async function sanityRequest(payload: unknown, secret = SECRET) {
  const body = JSON.stringify(payload);
  return new Request("http://localhost/api/revalidate", {
    method: "POST",
    headers: { "sanity-webhook-signature": await sanitySignature(body, secret) },
    body,
  });
}

function legacyRequest(payload: unknown, secret = SECRET) {
  const crypto = require("crypto");
  const body = JSON.stringify(payload);
  const signature = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return new Request("http://localhost/api/revalidate", {
    method: "POST",
    headers: { "content-signature": signature },
    body,
  });
}

describe("POST /api/revalidate", () => {
  const originalSecret = process.env.SANITY_REVALIDATE_SECRET;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SANITY_REVALIDATE_SECRET = SECRET;
  });

  afterEach(() => {
    if (originalSecret === undefined) delete process.env.SANITY_REVALIDATE_SECRET;
    else process.env.SANITY_REVALIDATE_SECRET = originalSecret;
  });

  it("fails closed when the secret is not configured", async () => {
    delete process.env.SANITY_REVALIDATE_SECRET;
    jest.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST(await sanityRequest({ _type: "beer" }));

    expect(res.status).toBe(503);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a request with no signature header", async () => {
    const res = await POST(
      new Request("http://localhost/api/revalidate", {
        method: "POST",
        body: JSON.stringify({ _type: "beer" }),
      }),
    );

    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a Sanity signature computed with the wrong secret", async () => {
    const res = await POST(await sanityRequest({ _type: "beer" }, "wrong-secret"));

    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a body altered after signing", async () => {
    const original = JSON.stringify({ _type: "beer" });
    const signature = await sanitySignature(original);

    const res = await POST(
      new Request("http://localhost/api/revalidate", {
        method: "POST",
        headers: { "sanity-webhook-signature": signature },
        body: JSON.stringify({ _type: "post" }),
      }),
    );

    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a malformed signature header", async () => {
    const res = await POST(
      new Request("http://localhost/api/revalidate", {
        method: "POST",
        headers: { "sanity-webhook-signature": "not-a-real-header" },
        body: JSON.stringify({ _type: "beer" }),
      }),
    );

    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a pre-2021 timestamp", async () => {
    const body = JSON.stringify({ _type: "beer" });
    const signature = await sanitySignature(body, SECRET, 1000000000000);

    const res = await POST(
      new Request("http://localhost/api/revalidate", {
        method: "POST",
        headers: { "sanity-webhook-signature": signature },
        body,
      }),
    );

    expect(res.status).toBe(401);
  });

  it("rejects malformed JSON with a 400 rather than a 500", async () => {
    const body = "{not json";
    const signature = await sanitySignature(body);

    const res = await POST(
      new Request("http://localhost/api/revalidate", {
        method: "POST",
        headers: { "sanity-webhook-signature": signature },
        body,
      }),
    );

    expect(res.status).toBe(400);
  });

  it("rejects a document type it does not handle", async () => {
    const res = await POST(await sanityRequest({ _type: "subscriber" }));

    expect(res.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("revalidates beer tags for a signed beer document", async () => {
    const res = await POST(await sanityRequest({ _type: "beer", slug: "trail-ale" }));

    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("beers", "max");
    expect(revalidateTag).toHaveBeenCalledWith("beer:trail-ale", "max");
  });

  it("revalidates post tags for a signed post document", async () => {
    const res = await POST(await sanityRequest({ _type: "post", slug: "brew-day" }));

    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("posts", "max");
    expect(revalidateTag).toHaveBeenCalledWith("post:brew-day", "max");
  });

  it("extracts the slug from Sanity's slug object shape", async () => {
    const res = await POST(
      await sanityRequest({ _type: "beer", slug: { _type: "slug", current: "trail-ale" } }),
    );

    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("beer:trail-ale", "max");
  });

  it("ignores a non-string slug instead of building a corrupt tag", async () => {
    const res = await POST(await sanityRequest({ _type: "beer", slug: { current: 42 } }));

    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("beers", "max");
    expect(revalidateTag).not.toHaveBeenCalledWith(
      expect.stringContaining("[object Object]"),
      "max",
    );
  });

  it("skips revalidation for draft documents", async () => {
    const res = await POST(
      await sanityRequest({ _type: "beer", _id: "drafts.abc", slug: "trail-ale" }),
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ revalidated: false, reason: "draft" });
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("still accepts the legacy content-signature header during migration", async () => {
    const res = await POST(legacyRequest({ _type: "beer", slug: "trail-ale" }));

    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("beers", "max");
  });
});

describe("verifySanitySignature interop", () => {
  // Generated by @sanity/webhook@4.0.4 encodeSignatureHeader, so a change to
  // the signing contract fails here instead of only in production.
  const FIXTURE_BODY = '{"_type":"beer","slug":"trail-ale"}';
  const FIXTURE_SECRET = "fixture-secret";
  const FIXTURE_HEADER = "t=1700000000000,v1=yCM2x_qcn1UZ4Tn7b7ltlhW-s9i0CXYrT8KU9At33Dk";

  it("accepts a header produced by Sanity's own library", () => {
    expect(verifySanitySignature(FIXTURE_BODY, FIXTURE_HEADER, FIXTURE_SECRET)).toEqual({
      ok: true,
    });
  });

  it("rejects that header once the body changes", () => {
    expect(
      verifySanitySignature('{"_type":"post","slug":"trail-ale"}', FIXTURE_HEADER, FIXTURE_SECRET),
    ).toEqual({ ok: false, reason: "mismatch" });
  });

  it("rejects that header under a different secret", () => {
    expect(verifySanitySignature(FIXTURE_BODY, FIXTURE_HEADER, "other-secret")).toEqual({
      ok: false,
      reason: "mismatch",
    });
  });
});

describe("verifySanitySignature", () => {
  it("accepts a correctly signed payload", async () => {
    const body = '{"_type":"beer"}';
    const header = await sanitySignature(body);
    expect(verifySanitySignature(body, header, SECRET)).toEqual({ ok: true });
  });

  it("rejects a signature over a different body", async () => {
    const header = await sanitySignature('{"_type":"beer"}');
    expect(verifySanitySignature('{"_type":"post"}', header, SECRET)).toEqual({
      ok: false,
      reason: "mismatch",
    });
  });

  it("reports malformed headers distinctly from mismatches", () => {
    expect(verifySanitySignature("{}", "v1=abc", SECRET)).toEqual({
      ok: false,
      reason: "malformed",
    });
    expect(verifySanitySignature("{}", null, SECRET)).toEqual({
      ok: false,
      reason: "malformed",
    });
  });
});

describe("webhook payload helpers", () => {
  it("extractSlug handles strings, slug objects, and junk", () => {
    expect(extractSlug("trail-ale")).toBe("trail-ale");
    expect(extractSlug({ _type: "slug", current: "trail-ale" })).toBe("trail-ale");
    expect(extractSlug({ current: "" })).toBeNull();
    expect(extractSlug(undefined)).toBeNull();
    expect(extractSlug(42)).toBeNull();
  });

  it("isDraftDocument only flags draft ids", () => {
    expect(isDraftDocument("drafts.abc")).toBe(true);
    expect(isDraftDocument("abc")).toBe(false);
    expect(isDraftDocument(undefined)).toBe(false);
  });
});
