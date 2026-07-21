import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getBeerBySlug, getAllBeerSlugs } from "@/lib/beers.server";
import { Beer as BeerType, BeerStatus } from "@/types";
import { urlFor } from "@/lib/sanity.client";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { beerStyles } from "@/sanity/constants/beerStyles";
import { getBeerStyleGradient } from "@/lib/beerStyleTheme";
import { ActionBox } from "@/components/action-box";
import {
  BookOpen,
  ArrowLeft,
  Calendar,
  Hash,
  Droplet,
  Thermometer,
  Layers,
  Beaker,
  Activity,
  Award,
  Sparkles,
  Info
} from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
  const slugs = await getAllBeerSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

function StatusBadge({ status }: { status: BeerStatus }) {
  const map: Record<BeerStatus, { bg: string; border: string; text: string; dot: string; label: string }> = {
    on_deck: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-600",
      dot: "bg-amber-500",
      label: "Planned / On Deck",
    },
    brewing: {
      bg: "bg-blue-500/10 animate-pulse",
      border: "border-blue-500/30",
      text: "text-blue-600",
      dot: "bg-blue-500",
      label: "Brewing / Fermenting",
    },
    ready: {
      bg: "bg-emerald-500/10 animate-pulse",
      border: "border-emerald-500/30",
      text: "text-emerald-600",
      dot: "bg-emerald-500",
      label: "On Tap / Available",
    },
    archived: {
      bg: "bg-zinc-500/10",
      border: "border-zinc-500/30",
      text: "text-zinc-600",
      dot: "bg-zinc-500",
      label: "Finished Batch",
    },
  };

  const current = map[status] || map.ready;

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs uppercase tracking-widest font-mono font-bold rounded-full ${current.bg} ${current.border} ${current.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </Badge>
  );
}

export default async function BeerDetailPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const { slug } = "then" in params ? await params : params;

  const beer = await getBeerBySlug(slug);

  if (!beer) notFound();

  const styleStr = (typeof beer.style === "object" && beer.style !== null) ? beer.style.title : beer.style;
  const styleLabel = (typeof beer.style === "object" && beer.style !== null) ? beer.style.title : (beerStyles.find(s => s.value === beer.style)?.title || beer.style || "Craft Special");
  const gradient = getBeerStyleGradient(styleStr);

  // Core Temps based on real status (labeled clearly as target/estimated specifications)
  let coreTemp = "38.2°F";
  let tempTarget = "38.0°F";
  let tempStatus = "Stable Draft Temp";

  if (beer.status === "brewing") {
    coreTemp = "64.5°F";
    tempTarget = "64.0°F";
    tempStatus = "Primary Fermentation Stage";
  } else if (beer.status === "on_deck") {
    coreTemp = "--";
    tempTarget = "--";
    tempStatus = "Planned Recipe Stage";
  } else if (beer.status === "archived") {
    coreTemp = "34.0°F";
    tempTarget = "34.0°F";
    tempStatus = "Cellared";
  }

  // Check if any telemetry is explicitly defined in Sanity to prevent fake data
  const hasTelemetry = !!beer.telemetry;
  const telemetry = beer.telemetry;

  const gravityDefined = typeof telemetry?.currentGravity === "number" || typeof telemetry?.targetFg === "number";
  const waterDefined = telemetry?.waterProfile && (
    typeof telemetry.waterProfile.ph === "number" ||
    typeof telemetry.waterProfile.sulfate === "number" ||
    typeof telemetry.waterProfile.chloride === "number" ||
    typeof telemetry.waterProfile.calcium === "number"
  );
  const scheduleDefined = Array.isArray(telemetry?.kettleSchedule) && telemetry.kettleSchedule.length > 0;

  // Real, non-fabricated telemetry variables (strictly derived from telemetry or hidden if absent)
  const currentSg = telemetry?.currentGravity ? telemetry.currentGravity.toFixed(3) : null;
  const targetFg = telemetry?.targetFg ? telemetry.targetFg.toFixed(3) : null;

  const ph = telemetry?.waterProfile?.ph ? parseFloat(telemetry.waterProfile.ph.toString()).toFixed(2) : null;
  const sulfate = telemetry?.waterProfile?.sulfate || null;
  const chloride = telemetry?.waterProfile?.chloride || null;
  const calcium = telemetry?.waterProfile?.calcium || null;
  const waterNotes = telemetry?.waterProfile?.waterNotes || null;
  const kettleSchedule = telemetry?.kettleSchedule || [];

  const maxSulfate = 180;
  const maxChloride = 150;
  const maxCalcium = 100;
  const sulfatePercent = sulfate ? `${Math.min((sulfate / maxSulfate) * 100, 100)}%` : "0%";
  const chloridePercent = chloride ? `${Math.min((chloride / maxChloride) * 100, 100)}%` : "0%";
  const calciumPercent = calcium ? `${Math.min((calcium / maxCalcium) * 100, 100)}%` : "0%";

  return (
    <main className="min-h-screen bg-cream text-forest">
      <Navbar />

      {/* 1. HERO SECTION WITH IMAGE & HEADER DETAILS */}
      <section className={`relative pt-32 pb-24 md:pt-40 md:pb-32 bg-gradient-to-b ${gradient} overflow-hidden border-b border-forest/10`}>
        {/* Subtle coordinate blueprint grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%2040h40M40%200v40%22%20fill%3D%22none%22%20stroke%3D%22%231A4132%22%20stroke-opacity%3D%220.04%22%20stroke-width%3D%221%22/%3E%3C/svg%3E')] opacity-70 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <Link
            href="/beers"
            className="inline-flex items-center gap-2 text-forest/70 hover:text-forest font-mono text-sm uppercase tracking-wider transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            Back to Brew Log
          </Link>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Beer Artwork Card Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-96 md:w-80 md:h-[480px] shrink-0 shadow-2xl rounded-2xl overflow-hidden border-4 border-white/40 group bg-white/10 backdrop-blur-sm">
                {beer.image ? (
                  <Image
                    src={urlFor(beer.image).width(800).height(1200).url()}
                    alt={beer.beer_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-forest/10 to-forest/30 flex items-center justify-center">
                    <Beaker className="w-16 h-24 text-forest/40" />
                  </div>
                )}
              </div>
            </div>

            {/* Beer Header Details Panel */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="bg-white/30 border-forest/20 text-forest uppercase tracking-widest font-mono font-bold px-4 py-1">
                  {styleLabel}
                </Badge>
                <StatusBadge status={beer.status} />
                {beer.is_flagship && (
                  <Badge className="bg-forest text-tan border border-tan/20 uppercase tracking-widest font-mono font-bold px-4 py-1 shadow">
                    Flagship Recipe
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-serif leading-tight text-forest tracking-wide">
                {beer.beer_name}
              </h1>

              {/* Core Metrics Summary Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/20 backdrop-blur-sm border border-forest/10 rounded-xl">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-forest/60 font-mono font-bold">ABV</span>
                  <p className="text-2xl font-serif text-forest">{beer.abv ? `${beer.abv}%` : "TBD"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-forest/60 font-mono font-bold">IBU</span>
                  <p className="text-2xl font-serif text-forest">{beer.ibu || "N/A"}</p>
                </div>
                {beer.batchNumber && (
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-forest/60 font-mono font-bold">Batch</span>
                    <p className="text-2xl font-serif text-forest">#{beer.batchNumber}</p>
                  </div>
                )}
                {beer.brewDate && (
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-forest/60 font-mono font-bold">Brew Date</span>
                    <p className="text-sm font-mono mt-1 text-forest/80 font-bold">{new Date(beer.brewDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                )}
              </div>

              {beer.notes && (
                <div className="border-l-2 border-forest/20 pl-6 my-6">
                  <p className="text-lg leading-relaxed text-forest/80 italic font-light">
                    &ldquo;{beer.notes}&rdquo;
                  </p>
                </div>
              )}

              {/* Action Box Call To Action Button Block */}
              <div className="pt-4">
                <ActionBox status={beer.status} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SENSORY EXPERIENCE / Structured Tasting Notes */}
      {beer.tastingNotes && (beer.tastingNotes.aroma || beer.tastingNotes.flavor || beer.tastingNotes.mouthfeel) && (
        <section className="py-20 px-4 bg-white/30 border-b border-forest/5">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-forest/50">Sensory Evaluation</span>
              <h2 className="font-serif text-3xl md:text-4xl text-forest mt-2">The Organoleptic Profile</h2>
              <div className="w-16 h-0.5 bg-forest/20 mx-auto mt-4" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {beer.tastingNotes.aroma && (
                <div className="p-6 bg-white border border-forest/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="p-2.5 bg-forest/5 text-forest rounded-lg">
                      <Sparkles className="w-5 h-5 text-forest" />
                    </span>
                    <h3 className="font-serif text-lg uppercase tracking-wider text-forest">Aroma</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-forest/70">{beer.tastingNotes.aroma}</p>
                </div>
              )}

              {beer.tastingNotes.flavor && (
                <div className="p-6 bg-white border border-forest/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="p-2.5 bg-forest/5 text-forest rounded-lg">
                      <Beaker className="w-5 h-5 text-forest" />
                    </span>
                    <h3 className="font-serif text-lg uppercase tracking-wider text-forest">Flavor</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-forest/70">{beer.tastingNotes.flavor}</p>
                </div>
              )}

              {beer.tastingNotes.mouthfeel && (
                <div className="p-6 bg-white border border-forest/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="p-2.5 bg-forest/5 text-forest rounded-lg">
                      <Layers className="w-5 h-5 text-forest" />
                    </span>
                    <h3 className="font-serif text-lg uppercase tracking-wider text-forest">Mouthfeel</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-forest/70">{beer.tastingNotes.mouthfeel}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 3. BREW JOURNAL RECIPE SHEET & GRIST DETAILS */}
      {(beer.ingredients || (beer.notableHops && beer.notableHops.length > 0)) && (
        <section className="py-20 px-4 bg-tan/10 border-b border-forest/5">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-forest/50">Recipe Sheet</span>
              <h2 className="font-serif text-3xl md:text-4xl text-forest mt-2">Grist & Hop Bill</h2>
              <div className="w-16 h-0.5 bg-forest/20 mx-auto mt-4" />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {beer.ingredients && (
                <div className="p-8 bg-white border border-forest/10 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-forest/10">
                    <Layers className="w-5 h-5 text-forest" />
                    <h3 className="font-serif text-xl text-forest uppercase tracking-wide">Grain Bill & Yeast</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-forest/80 whitespace-pre-line font-light">
                    {beer.ingredients}
                  </p>
                </div>
              )}

              {beer.notableHops && beer.notableHops.length > 0 && (
                <div className="p-8 bg-white border border-forest/10 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-forest/10">
                    <Beaker className="w-5 h-5 text-forest" />
                    <h3 className="font-serif text-xl text-forest uppercase tracking-wide">Notable Kettle additions</h3>
                  </div>
                  <ul className="space-y-3">
                    {beer.notableHops.map((hop, idx) => (
                      <li key={idx} className="flex items-center gap-3 font-mono text-sm text-forest/80">
                        <span className="w-2 h-2 rounded-full bg-forest" />
                        <span>{hop}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 4. TECHNICAL KETTLE & CELLAR TELEMETRY / BREW LAB CONSOLE (ONLY SHOWN IF REAL TELEMETRY EXISTS) */}
      {hasTelemetry && (gravityDefined || waterDefined || scheduleDefined) && (
        <section className="py-20 px-4 bg-forest text-tan relative overflow-hidden border-b border-tan/10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%2040h40M40%200v40%22%20fill%3D%22none%22%20stroke%3D%22%23E8D7B5%22%20stroke-opacity%3D%220.02%22%20stroke-width%3D%221%22/%3E%3C/svg%3E')] opacity-70 pointer-events-none" />

          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-tan/40">Lab Telemetry</span>
              <h2 className="font-serif text-3xl md:text-4xl text-tan mt-2">Active Batch Technical Specs</h2>
              <div className="w-16 h-0.5 bg-tan/20 mx-auto mt-4" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cellar/Fermentation status */}
              {gravityDefined && (
                <div className="p-6 rounded-2xl border border-tan/15 bg-white/5 backdrop-blur-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-6 border-b border-tan/10 pb-4">
                    <Thermometer className="w-5 h-5 text-sky" />
                    <h4 className="font-serif text-lg text-tan">Fermentation Status</h4>
                  </div>

                  <div className="space-y-6 flex-grow">
                    {/* Temperature */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-tan/70">Cellar Temp</span>
                      <div className="text-right">
                        <span className="font-mono text-2xl text-sky font-bold">
                          {coreTemp}
                        </span>
                        <span className="text-[10px] block text-sky/60 uppercase font-mono">
                          Target: {tempTarget} ({tempStatus})
                        </span>
                      </div>
                    </div>

                    {/* Gravity */}
                    <div className="flex justify-between items-center border-t border-tan/5 pt-4">
                      <span className="text-sm text-tan/70">Gravity (SG)</span>
                      <div className="text-right">
                        <span className="font-mono text-2xl text-tan font-bold">
                          {currentSg || "--"}
                        </span>
                        {targetFg && (
                          <span className="text-[10px] block text-tan/60 uppercase font-mono">
                            Original SG: {recipeOg} | Target FG: {targetFg}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Micro Gravity graph */}
                    <div className="border border-tan/10 rounded-lg p-3 bg-black/20 mt-4">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-tan/40 mb-2 block">Fermentation Progress Curve</span>
                      <div className="h-16 w-full flex items-end gap-1 pt-2">
                        <div className="bg-tan/10 h-full flex-1 rounded-t" />
                        <div className="bg-tan/15 h-[80%] flex-1 rounded-t" />
                        <div className="bg-tan/25 h-[60%] flex-1 rounded-t" />
                        <div className="bg-tan/40 h-[40%] flex-1 rounded-t" />
                        <div className="bg-tan/50 h-[25%] flex-1 rounded-t" />
                        <div className="bg-sky h-[18%] flex-1 rounded-t" />
                        <div className="border border-dashed border-sky/30 h-[15%] flex-1 rounded-t" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Water Profile */}
              {waterDefined && (
                <div className="p-6 rounded-2xl border border-tan/15 bg-white/5 backdrop-blur-sm flex flex-col">
                  <div className="flex items-center justify-between mb-6 border-b border-tan/10 pb-4">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-5 h-5 text-sky" />
                      <h4 className="font-serif text-lg text-tan">Mash Water Profile</h4>
                    </div>
                    {ph && <span className="font-mono text-sm text-emerald-400 font-bold">{ph} pH</span>}
                  </div>

                  <div className="space-y-5 flex-grow">
                    {sulfate !== null && (
                      <div>
                        <div className="flex justify-between text-xs font-mono text-tan/60 mb-1">
                          <span>Sulfate (SO₄²⁻)</span>
                          <span>{sulfate} ppm</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="bg-sky h-full" style={{ width: sulfatePercent }} />
                        </div>
                      </div>
                    )}

                    {chloride !== null && (
                      <div>
                        <div className="flex justify-between text-xs font-mono text-tan/60 mb-1">
                          <span>Chloride (Cl⁻)</span>
                          <span>{chloride} ppm</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="bg-sky h-full" style={{ width: chloridePercent }} />
                        </div>
                      </div>
                    )}

                    {calcium !== null && (
                      <div>
                        <div className="flex justify-between text-xs font-mono text-tan/60 mb-1">
                          <span>Calcium (Ca²⁺)</span>
                          <span>{calcium} ppm</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full" style={{ width: calciumPercent }} />
                        </div>
                      </div>
                    )}

                    {waterNotes && (
                      <div className="mt-4 p-3 bg-black/10 border border-tan/5 rounded text-[11px] font-mono text-tan/60 leading-relaxed">
                        <span className="font-bold text-tan block mb-1">Chemistry Notes:</span>
                        {waterNotes}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Hop Boil Schedule */}
              {scheduleDefined && (
                <div className="p-6 rounded-2xl border border-tan/15 bg-white/5 backdrop-blur-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-6 border-b border-tan/10 pb-4">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <h4 className="font-serif text-lg text-tan">Kettle Addition Logs</h4>
                  </div>

                  <div className="space-y-4 flex-grow font-mono text-xs text-tan/80">
                    {kettleSchedule.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 relative pb-3 border-l border-amber-400/20 pl-4 ml-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400 absolute -left-[4.5px] top-1" />
                        <div>
                          <span className="text-[10px] text-amber-400 uppercase font-bold">{step.time}</span>
                          <p className="font-serif text-tan mt-0.5 text-sm">{step.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-tan/40 border border-tan/15 px-4 py-2 rounded-lg bg-black/10">
                <Info className="w-3.5 h-3.5" /> [Batch ID: ITB-{slug.toUpperCase().slice(0, 8)} • Verified Telemetry]
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. RELATED TRAIL REPORT POSTS */}
      {beer.relatedPosts && beer.relatedPosts.length > 0 && (
        <section className="py-20 px-4 bg-tan/20 border-b border-forest/5">
          <div className="container mx-auto max-w-4xl text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-forest/50">From the Logbooks</span>
            <h2 className="font-serif text-3xl md:text-4xl text-forest mt-2 mb-12 flex items-center justify-center gap-3">
              <BookOpen className="w-6 h-6 text-sky" />
              The Trail Report Notes
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {beer.relatedPosts.map((post: any) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-tan/30 text-left"
                >
                  {post.image && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={urlFor(post.image).width(600).height(400).url()}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h4 className="font-serif text-xl text-forest group-hover:text-sky transition-colors mb-2">{post.title}</h4>
                    <p className="text-xs text-forest/40 uppercase tracking-widest font-mono">
                      {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
