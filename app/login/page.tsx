"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await loginAction(password);

    if (result.success) {
        router.push("/admin");
    } else {
        setError(result.error || "Login failed");
        setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 flex justify-center">
          <Card className="w-full max-w-md bg-white border-none shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-forest" />
                </div>
                <h1 className="font-serif text-3xl text-forest">Staff Access</h1>
                <p className="text-forest/60 mt-2">
                  Please enter the admin password.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-forest">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-forest/40" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 border-forest/20 focus:border-forest focus:ring-forest"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-forest text-tan hover:bg-forest/90 font-serif tracking-wide py-6"
                >
                  {isLoading ? "Checking..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
