import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import type { BlogPost } from "@/types";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";

const categories = [
  "All",
  "Brew Day",
  "Tasting Notes",
  "Recipes",
  "Tips & Learning",
];

function getCategoryColor(category?: string) {
  const colors: Record<string, string> = {
    "Brew Day": "bg-sky/20 text-sky",
    "Tasting Notes": "bg-tan text-forest",
    Recipes: "bg-forest/10 text-forest",
    "Tips & Learning": "bg-amber-100 text-amber-800",
  };

  return category ? colors[category] : "bg-tan text-forest";
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const allPosts: BlogPost[] = await getAllPosts();

  // Filter posts by category
  const filteredPosts: BlogPost[] =
    !category || category === "All"
      ? allPosts
      : allPosts.filter((p) => p.category === category);

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
          <h1 className="font-serif text-5xl md:text-6xl text-tan">
            The Brewhouse Blog
          </h1>
          <p className="text-tan/70 mt-4 text-lg max-w-2xl mx-auto">
            Brew day stories, tasting notes, recipes, and tips.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-4 bg-tan/30 border-b border-tan/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
                      : "outline"
                  }
                  size="sm"
                  className={getCategoryColor(cat)}
                >
                  {cat}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 max-w-5xl mx-auto min-h-[400px]">
        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <p className="text-center text-forest/50 py-20">
            No posts found in this category.
          </p>
        )}

        {/* Featured post */}
        {featuredPost && (
          <div className="mb-12">
            <Link href={`/blog/${featuredPost.slug}`}>
              <article className="bg-cream rounded-lg shadow hover:shadow-lg border border-tan/30 overflow-hidden">
                {featuredPost.image && (
                  <div className="relative h-64 md:h-96 w-full">
                    <Image
                      src={urlFor(featuredPost.image).width(1200).height(800).url()}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                      featuredPost.category,
                    )}`}
                  >
                    {featuredPost.category ?? "Uncategorized"}
                  </span>

                  <h2 className="text-3xl font-serif mt-2">
                    {featuredPost.title}
                  </h2>

                  <p className="text-forest/70 mt-1">{featuredPost.excerpt}</p>
                </div>
              </article>
            </Link>
          </div>
        )}

        {/* Recent posts */}
        <div className="grid md:grid-cols-2 gap-6">
          {recentPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="bg-cream rounded-lg shadow hover:shadow-lg border border-tan/30 h-full overflow-hidden">
                {post.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={urlFor(post.image).width(600).height(400).url()}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                      post.category,
                    )}`}
                  >
                    {post.category ?? "Uncategorized"}
                  </span>

                  <h3 className="text-xl font-serif mt-2">{post.title}</h3>

                  <p className="text-forest/70 mt-1">{post.excerpt}</p>
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
