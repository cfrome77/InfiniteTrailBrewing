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

const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

const attempts = new Map<string, { count: number; firstAt: number }>();

function clientKey(forwardedFor: string | null): string {
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

function isThrottled(key: string, now: number): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (now - entry.firstAt > ATTEMPT_WINDOW_MS) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(key: string, now: number): void {
  const entry = attempts.get(key);
  if (!entry || now - entry.firstAt > ATTEMPT_WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now });
    return;
  }
  entry.count += 1;
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

  if (isThrottled(key, now)) {
    return {
      success: false,
      message: "Too many failed attempts. Try again later.",
    };
  }

  const submitted = formData.get("password");
  if (typeof submitted !== "string" || !constantTimeStringEquals(submitted, expected)) {
    recordFailure(key, now);
    return { success: false, message: "Incorrect password." };
  }

  const token = await createSessionToken(now);
  if (!token) {
    return { success: false, message: "Admin session could not be created." };
  }

  attempts.delete(key);

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
