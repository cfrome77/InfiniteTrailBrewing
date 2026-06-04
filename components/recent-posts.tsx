import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog";
import { urlFor } from "@/lib/sanity";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { getCategoryColor } from "@/lib/blog-utils";

export async function RecentPosts() {
  const allPosts = await getAllPosts();
  const recentPosts = allPosts.slice(0, 3);

  if (recentPosts.length === 0) return null;

  return (
    <section className="bg-cream py-20 md:py-32 px-4 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl md:text-5xl text-forest mb-4">
              Latest from the Trail
            </h2>
            <p className="text-forest/70 text-lg">
              Follow our brewing journey, from recipe development to tasting notes and everything in between.
            </p>
          </div>
          <Link
            href="/blog"
            className="group flex items-center gap-2 text-forest font-serif text-lg hover:text-sky transition-colors"
          >
            View All Posts
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {recentPosts.map((post, idx) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-xl border border-tan/30 overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-48 w-full overflow-hidden">
                {post.image ? (
                  <Image
                    src={urlFor(post.image).width(600).height(400).url()}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-forest/5 flex items-center justify-center">
                    <span className="font-serif text-forest/20 text-4xl italic">ITB</span>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-3">
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase tracking-widest px-2 py-0 ${getCategoryColor(post.category)}`}
                  >
                    {post.category || "General"}
                  </Badge>
                </div>
                <h3 className="font-serif text-xl text-forest mb-3 group-hover:text-sky transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                <p className="text-forest/70 text-sm line-clamp-3 mb-6">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-tan/10 flex justify-between items-center text-xs font-medium text-forest/40 uppercase tracking-widest">
                   <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                   <span className="group-hover:text-forest transition-colors">Read More →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
