import "server-only";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "./admin-session";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export async function getAdminUser(): Promise<string | null> {
  const store = await cookies();
  const session = verifySessionToken(store.get(ADMIN_SESSION_COOKIE)?.value);
  return session?.user ?? null;
}

/**
 * Call at the top of every admin-only Server Action or Route Handler.
 * Server Actions are public HTTP endpoints; the Sanity Studio login does not
 * protect them.
 */
export async function requireAdmin(): Promise<string> {
  const user = await getAdminUser();
  if (!user) throw new UnauthorizedError();
  return user;
}
