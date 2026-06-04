"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { unsubscribe } from "@/app/actions/unsubscribe";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function UnsubscribePage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    const result = await unsubscribe(email);
    setStatus(result);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="container mx-auto px-4 pt-40 pb-20 max-w-md">
        <div className="bg-white p-8 rounded-2xl border border-tan/30 shadow-xl">
          <h1 className="text-3xl font-serif text-forest mb-6 text-center">Unsubscribe</h1>

          {status ? (
            <div className={`p-6 rounded-xl text-center ${status.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
              {status.success ? (
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-600" />
              ) : (
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
              )}
              <p className="font-medium">{status.message}</p>
              <Button
                variant="link"
                className="mt-4 text-forest"
                onClick={() => setStatus(null)}
              >
                Try another email
              </Button>
            </div>
          ) : (
            <>
              <p className="text-forest/70 mb-8 text-center leading-relaxed">
                We're sorry to see you go! Enter your email address below to unsubscribe from The Trail Report.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-tan/50 focus:border-forest"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-forest text-tan hover:bg-forest/90 font-serif text-lg py-6"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : "Unsubscribe"}
                </Button>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
