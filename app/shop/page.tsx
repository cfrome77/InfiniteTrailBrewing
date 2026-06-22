import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EmbeddedStore } from "@/components/embedded-store";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop | Infinite Trail Brewing",
  description: "Browse our merchandise and pick up some Infinite Trail Brewing gear.",
};

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Header Section */}
      <section className="pt-32 pb-12 bg-forest text-tan">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-4 uppercase tracking-tight">
            Merchandise
          </h1>
          <p className="text-tan/80 max-w-2xl mx-auto font-sans">
            Gear up for your next adventure. From stickers to apparel, find the perfect way to show your love for the trail.
          </p>
        </div>
      </section>

      {/* Store Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <EmbeddedStore />
        </div>
      </section>

      <Footer />
    </main>
  );
}
