// app/blog/[slug]/page.tsx
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
  Binary
} from "lucide-react";
import { getPostBySlug, getAllSlugs } from "@/lib/blog.server";
import { PortableText } from '@portabletext/react';
import { urlFor } from "@/lib/sanity.client";
import Image from "next/image";
import { getCategoryColor, getTagColor } from "@/lib/blog-utils";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Generate static params for SSG
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = "then" in params ? await params : params;

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <section className="bg-forest pt-32 pb-12 overflow-hidden relative">
        {/* Background texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23E8D7B5%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-tan/70 hover:text-tan transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to The Trail Report
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <Badge
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(
                post.category,
              )}`}
            >
              {post.category || "General"}
            </Badge>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl text-tan mb-6 text-balance leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-tan/70 text-sm">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky" />
              {formatDate(post.date)}
            </span>
            {post.read_time && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky" />
                {post.read_time}
              </span>
            )}
            <span className="text-tan/40">|</span>
            <span>By {post.author || "Infinite Trail"}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {post.image && (
            <div className="relative h-64 md:h-[450px] w-full mb-10 rounded-2xl overflow-hidden shadow-2xl border border-tan/30">
              <Image
                src={urlFor(post.image).width(1200).height(800).url()}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map(tag => (
                      <Badge key={tag} variant="outline" className={`text-[10px] uppercase tracking-wider px-2 border-none ${getTagColor(tag)}`}>
                          #{tag}
                      </Badge>
                  ))}
              </div>
          )}

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
            {Array.isArray(post.content) ? (
              <PortableText value={post.content} />
            ) : (
              <p className="whitespace-pre-wrap">{post.content}</p>
            )}
          </div>

          {/* Optional Brew Journal Sections & Metrics */}
          {post.isJournalEntry && post.journalDetails && (
            <div className="mt-12 pt-12 border-t border-tan/30 space-y-12">
              <div className="border-l-4 border-sky pl-4">
                <h3 className="font-serif text-2xl text-forest font-bold">Brew Day Log & Logbook Records</h3>
                <p className="text-xs text-forest/50 font-mono uppercase tracking-widest mt-1">
                  Technical process documentation from the brewhouse
                </p>
              </div>

              {/* Metrics block */}
              {post.journalDetails.brewingMetrics && (
                <div className="bg-forest text-tan p-6 rounded-2xl border border-tan/10 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%2040h40M40%200v40%22%20fill%3D%22none%22%20stroke%3D%22%23E8D7B5%22%20stroke-opacity%3D%220.02%22%20stroke-width%3D%221%22/%3E%3C/svg%3E')] opacity-70 pointer-events-none" />

                  <div className="flex items-center gap-2 mb-4 border-b border-tan/10 pb-4 relative z-10">
                    <Binary className="w-5 h-5 text-sky" />
                    <h4 className="font-serif text-lg text-tan">Lab Logbook Metrics</h4>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs font-mono relative z-10">
                    {post.journalDetails.brewingMetrics.originalGravity && (
                      <div>
                        <span className="text-tan/60 block mb-1">Original Gravity (OG)</span>
                        <span className="font-bold text-tan text-lg">{post.journalDetails.brewingMetrics.originalGravity.toFixed(3)}</span>
                      </div>
                    )}
                    {post.journalDetails.brewingMetrics.finalGravity && (
                      <div>
                        <span className="text-tan/60 block mb-1">Final Gravity (FG)</span>
                        <span className="font-bold text-tan text-lg">{post.journalDetails.brewingMetrics.finalGravity.toFixed(3)}</span>
                      </div>
                    )}
                    {post.journalDetails.brewingMetrics.originalGravity && post.journalDetails.brewingMetrics.finalGravity && (
                      <div>
                        <span className="text-sky/80 block mb-1">Calculated ABV</span>
                        <span className="font-bold text-sky text-lg font-serif">
                          {((post.journalDetails.brewingMetrics.originalGravity - post.journalDetails.brewingMetrics.finalGravity) * 131.25).toFixed(2)}%
                        </span>
                      </div>
                    )}
                    {post.journalDetails.brewingMetrics.mashTemp && (
                      <div>
                        <span className="text-tan/60 block mb-1">Mash Temp</span>
                        <span className="font-bold text-tan text-lg">{post.journalDetails.brewingMetrics.mashTemp}°F</span>
                      </div>
                    )}
                    {post.journalDetails.brewingMetrics.boilTime && (
                      <div>
                        <span className="text-tan/60 block mb-1">Boil Time</span>
                        <span className="font-bold text-tan text-lg">{post.journalDetails.brewingMetrics.boilTime} mins</span>
                      </div>
                    )}
                    {post.journalDetails.brewingMetrics.yeastPitchTemp && (
                      <div>
                        <span className="text-tan/60 block mb-1">Yeast Pitch Temp</span>
                        <span className="font-bold text-tan text-lg">{post.journalDetails.brewingMetrics.yeastPitchTemp}°F</span>
                      </div>
                    )}
                    {post.journalDetails.brewingMetrics.fermentationTemp && (
                      <div>
                        <span className="text-tan/60 block mb-1">Fermentation Temp</span>
                        <span className="font-bold text-tan text-lg">{post.journalDetails.brewingMetrics.fermentationTemp}°F</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 5-stage storytelling sections */}
              <div className="space-y-8">
                {/* 1. The Plan */}
                {post.journalDetails.thePlan && post.journalDetails.thePlan.length > 0 && (
                  <div className="p-6 bg-white border border-tan/30 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center gap-2 border-b border-tan/20 pb-3">
                      <Compass className="w-4 h-4 text-amber-600" />
                      <h4 className="font-serif text-lg text-forest font-bold">1. The Plan</h4>
                      <span className="text-[10px] font-mono uppercase text-forest/40 ml-auto">What was intended</span>
                    </div>
                    <div className="prose prose-forest text-sm leading-relaxed max-w-none">
                      <PortableText value={post.journalDetails.thePlan} />
                    </div>
                  </div>
                )}

                {/* 2. The Brew */}
                {post.journalDetails.theBrew && post.journalDetails.theBrew.length > 0 && (
                  <div className="p-6 bg-white border border-tan/30 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center gap-2 border-b border-tan/20 pb-3">
                      <Flame className="w-4 h-4 text-orange-600" />
                      <h4 className="font-serif text-lg text-forest font-bold">2. The Brew</h4>
                      <span className="text-[10px] font-mono uppercase text-forest/40 ml-auto">What happened during brewing</span>
                    </div>
                    <div className="prose prose-forest text-sm leading-relaxed max-w-none">
                      <PortableText value={post.journalDetails.theBrew} />
                    </div>
                  </div>
                )}

                {/* 3. Fermentation */}
                {post.journalDetails.fermentation && post.journalDetails.fermentation.length > 0 && (
                  <div className="p-6 bg-white border border-tan/30 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center gap-2 border-b border-tan/20 pb-3">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <h4 className="font-serif text-lg text-forest font-bold">3. Fermentation</h4>
                      <span className="text-[10px] font-mono uppercase text-forest/40 ml-auto">Fermentation logs</span>
                    </div>
                    <div className="prose prose-forest text-sm leading-relaxed max-w-none">
                      <PortableText value={post.journalDetails.fermentation} />
                    </div>
                  </div>
                )}

                {/* 4. The Result */}
                {post.journalDetails.theResult && post.journalDetails.theResult.length > 0 && (
                  <div className="p-6 bg-white border border-tan/30 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center gap-2 border-b border-tan/20 pb-3">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-serif text-lg text-forest font-bold">4. The Result</h4>
                      <span className="text-[10px] font-mono uppercase text-forest/40 ml-auto">How the beer turned out</span>
                    </div>
                    <div className="prose prose-forest text-sm leading-relaxed max-w-none">
                      <PortableText value={post.journalDetails.theResult} />
                    </div>
                  </div>
                )}

                {/* 5. Next Time */}
                {post.journalDetails.nextTime && post.journalDetails.nextTime.length > 0 && (
                  <div className="p-6 bg-white border border-tan/30 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center gap-2 border-b border-tan/20 pb-3">
                      <RotateCcw className="w-4 h-4 text-purple-600" />
                      <h4 className="font-serif text-lg text-forest font-bold">5. Next Time</h4>
                      <span className="text-[10px] font-mono uppercase text-forest/40 ml-auto">Future improvements</span>
                    </div>
                    <div className="prose prose-forest text-sm leading-relaxed max-w-none">
                      <PortableText value={post.journalDetails.nextTime} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Related Beers */}
          {post.relatedBeers && post.relatedBeers.length > 0 && (
              <div className="mt-20 pt-12 border-t border-tan/30">
                  <h3 className="font-serif text-2xl text-forest mb-8 flex items-center gap-3">
                      <Beer className="w-6 h-6 text-sky" />
                      Enjoy While Reading
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                      {post.relatedBeers.map((beer: any) => (
                          <Link key={beer._id} href={`/beers/${beer.slug}`} className="group flex items-center gap-4 bg-white p-4 rounded-xl border border-tan/20 shadow-sm hover:shadow-lg transition-all">
                              {beer.image && (
                                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                      <Image
                                          src={urlFor(beer.image).width(100).height(100).url()}
                                          alt={beer.beer_name}
                                          fill
                                          className="object-cover"
                                      />
                                  </div>
                              )}
                              <div>
                                  <h4 className="font-serif text-lg text-forest group-hover:text-sky transition-colors">{beer.beer_name}</h4>
                                  <p className="text-xs text-forest/50 uppercase tracking-tighter">{beer.style}</p>
                              </div>
                          </Link>
                      ))}
                  </div>
              </div>
          )}
        </div>
      </article>

      {/* Back to Blog CTA */}
      <section className="py-12 bg-tan/30">
        <div className="container mx-auto px-4 text-center">
          <Button
            asChild
            variant="outline"
            className="border-forest text-forest hover:bg-forest hover:text-tan rounded-full px-8 py-6 font-serif text-lg shadow-sm"
          >
            <Link href="/blog" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return to All Reports
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
