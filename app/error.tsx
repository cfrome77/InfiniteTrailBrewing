"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCw, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

/**
 * Route-level error boundary.
 *
 * Without this file Next renders its default error screen, which is a bare
 * message with no navigation and no branding. A Sanity outage or a failed
 * fetch is the realistic trigger here, so visitors get a way back rather than
 * a dead end.
 *
 * Each page renders its own Navbar and Footer rather than the root layout, so
 * they have to be repeated here: a page that throws never renders its own.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is what correlates this with the server log; the message
    // itself is not shown to visitors because it can carry internal detail.
    console.error("Unhandled route error:", error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-cream text-forest flex items-center">
      <section className="w-full relative bg-forest text-tan py-20 md:py-28 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-tan/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-tan/10 border border-tan/20 text-xs font-mono uppercase tracking-widest text-tan/80 mb-8">
            <Mountain className="w-3.5 h-3.5" />
            <span>Trail Closed</span>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl tracking-wider uppercase mb-6">
            We Hit a Rough Patch
          </h1>

          <div className="w-16 h-1 bg-tan/25 mx-auto mb-6" />

          <p className="text-tan/75 text-lg leading-relaxed font-light max-w-xl mx-auto mb-10">
            Something went wrong loading this page. It is usually temporary —
            give it another try, or head back to the trailhead.
          </p>

          {error.digest ? (
            <p className="font-mono text-xs text-tan/40 mb-8">
              Reference: {error.digest}
            </p>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={reset}
              variant="outline"
              className="bg-transparent border-tan text-tan hover:bg-tan hover:text-forest rounded-full px-6 py-5 font-serif text-base"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            <Button
              asChild
              variant="outline"
              className="bg-transparent border-tan text-tan hover:bg-tan hover:text-forest rounded-full px-6 py-5 font-serif text-base"
            >
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to the Trailhead
              </Link>
            </Button>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
