"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { client, urlFor } from "@/lib/sanity";
import { Beer, BeerStatus } from "@/types";
import Image from "next/image";

// ---------------- UI Helpers ----------------
function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-3 mt-10 mb-4">
      <h2 className="font-serif text-3xl text-forest">{title}</h2>

      <span className="text-xs bg-forest/10 text-forest px-2 py-1 rounded-full">
        {count}
      </span>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center text-forest/50 py-6 text-sm italic">{text}</div>
  );
}

function StatusPill({ status }: { status: BeerStatus }) {
  const map: Record<BeerStatus, string> = {
    on_deck: "bg-gray-200 text-gray-800",
    brewing: "bg-blue-200 text-blue-800",
    ready: "bg-green-200 text-green-800",
    archived: "bg-gray-400 text-white",
  };

  const label =
    status === "on_deck"
      ? "on deck"
      : status === "brewing"
        ? "brewing"
        : status === "ready"
          ? "on tap"
          : "archived";

  return (
    <span
      className={`px-2 py-1 text-xs uppercase rounded-full font-semibold ${map[status]}`}
    >
      {label}
    </span>
  );
}

function BeerGrid({
  beers,
  getColor,
}: {
  beers: Beer[];
  getColor: (style: string) => string;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {beers.map((beer) => {
        const color = beer.color || getColor(beer.style);
        const imageUrl = beer.image ? urlFor(beer.image).url() : beer.image_url;

        return (
          <Card
            key={beer.id}
            className="bg-white border-none shadow-lg hover:shadow-xl transition-all overflow-hidden"
          >
            <CardContent className="p-0">
              <div
                className={`h-48 bg-gradient-to-b ${color} flex items-center justify-center relative overflow-hidden`}
              >
                {imageUrl ? (
                  <Image src={imageUrl} alt={beer.beer_name} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-20 h-32 bg-white/30 backdrop-blur-sm rounded-lg border-2 border-white/50" />
                )}
              </div>

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

                <div className="flex gap-2 mt-3 flex-wrap">
                  <StatusPill status={beer.status} />

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
  );
}

// ---------------- Page ----------------
function BeersContent({ beers }: { beers: Beer[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "current";

  const handleTabChange = (tab: string) => {
    router.push(`/beers?tab=${tab}`, { scroll: false });
  };

  const onDeck = beers.filter((b) => b.status === "on_deck");
  const brewing = beers.filter((b) => b.status === "brewing");
  const ready = beers.filter((b) => b.status === "ready");
  const archived = beers.filter((b) => b.status === "archived");

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
          className={`px-8 py-3 font-serif text-lg rounded-lg ${
            activeTab === "current"
              ? "bg-forest text-tan"
              : "bg-tan/50 text-forest"
          }`}
        >
          Current Brews
        </button>

        <button
          onClick={() => handleTabChange("archive")}
          className={`px-8 py-3 font-serif text-lg rounded-lg ${
            activeTab === "archive"
              ? "bg-forest text-tan"
              : "bg-tan/50 text-forest"
          }`}
        >
          Beer Archive
        </button>
      </div>

      {/* CURRENT */}
      {activeTab === "current" && (
        <>
          <SectionTitle title="On Deck" count={onDeck.length} />
          {onDeck.length === 0 ? (
            <EmptyState text="No beers on deck." />
          ) : (
            <BeerGrid beers={onDeck} getColor={getColor} />
          )}

          <SectionTitle title="Brewing" count={brewing.length} />
          {brewing.length === 0 ? (
            <EmptyState text="Nothing brewing right now." />
          ) : (
            <BeerGrid beers={brewing} getColor={getColor} />
          )}

          <SectionTitle title="On Tap" count={ready.length} />
          {ready.length === 0 ? (
            <EmptyState text="No beers currently on tap." />
          ) : (
            <BeerGrid beers={ready} getColor={getColor} />
          )}
        </>
      )}

      {/* ARCHIVE */}
      {activeTab === "archive" && (
        <>
          <SectionTitle title="Archived Beers" count={archived.length} />

          {archived.length === 0 ? (
            <EmptyState text="No archived beers yet." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {archived.map((beer) => (
                <Card key={beer.id} className="bg-white shadow-md">
                  <CardContent className="p-5">
                    <h3 className="font-serif text-lg text-forest">
                      {beer.beer_name}
                    </h3>

                    <p className="text-sm text-forest/60">{beer.style}</p>

                    <p className="text-xs text-forest/50 uppercase">
                      Brewed: {beer.started_at ? new Date(beer.started_at).toLocaleDateString() : 'N/A'}
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
      )}
    </>
  );
}

// ---------------- Main Page ----------------
export default function BeersPage() {
  const [beers, setBeers] = useState<Beer[]>([]);

  useEffect(() => {
    const fetchBeers = async () => {
      const data = await client.fetch(`
        *[_type == "beer"] | order(started_at desc) {
          _id,
          "id": _id,
          beer_name,
          style,
          status,
          notes,
          abv,
          color,
          is_flagship,
          started_at,
          image
        }
      `);

      setBeers((data as Beer[]) ?? []);
    };

    fetchBeers();
  }, []);

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
          <Suspense fallback={<div>Loading beers...</div>}>
            <BeersContent beers={beers} />
          </Suspense>
        </div>
      </section>

      <Footer />
    </main>
  );
}
