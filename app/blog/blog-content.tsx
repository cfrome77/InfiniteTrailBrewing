"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/lib/sanity";
import type { BlogPost } from "@/types";
import { getCategoryColor } from "@/lib/blog-utils";

interface BlogContentProps {
  allPosts: BlogPost[];
  initialCategory?: string;
}

const categories = [
  "All",
  "Brew Day",
  "Tasting Notes",
  "Recipes",
  "Tips & Learning",
];

export function BlogContent({ allPosts, initialCategory = "All" }: BlogContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allPosts, activeCategory, searchQuery]);

  // Featured + recent split
  const featuredPost = useMemo(() =>
    filteredPosts.find((p) => p.featured),
  [filteredPosts]);

  const recentPosts = useMemo(() =>
    filteredPosts.filter((p) => !p.featured),
  [filteredPosts]);

  return (
    <>
      {/* Search & Categories Bar */}
      <section className="sticky top-16 z-30 bg-cream/80 backdrop-blur-md border-b border-tan/30 py-4 px-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                className={`${
                  activeCategory === cat
                    ? "bg-forest text-tan hover:bg-forest/90"
                    : "bg-transparent text-forest border-tan/50 hover:bg-tan/20"
                } rounded-full px-4 transition-all duration-300`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/40 group-focus-within:text-forest transition-colors" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 bg-white border-tan/50 focus:border-forest focus:ring-forest rounded-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-tan/20 rounded-full text-forest/40 hover:text-forest transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 max-w-5xl mx-auto min-h-[400px]">
        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center animate-fade-in">
            <div className="w-16 h-16 bg-tan/20 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-forest/30" />
            </div>
            <p className="text-xl font-serif text-forest/50">
              No posts found matching your search.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-2 text-forest hover:text-sky transition-colors"
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Featured post */}
        {featuredPost && (
          <div className="mb-12 animate-fade-in">
            <Link href={`/blog/${featuredPost.slug}`}>
              <article className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-tan/30 overflow-hidden transition-all duration-500 hover:-translate-y-1">
                {featuredPost.image && (
                  <div className="relative h-64 md:h-[450px] w-full overflow-hidden">
                    <Image
                      src={urlFor(featuredPost.image).width(1200).height(800).url()}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )}
                <div className="p-8 md:p-10">
                  <Badge
                    variant="outline"
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(
                      featuredPost.category,
                    )}`}
                  >
                    {featuredPost.category ?? "Uncategorized"}
                  </Badge>

                  <h2 className="text-3xl md:text-4xl font-serif mt-4 group-hover:text-sky transition-colors duration-300 leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-forest/70 mt-4 text-lg leading-relaxed max-w-3xl">
                    {featuredPost.excerpt}
                  </p>

                  <div className="mt-6 flex items-center text-forest font-medium text-sm">
                    Read more
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        )}

        {/* Recent posts */}
        <div className="grid md:grid-cols-2 gap-8">
          {recentPosts.map((post, idx) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={`animate-fade-in [animation-delay:${idx * 100}ms]`}>
              <article className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-tan/30 h-full overflow-hidden transition-all duration-300 hover:-translate-y-1">
                {post.image && (
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={urlFor(post.image).width(600).height(400).url()}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <Badge
                    variant="outline"
                    className={`px-2 py-1 rounded-full text-sm font-medium border ${getCategoryColor(
                      post.category,
                    )}`}
                  >
                    {post.category ?? "Uncategorized"}
                  </Badge>

                  <h3 className="text-2xl font-serif mt-4 group-hover:text-sky transition-colors duration-300">
                    {post.title}
                  </h3>

                  <p className="text-forest/70 mt-2 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 flex items-center text-forest text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Read article <span className="ml-1">→</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
