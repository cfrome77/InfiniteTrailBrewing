import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { isAdminAuthConfigured } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Staff Sign In | Infinite Trail Brewing",
  robots: { index: false, follow: false },
};

// isAdminAuthConfigured() reads ADMIN_SESSION_SECRET. Without this the page is
// prerendered at build time, so a secret configured only in the runtime
// environment leaves the form permanently replaced by "not configured".
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl border border-tan/30 shadow-xl">
        <h1 className="font-serif text-3xl text-forest mb-2 text-center uppercase tracking-wide">
          Staff Sign In
        </h1>
        <p className="text-sm text-forest/75 text-center mb-8">
          Restricted area. Brewery staff only.
        </p>

        {isAdminAuthConfigured() ? (
          <LoginForm />
        ) : (
          <p
            role="alert"
            className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3"
          >
            Admin access is not configured. Set <code>ADMIN_LOGIN_PASSWORD</code> and{" "}
            <code>ADMIN_SESSION_SECRET</code> in the environment.
          </p>
        )}
      </div>
    </main>
  );
}
