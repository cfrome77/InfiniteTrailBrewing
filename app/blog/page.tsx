import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import type { BlogPost } from "@/types";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import { getCategoryColor } from "@/lib/blog-utils";
import { Search, Filter } from "lucide-react";

const categories = [
  "All",
  "Brew Day",
  "Tasting Notes",
  "Recipes",
  "Tips & Learning",
];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;

  const allPosts: BlogPost[] = await getAllPosts();

  // Filter posts by category and search query
  let filteredPosts: BlogPost[] = allPosts;

  if (category && category !== "All") {
    filteredPosts = filteredPosts.filter((p) => p.category === category);
  }

  if (q) {
    const query = q.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.excerpt?.toLowerCase().includes(query) ||
        p.tags?.some(t => t.toLowerCase().includes(query))
    );
  }

  // Featured + recent split
  const featuredPost: BlogPost | undefined = filteredPosts.find(
    (p) => p.featured,
  );

  const recentPosts: BlogPost[] = filteredPosts.filter((p) => !p.featured);

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <section className="relative bg-forest pt-32 pb-20 md:pt-40 md:pb-32 text-center overflow-hidden">
        {/* Background texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23E8D7B5%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

        <div className="relative z-10 container mx-auto px-4">
          <Badge className="bg-tan text-forest mb-4 px-4 py-1 text-sm tracking-widest uppercase">The Trail Report</Badge>
          <h1 className="font-serif text-5xl md:text-6xl text-tan">
            The Brewhouse Blog
          </h1>
          <p className="text-tan/70 mt-4 text-lg max-w-2xl mx-auto italic font-light">
            Dispatch from the kettles and the trails.
          </p>
        </div>
      </section>

      {/* Search & Categories Bar */}
      <section className="sticky top-[72px] z-30 py-4 bg-cream/95 backdrop-blur border-b border-tan/30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide w-full md:w-auto">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/blog${cat === "All" ? "" : `?category=${encodeURIComponent(cat)}`}`}
                scroll={false}
                className="shrink-0"
              >
                <Button
                  variant={
                    category === cat || (!category && cat === "All")
                      ? "default"
                      : "ghost"
                  }
                  size="sm"
                  className={category === cat || (!category && cat === "All") ? "bg-forest text-tan" : "text-forest hover:bg-tan/20"}
                >
                  {cat}
                </Button>
              </Link>
            ))}
          </div>

          <form action="/blog" method="GET" className="relative w-full md:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/40 group-focus-within:text-forest transition-colors" />
            <input
              type="text"
              name="q"
              placeholder="Search posts..."
              defaultValue={q}
              className="w-full pl-10 pr-4 py-2 bg-tan/20 border border-tan/40 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/40 transition-all"
            />
            {category && <input type="hidden" name="category" value={category} />}
          </form>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 max-w-6xl mx-auto min-h-[400px]">
        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-tan/20 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-forest/30" />
            </div>
            <h3 className="text-xl font-serif text-forest">No trails found</h3>
            <p className="text-forest/50 mt-2">Try adjusting your search or filters.</p>
            <Button asChild variant="link" className="mt-4 text-forest">
              <Link href="/blog">Clear all filters</Link>
            </Button>
          </div>
        )}

        {/* Featured post */}
        {featuredPost && (
          <div className="mb-16">
            <Link href={`/blog/${featuredPost.slug}`} className="group">
              <article className="grid md:grid-cols-5 bg-cream rounded-2xl overflow-hidden border border-tan/30 shadow-sm group-hover:shadow-xl transition-all duration-500">
                {featuredPost.image && (
                  <div className="md:col-span-3 relative h-72 md:h-full min-h-[300px] overflow-hidden">
                    <Image
                      src={urlFor(featuredPost.image).width(1200).height(800).url()}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(featuredPost.category)}>
                        Featured: {featuredPost.category ?? "General"}
                      </Badge>
                    </div>
                  </div>
                )}
                <div className="md:col-span-2 p-8 md:p-12 flex flex-col justify-center bg-white">
                  <div className="text-sm text-forest/50 mb-4 flex items-center gap-2">
                    {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    <span className="w-1 h-1 bg-tan rounded-full" />
                    By {featuredPost.author || "Infinite Trail"}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-serif mb-4 group-hover:text-forest/80 transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-forest/70 text-lg mb-8 line-clamp-3 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <div className="mt-auto">
                    <Button className="bg-forest text-tan hover:bg-forest/90 group-hover:translate-x-1 transition-transform">
                      Read Full Report
                    </Button>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        )}

        {/* Recent posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white rounded-xl border border-tan/30 h-full flex flex-col group-hover:shadow-lg transition-all duration-300">
                {post.image && (
                  <div className="relative h-56 w-full overflow-hidden rounded-t-xl">
                    <Image
                      src={urlFor(post.image).width(600).height(400).url()}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 left-3">
                      <Badge className={getCategoryColor(post.category)}>
                        {post.category ?? "General"}
                      </Badge>
                    </div>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs text-forest/50 mb-3 uppercase tracking-wider">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>

                  <h3 className="text-xl font-serif mb-3 group-hover:text-forest/70 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-forest/70 text-sm mb-6 line-clamp-2 flex-grow leading-relaxed italic">
                    {post.excerpt}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-tan/30 text-forest/60 px-2 py-0.5 rounded-full uppercase tracking-tighter font-semibold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
