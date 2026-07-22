import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { NewsletterPopup } from "@/components/newsletter-popup"
import { getBeersForPage } from "@/lib/beers.server"
import { Button } from "@/components/ui/button"
import { getBeerImage } from "@/lib/images"
import { getBeerStyleGradient } from "@/lib/beerStyleTheme"
import { beerStyles } from "@/sanity/constants/beerStyles"
import {
  Sparkles,
  ArrowRight
} from "lucide-react"

export const revalidate = 86400;

export default async function Home() {
  const beers = await getBeersForPage();

  // Find a featured beer (prioritize flagship, then active/tap, then latest)
  const featuredBeer =
    beers.find((b) => b.is_flagship && b.status !== "archived") ||
    beers.find((b) => b.status === "ready") ||
    beers.find((b) => b.status === "brewing") ||
    beers[0];

  let featuredBeerStyle = "Craft Special"
  let featuredBeerGradient = "from-tan/10 to-tan/20"
  let featuredBeerImageUrl = null

  if (featuredBeer) {
    const styleStr = (typeof featuredBeer.style === "object" && featuredBeer.style !== null)
      ? (featuredBeer.style.title || "")
      : (featuredBeer.style as string) || "";

    featuredBeerStyle =
      beerStyles.find((s) => s.value === styleStr)?.title ||
      styleStr ||
      "Craft Special";
    featuredBeerGradient = getBeerStyleGradient(styleStr);
    featuredBeerImageUrl = getBeerImage(featuredBeer, "card");
  }

  return (
    <main className="min-h-screen bg-cream text-forest">
      <Navbar />
      <Hero />

      {/* 2. Brand Story Section */}
      <section className="bg-cream py-20 md:py-32 px-4 relative overflow-hidden">
        {/* Blueprint coordinate grid background texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%232C4A3E%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-45 pointer-events-none" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Story Image / Emblem */}
            <div className="relative">
              <div className="relative aspect-square max-w-sm mx-auto">
                <div className="absolute inset-3 border-2 border-forest/15 rounded-2xl" />
                <div className="absolute -inset-1 border border-forest/5 rounded-3xl" />
                <div className="relative z-10 flex items-center justify-center h-full bg-forest/5 rounded-2xl p-8 shadow-inner">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/InfiniteTrailBrewingLogo-Transparent-v6FezPtqxZNb3SWQzDZTLQnNvIqEf6.png"
                    alt="Infinite Trail Brewing"
                    width={320}
                    height={320}
                    className="w-full max-w-[260px] drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Story Narrative */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/5 border border-forest/10 text-xs font-mono uppercase tracking-widest text-forest/75">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Backcountry Brewery</span>
              </div>

              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-wide leading-tight text-forest uppercase">
                A Homebrewery Built Around Curiosity
              </h2>
              <div className="w-16 h-1 bg-forest/20" />

              <p className="text-forest/80 text-lg leading-relaxed font-light">
                Based in Frederick, Maryland, Infinite Trail Brewing is a private, non-commercial homebrewery and experimental craft beer lab.
              </p>

              <p className="text-forest/75 text-base leading-relaxed font-light">
                To us, every single batch is a blank canvas. It is an exploration of science and spirit—whether we are tweaking water mineral PPMs for the perfect hop punch, adjusting the grain bill, or testing novel yeasts. We document our journey step-by-step, turning brewing logs and mountain backcountry trails into the lessons that fuel our next adventure.
              </p>

              <div className="pt-2">
                <Button
                  asChild
                  variant="outline"
                  className="border-forest text-forest hover:bg-forest hover:text-tan rounded-full px-6 py-5 font-serif text-base"
                >
                  <Link href="/our-story" className="flex items-center gap-2">
                    Read Our Story
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 5. One Featured Dynamic Element: Featured Brew */}
      {featuredBeer && (
        <section className="bg-forest text-tan py-20 md:py-32 px-4 relative overflow-hidden border-t border-b border-tan/10">
          {/* Subtle blueprint coordinate grid background texture */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%2040h40M40%200v40%22%20fill%3D%22none%22%20stroke%3D%22%23E8D7B5%22%20stroke-opacity%3D%220.02%22%3E%3C/path%3E%3C/svg%3E')] opacity-60 pointer-events-none" />

          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Narrative */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tan/10 border border-tan/20 text-xs font-mono uppercase tracking-widest text-tan/80">
                  <Sparkles className="w-3.5 h-3.5 text-tan" />
                  <span>Featured Batch</span>
                </div>

                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-tan tracking-wide leading-tight uppercase">
                  Featured Brew
                </h2>

                <p className="text-tan/80 text-base md:text-lg font-light leading-relaxed">
                  We run highly focused test batches to evaluate specific brewing profiles. Here is a highlighted recipe currently taking center stage in our cellar logs.
                </p>

                <div className="pt-2">
                  <Link
                    href={`/beers/${featuredBeer.slug}`}
                    className="group inline-flex items-center gap-2 font-serif text-lg text-tan border-b border-tan/30 pb-1 hover:text-tan/80 hover:border-tan transition-colors"
                  >
                    View Recipe & Logs
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Featured Brew Snapshot Card */}
              <div className="lg:col-span-7">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-tan/15 overflow-hidden shadow-2xl">
                  <div className="grid md:grid-cols-12">
                    {/* Visual Artwork / Placeholder */}
                    <div className={`relative h-64 md:h-full md:col-span-5 min-h-[240px] bg-gradient-to-b ${featuredBeerGradient} flex items-center justify-center overflow-hidden`}>
                      {featuredBeerImageUrl ? (
                        <Image
                          src={featuredBeerImageUrl}
                          alt={featuredBeer.beer_name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-16 h-28 bg-white/25 backdrop-blur-sm rounded-lg border border-white/40" />
                      )}
                      {featuredBeer.abv && (
                        <span className="absolute bottom-4 left-4 text-xs font-mono font-bold bg-forest/85 backdrop-blur-sm border border-tan/20 text-tan px-2.5 py-1 rounded">
                          {featuredBeer.abv}% ABV
                        </span>
                      )}
                    </div>

                    {/* Details Panel */}
                    <div className="p-8 md:col-span-7 space-y-6 flex flex-col justify-center">
                      <div>
                        <span className="text-xs font-mono uppercase tracking-widest text-tan/50 block">Recipe Profile</span>
                        <h3 className="font-serif text-2xl md:text-3xl text-tan mt-1 leading-tight">{featuredBeer.beer_name}</h3>
                        <span className="text-xs font-mono text-tan/60 mt-1 block">Style: {featuredBeerStyle}</span>
                      </div>

                      {featuredBeer.notes && (
                        <p className="text-sm text-tan/85 leading-relaxed font-light line-clamp-3 italic">
                          &ldquo;{featuredBeer.notes}&rdquo;
                        </p>
                      )}

                      <div className="pt-2">
                        <Link
                          href={`/beers/${featuredBeer.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-tan/70 hover:text-tan transition-colors uppercase tracking-wider"
                        >
                          Inspect Batch Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Final CTA Section */}
      <section className="bg-tan py-20 md:py-32 px-4 text-center relative overflow-hidden">
        <div className="container mx-auto max-w-2xl relative z-10">
          <h2 className="font-serif text-3xl md:text-5xl text-forest tracking-wide mb-4 uppercase">
            Start Exploring
          </h2>
          <p className="text-forest/85 text-lg font-light mb-8 max-w-md mx-auto leading-relaxed">
            Follow the beers. Explore the process. Read the stories behind the brew.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-forest text-tan hover:bg-forest/90 font-serif text-base px-8 py-6 tracking-wide shadow-md"
            >
              <Link href="/beers">
                Explore Our Beers
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-forest/30 text-forest hover:bg-forest/10 hover:border-forest font-serif text-base px-8 py-6 tracking-wide"
            >
              <Link href="/blog">
                Read the Brew Log
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <NewsletterPopup />
    </main>
  )
}
