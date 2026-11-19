"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="font-serif text-4xl text-forest mb-4">Something went sideways</h1>
        <p className="text-forest/70 leading-relaxed mb-10">
          We hit an unexpected error loading this page. Try again, or head back to
          the trailhead.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-forest/40 mb-8">Reference: {error.digest}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="bg-forest text-tan hover:bg-forest/90 font-serif">
            Try Again
          </Button>
          <Button asChild variant="outline" className="border-forest/20 text-forest hover:bg-forest/5 font-serif">
            <Link href="/">Back to the Trailhead</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
