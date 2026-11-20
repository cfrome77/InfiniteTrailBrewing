import { createRateLimiter } from "../../lib/rate-limit";

describe("createRateLimiter", () => {
  it("allows calls up to the cap, then blocks", () => {
    const limited = createRateLimiter(3, 1000);
    const t = 1_000_000;

    expect(limited("ip", t)).toBe(false);
    expect(limited("ip", t)).toBe(false);
    expect(limited("ip", t)).toBe(false);
    expect(limited("ip", t)).toBe(true);
  });

  it("tracks keys independently", () => {
    const limited = createRateLimiter(1, 1000);
    const t = 1_000_000;

    expect(limited("a", t)).toBe(false);
    expect(limited("b", t)).toBe(false);
    expect(limited("a", t)).toBe(true);
  });

  it("reopens the window once it expires", () => {
    const limited = createRateLimiter(1, 1000);
    const t = 1_000_000;

    expect(limited("ip", t)).toBe(false);
    expect(limited("ip", t + 500)).toBe(true);
    expect(limited("ip", t + 1500)).toBe(false);
  });

  it("peek reports the cap without consuming a slot", () => {
    const limited = createRateLimiter(2, 1000);
    const t = 1_000_000;

    expect(limited.peek("ip", t)).toBe(false);
    limited("ip", t);
    limited("ip", t);
    expect(limited.peek("ip", t)).toBe(true);
    // Peeking must not itself push the count further over.
    expect(limited.peek("ip", t)).toBe(true);
    expect(limited.peek("other", t)).toBe(false);
  });

  it("reset clears the window", () => {
    const limited = createRateLimiter(1, 1000);
    const t = 1_000_000;

    expect(limited("ip", t)).toBe(false);
    expect(limited("ip", t)).toBe(true);
    limited.reset("ip");
    expect(limited("ip", t)).toBe(false);
  });
});
