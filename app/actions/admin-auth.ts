"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createSessionToken,
  isAdminAuthConfigured,
} from "@/lib/admin-auth";
import { constantTimeStringEquals } from "@/lib/constant-time";
import { failedAdminLogins } from "@/lib/admin-login-limiter";

function clientKey(forwardedFor: string | null): string {
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

export interface LoginResult {
  success: boolean;
  message: string;
}

export async function loginAdmin(
  _previous: LoginResult | null,
  formData: FormData,
): Promise<LoginResult> {
  const expected = process.env.ADMIN_LOGIN_PASSWORD;

  if (!isAdminAuthConfigured() || !expected) {
    return {
      success: false,
      message:
        "Admin access is not configured. Set ADMIN_LOGIN_PASSWORD and ADMIN_SESSION_SECRET.",
    };
  }

  const now = Date.now();
  const key = clientKey((await headers()).get("x-forwarded-for"));

  if (failedAdminLogins.peek(key, now)) {
    return {
      success: false,
      message: "Too many failed attempts. Try again later.",
    };
  }

  const submitted = formData.get("password");
  if (typeof submitted !== "string" || !constantTimeStringEquals(submitted, expected)) {
    failedAdminLogins(key, now);
    return { success: false, message: "Incorrect password." };
  }

  const token = await createSessionToken(now);
  if (!token) {
    return { success: false, message: "Admin session could not be created." };
  }

  // A successful login clears the failure window so a legitimate admin who
  // mistyped a few times is not locked out afterwards.
  failedAdminLogins.reset(key);

  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  redirect("/admin/studio");
}

export async function logoutAdmin(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
