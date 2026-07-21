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
  BookOpen
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

              {/* Freeform content block (full freeform markdown supported) */}
              {entry.content && (
                <div
                  className="prose prose-lg prose-forest max-w-none
                    prose-headings:font-serif prose-headings:text-forest
                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-forest/80 prose-p:leading-relaxed
                    prose-strong:text-forest
                    prose-ul:text-forest/80 prose-ol:text-forest/80
                    prose-li:marker:text-forest/50
                    prose-blockquote:border-forest/30 prose-blockquote:text-forest/70
                    prose-code:bg-tan/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-forest
                    prose-pre:bg-forest prose-pre:text-tan/90"
                >
                  {Array.isArray(entry.content) ? (
                    <PortableText value={entry.content} />
                  ) : (
                    <p className="whitespace-pre-wrap">{entry.content}</p>
                  )}
                </div>
              )}
            </div>

            {/* Right column: Sticky metadata and associated beer */}
            <div className="lg:col-span-4 lg:sticky lg:top-[96px] space-y-8">
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
