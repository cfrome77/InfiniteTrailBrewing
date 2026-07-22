import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown, BookOpen, FlaskConical, Beer } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-forest text-tan px-4 overflow-hidden pt-16 pb-16 md:pt-20 md:pb-20">
      {/* Blueprint/coarse grid and cross background texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23E8D7B5%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-55 pointer-events-none" />

      {/* Subtle organic light bleed from top-left */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-tan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Brand Concept Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-tan/10 border border-tan/20 text-xs font-mono uppercase tracking-widest text-tan/80 mb-3 md:mb-4 animate-fade-in">
          <FlaskConical className="w-3.5 h-3.5 text-tan" />
          <span>Private Craft Beer Lab</span>
          <span className="w-1.5 h-1.5 rounded-full bg-tan/30" />
          <span>Est. Frederick, MD</span>
        </div>

        {/* Logo */}
        <div className="mb-3 md:mb-4 animate-fade-in [animation-delay:100ms] opacity-0 [animation-fill-mode:forwards]">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/InfiniteTrailBrewingLogo-Transparent-v6FezPtqxZNb3SWQzDZTLQnNvIqEf6.png"
            alt="Infinite Trail Brewing"
            width={180}
            height={180}
            className="w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 drop-shadow-2xl hover:scale-105 transition-transform duration-500 ease-out"
            priority
          />
        </div>

        {/* Title & Brand Phrase */}
        <div className="space-y-1 mb-3 md:mb-4 animate-fade-in [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-wider text-tan font-bold uppercase">
            Infinite Trail Brewing
          </h1>
          <p className="font-sans text-lg md:text-2xl tracking-widest text-tan/90 font-light italic uppercase">
            Brewed for the Adventure
          </p>
        </div>

        {/* Brand Narrative mapping: Beer -> Brewing -> Experimentation -> Adventure -> Exploration */}
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 text-[10px] md:text-sm font-mono text-tan/50 mb-3 md:mb-4 uppercase tracking-widest max-w-xl mx-auto animate-fade-in [animation-delay:300ms] opacity-0 [animation-fill-mode:forwards]">
          <span>Beer</span>
          <span className="text-tan/20">➔</span>
          <span>Brewing</span>
          <span className="text-tan/20">➔</span>
          <span>Experimentation</span>
          <span className="text-tan/20">➔</span>
          <span>Adventure</span>
          <span className="text-tan/20">➔</span>
          <span>Exploration</span>
        </div>

        {/* Clear Brand/Lab Explanation */}
        <div className="max-w-2xl mx-auto mb-4 md:mb-6 animate-fade-in [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
          <p className="text-xs md:text-base leading-relaxed text-tan/85 font-light">
            We are a private, small-batch homebrewery and experimental craft beer lab based in Frederick, Maryland. By connecting technical mashing chemistry with the rugged spirit of the backcountry, we hand-forge high-character recipes ready for the next summit.
          </p>
        </div>

        {/* Primary Calls to Action */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 animate-slide-up [animation-delay:500ms] opacity-0 [animation-fill-mode:forwards]">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-tan text-forest hover:bg-tan/90 font-serif text-base px-8 py-6 tracking-wide shadow-xl hover:scale-[1.03] transition-all duration-300"
          >
            <Link href="/beers" className="flex items-center gap-2">
              <Beer className="w-4 h-4" />
              Explore the Beers
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-tan/30 text-tan hover:bg-tan/10 hover:border-tan font-serif text-base px-8 py-6 tracking-wide hover:scale-[1.03] transition-all duration-300"
          >
            <Link href="/blog" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Read the Brew Log
            </Link>
          </Button>
        </div>
      </div>

      {/* BOTTOM SCROLL ARROW */}
      <a href="#brand-story" aria-label="Scroll down to brand story" className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-20 group transition-colors hover:text-tan">
        <div className="animate-bounce opacity-40 group-hover:opacity-100 transition-opacity">
          <ArrowDown className="w-6 h-6 text-tan" />
        </div>
      </a>
    </section>
  );
}
