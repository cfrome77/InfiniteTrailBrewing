import Link from "next/link";
import Image from "next/image";
import { Beer, ArrowRight, Activity, Thermometer, Droplet, Layers } from "lucide-react";
import { BeerStatus } from "@/types";
import { getBeerImage } from "@/lib/images";
import { getBeerStyleGradient } from "@/lib/beerStyleTheme";
import { beerStyles } from "@/sanity/constants/beerStyles";

interface FromTheBrewHouseProps {
  beers: any[];
}

export function FromTheBrewHouse({ beers }: FromTheBrewHouseProps) {
  // Let's find the active batch (not archived).
  // If there are none, we'll pick any latest beer.
  const activeBrews = beers.filter((b) => b.status !== "archived");
  const displayBeer = activeBrews.length > 0 ? activeBrews[0] : beers[0];

  if (!displayBeer) {
    return null;
  }

  // Define styling and label based on status
  const statusLabels: Record<BeerStatus, { title: string; badge: string; color: string }> = {
    on_deck: {
      title: "On Deck: Recipe Stage",
      badge: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      color: "text-amber-500",
    },
    brewing: {
      title: "Fermenting: In the Carboy",
      badge: "bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse",
      color: "text-blue-500",
    },
    ready: {
      title: "On Tap: In the Kegerator",
      badge: "bg-green-500/10 text-green-500 border-green-500/20 animate-pulse",
      color: "text-green-500",
    },
    archived: {
      title: "Completed Batch",
      badge: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
      color: "text-zinc-500",
    },
  };

  const currentStatus = statusLabels[displayBeer.status as BeerStatus] || {
    title: "Active Lab Batch",
    badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    color: "text-emerald-500",
  };

  const styleTitle = beerStyles.find((s) => s.value === displayBeer.style)?.title || displayBeer.style || "Craft Special";
  const bgGradient = getBeerStyleGradient(displayBeer.style);
  const imageUrl = getBeerImage(displayBeer, "card");

  // Determine estimated / measured gravity and chemistry
  const abvNum = displayBeer.abv || 5.0;
  const recipeOg = (1 + abvNum * 0.0078).toFixed(3);
  const recipeFg = (1 + abvNum * 0.0018).toFixed(3);
  let calculatedCurrentSg = recipeFg;
  if (displayBeer.status === "brewing") {
    calculatedCurrentSg = (parseFloat(recipeOg) - abvNum * 0.004).toFixed(3);
  } else if (displayBeer.status === "on_deck") {
    calculatedCurrentSg = 0; // represented as N/A or recipe
  }

  const currentSg = displayBeer.telemetry?.currentGravity
    ? displayBeer.telemetry.currentGravity.toFixed(3)
    : (displayBeer.status === "on_deck" ? "--" : calculatedCurrentSg);

  const ph = displayBeer.resolvedPh || "5.32";
  const sulfate = displayBeer.resolvedSulfate || 80;
  const chloride = displayBeer.resolvedChloride || 80;

  return (
    <section id="latest-brew" className="bg-forest text-tan py-20 md:py-32 px-4 relative overflow-hidden border-t border-tan/10">
      {/* Subtle blueprint coordinate grid background texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%2040h40M40%200v40%22%20fill%3D%22none%22%20stroke%3D%22%23E8D7B5%22%20stroke-opacity%3D%220.02%22%3E%3C/path%3E%3C/svg%3E')] opacity-60 pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Heading & Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tan/10 border border-tan/20 text-xs font-mono uppercase tracking-widest text-tan/80">
              <Activity className="w-3.5 h-3.5 text-tan" />
              <span>Telemetry Status Feed</span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl text-tan tracking-wide leading-tight">
              From the Brew House
            </h2>

            <p className="text-tan/80 text-lg font-light leading-relaxed">
              We track our ongoing brew cycles in real-time. Follow along with our current batch, telemetry stats, and chemistry updates live from our private garage setup.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/telemetry"
                className="group inline-flex items-center gap-2 font-serif text-lg text-tan border-b border-tan/30 pb-1 hover:text-tan/80 hover:border-tan transition-colors"
              >
                View Full Brew Lab Logs
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Live Batch Snapshot Card */}
          <div className="lg:col-span-7">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-tan/15 overflow-hidden shadow-2xl">
              {/* Card Header Area */}
              <div className="p-6 md:p-8 border-b border-tan/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02]">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-tan/50">Current Active Batch</span>
                  <h3 className="font-serif text-2xl md:text-3xl text-tan mt-1">{displayBeer.beer_name}</h3>
                  <span className="text-xs font-mono text-tan/40">Style: {styleTitle}</span>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase border ${currentStatus.badge}`}>
                  {currentStatus.title}
                </span>
              </div>

              {/* Card Body Area */}
              <div className="grid md:grid-cols-2">
                {/* Visual Image / Placeholder */}
                <div className={`relative h-56 md:h-full min-h-[220px] bg-gradient-to-b ${bgGradient} flex items-center justify-center overflow-hidden`}>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={displayBeer.beer_name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-16 h-28 bg-white/25 backdrop-blur-sm rounded-lg border border-white/40" />
                  )}
                  {/* Absolute Badge on Beer card */}
                  {displayBeer.abv && (
                    <span className="absolute bottom-4 left-4 text-xs font-mono font-bold bg-forest/80 backdrop-blur-sm border border-tan/20 text-tan px-2.5 py-1 rounded">
                      {displayBeer.abv}% ABV
                    </span>
                  )}
                </div>

                {/* Technical Telemetry Dashboard Preview */}
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-2 border-b border-tan/5 pb-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-tan/45">Telemetry Snapshot</span>
                  </div>

                  <div className="space-y-4">
                    {/* Temp Spec */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-sky/70" />
                        <span className="text-sm text-tan/70">Cellar Temp</span>
                      </div>
                      <span className="font-mono text-sm font-semibold text-tan">
                        {displayBeer.status === "brewing" ? "64.5°F" : displayBeer.status === "ready" ? "38.2°F" : "--"}
                      </span>
                    </div>

                    {/* Gravity Spec */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-400/70" />
                        <span className="text-sm text-tan/70">Current Gravity</span>
                      </div>
                      <span className="font-mono text-sm font-semibold text-tan">
                        {currentSg === "--" ? "--" : `${currentSg} SG`}
                      </span>
                    </div>

                    {/* Mash pH */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-emerald-400/70" />
                        <span className="text-sm text-tan/70">Mash Water pH</span>
                      </div>
                      <span className="font-mono text-sm font-semibold text-emerald-400">
                        {ph} pH
                      </span>
                    </div>

                    {/* Mineral Ratio */}
                    <div className="pt-3 border-t border-tan/10 space-y-1.5">
                      <div className="flex justify-between text-[11px] font-mono text-tan/50">
                        <span>Sulfate / Chloride</span>
                        <span>{sulfate} / {chloride} ppm</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden flex">
                        <div className="bg-sky h-full" style={{ width: `${(sulfate / (sulfate + chloride)) * 100}%` }} />
                        <div className="bg-amber-400 h-full" style={{ width: `${(chloride / (sulfate + chloride)) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link
                      href={`/beers/${displayBeer.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-tan/60 hover:text-tan transition-colors uppercase tracking-wider"
                    >
                      Inspect Recipe Logs →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
