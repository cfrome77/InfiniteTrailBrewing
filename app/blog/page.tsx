import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getAllPosts } from "@/lib/blog";
import type { BlogPost } from "@/types";
import { BlogContent } from "./blog-content";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allPosts: BlogPost[] = await getAllPosts();

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

      <BlogContent allPosts={allPosts} initialCategory={category} />

      <Footer />
    </main>
  );
}
