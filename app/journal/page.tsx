import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getAllJournalEntries } from "@/lib/blog.server";
import type { BlogPost } from "@/types";
import { urlFor } from "@/lib/sanity.client";
import Image from "next/image";
import { getTagColor, calculateReadTime } from "@/lib/blog-utils";
import { Calendar, Beaker, BookOpen, Clock } from "lucide-react";

export const revalidate = 86400; // Revalidate every 24 hours

export default async function JournalListingPage() {
  const entries: BlogPost[] = await getAllJournalEntries();

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <section className="relative bg-forest pt-32 pb-20 md:pt-40 md:pb-32 text-center overflow-hidden">
        {/* Background texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23E8D7B5%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

        <div className="relative z-10 container mx-auto px-4">
          <Badge className="bg-tan text-forest mb-4 px-4 py-1 text-sm tracking-widest uppercase font-mono font-bold">
            The Brew Journal
          </Badge>
          <h1 className="font-serif text-5xl md:text-6xl text-tan max-w-4xl mx-auto leading-tight">
            Process, Experiments & Logbooks
          </h1>
          <p className="text-tan/70 mt-4 text-lg max-w-2xl mx-auto italic font-light">
            An authentic archive of our brewing process, experimental trials, failures, successes, and lessons learned at the kettles.
          </p>
        </div>
      </section>

      {/* Intro block */}
      <section className="py-12 border-b border-tan/30 bg-tan/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-forest/80 leading-relaxed max-w-2xl mx-auto text-sm md:text-base font-light">
            Each entry represents a complete log of our journey. Unlike a polished corporate blog, this journal catalogs the raw data: mash metrics, fermentation behaviors, and honest tasting post-mortems. Filtered through the lens of continuous improvement.
          </p>
        </div>
      </section>

      {/* Main Content Listing */}
      <section className="py-16 px-4 max-w-6xl mx-auto min-h-[400px]">
        {entries.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-tan/20 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-forest/30" />
            </div>
            <h3 className="text-xl font-serif text-forest">The journal is currently pristine</h3>
            <p className="text-forest/50 mt-2 text-sm leading-relaxed">
              No experimental brew day records have been published yet. Our brewers are busy sanitizing the fermenters and scaling recipes. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {entries.map((entry) => {
              const hasRelatedBeers = Array.isArray(entry.relatedBeers) && entry.relatedBeers.length > 0;
              const relatedBeer = hasRelatedBeers ? entry.relatedBeers?.[0] : null;

              return (
                <article
                  key={entry.slug}
                  className="bg-white rounded-2xl border border-tan/30 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid md:grid-cols-12 gap-0"
                >
                  {/* Image/Photo Frame */}
                  <div className="md:col-span-5 relative min-h-[250px] md:h-full overflow-hidden bg-forest/5">
                    {entry.image ? (
                      <Image
                        src={urlFor(entry.image).width(800).height(600).url()}
                        alt={entry.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-forest/30 gap-2">
                        <Beaker className="w-12 h-12 stroke-1" />
                        <span className="text-xs font-mono tracking-widest uppercase">No Photo Logged</span>
                      </div>
                    )}

                    {/* Left overlay badge indicating Category */}
                    {entry.category && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-forest text-tan hover:bg-forest font-mono tracking-wide px-3 py-1 text-xs">
                          {entry.category}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content Info Panel */}
                  <div className="md:col-span-7 p-6 md:p-10 flex flex-col justify-between">
                    <div>
                      {/* Metadata row */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-forest/50 font-mono mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {entry.read_time || calculateReadTime(entry.content)}
                        </span>
                        <span>•</span>
                        <span>Logged by {entry.author || "Infinite Trail"}</span>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl md:text-3xl font-serif text-forest mb-4 hover:text-forest/80 transition-colors">
                        <Link href={`/journal/${entry.slug}`}>
                          {entry.title}
                        </Link>
                      </h2>

                      {/* Excerpt */}
                      <p className="text-forest/70 text-sm md:text-base mb-6 leading-relaxed italic">
                        &ldquo;{entry.excerpt}&rdquo;
                      </p>

                      {/* Related Beer / Batch Info */}
                      {relatedBeer && (
                        <div className="mb-6 p-4 rounded-xl bg-tan/10 border border-tan/30 inline-flex items-center gap-4 text-left max-w-full">
                          {relatedBeer.image && (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-tan/30 bg-white">
                              <Image
                                src={urlFor(relatedBeer.image).width(80).height(80).url()}
                                alt={relatedBeer.beer_name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-forest/50 block">Associated Brew</span>
                            <Link
                              href={`/beers/${relatedBeer.slug}`}
                              className="font-serif text-forest hover:text-sky transition-colors font-bold text-sm block truncate"
                            >
                              {relatedBeer.beer_name}
                            </Link>
                            {relatedBeer.batchNumber && (
                              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-sky bg-sky/10 border border-sky/20 px-2 py-0.5 rounded-full mt-1.5">
                                Batch #{relatedBeer.batchNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-tan/20">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {entry.tags && entry.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 border-none ${getTagColor(tag)}`}
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Link button */}
                      <Button asChild className="bg-forest text-tan hover:bg-forest/90 font-mono tracking-wider text-xs">
                        <Link href={`/journal/${entry.slug}`}>
                          View Journal Logbook ➔
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
