"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Beer, BeerStatus } from "@/types";
import { getBeerImage } from "@/lib/images";
import { getBeerStyleGradient } from "@/lib/beerStyleTheme";
import Image from "next/image";
import { beerStyles } from "@/sanity/constants/beerStyles";

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

// ---------------- Beer Grid ----------------
function BeerGrid({ beers }: { beers: Beer[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {beers.map((beer) => {
        const color = getBeerStyleGradient(beer.style);
        const imageUrl = getBeerImage(beer, "card");

        return (
          <Card
            key={beer.id}
            className="group bg-white border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <CardContent className="p-0">
              {/* IMAGE AREA */}
              <div
                className={`h-48 bg-gradient-to-b ${color} flex items-center justify-center relative overflow-hidden`}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={beer.beer_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="w-20 h-32 bg-white/30 backdrop-blur-sm rounded-lg border-2 border-white/50 group-hover:scale-110 transition-transform duration-500" />
                )}
              </div>

              {/* CONTENT */}
              <div className="p-5 md:p-6">
                <div className="flex justify-between mb-2">
                  <span className="text-xs uppercase text-forest/60">
                    {beerStyles.find(s => s.value === beer.style)?.title || beer.style}
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

// ---------------- Content ----------------
export function BeersContent({ initialBeers }: { initialBeers: Beer[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "current";

  const handleTabChange = (tab: string) => {
    router.push(`/beers?tab=${tab}`, { scroll: false });
  };

  const onDeck = initialBeers.filter((b) => b.status === "on_deck");
  const brewing = initialBeers.filter((b) => b.status === "brewing");
  const ready = initialBeers.filter((b) => b.status === "ready");
  const archived = initialBeers.filter((b) => b.status === "archived");

  return (
    <>
      {/* TABS */}
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
            <BeerGrid beers={onDeck} />
          )}

          <SectionTitle title="Brewing" count={brewing.length} />
          {brewing.length === 0 ? (
            <EmptyState text="Nothing brewing right now." />
          ) : (
            <BeerGrid beers={brewing} />
          )}

          <SectionTitle title="On Tap" count={ready.length} />
          {ready.length === 0 ? (
            <EmptyState text="No beers currently on tap." />
          ) : (
            <BeerGrid beers={ready} />
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
              {archived.map((beer) => {
                const imageUrl = getBeerImage(beer, "thumb");

                return (
                  <Card key={beer.id} className="bg-white shadow-md">
                    <CardContent className="p-0">
                      <div className="h-32 relative overflow-hidden bg-gradient-to-b from-amber-200 to-amber-300">
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt={beer.beer_name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="font-serif text-lg text-forest">
                          {beer.beer_name}
                        </h3>

                        <p className="text-sm text-forest/60">
                          {beerStyles.find(s => s.value === beer.style)?.title || beer.style}
                        </p>

                        {beer.is_flagship && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs uppercase rounded-full font-semibold bg-forest text-tan">
                            Flagship
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}
