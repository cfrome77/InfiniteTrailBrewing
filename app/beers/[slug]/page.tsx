import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { client } from "@/lib/sanity";
import { serverClient } from "@/lib/sanity.server";
import { Beer as BeerType } from "@/types";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { beerStyles } from "@/sanity/constants/beerStyles";
import { getBeerStyleGradient } from "@/lib/beerStyleTheme";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  const activeClient = process.env.SANITY_API_TOKEN ? serverClient : client;
  const slugs = await activeClient.fetch(`*[_type == "beer" && defined(slug.current)].slug.current`);
  return slugs.map((slug: string) => ({ slug }));
}

export default async function BeerDetailPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const { slug } = "then" in params ? await params : params;
  const activeClient = process.env.SANITY_API_TOKEN ? serverClient : client;

  const beer: BeerType | null = await activeClient.fetch(
    `*[_type == "beer" && slug.current == $slug][0] {
      ...,
      "slug": slug.current,
      "relatedPosts": *[_type == "post" && references(^._id) && is_published == true] {
          _id,
          title,
          "slug": slug.current,
          date,
          image
      }
    }`,
    { slug }
  );

  if (!beer) notFound();

  const styleLabel = beerStyles.find(s => s.value === beer.style)?.title || beer.style;
  const gradient = getBeerStyleGradient(beer.style);

  return (
    <main className="min-h-screen bg-cream text-forest">
      <Navbar />

      <section className={`relative pt-32 pb-20 bg-gradient-to-b ${gradient} overflow-hidden`}>
        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/beers"
            className="inline-flex items-center gap-2 text-forest/60 hover:text-forest transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to All Beers
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-12">
              {beer.image && (
                  <div className="relative w-64 h-96 md:w-80 md:h-[480px] shrink-0 shadow-2xl rounded-2xl overflow-hidden border-4 border-white/30">
                      <Image
                          src={urlFor(beer.image).width(800).height(1200).url()}
                          alt={beer.beer_name}
                          fill
                          className="object-cover"
                      />
                  </div>
              )}

              <div className="flex-grow">
                  <Badge variant="outline" className="mb-4 bg-white/20 border-forest/20 text-forest uppercase tracking-widest px-4 py-1">
                      {styleLabel}
                  </Badge>
                  <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight drop-shadow-sm">
                      {beer.beer_name}
                  </h1>

                  <div className="flex gap-6 mb-8">
                      {beer.abv && (
                          <div>
                              <div className="text-[10px] uppercase tracking-widest text-forest/40 font-bold">ABV</div>
                              <div className="text-3xl font-serif">{beer.abv}%</div>
                          </div>
                      )}
                      {beer.ibu && (
                          <div>
                              <div className="text-[10px] uppercase tracking-widest text-forest/40 font-bold">IBU</div>
                              <div className="text-3xl font-serif">{beer.ibu}</div>
                          </div>
                      )}
                  </div>

                  <p className="text-xl leading-relaxed text-forest/80 max-w-2xl italic">
                      {beer.notes}
                  </p>
              </div>
          </div>
        </div>
      </section>

      {beer.tastingNotes && (
          <section className="py-20 px-4">
              <div className="container mx-auto max-w-4xl">
                  <h2 className="font-serif text-3xl mb-12 text-center">The Experience</h2>
                  <div className="grid md:grid-cols-3 gap-12 text-center">
                      {beer.tastingNotes.aroma && (
                          <div>
                              <div className="text-[10px] uppercase tracking-[0.2em] text-forest/40 font-bold mb-4">Aroma</div>
                              <p className="text-lg text-forest/70 leading-relaxed">{beer.tastingNotes.aroma}</p>
                          </div>
                      )}
                      {beer.tastingNotes.flavor && (
                          <div>
                              <div className="text-[10px] uppercase tracking-[0.2em] text-forest/40 font-bold mb-4">Flavor</div>
                              <p className="text-lg text-forest/70 leading-relaxed">{beer.tastingNotes.flavor}</p>
                          </div>
                      )}
                      {beer.tastingNotes.mouthfeel && (
                          <div>
                              <div className="text-[10px] uppercase tracking-[0.2em] text-forest/40 font-bold mb-4">Mouthfeel</div>
                              <p className="text-lg text-forest/70 leading-relaxed">{beer.tastingNotes.mouthfeel}</p>
                          </div>
                      )}
                  </div>
              </div>
          </section>
      )}

      {/* Related Posts */}
      {beer.relatedPosts && beer.relatedPosts.length > 0 && (
          <section className="py-20 px-4 bg-tan/20">
              <div className="container mx-auto max-w-4xl text-center">
                  <h2 className="font-serif text-3xl mb-12 flex items-center justify-center gap-3">
                      <BookOpen className="w-6 h-6 text-sky" />
                      From The Trail Report
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-8">
                      {beer.relatedPosts.map((post: any) => (
                          <Link key={post._id} href={`/blog/${post.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-tan/30">
                              {post.image && (
                                  <div className="relative h-48 w-full overflow-hidden">
                                      <Image
                                          src={urlFor(post.image).width(600).height(400).url()}
                                          alt={post.title}
                                          fill
                                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                                      />
                                  </div>
                              )}
                              <div className="p-6 text-left">
                                  <h4 className="font-serif text-xl mb-2 group-hover:text-sky transition-colors">{post.title}</h4>
                                  <p className="text-xs text-forest/40 uppercase tracking-widest">{new Date(post.date).toLocaleDateString()}</p>
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
