// app/blog/[slug]/page.tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, Beer } from "lucide-react";
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
