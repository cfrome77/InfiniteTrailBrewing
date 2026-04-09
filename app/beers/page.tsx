"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

// ---------------- Types ----------------
type Beer = {
  id: string;
  beer_name: string;
  style: string;
  status: string; // fermenting, conditioning, archived, etc.
  is_flagship?: boolean;
  notes: string | null;
  abv?: string | null;
  color?: string | null;
  started_at: string;
};

// ---------------- BeersContent ----------------
function BeersContent({ beers }: { beers: Beer[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "current";

  const handleTabChange = (tab: string) => {
    router.push(`/beers?tab=${tab}`, { scroll: false });
  };

  const currentBeers = beers.filter((b) => b.status !== "archived");
  const archivedBeers = beers.filter((b) => b.status === "archived");

  const getColor = (style: string) => {
    const s = style.toLowerCase();
    if (s.includes("stout") || s.includes("porter"))
      return "from-stone-700 to-stone-800";
    if (s.includes("lager")) return "from-amber-400 to-amber-500";
    if (s.includes("ipa")) return "from-orange-400 to-orange-500";
    return "from-amber-200 to-amber-300";
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => handleTabChange("current")}
          className={`px-8 py-3 font-serif text-lg tracking-wide rounded-lg transition-all ${
            activeTab === "current"
              ? "bg-forest text-tan"
              : "bg-tan/50 text-forest hover:bg-tan/70"
          }`}
        >
          Current Brews
        </button>
        <button
          onClick={() => handleTabChange("archive")}
          className={`px-8 py-3 font-serif text-lg tracking-wide rounded-lg transition-all ${
            activeTab === "archive"
              ? "bg-forest text-tan"
              : "bg-tan/50 text-forest hover:bg-tan/70"
          }`}
        >
          Beer Archive
        </button>
      </div>

      {/* Current Beers */}
      {activeTab === "current" && (
        <div className="grid md:grid-cols-2 gap-8">
          {currentBeers.map((beer) => {
            const color = beer.color || getColor(beer.style);
            return (
              <Card
                key={beer.id}
                className="group bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Beer Visual */}
                  <div
                    className={`h-48 bg-gradient-to-b ${color} flex items-center justify-center`}
                  >
                    <div className="w-20 h-32 bg-white/30 backdrop-blur-sm rounded-lg border-2 border-white/50" />
                  </div>

                  {/* Beer Info */}
                  <div className="p-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs uppercase text-forest/60">
                        {beer.style}
                      </span>
                      {beer.abv && (
                        <span className="text-xs font-semibold text-forest bg-tan/50 px-2 py-1 rounded">
                          {beer.abv} ABV
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-2xl text-forest mb-3">
                      {beer.beer_name}
                    </h3>
                    <p className="text-forest/70">{beer.notes}</p>

                    {/* Status + Flagship Chips */}
                    <div className="flex items-center flex-wrap gap-2 mt-3">
                      <span
                        className={`px-2 py-1 text-xs uppercase rounded-full font-semibold ${
                          beer.status === "fermenting"
                            ? "bg-amber-200 text-amber-800"
                            : beer.status === "conditioning"
                              ? "bg-blue-200 text-blue-800"
                              : beer.status === "archived"
                                ? "bg-gray-300 text-gray-700"
                                : "bg-green-200 text-green-800"
                        }`}
                      >
                        {beer.status}
                      </span>

                      {beer.is_flagship && (
                        <span className="px-2 py-1 text-xs uppercase rounded-full font-semibold bg-forest text-tan">
                          Flagship
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Archived Beers */}
      {activeTab === "archive" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {archivedBeers.map((beer) => (
            <Card key={beer.id} className="bg-white shadow-md">
              <CardContent className="p-5">
                <h3 className="font-serif text-lg text-forest">
                  {beer.beer_name}
                </h3>
                <p className="text-sm text-forest/60">{beer.style}</p>
                <p className="text-xs text-forest/50 uppercase">
                  Brewed: {new Date(beer.started_at).toLocaleDateString()}
                </p>
                {beer.is_flagship && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs uppercase rounded-full font-semibold bg-forest text-tan">
                    Flagship
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

// ---------------- Main Page ----------------
export default function BeersPage() {
  const [beers, setBeers] = useState<Beer[]>([]);

  useEffect(() => {
    const fetchBeers = async () => {
      const { data, error } = await createClient()
        .from("currently_brewing")
        .select("*")
        .order("started_at", { ascending: false });
      if (error) {
        console.error("Error fetching beers:", error);
        return;
      }
      setBeers(data ?? []);
    };

    fetchBeers();
  }, []);

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 bg-forest text-tan">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-4 tracking-wide">
            Our Beers
          </h1>
          <div className="w-24 h-1 bg-tan mx-auto mb-6" />
          <p className="text-lg text-tan/80 max-w-2xl mx-auto">
            Each brew is hand-forged with intention and endurance, serving as
            the ultimate reward earned at the end of the trail.
          </p>
        </div>
      </section>

      {/* Beers Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div className="text-center">Loading beers...</div>}>
            <BeersContent beers={beers} />
          </Suspense>
        </div>
      </section>

      <Footer />
    </main>
  );
}
