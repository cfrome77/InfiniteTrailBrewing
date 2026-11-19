"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { unsubscribeByToken, requestUnsubscribeLink } from "@/app/actions/unsubscribe";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const successParam = searchParams.get("success");
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  // A token link unsubscribes on load, so the spinner is the initial state
  // rather than something an effect switches on.
  const [isLoading, setIsLoading] = useState(Boolean(token));
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Derived during render rather than pushed into state from an effect, so the
  // redirect result is correct on the first paint.
  const paramStatus = useMemo(() => {
    if (successParam === "true") {
      return {
        success: true,
        message: "You have been successfully unsubscribed from The Brew Log.",
      };
    }
    if (errorParam) {
      return {
        success: false,
        message:
          errorParam === "invalid"
            ? "This unsubscribe link is no longer valid."
            : "We could not process that unsubscribe link. Please request a new one below.",
      };
    }
    return null;
  }, [successParam, errorParam]);

  // A token link is proof of mailbox ownership, so it unsubscribes on load
  // without asking for the address again.
  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    unsubscribeByToken(token).then((result) => {
      if (cancelled) return;
      setStatus(result);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    const result = await requestUnsubscribeLink(email);
    setStatus(result);
    setIsLoading(false);
  };

  const displayStatus = status ?? paramStatus;

  return (
    <main className="container mx-auto px-4 pt-40 pb-20 max-w-md">
      <div className="bg-white p-8 rounded-2xl border border-tan/30 shadow-xl">
        <h1 className="text-3xl font-serif text-forest mb-6 text-center">Unsubscribe</h1>

        {isLoading && token ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-10 h-10 text-forest animate-spin" />
            <p className="mt-4 text-forest/70">Updating your subscription...</p>
          </div>
        ) : displayStatus ? (
          <div className={`p-6 rounded-xl text-center ${displayStatus.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {displayStatus.success ? (
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-600" />
            ) : (
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            )}
            <p className="font-medium">{displayStatus.message}</p>
            <Button
              variant="link"
              className="mt-4 text-forest"
              onClick={() => setStatus(null)}
            >
              Back to form
            </Button>
          </div>
        ) : (
          <>
            <p className="text-forest/70 mb-8 text-center leading-relaxed">
              We're sorry to see you go! Enter your email address and we'll send you a
              confirmation link to unsubscribe from The Brew Log.
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
                ) : "Send Unsubscribe Link"}
              </Button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Suspense fallback={
        <main className="container mx-auto px-4 pt-40 pb-20 max-w-md">
          <div className="bg-white p-8 rounded-2xl border border-tan/30 shadow-xl flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="w-10 h-10 text-forest animate-spin" />
          </div>
        </main>
      }>
        <UnsubscribeContent />
      </Suspense>
      <Footer />
    </div>
  );
}
