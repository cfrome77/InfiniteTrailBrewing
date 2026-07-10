import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { RecentPosts } from "@/components/recent-posts";
import { HomeCTA } from "@/components/home-cta";
import { Footer } from "@/components/footer";
import { NewsletterPopup } from "@/components/newsletter-popup";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <RecentPosts />
      <HomeCTA />
      <Footer />
      <NewsletterPopup />
    </main>
  );
}
