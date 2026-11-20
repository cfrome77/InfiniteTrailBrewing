import { createRateLimiter } from "@/lib/rate-limit";

/**
 * Caps newsletter signups per client. Lives outside the Server Action file
 * because a `"use server"` module may only export async functions, so the
 * limiter could not be reset from tests there.
 */
export const isSubscribeLimited = createRateLimiter(5, 60 * 60 * 1000);
