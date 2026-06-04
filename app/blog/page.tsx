import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getAllPosts } from "@/lib/blog";
import type { BlogPost } from "@/types";
import { BlogContent } from "./blog-content";

export const dynamic = 'force-dynamic';

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

      <BlogContent allPosts={allPosts} initialCategory={category} />

      <Footer />
    </main>
  );
}
