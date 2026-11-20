/**
 * Small in-memory sliding-window limiter.
 *
 * Per-instance only: on a multi-instance deployment each instance counts
 * independently, so this slows abuse rather than enforcing a global quota.
 * Good enough to stop a single client hammering an email-sending endpoint.
 */
export interface RateLimiter {
  /** Records a hit for `key` and reports whether the caller is now over the cap. */
  (key: string, now?: number): boolean;
  /** Reports whether `key` is already at the cap, without recording a hit. */
  peek(key: string, now?: number): boolean;
  /** Clears the window for `key`, e.g. after a successful login. */
  reset(key: string): void;
}

export function createRateLimiter(max: number, windowMs: number): RateLimiter {
  const hits = new Map<string, { count: number; firstAt: number }>();

  const isLimited = (key: string, now = Date.now()): boolean => {
    const entry = hits.get(key);

    if (!entry || now - entry.firstAt > windowMs) {
      hits.set(key, { count: 1, firstAt: now });
      // Keep the map from growing without bound on a long-lived instance.
      if (hits.size > 5000) {
        for (const [k, v] of hits) {
          if (now - v.firstAt > windowMs) hits.delete(k);
        }
      }
      return false;
    }

    entry.count += 1;
    return entry.count > max;
  };

  // Same threshold as the recording path, evaluated before the increment, so
  // "peek" and "call" agree on when the cap is reached.
  isLimited.peek = (key: string, now = Date.now()): boolean => {
    const entry = hits.get(key);
    if (!entry || now - entry.firstAt > windowMs) return false;
    return entry.count >= max;
  };

  isLimited.reset = (key: string) => {
    hits.delete(key);
  };

  return isLimited;
}
