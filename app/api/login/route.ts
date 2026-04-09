"use server";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // store in .env

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const supabase = createClient();

  const { data: user, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "8h",
  });

  const response = NextResponse.json({ success: true });
  // Set HttpOnly cookie so client cannot tamper
  response.cookies.set({
    name: "admin_token",
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
