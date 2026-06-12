import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { HomeCTA } from "@/components/home-cta"
import { Footer } from "@/components/footer"
import { NewsletterPopup } from "@/components/newsletter-popup"
import { RecentPosts } from "@/components/recent-posts"

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
  )
}
