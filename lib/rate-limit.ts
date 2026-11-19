import { Redis } from "@upstash/redis";

/**
 * Fixed-window rate limiter.
 *
 * With Upstash configured the counter lives in Redis, so it is shared across
 * every serverless instance. Without it the limiter falls back to per-process
 * memory: fine for local development, but each instance then keeps its own
 * counters, so it is only a speed bump against casual abuse.
 */
interface Bucket {
  count: number;
  resetAt: number;
}

const MAX_ENTRIES = 10_000;
const SWEEP_INTERVAL_MS = 60_000;
const UPSTASH_TIMEOUT_MS = 1_000;

const buckets = new Map<string, Bucket>();
let lastSweep = 0;

let redis: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redis !== undefined) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

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

function rateLimitInMemory(key: string, limit: number, windowMs: number): boolean {
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

async function rateLimitUpstash(
  client: Redis,
  key: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const redisKey = `ratelimit:${key}`;
  // INCR then EXPIRE (NX) is not atomic, but the failure mode is a bucket that
  // never expires, which is the safe direction. A sliding-window script would
  // be exact at the cost of an extra round trip on every request.
  const count = await client.incr(redisKey);
  if (count === 1) {
    await client.pexpire(redisKey, windowMs);
  }
  return count <= limit;
}

/**
 * The limiter is on the path of public endpoints, so a slow or unreachable
 * Redis must not take the site down. On failure this fails open and falls back
 * to the in-process limiter, which still blocks the obvious bursts.
 */
async function tryUpstash(
  client: Redis,
  key: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  try {
    return await Promise.race([
      rateLimitUpstash(client, key, limit, windowMs),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Upstash timeout")), UPSTASH_TIMEOUT_MS),
      ),
    ]);
  } catch (error) {
    console.error("Upstash rate limit failed; falling back to in-memory:", error);
    return rateLimitInMemory(key, limit, windowMs);
  }
}

export function rateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const client = getRedis();
  if (!client) return Promise.resolve(rateLimitInMemory(key, limit, windowMs));
  return tryUpstash(client, key, limit, windowMs);
}

/** Current in-memory bucket count. Useful for diagnostics and for asserting eviction. */
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
