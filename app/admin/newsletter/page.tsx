import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getAllPostsWithAuth } from "@/lib/blog";
import { NewsletterManager } from "../newsletter-manager";

export default async function AdminNewsletterPage() {
  const allPosts = await getAllPostsWithAuth();

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
        <div className="flex items-center justify-between mb-12">
            <div>
                <h1 className="text-4xl font-serif text-forest mb-2">Newsletter Center</h1>
                <p className="text-forest/60">Manage your subscribers and send out The Trail Report.</p>
            </div>
        </div>

        <NewsletterManager posts={allPosts} />
      </main>
      <Footer />
    </div>
  );
}
