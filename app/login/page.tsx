"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"login" | "reset" | "update_password">("login");

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const viewParam = searchParams.get("view");
    if (viewParam === "update_password") {
      setView("update_password");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login?view=update_password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage("Check your email for the password reset link.");
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage("Password updated successfully. You can now log in.");
      setView("login");
    }
    setLoading(false);
  };

  const getTitle = () => {
    switch (view) {
      case "login": return "Staff Login";
      case "reset": return "Reset Password";
      case "update_password": return "Create New Password";
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo/Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-block bg-forest p-6 rounded-full mb-6">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/InfiniteTrailBrewingWordmarkDeepForest-Transparent-mWmicyKGqRtwkNbzt0Qqv431s925IK.png"
            alt="Infinite Trail Brewing"
            width={240}
            height={80}
            className="h-12 w-auto brightness-0 invert"
          />
        </div>
        <h1 className="font-serif text-3xl text-forest tracking-wide">
          {getTitle()}
        </h1>
        <p className="text-forest/60 mt-2 font-sans text-sm uppercase tracking-widest">
          Infinite Trail Brewing
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-xl border border-tan/20">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <p className="text-green-700 text-sm">{message}</p>
          </div>
        )}

        {view === "login" && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest/70 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-tan/30 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                placeholder="name@example.com"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-forest/70">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setView("reset")}
                  className="text-xs text-forest/50 hover:text-forest transition-colors underline"
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-tan/30 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest text-tan py-3 rounded-lg font-serif text-lg tracking-wide hover:bg-forest/90 disabled:opacity-50 transition-all shadow-md active:transform active:scale-[0.98]"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
        )}

        {view === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <p className="text-forest/70 text-sm leading-relaxed mb-4">
              Enter your email address and we'll send you a link to reset your account password.
            </p>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest/70 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-tan/30 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                placeholder="name@example.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest text-tan py-3 rounded-lg font-serif text-lg tracking-wide hover:bg-forest/90 disabled:opacity-50 transition-all shadow-md"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <button
              type="button"
              onClick={() => setView("login")}
              className="w-full text-sm text-forest/60 hover:text-forest transition-colors mt-2"
            >
              Return to Login
            </button>
          </form>
        )}

        {view === "update_password" && (
          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <p className="text-forest/70 text-sm leading-relaxed mb-4">
              Please enter a new secure password for your account.
            </p>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest/70 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-tan/30 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest/70 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-tan/30 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest text-tan py-3 rounded-lg font-serif text-lg tracking-wide hover:bg-forest/90 disabled:opacity-50 transition-all shadow-md"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-forest/40 hover:text-forest transition-colors text-sm uppercase tracking-widest">
          ← Back to Main Site
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-4 pt-32 pb-20">
        <Suspense fallback={<div className="text-forest">Loading...</div>}>
          <LoginContent />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}
