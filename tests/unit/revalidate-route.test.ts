/**
 * @jest-environment node
 */
import { POST } from "../../app/api/revalidate/route";

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

function signedRequest(payload: unknown, secret = SECRET) {
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

    const res = await POST(signedRequest({ _type: "beer" }));

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

  it("rejects a signature computed with the wrong secret", async () => {
    const res = await POST(signedRequest({ _type: "beer" }, "wrong-secret"));

    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a body that was altered after signing", async () => {
    const crypto = require("crypto");
    const original = JSON.stringify({ _type: "beer" });
    const signature = crypto.createHmac("sha256", SECRET).update(original).digest("hex");

    const res = await POST(
      new Request("http://localhost/api/revalidate", {
        method: "POST",
        headers: { "content-signature": signature },
        body: JSON.stringify({ _type: "post" }),
      }),
    );

    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON with a 400 rather than a 500", async () => {
    const crypto = require("crypto");
    const body = "{not json";
    const signature = crypto.createHmac("sha256", SECRET).update(body).digest("hex");

    const res = await POST(
      new Request("http://localhost/api/revalidate", {
        method: "POST",
        headers: { "content-signature": signature },
        body,
      }),
    );

    expect(res.status).toBe(400);
  });

  it("rejects a document type it does not handle", async () => {
    const res = await POST(signedRequest({ _type: "subscriber" }));

    expect(res.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("revalidates beer tags for a signed beer document", async () => {
    const res = await POST(signedRequest({ _type: "beer", slug: "trail-ale" }));

    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("beers", "max");
    expect(revalidateTag).toHaveBeenCalledWith("beer:trail-ale", "max");
  });

  it("revalidates post tags for a signed post document", async () => {
    const res = await POST(signedRequest({ _type: "post", slug: "brew-day" }));

    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("posts", "max");
    expect(revalidateTag).toHaveBeenCalledWith("post:brew-day", "max");
  });

  it("ignores a non-string slug instead of building a corrupt tag", async () => {
    const res = await POST(signedRequest({ _type: "beer", slug: { current: "x" } }));

    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("beers", "max");
    expect(revalidateTag).not.toHaveBeenCalledWith(
      expect.stringContaining("[object Object]"),
      "max",
    );
  });
});
