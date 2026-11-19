/**
 * @jest-environment node
 */
const incr = jest.fn();
const pexpire = jest.fn();

jest.mock("@upstash/redis", () => ({
  Redis: jest.fn().mockImplementation(() => ({ incr, pexpire })),
}));

const ENV = { ...process.env };

async function loadLimiter() {
  // Re-import so module-level Redis caching does not leak between cases.
  let mod!: typeof import("../../lib/rate-limit");
  await jest.isolateModulesAsync(async () => {
    mod = await import("../../lib/rate-limit");
  });
  return mod;
}

beforeEach(() => {
  incr.mockReset();
  pexpire.mockReset();
  pexpire.mockResolvedValue(1);
  process.env = {
    ...ENV,
    UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
    UPSTASH_REDIS_REST_TOKEN: "token",
  };
});

afterEach(() => {
  process.env = { ...ENV };
});

describe("rateLimit with Upstash", () => {
  it("allows requests until the shared counter exceeds the limit", async () => {
    const { rateLimit } = await loadLimiter();

    incr.mockResolvedValueOnce(1).mockResolvedValueOnce(2).mockResolvedValueOnce(3);

    expect(await rateLimit("k", 2, 60_000)).toBe(true);
    expect(await rateLimit("k", 2, 60_000)).toBe(true);
    expect(await rateLimit("k", 2, 60_000)).toBe(false);
  });

  it("sets the TTL only when the counter is first created", async () => {
    const { rateLimit } = await loadLimiter();

    incr.mockResolvedValueOnce(1).mockResolvedValueOnce(2);

    await rateLimit("ttl", 5, 90_000);
    await rateLimit("ttl", 5, 90_000);

    expect(pexpire).toHaveBeenCalledTimes(1);
    expect(pexpire).toHaveBeenCalledWith("ratelimit:ttl", 90_000);
  });

  it("namespaces keys so they cannot collide with application data", async () => {
    const { rateLimit } = await loadLimiter();
    incr.mockResolvedValue(1);

    await rateLimit("contact:1.2.3.4", 5, 60_000);

    expect(incr).toHaveBeenCalledWith("ratelimit:contact:1.2.3.4");
  });

  it("falls back to memory instead of failing when Redis errors", async () => {
    const { rateLimit } = await loadLimiter();
    incr.mockRejectedValue(new Error("connection refused"));
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Still enforces the limit, just locally.
    expect(await rateLimit("degraded", 1, 60_000)).toBe(true);
    expect(await rateLimit("degraded", 1, 60_000)).toBe(false);

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("does not hang when Redis is slow", async () => {
    const { rateLimit } = await loadLimiter();
    incr.mockImplementation(() => new Promise(() => {}));
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await rateLimit("slow", 1, 60_000);

    expect(result).toBe(true);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
