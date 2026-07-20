import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Beer,
  Compass,
  Flame,
  Activity,
  Award,
  RotateCcw,
  Binary,
  ArrowRight,
  Sparkles,
  Info
} from "lucide-react";
import { getPostBySlug, getAllJournalEntries } from "@/lib/blog.server";
import { PortableText } from '@portabletext/react';
import { urlFor } from "@/lib/sanity.client";
import Image from "next/image";
import { getTagColor } from "@/lib/blog-utils";

export const revalidate = 86400; // Revalidate every 24 hours

// Generate static params for SSG of journal entries
export async function generateStaticParams() {
  const entries = await getAllJournalEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function JournalDetailPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = "then" in params ? await params : params;

  const entry = await getPostBySlug(slug);

  // If the post is not found or is not flagged as a journal entry, return 404
  if (!entry || !entry.isJournalEntry) {
    notFound();
  }

  const relatedBeer = Array.isArray(entry.relatedBeers) && entry.relatedBeers.length > 0 ? entry.relatedBeers[0] : null;
  const details = entry.journalDetails;
  const metrics = details?.brewingMetrics;

  const hasMetrics = metrics && (
    typeof metrics.originalGravity === "number" ||
    typeof metrics.finalGravity === "number" ||
    typeof metrics.mashTemp === "number" ||
    typeof metrics.boilTime === "number" ||
    typeof metrics.yeastPitchTemp === "number" ||
    typeof metrics.fermentationTemp === "number"
  );

  return (
    <main className="min-h-screen bg-cream text-forest">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-forest pt-32 pb-16 overflow-hidden relative border-b border-tan/10">
        {/* Background texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23E8D7B5%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-tan/70 hover:text-tan transition-colors mb-8 group font-mono text-sm uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to The Brew Journal
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge className="bg-tan text-forest uppercase tracking-widest font-mono font-bold px-3 py-1">
              {entry.category || "Journal Log"}
            </Badge>
            {relatedBeer && (
              <Badge variant="outline" className="border-tan/30 text-tan font-mono uppercase tracking-widest px-3 py-1">
                Beer: {relatedBeer.beer_name}
              </Badge>
            )}
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-tan mb-6 leading-tight max-w-4xl">
            {entry.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-tan/70 text-xs md:text-sm font-mono border-t border-tan/10 pt-6">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky" />
              {formatDate(entry.date)}
            </span>
            {entry.read_time && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky" />
                {entry.read_time}
              </span>
            )}
            <span>|</span>
            <span>By {entry.author || "Infinite Trail"}</span>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar Grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Left column: Journal Narrative Story */}
            <div className="lg:col-span-8 space-y-12">
              {entry.image && (
                <div className="relative h-64 md:h-[450px] w-full rounded-2xl overflow-hidden shadow-xl border border-tan/30">
                  <Image
                    src={urlFor(entry.image).width(1200).height(800).url()}
                    alt={entry.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map(tag => (
                    <Badge key={tag} variant="outline" className={`text-[10px] uppercase tracking-wider px-2.5 border-none ${getTagColor(tag)}`}>
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Introduction / Content (Standard Body) */}
              {entry.content && (
                <div className="prose prose-lg prose-forest max-w-none border-b border-tan/20 pb-10">
                  <div className="font-mono text-xs uppercase text-forest/40 tracking-widest mb-4">Initial Log Entry Overview</div>
                  {Array.isArray(entry.content) ? (
                    <PortableText value={entry.content} />
                  ) : (
                    <p className="whitespace-pre-wrap">{entry.content}</p>
                  )}
                </div>
              )}

              {/* The 5 Story-driven Journal Sections */}
              <div className="space-y-10">
                {/* 1. The Plan */}
                {details?.thePlan && details.thePlan.length > 0 && (
                  <div className="p-6 md:p-8 bg-white border border-tan/30 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center gap-3 border-b border-tan/20 pb-4">
                      <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-forest font-bold">1. The Plan</h3>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-forest/40">What was intended</p>
                      </div>
                    </div>
                    <div className="prose prose-forest text-sm md:text-base text-forest/80 leading-relaxed max-w-none">
                      <PortableText value={details.thePlan} />
                    </div>
                  </div>
                )}

                {/* 2. The Brew */}
                {details?.theBrew && details.theBrew.length > 0 && (
                  <div className="p-6 md:p-8 bg-white border border-tan/30 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center gap-3 border-b border-tan/20 pb-4">
                      <div className="p-2 bg-orange-500/10 text-orange-600 rounded-lg">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-forest font-bold">2. The Brew</h3>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-forest/40">What happened during brewing</p>
                      </div>
                    </div>
                    <div className="prose prose-forest text-sm md:text-base text-forest/80 leading-relaxed max-w-none">
                      <PortableText value={details.theBrew} />
                    </div>
                  </div>
                )}

                {/* 3. Fermentation */}
                {details?.fermentation && details.fermentation.length > 0 && (
                  <div className="p-6 md:p-8 bg-white border border-tan/30 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center gap-3 border-b border-tan/20 pb-4">
                      <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-forest font-bold">3. Fermentation</h3>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-forest/40">Fermentation behavior and monitoring</p>
                      </div>
                    </div>
                    <div className="prose prose-forest text-sm md:text-base text-forest/80 leading-relaxed max-w-none">
                      <PortableText value={details.fermentation} />
                    </div>
                  </div>
                )}

                {/* 4. The Result */}
                {details?.theResult && details.theResult.length > 0 && (
                  <div className="p-6 md:p-8 bg-white border border-tan/30 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center gap-3 border-b border-tan/20 pb-4">
                      <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-forest font-bold">4. The Result</h3>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-forest/40">Organoleptic and final sensory assessment</p>
                      </div>
                    </div>
                    <div className="prose prose-forest text-sm md:text-base text-forest/80 leading-relaxed max-w-none">
                      <PortableText value={details.theResult} />
                    </div>
                  </div>
                )}

                {/* 5. Next Time */}
                {details?.nextTime && details.nextTime.length > 0 && (
                  <div className="p-6 md:p-8 bg-white border border-tan/30 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center gap-3 border-b border-tan/20 pb-4">
                      <div className="p-2 bg-purple-500/10 text-purple-600 rounded-lg">
                        <RotateCcw className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-forest font-bold">5. Next Time</h3>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-forest/40">Continuous recipe/process improvement notes</p>
                      </div>
                    </div>
                    <div className="prose prose-forest text-sm md:text-base text-forest/80 leading-relaxed max-w-none">
                      <PortableText value={details.nextTime} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column: Sticky metadata and brewing metrics */}
            <div className="lg:col-span-4 lg:sticky lg:top-[96px] space-y-8">
              {/* Brewing Metrics Card */}
              {hasMetrics && (
                <div className="bg-forest text-tan p-6 rounded-2xl border border-tan/10 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%2040h40M40%200v40%22%20fill%3D%22none%22%20stroke%3D%22%23E8D7B5%22%20stroke-opacity%3D%220.02%22%20stroke-width%3D%221%22/%3E%3C/svg%3E')] opacity-70 pointer-events-none" />

                  <div className="flex items-center gap-2 mb-4 border-b border-tan/10 pb-4 relative z-10">
                    <Binary className="w-5 h-5 text-sky" />
                    <h3 className="font-serif text-lg text-tan">Lab Logbook Metrics</h3>
                  </div>

                  <div className="space-y-4 text-xs font-mono relative z-10">
                    {metrics.originalGravity && (
                      <div className="flex justify-between border-b border-tan/5 pb-2">
                        <span className="text-tan/60">Original Gravity (OG)</span>
                        <span className="font-bold text-tan">{metrics.originalGravity.toFixed(3)}</span>
                      </div>
                    )}
                    {metrics.finalGravity && (
                      <div className="flex justify-between border-b border-tan/5 pb-2">
                        <span className="text-tan/60">Final Gravity (FG)</span>
                        <span className="font-bold text-tan">{metrics.finalGravity.toFixed(3)}</span>
                      </div>
                    )}
                    {metrics.originalGravity && metrics.finalGravity && (
                      <div className="flex justify-between border-b border-tan/5 pb-2 text-sky">
                        <span>Calculated ABV</span>
                        <span className="font-bold font-serif">
                          {((metrics.originalGravity - metrics.finalGravity) * 131.25).toFixed(2)}%
                        </span>
                      </div>
                    )}
                    {metrics.mashTemp && (
                      <div className="flex justify-between border-b border-tan/5 pb-2">
                        <span className="text-tan/60">Mash Temperature</span>
                        <span className="text-tan">{metrics.mashTemp}°F</span>
                      </div>
                    )}
                    {metrics.boilTime && (
                      <div className="flex justify-between border-b border-tan/5 pb-2">
                        <span className="text-tan/60">Boil Time</span>
                        <span className="text-tan">{metrics.boilTime} mins</span>
                      </div>
                    )}
                    {metrics.yeastPitchTemp && (
                      <div className="flex justify-between border-b border-tan/5 pb-2">
                        <span className="text-tan/60">Yeast Pitch Temp</span>
                        <span className="text-tan">{metrics.yeastPitchTemp}°F</span>
                      </div>
                    )}
                    {metrics.fermentationTemp && (
                      <div className="flex justify-between">
                        <span className="text-tan/60">Fermentation Temp</span>
                        <span className="text-tan">{metrics.fermentationTemp}°F</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Related Beer Detail Card */}
              {relatedBeer && (
                <div className="bg-white p-6 rounded-2xl border border-tan/30 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-tan/20 pb-4">
                    <Beer className="w-5 h-5 text-forest" />
                    <h3 className="font-serif text-lg text-forest">The Associated Brew</h3>
                  </div>

                  <div className="flex items-center gap-4">
                    {relatedBeer.image && (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-tan/20 bg-cream">
                        <Image
                          src={urlFor(relatedBeer.image).width(120).height(120).url()}
                          alt={relatedBeer.beer_name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <Link
                        href={`/beers/${relatedBeer.slug}`}
                        className="font-serif text-lg text-forest hover:text-sky transition-colors font-bold block leading-snug"
                      >
                        {relatedBeer.beer_name}
                      </Link>
                      <span className="text-xs text-forest/50 font-mono block mt-1">
                        {relatedBeer.style?.title || "Special Recipe"}
                      </span>
                      {relatedBeer.batchNumber && (
                        <span className="inline-block text-[10px] font-mono text-sky bg-sky/10 border border-sky/20 px-2 py-0.5 rounded-full mt-1.5 font-bold">
                          Batch #{relatedBeer.batchNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-forest/70 leading-relaxed pt-2 border-t border-tan/10 font-light">
                    Analyze the recipe sheet, hops profile, and chemical water chemistry targets for this batch in our telemetry log.
                  </p>

                  <div className="pt-2">
                    <Button asChild variant="outline" className="w-full border-forest text-forest hover:bg-forest hover:text-tan font-mono tracking-wider text-xs">
                      <Link href={`/beers/${relatedBeer.slug}`}>
                        Go to Brew Log ➔
                      </Link>
                    </Button>
                  </div>

                  {/* Brew Lab Sensor Integration */}
                  {relatedBeer.telemetry && (
                    <div className="pt-2">
                      <Button asChild className="w-full bg-forest text-tan hover:bg-forest/90 font-mono tracking-wider text-xs">
                        <Link href="/telemetry">
                          Analyze Brew Lab Sensors ➔
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Return CTA */}
      <section className="py-16 bg-tan/30 border-t border-tan/20">
        <div className="container mx-auto px-4 text-center">
          <Button
            asChild
            variant="outline"
            className="border-forest text-forest hover:bg-forest hover:text-tan rounded-full px-8 py-6 font-serif text-lg shadow-sm"
          >
            <Link href="/journal" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return to All Journal Entries
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
