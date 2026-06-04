"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/app/actions/auth";
import { Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login(password);

    if (result.success) {
      router.push("/admin/dashboard");
    } else {
      setError(result.message || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="container mx-auto px-4 pt-40 pb-20 max-w-md">
        <div className="bg-white p-8 rounded-2xl border border-tan/30 shadow-xl">
          <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-forest" />
          </div>
          <h1 className="text-3xl font-serif text-forest mb-2 text-center">Staff Login</h1>
          <p className="text-forest/60 text-center mb-8">Access the brewery dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-tan/50 focus:border-forest"
              />
            </div>
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-forest text-tan hover:bg-forest/90 font-serif text-lg py-6"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : "Sign In"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
