import Link from "next/link";
import { getFilteredPosts } from "@/lib/blog.server";
import { urlFor } from "@/lib/sanity.client";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Compass } from "lucide-react";
import { getCategoryColor } from "@/lib/blog-utils";
import Image from "next/image";

export async function RecentPosts() {
  // Let's call the filtered posts which correctly gets published website posts
  const recentPosts = await getFilteredPosts();
  const limitedPosts = recentPosts.slice(0, 3);

  return (
    <section className="bg-cream py-20 md:py-32 px-4 overflow-hidden relative">
      {/* Subtle blueprint cross coordinates overlay to sustain design consistency */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%232C4A3E%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40 pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/5 border border-forest/10 text-[11px] font-mono uppercase tracking-widest text-forest/70 mb-4">
              <Compass className="w-3.5 h-3.5 text-forest/70" />
              <span>Lab Notes & Reports</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-forest tracking-wide">
              The Trail Report
            </h2>
            <p className="text-forest/70 text-lg mt-3 font-light">
              Follow our brewing journey, from recipe development and water chemistry to tasting logs.
            </p>
          </div>
          <Link
            href="/blog"
            className="group flex items-center gap-2 text-forest font-serif text-lg hover:text-forest/80 transition-colors border-b border-forest/20 pb-1"
          >
            View All Notes
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {limitedPosts.length === 0 ? (
          /* Graceful, gorgeous empty state styled with adventure-oriented theme */
          <div className="bg-white rounded-2xl border border-tan/30 p-12 md:p-16 text-center max-w-3xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-forest/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-forest/40" />
            </div>
            <h3 className="font-serif text-2xl text-forest mb-3">No Dispatch Logs Active</h3>
            <p className="text-forest/70 text-base max-w-md mx-auto leading-relaxed italic font-light mb-8">
              We are currently sanitizing the carboys and aligning our water profiles. The next set of lab logs and brew day reports will be dispatched here soon.
            </p>
            <Link
              href="/beers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-forest text-tan hover:bg-forest/90 font-serif tracking-wide transition-all hover:scale-105 duration-300 shadow-md"
            >
              Browse Active Brew Log
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {limitedPosts.map((post) => (
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
                  <h3 className="font-serif text-xl text-forest mb-3 group-hover:text-forest/80 transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-forest/70 text-sm line-clamp-3 mb-6 font-light">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-4 border-t border-tan/10 flex justify-between items-center text-xs font-medium text-forest/40 uppercase tracking-widest">
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="group-hover:text-forest transition-colors">Read Notes →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
