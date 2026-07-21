import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { FromTheBrewHouse } from "@/components/from-the-brewhouse"
import { HomeCTA } from "@/components/home-cta"
import { Footer } from "@/components/footer"
import { NewsletterPopup } from "@/components/newsletter-popup"
import { RecentPosts } from "@/components/recent-posts"
import { getBeersForPage } from "@/lib/beers.server"

export const revalidate = 86400;

export default async function Home() {
  const beers = await getBeersForPage();

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FromTheBrewHouse beers={beers} />
      <RecentPosts />
      <HomeCTA />
      <Footer />
      <NewsletterPopup />
    </main>
  )
}
