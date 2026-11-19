"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createSessionToken,
  verifyCredentials,
} from "@/lib/admin-session";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

async function clientKey(): Promise<string> {
  const store = await headers();
  return (
    store.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    store.get("x-real-ip") ||
    "unknown"
  );
}

function isLockedOut(key: string, now = Date.now()): boolean {
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) return false;
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(key: string, now = Date.now()) {
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export async function login(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const key = await clientKey();

  if (isLockedOut(key)) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  if (!verifyCredentials(username, password)) {
    recordFailure(key);
    return { error: "Invalid username or password." };
  }

  attempts.delete(key);
  const token = createSessionToken(username);
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  redirect("/admin/studio");
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
