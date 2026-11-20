import { createRateLimiter } from "@/lib/rate-limit";

/**
 * Failed admin login attempts per client IP. Lives outside the Server Action
 * file because a `"use server"` module may only export async functions, so the
 * limiter could not be reset from tests there.
 */
export const failedAdminLogins = createRateLimiter(5, 15 * 60 * 1000);
