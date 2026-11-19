/**
 * @jest-environment node
 */
import { rateLimit, rateLimitBucketCount } from "../../lib/rate-limit";

const realNow = Date.now;

afterEach(() => {
  Date.now = realNow;
});

describe("bucket eviction", () => {
  it("drops expired buckets on the next sweep", () => {
    let now = realNow();
    Date.now = () => now;

    // Short window so these expire immediately after we advance the clock.
    for (let i = 0; i < 50; i++) rateLimit(`evict-${i}-${Math.random()}`, 1, 1);
    expect(rateLimitBucketCount()).toBeGreaterThan(0);

    // Past both the window and the sweep interval, so the sweep must run.
    now += 120_000;
    rateLimit("post-sweep", 1, 60_000);

    // Only the fresh key remains; the 50 expired ones are gone.
    expect(rateLimitBucketCount()).toBe(1);
  });

  it("does not sweep on every call", () => {
    let now = realNow();
    Date.now = () => now;

    for (let i = 0; i < 20; i++) rateLimit(`nosweep-${i}-${Math.random()}`, 1, 1);
    const before = rateLimitBucketCount();

    // Advance past the windows but stay inside the sweep interval.
    now += 30_000;
    rateLimit("still-within-interval", 1, 60_000);

    // The expired entries are still present because the sweep is not due yet.
    expect(rateLimitBucketCount()).toBe(before + 1);
  });

  it("keeps the map bounded when many unique keys arrive at once", () => {
    const now = realNow();
    Date.now = () => now;

    for (let i = 0; i < 12_000; i++) rateLimit(`burst-${i}`, 1, 60_000);

    expect(rateLimitBucketCount()).toBeLessThanOrEqual(10_000);
  });
});
