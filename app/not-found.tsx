import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export const metadata = {
  title: "Off the Trail | Infinite Trail Brewing",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-40 pb-24 max-w-xl text-center">
        <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-forest/5 border border-forest/10 flex items-center justify-center">
          <Compass className="w-8 h-8 text-forest/60" />
        </div>
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-forest/50 mb-4">
          404
        </p>
        <h1 className="font-serif text-4xl text-forest mb-4">You&apos;ve wandered off the trail</h1>
        <p className="text-forest/70 leading-relaxed mb-10">
          This page doesn&apos;t exist, or it was moved. Let&apos;s get you back to
          something worth drinking.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-forest text-tan hover:bg-forest/90 font-serif">
            <Link href="/">Back to the Trailhead</Link>
          </Button>
          <Button asChild variant="outline" className="border-forest/20 text-forest hover:bg-forest/5 font-serif">
            <Link href="/beers">Browse the Beers</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
