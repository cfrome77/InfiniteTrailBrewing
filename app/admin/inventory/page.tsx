import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getAllBeers } from "@/lib/beers";
import { InventoryManager } from "../inventory-manager";

export default async function InventoryPage() {
  const beers = await getAllBeers();

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
                <h1 className="text-4xl font-serif text-forest mb-2">Brewery Metrics</h1>
                <p className="text-forest/60">Inventory overview and brewing statistics.</p>
            </div>
            <a
              href="/admin/studio/structure/beer"
              className="text-forest font-serif hover:text-sky transition-colors text-sm border-b border-forest/20"
            >
              Update Inventory in Studio →
            </a>
        </div>

        <InventoryManager beers={beers} />
      </main>
      <Footer />
    </div>
  );
}
