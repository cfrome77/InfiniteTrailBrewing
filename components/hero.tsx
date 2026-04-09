import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-forest text-tan px-4">
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23E8D7B5%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/InfiniteTrailBrewingLogo-Transparent-v6FezPtqxZNb3SWQzDZTLQnNvIqEf6.png"
            alt="Infinite Trail Brewing - Frederick, MD"
            width={350}
            height={350}
            className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 drop-shadow-2xl"
            priority
          />
        </div>

        {/* Tagline */}
        <p className="font-serif text-2xl md:text-3xl lg:text-4xl tracking-wide mb-4 text-tan/90">
          Brewed for the Next Adventure.
        </p>

        {/* Location */}
        <p className="text-lg md:text-xl text-tan/70 mb-10">
          Hand-forged craft beers in Frederick, MD
        </p>

        {/* PRIMARY NAV CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button
            asChild
            size="lg"
            className="bg-tan text-forest hover:bg-tan/90 font-serif text-lg px-8 py-6 tracking-wide"
          >
            <Link href="/beers">Explore Our Beers</Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-tan text-tan hover:bg-tan/10 font-serif text-lg px-8 py-6 tracking-wide"
          >
            <Link href="/our-story">Our Story</Link>
          </Button>
        </div>
      </div>

      {/* 👇 BOTTOM SCROLL ARROW */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <Link
          href="#explore"
          className="animate-bounce opacity-60 hover:opacity-100 transition"
        >
          <ArrowDown className="w-8 h-8 text-tan" />
        </Link>
      </div>
    </section>
  );
}
