import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getBeersForPage } from "@/lib/beers.server";
import { BeersContent } from "./beers-content";

export const revalidate = 86400;

// ---------------- PAGE ----------------
export default async function BeersPage() {
  const beers = await getBeersForPage();

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-forest text-tan overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23E8D7B5%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-4">Our Beers</h1>
          <div className="w-24 h-1 bg-tan mx-auto mb-6" />
          <p className="text-lg text-tan/80 max-w-2xl mx-auto">From idea to pint — follow the journey of every brew.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div className="text-center py-20 text-forest/50">Loading beers...</div>}>
            <BeersContent initialBeers={beers} />
          </Suspense>
        </div>
      </section>

      <Footer />
    </main>
  );
}
