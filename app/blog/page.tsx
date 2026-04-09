import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

const categories = [
  "All",
  "Brew Day",
  "Tasting Notes",
  "Recipes",
  "Tips & Learning",
];

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    "Brew Day": "bg-sky/20 text-sky",
    "Tasting Notes": "bg-tan text-forest",
    Recipes: "bg-forest/10 text-forest",
    "Tips & Learning": "bg-amber-100 text-amber-800",
  };
  return colors[category] || "bg-tan text-forest";
}

// Next.js passes searchParams to page components automatically
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allPosts = await getAllPosts();

  // 1. Filter posts based on the category in the URL
  const filteredPosts =
    !category || category === "All"
      ? allPosts
      : allPosts.filter((p: any) => p.category === category);

  // 2. Separate featured vs recent from the FILTERED list
  const featuredPost = filteredPosts.find((p: any) => p.featured);
  const recentPosts = filteredPosts.filter((p: any) => !p.featured);

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <section className="bg-forest pt-32 pb-16 text-center">
        <h1 className="font-serif text-5xl text-tan">The Brewhouse Blog</h1>
        <p className="text-tan/70 mt-2">
          Brew day stories, tasting notes, recipes, and tips.
        </p>
      </section>

      <section className="py-4 bg-tan/30 border-b border-tan/50">
        {/* Add a max-width container to match your other sections */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-start">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/blog${cat === "All" ? "" : `?category=${encodeURIComponent(cat)}`}`}
                scroll={false}
                className="shrink-0" // Prevents buttons from squishing
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

      <section className="py-12 px-4 max-w-5xl mx-auto min-h-[400px]">
        {/* If no posts match the category */}
        {filteredPosts.length === 0 && (
          <p className="text-center text-forest/50 py-20">
            No posts found in this category.
          </p>
        )}

        {/* Featured Post (only show if it matches filter) */}
        {featuredPost && (
          <div className="mb-12">
            <Link href={`/blog/${featuredPost.slug}`}>
              <article className="bg-cream p-6 rounded-lg shadow hover:shadow-lg border border-tan/30">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(featuredPost.category)}`}
                >
                  {featuredPost.category}
                </span>
                <h2 className="text-3xl font-serif mt-2">
                  {featuredPost.title}
                </h2>
                <p className="text-forest/70 mt-1">{featuredPost.excerpt}</p>
              </article>
            </Link>
          </div>
        )}

        {/* Recent Posts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {recentPosts.map((post: any) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="bg-cream p-4 rounded-lg shadow hover:shadow-lg border border-tan/30 h-full">
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}
                >
                  {post.category}
                </span>
                <h3 className="text-xl font-serif mt-2">{post.title}</h3>
                <p className="text-forest/70 mt-1">{post.excerpt}</p>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
