'use server'

import { cookies } from 'next/headers';

export async function loginAction(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { success: false, error: "Admin password not configured on server." };
  }

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_auth', password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return { success: true };
  }

  return { success: false, error: "Invalid password." };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_auth');
}
