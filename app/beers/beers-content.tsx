"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Beer, BeerStatus, BeerStyle } from "@/types";
import { getBeerImage } from "@/lib/images";
import { getBeerStyleGradient } from "@/lib/beerStyleTheme";
import { beerStyles } from "@/sanity/constants/beerStyles";
import { Activity, Beaker, ArrowRight, Search, X, SlidersHorizontal, RotateCcw, Filter } from "lucide-react";

// Style Category Filter definitions
const STYLE_CATEGORIES = [
  { key: "all", label: "All Styles" },
  { key: "ipa", label: "IPAs & Hazy Ales" },
  { key: "lager", label: "Lagers & Pilsners" },
  { key: "stout_porter", label: "Stouts & Porters" },
  { key: "pale_wheat", label: "Pale Ales & Wheat" },
  { key: "sour_wild", label: "Sours & Wild Ales" },
  { key: "cider_hybrid", label: "Ciders, Meads & Hybrids" },
];

function getStyleName(style: BeerStyle | string | undefined | null): string {
  if (!style) return "Craft Special";
  if (typeof style === "object" && style !== null) return style.title || style.slug || "Craft Special";
  const found = beerStyles.find((s) => s.value === style);
  return found ? found.title : style;
}

function matchesStyleCategory(style: BeerStyle | string | undefined | null, categoryKey: string): boolean {
  if (categoryKey === "all") return true;
  const styleStr = (typeof style === "object" && style !== null ? style.title || style.slug : style) || "";
  const styleLower = styleStr.toLowerCase();

  switch (categoryKey) {
    case "ipa":
      return styleLower.includes("ipa");
    case "lager":
      return styleLower.includes("lager") || styleLower.includes("pilsner") || styleLower.includes("helles") || styleLower.includes("dunkel") || styleLower.includes("marzen") || styleLower.includes("festbier");
    case "stout_porter":
      return styleLower.includes("stout") || styleLower.includes("porter");
    case "pale_wheat":
      return styleLower.includes("pale ale") || styleLower.includes("blonde") || styleLower.includes("wheat") || styleLower.includes("hefeweizen") || styleLower.includes("witbier") || styleLower.includes("golden ale") || styleLower.includes("cream ale") || styleLower.includes("esb");
    case "sour_wild":
      return styleLower.includes("sour") || styleLower.includes("gose") || styleLower.includes("berliner") || styleLower.includes("wild") || styleLower.includes("lambic") || styleLower.includes("gueuze");
    case "cider_hybrid":
      return styleLower.includes("cider") || styleLower.includes("mead") || styleLower.includes("apple") || styleLower.includes("perry") || styleLower.includes("graff") || styleLower.includes("seltzer") || styleLower.includes("kombucha");
    default:
      return true;
  }
}

function matchesSearchQuery(beer: Beer, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase().trim();

  const nameMatch = beer.beer_name?.toLowerCase().includes(q);
  const notesMatch = beer.notes?.toLowerCase().includes(q);
  const ingredientsMatch = beer.ingredients?.toLowerCase().includes(q);
  const hopsMatch = beer.notableHops?.some((h) => h.toLowerCase().includes(q));
  const styleMatch = getStyleName(beer.style).toLowerCase().includes(q);
  const batchMatch = beer.batchNumber?.toLowerCase().includes(q);

  return Boolean(nameMatch || notesMatch || ingredientsMatch || hopsMatch || styleMatch || batchMatch);
}

// ---------------- UI Helpers ----------------
function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-4 mt-12 mb-8 border-b border-forest/10 pb-4">
      <div className="h-6 w-1 bg-forest rounded-full" />
      <h2 className="font-serif text-2xl md:text-3xl tracking-wide text-forest uppercase">{title}</h2>
      <span className="text-xs bg-forest/10 font-mono text-forest px-3 py-1 rounded-full font-bold">
        {count} {count === 1 ? "Batch" : "Batches"}
      </span>
    </div>
  );
}

function EmptyState({ text, onReset }: { text: string; onReset?: () => void }) {
  return (
    <div className="text-center py-16 px-4 bg-white/40 border border-dashed border-forest/20 rounded-2xl max-w-lg mx-auto my-6">
      <Activity className="w-8 h-8 text-forest/30 mx-auto mb-3" />
      <p className="text-forest/70 text-sm font-medium mb-4">{text}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-tan text-xs font-mono font-bold uppercase rounded-lg hover:bg-forest/90 transition-colors shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Search & Filters
        </button>
      )}
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
        const styleLabel = getStyleName(beer.style);
        const color = getBeerStyleGradient(styleStr);
        const imageUrl = getBeerImage(beer, "card");

        return (
          <Link key={beer.id} href={`/beers/${beer.slug}`} className="block group">
            <Card className="bg-white border border-forest/10 shadow-md group-hover:shadow-xl group-hover:border-forest/20 transition-all duration-300 overflow-hidden h-full flex flex-col">
              <CardContent className="p-0 flex flex-col h-full">
                {/* IMAGE AREA */}
                <div className={`h-56 bg-gradient-to-b ${color} flex items-center justify-center relative overflow-hidden shrink-0`}>
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
                  <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest font-mono font-bold bg-black/60 backdrop-blur-sm border border-white/20 text-white px-2.5 py-1 rounded max-w-[80%] truncate">
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

// ---------------- Main Content Component ----------------
export function BeersContent({ initialBeers }: { initialBeers: Beer[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>(searchParams.get("tab") || "current");
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("q") || "");
  const [selectedStyle, setSelectedStyle] = useState<string>(searchParams.get("style") || "all");

  // Keep state in sync with URL searchParams if changed externally
  useEffect(() => {
    setActiveTab(searchParams.get("tab") || "current");
    setSearchQuery(searchParams.get("q") || "");
    setSelectedStyle(searchParams.get("style") || "all");
  }, [searchParams]);

  const updateFilters = (newTab: string, newQuery: string, newStyle: string) => {
    setActiveTab(newTab);
    setSearchQuery(newQuery);
    setSelectedStyle(newStyle);

    const params = new URLSearchParams();
    if (newTab && newTab !== "current") params.set("tab", newTab);
    if (newQuery.trim()) params.set("q", newQuery.trim());
    if (newStyle && newStyle !== "all") params.set("style", newStyle);

    const queryString = params.toString();
    router.push(`/beers${queryString ? `?${queryString}` : ""}`, { scroll: false });
  };

  const handleResetFilters = () => {
    updateFilters(activeTab, "", "all");
  };

  // Filter all beers based on active search term and style category
  const filteredBeers = initialBeers.filter(
    (b) => matchesStyleCategory(b.style, selectedStyle) && matchesSearchQuery(b, searchQuery)
  );

  const onDeck = filteredBeers.filter((b) => b.status === "on_deck");
  const brewing = filteredBeers.filter((b) => b.status === "brewing");
  const ready = filteredBeers.filter((b) => b.status === "ready");
  const archived = filteredBeers.filter((b) => b.status === "archived");

  const hasActiveFilters = searchQuery.trim() !== "" || selectedStyle !== "all";

  return (
    <div className="max-w-6xl mx-auto">
      {/* SEARCH & FILTER CONTROLS BAR */}
      <div className="bg-white/80 backdrop-blur-md border border-forest/15 rounded-2xl p-4 md:p-6 shadow-sm mb-12 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Text Search Input */}
          <div className="relative md:col-span-7">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by beer name, hops, ingredients, or notes..."
              value={searchQuery}
              onChange={(e) => updateFilters(activeTab, e.target.value, selectedStyle)}
              className="w-full pl-10 pr-10 py-2.5 bg-forest/5 border border-forest/15 rounded-xl text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => updateFilters(activeTab, "", selectedStyle)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/40 hover:text-forest transition-colors"
                title="Clear text search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Style Category Select */}
          <div className="relative md:col-span-5 flex items-center gap-2">
            <Filter className="w-4 h-4 text-forest/40 shrink-0 hidden sm:block" />
            <select
              value={selectedStyle}
              onChange={(e) => updateFilters(activeTab, searchQuery, e.target.value)}
              className="w-full px-3.5 py-2.5 bg-forest/5 border border-forest/15 rounded-xl text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/30 transition-all font-sans cursor-pointer"
            >
              {STYLE_CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Badges & Reset Button */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-forest/10 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-forest/60 font-semibold">Active Filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-forest/10 text-forest rounded-md font-bold">
                  Query: &quot;{searchQuery}&quot;
                  <button onClick={() => updateFilters(activeTab, "", selectedStyle)}>
                    <X className="w-3 h-3 hover:text-red-600 transition-colors" />
                  </button>
                </span>
              )}
              {selectedStyle !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-forest/10 text-forest rounded-md font-bold">
                  Style: {STYLE_CATEGORIES.find((c) => c.key === selectedStyle)?.label}
                  <button onClick={() => updateFilters(activeTab, searchQuery, "all")}>
                    <X className="w-3 h-3 hover:text-red-600 transition-colors" />
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-forest/70 hover:text-forest font-bold transition-colors underline underline-offset-2 ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* VIEW TABS */}
      <div className="flex justify-center p-1.5 bg-forest/5 border border-forest/10 rounded-xl max-w-xl mx-auto mb-12">
        <button
          onClick={() => updateFilters("current", searchQuery, selectedStyle)}
          className={`flex-1 py-2.5 px-3 font-serif text-sm md:text-base tracking-wider uppercase rounded-lg transition-all duration-300 ${
            activeTab === "current"
              ? "bg-forest text-tan shadow-md font-bold"
              : "text-forest/60 hover:text-forest"
          }`}
        >
          Active Cellar
        </button>

        <button
          onClick={() => updateFilters("archive", searchQuery, selectedStyle)}
          className={`flex-1 py-2.5 px-3 font-serif text-sm md:text-base tracking-wider uppercase rounded-lg transition-all duration-300 ${
            activeTab === "archive"
              ? "bg-forest text-tan shadow-md font-bold"
              : "text-forest/60 hover:text-forest"
          }`}
        >
          Archived Logs
        </button>

        <button
          onClick={() => updateFilters("all", searchQuery, selectedStyle)}
          className={`flex-1 py-2.5 px-3 font-serif text-sm md:text-base tracking-wider uppercase rounded-lg transition-all duration-300 ${
            activeTab === "all"
              ? "bg-forest text-tan shadow-md font-bold"
              : "text-forest/60 hover:text-forest"
          }`}
        >
          Every Brew
        </button>
      </div>

      {/* CURRENT TAB */}
      {activeTab === "current" && (
        <div className="space-y-12">
          {ready.length === 0 && brewing.length === 0 && onDeck.length === 0 ? (
            <EmptyState
              text={hasActiveFilters ? "No active beers match your search criteria." : "No active beers in the cellar."}
              onReset={hasActiveFilters ? handleResetFilters : undefined}
            />
          ) : (
            <>
              <div>
                <SectionTitle title="On Tap: In the Kegerator" count={ready.length} />
                {ready.length === 0 ? (
                  <EmptyState text="No beers matching your filter currently on tap." />
                ) : (
                  <BeerGrid beers={ready} />
                )}
              </div>

              <div>
                <SectionTitle title="Fermenting: In the Carboy" count={brewing.length} />
                {brewing.length === 0 ? (
                  <EmptyState text="Nothing matching your filter brewing or fermenting right now." />
                ) : (
                  <BeerGrid beers={brewing} />
                )}
              </div>

              <div>
                <SectionTitle title="On Deck: Planned Batches" count={onDeck.length} />
                {onDeck.length === 0 ? (
                  <EmptyState text="No upcoming batches matching your filter on deck." />
                ) : (
                  <BeerGrid beers={onDeck} />
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ARCHIVE TAB */}
      {activeTab === "archive" && (
        <div className="space-y-12 animate-fade-in duration-300">
          <SectionTitle title="Historical Brew Archive" count={archived.length} />

          {archived.length === 0 ? (
            <EmptyState
              text={hasActiveFilters ? "No archived beers match your search criteria." : "No archived beers yet."}
              onReset={hasActiveFilters ? handleResetFilters : undefined}
            />
          ) : (
            <BeerGrid beers={archived} />
          )}
        </div>
      )}

      {/* EVERY BREW / ALL BATCHES TAB */}
      {activeTab === "all" && (
        <div className="space-y-12 animate-fade-in duration-300">
          <SectionTitle title="Every Beer We've Ever Made" count={filteredBeers.length} />

          {filteredBeers.length === 0 ? (
            <EmptyState
              text={hasActiveFilters ? "No beers match your search criteria across our entire catalog." : "No beers found in the catalog."}
              onReset={hasActiveFilters ? handleResetFilters : undefined}
            />
          ) : (
            <BeerGrid beers={filteredBeers} />
          )}
        </div>
      )}
    </div>
  );
}
