import "server-only";

import { Resend } from "resend";

let cached: Resend | null = null;

/**
 * Returns a Resend client, or null when RESEND_API_KEY is absent.
 *
 * Constructed lazily: `new Resend(undefined)` throws, which previously crashed
 * the entire action module at import time and took down unrelated actions.
 */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  if (!cached) cached = new Resend(apiKey);
  return cached;
}
