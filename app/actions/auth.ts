"use server";

import { signIn, signOut } from "@/auth";

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/admin/dashboard" });
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}
