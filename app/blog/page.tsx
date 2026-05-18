import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSubstackPosts } from "@/lib/substack";
import Link from "next/link";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getSubstackPosts();

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <section className="bg-forest pt-32 pb-16 text-center">
        <h1 className="font-serif text-5xl text-tan">The Brewhouse Blog</h1>
        <p className="text-tan/70 mt-2">
          Brew day stories, tasting notes, and brewery updates via Substack.
        </p>
      </section>

      <section className="py-12 px-4 max-w-5xl mx-auto min-h-[400px]">
        {posts.length === 0 && (
          <p className="text-center text-forest/50 py-20">
            No posts found. Stay tuned for updates!
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <article className="bg-white p-8 rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-300 border border-tan/20 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <time className="text-[10px] uppercase font-bold tracking-[0.2em] text-forest/30">
                    {formatDate(post.pubDate)}
                  </time>
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-sky bg-sky/5 px-2 py-1 rounded">
                    Substack
                  </span>
                </div>

                <h3 className="text-2xl font-serif text-forest mb-4 group-hover:text-sky transition-colors">
                  {post.title}
                </h3>

                <p className="text-forest/70 text-sm leading-relaxed line-clamp-4 flex-grow">
                  {post.contentSnippet}
                </p>

                <div className="mt-8 pt-6 border-t border-tan/10 flex items-center text-xs font-bold uppercase tracking-widest text-forest/40 group-hover:text-forest transition-colors">
                  Read Full Story
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </article>
            </a>
          ))}
        </div>
      </section>

      <section className="py-20 bg-tan/10 border-t border-tan/20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-serif text-forest mb-4">Never Miss a Brew Day</h2>
          <p className="text-forest/60 mb-8 leading-relaxed">
            Get the full Infinite Trail experience delivered straight to your inbox.
            Subscribe to our Substack for detailed recipes, process notes, and more.
          </p>
          <a
            href={process.env.SUBSTACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-forest text-tan px-10 py-4 rounded-full font-serif text-lg hover:bg-forest/90 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Join our Substack
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
