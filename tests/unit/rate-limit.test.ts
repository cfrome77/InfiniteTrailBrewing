import { clientIp, rateLimit } from "../../lib/rate-limit";

describe("rateLimit", () => {
  it("allows requests up to the limit then blocks", () => {
    const key = `test-${Math.random()}`;
    expect(rateLimit(key, 2, 60_000)).toBe(true);
    expect(rateLimit(key, 2, 60_000)).toBe(true);
    expect(rateLimit(key, 2, 60_000)).toBe(false);
  });

  it("keeps buckets independent per key", () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    expect(rateLimit(a, 1, 60_000)).toBe(true);
    expect(rateLimit(a, 1, 60_000)).toBe(false);
    expect(rateLimit(b, 1, 60_000)).toBe(true);
  });

  it("resets once the window elapses", () => {
    const key = `w-${Math.random()}`;
    expect(rateLimit(key, 1, 1)).toBe(true);
    const start = Date.now();
    while (Date.now() - start < 5) {
      // wait out the 1ms window
    }
    expect(rateLimit(key, 1, 1)).toBe(true);
  });
});

function fakeRequest(headers: Record<string, string>): Request {
  return { headers: new Headers(headers) } as unknown as Request;
}

describe("clientIp", () => {
  it("takes the first hop from x-forwarded-for", () => {
    expect(clientIp(fakeRequest({ "x-forwarded-for": "203.0.113.7, 70.41.3.18" }))).toBe(
      "203.0.113.7",
    );
  });

  it("falls back to x-real-ip then to unknown", () => {
    expect(clientIp(fakeRequest({ "x-real-ip": "198.51.100.4" }))).toBe("198.51.100.4");
    expect(clientIp(fakeRequest({}))).toBe("unknown");
  });
});
