"use server";

import { cookies } from "next/headers";

export async function login(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", adminPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return { success: true };
  }

  return { success: false, message: "Invalid password" };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_auth");
}
