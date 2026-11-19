import "server-only";

import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/admin-session";

export {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createSessionToken,
  isAdminAuthConfigured,
  verifySessionToken,
} from "@/lib/admin-session";

/**
 * Throws unless the current request carries a valid admin session cookie.
 * Every privileged Server Action must call this before touching data.
 */
export async function requireAdmin(): Promise<void> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;

  if (!(await verifySessionToken(token))) {
    throw new Error("Unauthorized: admin session required");
  }
}
