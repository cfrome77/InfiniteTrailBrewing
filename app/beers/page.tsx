import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { client } from "@/lib/sanity";
import { serverClient } from "@/lib/sanity.server";
import { Beer } from "@/types";
import { BeersContent } from "./beers-content";

export const dynamic = 'force-dynamic';

// ---------------- PAGE ----------------
export default async function BeersPage() {
  const activeClient = process.env.SANITY_API_TOKEN ? serverClient : client;

  if (process.env.NODE_ENV !== "production") {
    console.log("Fetching beers with config:", {
      projectId: activeClient.config().projectId,
      dataset: activeClient.config().dataset,
      useCdn: activeClient.config().useCdn,
      usingToken: !!process.env.SANITY_API_TOKEN,
    });
  }

  let beers: Beer[] = [];
  try {
    beers = await activeClient.fetch(`
      *[_type == "beer"] | order(_createdAt desc) {
        _id,
        "id": _id,
        beer_name,
        style,
        status,
        notes,
        abv,
        is_flagship,
        _createdAt,
        image
      }
    `);
    if (process.env.NODE_ENV !== "production") {
      console.log("BEERS QUERY RESULT COUNT:", beers.length);
    }
  } catch (err) {
    console.error("Error fetching beers:", err);
  }

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <section className="pt-32 pb-12 bg-forest text-tan">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-4">
            Our Beers
          </h1>
          <div className="w-24 h-1 bg-tan mx-auto mb-6" />
          <p className="text-lg text-tan/80 max-w-2xl mx-auto">
            From idea to pint — follow the journey of every brew.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Suspense
            fallback={
              <div className="text-center py-20 text-forest/50">
                Loading beers...
              </div>
            }
          >
            <BeersContent initialBeers={beers} />
          </Suspense>
        </div>
      </section>

      <Footer />
    </main>
  );
}
