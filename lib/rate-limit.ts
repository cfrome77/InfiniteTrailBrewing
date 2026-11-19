/**
 * Small in-memory sliding-window limiter.
 *
 * Per-instance only: on a multi-instance deployment each instance counts
 * independently, so this slows abuse rather than enforcing a global quota.
 * Good enough to stop a single client hammering an email-sending endpoint.
 */
export function createRateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, { count: number; firstAt: number }>();

  return function isLimited(key: string, now = Date.now()): boolean {
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
}
