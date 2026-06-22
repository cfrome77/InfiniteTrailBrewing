import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merchandise | Infinite Trail Brewing",
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

      {/* Products Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">

            {/* T-Shirt Product */}
            <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-square bg-tan/20 flex items-center justify-center p-8 relative overflow-hidden group">
                <div className="w-48 h-48 bg-forest/10 rounded-full absolute -top-12 -right-12 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="w-32 h-32 bg-forest/5 rounded-full absolute -bottom-8 -left-8 group-hover:scale-110 transition-transform duration-500 delay-75"></div>
                <span className="text-forest/40 font-serif text-8xl select-none group-hover:scale-105 transition-transform duration-300">T</span>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h2 className="text-2xl font-serif text-forest mb-2">Classic Brand T-Shirt</h2>
                <p className="text-forest/70 font-sans mb-6 flex-grow">
                  High quality print-on-demand t-shirt. Featuring our signature Infinite Trail Brewing logo on a premium cotton blend.
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-serif text-forest">$25.00</span>
                  <button
                    className="snipcart-add-item inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-forest text-tan shadow hover:bg-forest/90 h-10 px-6 py-2"
                    data-item-id="classic-tshirt"
                    data-item-name="Classic Brand T-Shirt"
                    data-item-price="25.00"
                    data-item-url="/merch"
                    data-item-description="High quality print-on-demand t-shirt.">
                    Buy T-Shirt
                  </button>
                </div>
              </div>
            </div>

            {/* Sticker Product */}
            <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-square bg-tan/20 flex items-center justify-center p-8 relative overflow-hidden group">
                <div className="w-48 h-48 bg-forest/10 rounded-full absolute -top-12 -right-12 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="w-32 h-32 bg-forest/5 rounded-full absolute -bottom-8 -left-8 group-hover:scale-110 transition-transform duration-500 delay-75"></div>
                <span className="text-forest/40 font-serif text-8xl select-none group-hover:scale-105 transition-transform duration-300">S</span>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h2 className="text-2xl font-serif text-forest mb-2">Logo Sticker</h2>
                <p className="text-forest/70 font-sans mb-6 flex-grow">
                  Durable weatherproof sticker. Perfect for your water bottle, laptop, or cooler.
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-serif text-forest">$5.00</span>
                  <button
                    className="snipcart-add-item inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-forest text-tan shadow hover:bg-forest/90 h-10 px-6 py-2"
                    data-item-id="brand-sticker"
                    data-item-name="Logo Sticker"
                    data-item-price="5.00"
                    data-item-url="/merch"
                    data-item-description="Durable weatherproof sticker.">
                    Buy Sticker
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
