"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Beer, BeerStatus } from "@/types";
import { getBeerImage } from "@/lib/images";
import { getBeerStyleGradient } from "@/lib/beerStyleTheme";
import Image from "next/image";
import { beerStyles } from "@/sanity/constants/beerStyles";
import { Activity, Beaker, Calendar, Layers, ArrowRight } from "lucide-react";

// ---------------- UI Helpers ----------------
function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-4 mt-16 mb-8 border-b border-forest/10 pb-4">
      <div className="h-6 w-1 bg-forest rounded-full" />
      <h2 className="font-serif text-3xl tracking-wide text-forest uppercase">{title}</h2>
      <span className="text-xs bg-forest/10 font-mono text-forest px-3 py-1 rounded-full font-bold">
        {count} {count === 1 ? "Batch" : "Batches"}
      </span>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-16 px-4 bg-white/40 border border-dashed border-forest/20 rounded-2xl max-w-lg mx-auto my-6">
      <Activity className="w-8 h-8 text-forest/30 mx-auto mb-3" />
      <p className="text-forest/60 text-sm font-medium italic">{text}</p>
    </div>
  );
}

function StatusPill({ status }: { status: BeerStatus }) {
  const map: Record<BeerStatus, { bg: string; dot: string; label: string }> = {
    on_deck: {
      bg: "bg-amber-100 border-amber-200 text-amber-800",
      dot: "bg-amber-500",
      label: "Planned / On Deck",
    },
    brewing: {
      bg: "bg-blue-100 border-blue-200 text-blue-800 animate-pulse",
      dot: "bg-blue-500",
      label: "Brewing / Fermenting",
    },
    ready: {
      bg: "bg-emerald-100 border-emerald-200 text-emerald-800",
      dot: "bg-emerald-500 animate-ping",
      label: "On Tap / Available",
    },
    archived: {
      bg: "bg-zinc-100 border-zinc-200 text-zinc-700",
      dot: "bg-zinc-500",
      label: "Finished / Cellared",
    },
  };

  const current = map[status] || map.ready;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] tracking-wider uppercase font-mono font-bold rounded-full border ${current.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
}

// ---------------- Beer Grid ----------------
function BeerGrid({ beers }: { beers: Beer[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {beers.map((beer) => {
        const styleStr = (typeof beer.style === "object" && beer.style !== null) ? beer.style.title : (beer.style as string);
        const styleLabel = (typeof beer.style === "object" && beer.style !== null) ? beer.style.title : (beerStyles.find(s => s.value === (beer.style as string))?.title || (beer.style as string) || "Craft Special");
        const color = getBeerStyleGradient(styleStr);
        const imageUrl = getBeerImage(beer, "card");

        return (
          <Link key={beer.id} href={`/beers/${beer.slug}`} className="block group">
            <Card className="bg-white border border-forest/10 shadow-md group-hover:shadow-xl group-hover:border-forest/20 transition-all duration-300 overflow-hidden h-full flex flex-col">
              <CardContent className="p-0 flex flex-col h-full">
                {/* IMAGE AREA */}
                <div className={`h-56 bg-gradient-to-b ${color} flex items-center justify-center relative overflow-hidden shrink-0`}>
                  {/* Fine blueprint coordinate grid texture overlay */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%2020h20M20%200v20%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-opacity%3D%220.08%22%20stroke-width%3D%221%22/%3E%3C/svg%3E')] opacity-70 pointer-events-none" />

                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={beer.beer_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="w-16 h-28 bg-white/20 backdrop-blur-sm rounded-xl border border-white/40 group-hover:scale-110 transition-transform duration-500 shadow-sm flex items-center justify-center">
                      <Beaker className="w-8 h-8 text-white/50" />
                    </div>
                  )}

                  {/* Flagship Badge Overlay */}
                  {beer.is_flagship && (
                    <span className="absolute top-4 right-4 px-2.5 py-1 text-[10px] uppercase tracking-widest font-mono font-bold bg-forest text-tan rounded border border-tan/30 shadow-md">
                      Flagship
                    </span>
                  )}

                  {/* Style Overlay Badge */}
                  <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest font-mono font-bold bg-black/60 backdrop-blur-sm border border-white/20 text-white px-2.5 py-1 rounded">
                    {styleLabel}
                  </span>
                </div>

                {/* CONTENT AREA */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-serif text-2xl text-forest group-hover:text-sky transition-colors mb-2 tracking-wide">
                      {beer.beer_name}
                    </h3>

                    <p className="text-forest/70 text-sm font-light leading-relaxed line-clamp-3 mb-4">
                      {beer.notes || "No description provided for this experimental brew log entry."}
                    </p>
                  </div>

                  <div>
                    {/* Metrics Row */}
                    <div className="grid grid-cols-2 gap-4 border-t border-forest/10 pt-4 mb-4 font-mono text-xs text-forest/60">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-forest">ABV:</span>
                        <span>{beer.abv ? `${beer.abv}%` : "TBD"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-forest">IBU:</span>
                        <span>{beer.ibu || "N/A"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-forest/5 pt-4">
                      <StatusPill status={beer.status} />
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-forest group-hover:text-sky transition-all">
                        Logbook
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
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
    <div className="max-w-6xl mx-auto">
      {/* TABS */}
      <div className="flex justify-center p-1.5 bg-forest/5 border border-forest/10 rounded-xl max-w-md mx-auto mb-16">
        <button
          onClick={() => handleTabChange("current")}
          className={`flex-1 py-3 font-serif text-base tracking-wider uppercase rounded-lg transition-all duration-300 ${
            activeTab === "current"
              ? "bg-forest text-tan shadow-md font-bold"
              : "text-forest/60 hover:text-forest"
          }`}
        >
          Active Cellar
        </button>

        <button
          onClick={() => handleTabChange("archive")}
          className={`flex-1 py-3 font-serif text-base tracking-wider uppercase rounded-lg transition-all duration-300 ${
            activeTab === "archive"
              ? "bg-forest text-tan shadow-md font-bold"
              : "text-forest/60 hover:text-forest"
          }`}
        >
          Archived Logs
        </button>
      </div>

      {/* CURRENT TAB */}
      {activeTab === "current" && (
        <div className="space-y-12">
          <div>
            <SectionTitle title="On Tap: In the Kegerator" count={ready.length} />
            {ready.length === 0 ? (
              <EmptyState text="No beers currently on tap." />
            ) : (
              <BeerGrid beers={ready} />
            )}
          </div>

          <div>
            <SectionTitle title="Fermenting: In the Carboy" count={brewing.length} />
            {brewing.length === 0 ? (
              <EmptyState text="Nothing brewing or fermenting right now." />
            ) : (
              <BeerGrid beers={brewing} />
            )}
          </div>

          <div>
            <SectionTitle title="On Deck: Planned Batches" count={onDeck.length} />
            {onDeck.length === 0 ? (
              <EmptyState text="No upcoming batches on deck." />
            ) : (
              <BeerGrid beers={onDeck} />
            )}
          </div>
        </div>
      )}

      {/* ARCHIVE TAB */}
      {activeTab === "archive" && (
        <div className="space-y-12 animate-fade-in duration-300">
          <SectionTitle title="Historical Brew Archive" count={archived.length} />

          {archived.length === 0 ? (
            <EmptyState text="No archived beers yet." />
          ) : (
            <BeerGrid beers={archived} />
          )}
        </div>
      )}
    </div>
  );
}
