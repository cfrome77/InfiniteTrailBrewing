import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Beer, BookOpen, Compass, Mountain } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  // Bare title: the root layout template appends the site name.
  title: "Off the Trail",
  description: "This path doesn't lead anywhere. Head back to the trailhead.",
  robots: { index: false, follow: false },
};

const suggestions = [
  {
    href: "/beers",
    label: "What's On Tap",
    description: "Current pours and what's conditioning.",
    icon: Beer,
  },
  {
    href: "/beers/archive",
    label: "Brew Archive",
    description: "Every batch we've logged, past and present.",
    icon: Mountain,
  },
  {
    href: "/blog",
    label: "The Brew Log",
    description: "Notes from the garage lab.",
    icon: BookOpen,
  },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cream text-forest">
      <Navbar />

      <section className="relative bg-forest text-tan pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23E8D7B5%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-tan/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-tan/10 border border-tan/20 text-xs font-mono uppercase tracking-widest text-tan/80 mb-8">
            <Compass className="w-3.5 h-3.5" />
            <span>Error 404</span>
            <span className="w-1.5 h-1.5 rounded-full bg-tan/30" />
            <span>Trail Not Found</span>
          </div>

          <p
            aria-hidden="true"
            className="font-serif text-[5.5rem] md:text-[9rem] leading-none tracking-wider text-tan/15 select-none mb-2"
          >
            404
          </p>

          <h1 className="font-serif text-3xl md:text-5xl tracking-wider uppercase mb-6 -mt-4 md:-mt-8">
            You&apos;ve Wandered Off the Trail
          </h1>

          <div className="w-16 h-1 bg-tan/25 mx-auto mb-6" />

          <p className="text-tan/75 text-lg leading-relaxed font-light max-w-xl mx-auto mb-10">
            This path doesn&apos;t lead anywhere — the page may have been
            retired, renamed, or never brewed in the first place. Nothing lost
            but a little daylight.
          </p>

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
      </section>

      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-serif text-sm uppercase tracking-widest text-forest/75 text-center mb-8">
            Pick a Trail Back
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            {suggestions.map(({ href, label, description, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col gap-3 p-6 rounded-2xl bg-white border border-forest/10 hover:border-forest/30 hover:shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                <Icon className="w-6 h-6 text-forest/60 group-hover:text-forest transition-colors" />
                <span className="font-serif text-lg uppercase tracking-wide text-forest">
                  {label}
                </span>
                <span className="text-sm text-forest/75 leading-relaxed font-light">
                  {description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
