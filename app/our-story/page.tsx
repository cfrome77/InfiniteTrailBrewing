"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { client } from "@/lib/sanity";

type BrewStats = {
  total: number;
  flagship: number;
};

export default function OurStoryPage() {
  const [stats, setStats] = useState<BrewStats>({
    total: 0,
    flagship: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [flagshipsCount, totalCount] = await Promise.all([
          client.fetch(`count(*[_type == "beer" && is_flagship == true])`),
          client.fetch(`count(*[_type == "beer" && status != "on_deck"])`),
        ]);

        setStats({
          flagship: flagshipsCount ?? 0,
          total: totalCount ?? 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Page Header */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-forest text-tan overflow-hidden">
        {/* Background texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23E8D7B5%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-4 tracking-wide">
            Our Story
          </h1>
          <div className="w-24 h-1 bg-tan mx-auto mb-6" />
          <p className="text-lg text-tan/80 max-w-2xl mx-auto">
            From trail to tap—the journey behind Infinite Trail Brewing.
          </p>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-20 md:py-32 bg-cream">
        <div className="container mx-auto px-4">
          {/* Image + Story */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-4 border-2 border-forest/20 rounded-lg" />
                <div className="relative z-10 flex items-center justify-center h-full bg-forest/5 rounded-lg p-8">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/InfiniteTrailBrewingLogo-Transparent-v6FezPtqxZNb3SWQzDZTLQnNvIqEf6.png"
                    alt="Infinite Trail Brewing Badge"
                    width={400}
                    height={400}
                    className="w-full max-w-sm drop-shadow-xl"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-forest mb-6">
                The Beginning
              </h2>
              <div className="space-y-6 text-lg text-forest/80 leading-relaxed">
                <p>
                  <span className="text-forest font-semibold">
                    Infinite Trail Brewing
                  </span>{" "}
                  was born from a simple belief: the greatest rewards are found
                  at the end of the hardest trails. What started as a passion
                  for homebrewing in a small garage in Frederick, MD has grown
                  into a dedication to crafting beers that capture the spirit of
                  adventure.
                </p>
                <p>
                  Every brew we create is inspired by the landscapes that
                  surround us—the rolling Blue Ridge, the rugged Catoctin
                  Mountains, and the iconic Sugarloaf peak. Each pint tells a
                  story of exploration, perseverance, and the joy of reaching a
                  summit.
                </p>
              </div>
            </div>
          </div>

          {/* Philosophy */}
          <div className="bg-forest text-tan rounded-2xl p-8 md:p-12 lg:p-16 mb-20">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl mb-6 tracking-wide">
                Our Philosophy
              </h2>
              <div className="w-16 h-1 bg-tan mx-auto mb-8" />
              <p className="text-xl text-tan/90 leading-relaxed mb-8">
                We believe beer should be hand-forged with intention and
                endurance. Every batch is crafted to be the ultimate reward
                earned at the end of the trail—fueling the pursuit of the next
                summit.
              </p>
              <p className="text-lg text-tan/70">
                We&apos;re not just making beer—we&apos;re crafting experiences
                that connect you to the trail.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="font-serif text-2xl text-forest">01</span>
              </div>
              <h3 className="font-serif text-xl text-forest mb-4">
                Rugged Quality
              </h3>
              <p className="text-forest/70">
                Built tough, just like the trails we love. Every ingredient is
                chosen with care, every process refined through dedication.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="font-serif text-2xl text-forest">02</span>
              </div>
              <h3 className="font-serif text-xl text-forest mb-4">
                Local Inspiration
              </h3>
              <p className="text-forest/70">
                Frederick, MD is our home. The mountains, trails, and community
                shape every beer we brew.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="font-serif text-2xl text-forest">03</span>
              </div>
              <h3 className="font-serif text-xl text-forest mb-4">
                Endless Exploration
              </h3>
              <p className="text-forest/70">
                The trail never truly ends. We&apos;re always experimenting,
                always pushing forward to discover new flavors and styles.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-tan/50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="font-serif text-5xl md:text-6xl text-forest mb-2">
                  {stats.flagship}
                </div>
                <div className="text-sm text-forest/60 uppercase tracking-wider">
                  Flagship Beers
                </div>
              </div>

              <div className="text-center">
                <div className="font-serif text-5xl md:text-6xl text-forest mb-2">
                  {stats.total}
                </div>
                <div className="text-sm text-forest/60 uppercase tracking-wider">
                  Batches Brewed
                </div>
              </div>

              <div className="text-center">
                <div className="font-serif text-5xl md:text-6xl text-forest mb-2">
                  1
                </div>
                <div className="text-sm text-forest/60 uppercase tracking-wider">
                  Garage Setup
                </div>
              </div>

              <div className="text-center">
                <div className="font-serif text-5xl md:text-6xl text-forest mb-2">
                  &#8734;
                </div>
                <div className="text-sm text-forest/60 uppercase tracking-wider">
                  Trails to Explore
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <h3 className="font-serif text-2xl text-forest mb-6">
              Want to try our beers?
            </h3>
            <Button
              asChild
              size="lg"
              className="bg-forest text-tan hover:bg-forest/90 font-serif tracking-wide"
            >
              <Link href="/contact" className="inline-flex items-center gap-2">
                Get in Touch
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
