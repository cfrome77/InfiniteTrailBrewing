// app/blog/[slug]/page.tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { PortableText } from '@portabletext/react';
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import { getCategoryColor } from "@/lib/blog-utils";

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
      <section className="bg-forest pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-tan/70 hover:text-tan transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <Badge
              variant="outline"
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(
                post.category || "General",
              )}`}
            >
              {post.category || "General"}
            </Badge>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-tan mb-6 text-balance">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-tan/70">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(post.date)}
            </span>
            {post.read_time && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.read_time}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {post.image && (
            <div className="relative h-64 md:h-[400px] w-full mb-10 rounded-xl overflow-hidden shadow-lg border border-tan/30">
              <Image
                src={urlFor(post.image).width(1200).height(800).url()}
                alt={post.title}
                fill
                className="object-cover"
              />
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
        </div>
      </article>

      {/* Back to Blog CTA */}
      <section className="py-12 bg-tan/30">
        <div className="container mx-auto px-4 text-center">
          <Button
            asChild
            variant="outline"
            className="border-forest text-forest hover:bg-forest hover:text-tan"
          >
            <Link href="/blog" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to All Posts
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
