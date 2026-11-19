import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-guard";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Staff Access | Infinite Trail Brewing",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminUser()) redirect("/admin/studio");
  return <LoginForm />;
}
