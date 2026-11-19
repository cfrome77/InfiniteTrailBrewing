/**
 * In-memory fixed-window rate limiter.
 *
 * Per-instance only: on serverless or multi-instance deployments each instance
 * keeps its own counters, so this is a speed bump against casual abuse, not a
 * guarantee. Anything stronger needs an edge/WAF limiter or a shared store.
 */
interface Bucket {
  count: number;
  resetAt: number;
}

const MAX_ENTRIES = 10_000;
const SWEEP_INTERVAL_MS = 60_000;
const buckets = new Map<string, Bucket>();
let lastSweep = 0;

/**
 * A bucket is only overwritten when the same key recurs, so without a sweep
 * every unique IP or email would stay in the Map forever.
 */
function evictExpired(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * The sweep is O(n), so it runs at most once a minute rather than on every
 * call. The size cap bounds a burst of unique keys between sweeps; if it is
 * still exceeded after evicting expired entries, the oldest are dropped.
 */
function evictIfDue(now: number): void {
  if (now - lastSweep >= SWEEP_INTERVAL_MS) {
    evictExpired(now);
    lastSweep = now;
    return;
  }

  if (buckets.size <= MAX_ENTRIES) return;

  evictExpired(now);
  // +1 leaves room for the key about to be inserted, so the map never
  // exceeds MAX_ENTRIES once rateLimit() has stored it.
  let excess = buckets.size - MAX_ENTRIES + 1;
  if (excess <= 0) return;

  for (const key of buckets.keys()) {
    buckets.delete(key);
    if (--excess <= 0) break;
  }
}

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  evictIfDue(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}

/** Current bucket count. Useful for diagnostics and for asserting eviction. */
export function rateLimitBucketCount(): number {
  return buckets.size;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
