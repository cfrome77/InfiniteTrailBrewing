import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Compass,
  FlaskConical,
  Beer,
  BookOpen,
  Users,
  ArrowRight,
  Flame,
  Activity,
  Heart,
  MapPin,
  Sparkles
} from "lucide-react";
import { activeClient } from "@/lib/sanity.server";

export const revalidate = 86400;

export default async function OurStoryPage() {
  let flagshipCount = 0;
  let totalCount = 0;

  try {
    const [flagships, total] = await Promise.all([
      activeClient.fetch(`count(*[_type == "beer" && is_flagship == true && !(_id in path("drafts.**"))])`),
      activeClient.fetch(`count(*[_type == "beer" && status != "on_deck" && !(_id in path("drafts.**"))])`),
    ]);
    flagshipCount = flagships ?? 0;
    totalCount = total ?? 0;
  } catch (error) {
    console.error("Error fetching story page stats:", error);
  }

  // Visual Progression Steps
  const progressionSteps = [
    {
      step: "01",
      title: "Exploration",
      icon: <Compass className="w-6 h-6 text-emerald-500" />,
      subtitle: "The Backcountry Muse",
      description: "Our recipes start where the pavement ends. We hike, climb, and explore the rugged trails of the Blue Ridge and Catoctin Mountains, looking for the natural sensory cues—damp earth, pine needles, wild berries, and crisp mountain air—that inspire our flavor profiles.",
    },
    {
      step: "02",
      title: "Experimentation",
      icon: <FlaskConical className="w-6 h-6 text-amber-500" />,
      subtitle: "The Private Lab",
      description: "In our small garage lab in Frederick, MD, we push the limits of traditional styles. We run micro-batches (5-gallon pilot systems), testing yeast strain boundaries, untamed hop combinations, and unique grain blends with scientific curiosity.",
    },
    {
      step: "03",
      title: "Brewing",
      icon: <Beer className="w-6 h-6 text-amber-600" />,
      subtitle: "Hand-Forged Endurance",
      description: "Brew day is a test of precision and endurance. We meticulously control mash temperatures, water mineral concentrations, and boil schedules. From milling the grains to pitch day, we craft each recipe with raw passion and attention to detail.",
    },
    {
      step: "04",
      title: "Learning",
      icon: <BookOpen className="w-6 h-6 text-sky-500" />,
      subtitle: "Telemetry & Journals",
      description: "We are obsessed with progress. By logging kettle telemetry (pH values, specific gravity, fermentation curves) on our Brew Lab dashboard and cataloging our observations in our Brew Journal, we treat every batch as a classroom to refine our methods.",
    },
    {
      step: "05",
      title: "Sharing the Result",
      icon: <Users className="w-6 h-6 text-rose-500" />,
      subtitle: "The Summit Reward",
      description: "We believe the greatest reward is earned. There is nothing like opening a cold bottle at the peak of a mountain or passing a fresh-poured pint to a trail companion. We share our recipes, logs, and craft transparently with friends and the homebrew community.",
    }
  ];

  return (
    <main className="min-h-screen bg-cream text-forest">
      <Navbar />

      {/* 1. Page Header (Editorial style with standard pattern background) */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-forest text-tan overflow-hidden">
        {/* Background texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23E8D7B5%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50 pointer-events-none" />

        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-tan/10 border border-tan/20 text-xs font-mono uppercase tracking-widest text-tan/80 mb-6">
            <MapPin className="w-3.5 h-3.5" />
            <span>39.414° N, 77.411° W (Frederick, MD)</span>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6 tracking-wide uppercase">
            Our Story
          </h1>
          <div className="w-24 h-1 bg-tan mx-auto mb-6" />
          <p className="text-xl md:text-2xl text-tan/90 font-light max-w-2xl mx-auto italic">
            &ldquo;Brewed for the Adventure.&rdquo;
          </p>
        </div>
      </section>

      {/* 2. The Purpose / Personal Narrative (Authentic Homebrew Story) */}
      <section className="py-20 md:py-32 bg-cream">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Logo Badge Card */}
            <div className="relative">
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Visual design system decorative frames */}
                <div className="absolute inset-4 border-2 border-forest/20 rounded-2xl" />
                <div className="absolute -inset-1 border border-forest/5 rounded-3xl" />
                <div className="relative z-10 flex items-center justify-center h-full bg-forest/5 rounded-2xl p-8 shadow-inner">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/InfiniteTrailBrewingLogo-Transparent-v6FezPtqxZNb3SWQzDZTLQnNvIqEf6.png"
                    alt="Infinite Trail Brewing Badge"
                    width={400}
                    height={400}
                    className="w-full max-w-xs drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Story Details */}
            <div className="space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-forest/60">The Spark Behind The Kettle</span>
              <h2 className="font-serif text-4xl text-forest tracking-wide">
                Why We Exist
              </h2>
              <div className="w-16 h-1 bg-forest/20" />

              <div className="space-y-6 text-lg text-forest/80 leading-relaxed font-light">
                <p>
                  <strong className="text-forest font-semibold">Infinite Trail Brewing</strong> was born from a simple realization: the most memorable beer is the one earned with a heavy pack, dusty boots, and miles of trail left behind.
                </p>
                <p>
                  We are not an industrial, volume-first beer factory. We operate as an experimental, small-batch homebrew project. By treating each batch as a scientific study and an artistic endeavor, we connect raw backcountry hiking and climbing inspiration with meticulous brewing chemistry.
                </p>
                <p>
                  For us, brewing is not just about combining water, malt, hops, and yeast. It is about capturing a moment of rugged exploration. Whether it is an aggressive West Coast IPA mapping the aroma of pine needles or a deep, rich stout mirroring a starry night in the Blue Ridge, our beers are hand-forged for the pursuit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Visual Journey Progression (Exploration → Sharing) */}
      <section className="py-20 md:py-32 bg-white border-t border-b border-forest/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-mono uppercase tracking-widest text-forest/50">Our Process & Ethos</span>
            <h2 className="font-serif text-4xl text-forest mt-2 tracking-wide uppercase">From Grain to Glass</h2>
            <div className="w-20 h-1 bg-forest/25 mx-auto mt-4 mb-6" />
            <p className="text-base text-forest/70 font-light">
              We guide every batch through an authentic progression of discovery, chemistry, and fellowship. Here is how we craft our narrative.
            </p>
          </div>

          {/* Stepped layout progression */}
          <div className="space-y-12">
            {progressionSteps.map((step, idx) => (
              <div
                key={step.step}
                className={`grid md:grid-cols-12 gap-8 items-start p-8 rounded-2xl border border-forest/10 hover:border-forest/20 transition-all duration-300 ${
                  idx % 2 === 1 ? "bg-tan/10" : "bg-cream/20"
                }`}
              >
                {/* Step Number & Icon */}
                <div className="md:col-span-3 flex md:flex-col items-center md:items-start gap-4">
                  <div className="font-serif text-5xl md:text-6xl text-forest/20 font-bold">
                    {step.step}
                  </div>
                  <div className="p-3 bg-white border border-forest/15 rounded-xl shadow-sm">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-9 space-y-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono uppercase tracking-widest text-forest/50 font-bold">{step.subtitle}</span>
                    <h3 className="font-serif text-2xl text-forest font-semibold tracking-wide">{step.title}</h3>
                  </div>
                  <p className="text-base text-forest/75 leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Brewing Philosophy Section */}
      <section className="py-20 md:py-32 bg-forest text-tan relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23E8D7B5%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <Flame className="w-12 h-12 text-tan/40 mx-auto mb-6 animate-pulse" />
          <h2 className="font-serif text-3xl md:text-4xl mb-6 tracking-wide uppercase">
            Our Brewing Philosophy
          </h2>
          <div className="w-16 h-1 bg-tan/30 mx-auto mb-8" />

          <div className="grid md:grid-cols-2 gap-10 text-left mt-12">
            <div className="space-y-3 p-6 rounded-xl border border-tan/10 bg-tan/5">
              <h3 className="font-serif text-lg text-tan font-bold">1. Absolute Transparency</h3>
              <p className="text-sm text-tan/75 font-light leading-relaxed">
                We hide nothing behind industrial marketing walls. All grain weights, hop timings, water chemistry, yeast pitches, and fermentation tracking records are open source and logged for the community.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-xl border border-tan/10 bg-tan/5">
              <h3 className="font-serif text-lg text-tan font-bold">2. Uncompromised Quality</h3>
              <p className="text-sm text-tan/75 font-light leading-relaxed">
                We mill each batch by hand, filter water down to exact mineral PPM targets, and source high-grade grains and hop pellets. If a batch doesn&apos;t meet our scientific metrics, it doesn&apos;t make the tap.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-xl border border-tan/10 bg-tan/5">
              <h3 className="font-serif text-lg text-tan font-bold">3. Backcountry Roots</h3>
              <p className="text-sm text-tan/75 font-light leading-relaxed">
                Nature dictates our schedule. We brew styles that fit the season of the backcountry—refreshing ciders and light ales for summer summits, and thick, warming stouts for cold winter camps.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-xl border border-tan/10 bg-tan/5">
              <h3 className="font-serif text-lg text-tan font-bold">4. Continuous Curiosity</h3>
              <p className="text-sm text-tan/75 font-light leading-relaxed">
                The trail never truly ends. We never stop tweaking our recipes, altering minerals, mashing techniques, and hop ratios. Every brew day is an opportunity to chase a more perfect pint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive Relationship Cards (Navigational connections to site features) */}
      <section className="py-20 md:py-32 bg-cream">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-forest/50">Keep Exploring</span>
            <h2 className="font-serif text-4xl text-forest mt-2 tracking-wide">Continue The Adventure</h2>
            <div className="w-16 h-0.5 bg-forest/20 mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Beers Log Card */}
            <div className="bg-white rounded-2xl border border-forest/10 p-8 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-forest border border-forest/10">
                  <Beer className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl text-forest font-semibold">The Brew Log</h3>
                <p className="text-sm text-forest/70 font-light leading-relaxed">
                  Browse our full, chronological ledger of active cellar fermentations, planned pilot batches, and historical recipes.
                </p>
              </div>
              <Button asChild variant="link" className="text-forest hover:text-forest/80 font-mono text-sm p-0 justify-start mt-6 group">
                <Link href="/beers" className="flex items-center gap-1.5">
                  See Active Brews
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            {/* Brew Lab Card */}
            <div className="bg-white rounded-2xl border border-forest/10 p-8 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-forest border border-forest/10">
                  <Activity className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-serif text-xl text-forest font-semibold">Brew Lab Telemetry</h3>
                <p className="text-sm text-forest/70 font-light leading-relaxed">
                  Check live fermentation curves, gravity readings, mash pH values, and hot-side boil timelines.
                </p>
              </div>
              <Button asChild variant="link" className="text-forest hover:text-forest/80 font-mono text-sm p-0 justify-start mt-6 group">
                <Link href="/telemetry" className="flex items-center gap-1.5">
                  View Lab Data
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            {/* Blog / Lab Notes Card */}
            <div className="bg-white rounded-2xl border border-forest/10 p-8 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-forest border border-forest/10">
                  <BookOpen className="w-6 h-6 text-sky-500" />
                </div>
                <h3 className="font-serif text-xl text-forest font-semibold">Lab Notes & Reports</h3>
                <p className="text-sm text-forest/70 font-light leading-relaxed">
                  Read complete brew day recaps, water profile reports, tasting session logs, and technical field insights.
                </p>
              </div>
              <Button asChild variant="link" className="text-forest hover:text-forest/80 font-mono text-sm p-0 justify-start mt-6 group">
                <Link href="/blog" className="flex items-center gap-1.5">
                  Read Lab Reports
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Dynamic Stats Ledger (Database metrics fetched on server) */}
      <section className="py-16 bg-tan/40 border-t border-forest/5">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-4">
              <div className="font-serif text-5xl md:text-6xl text-forest font-bold mb-2">
                {flagshipCount}
              </div>
              <div className="text-xs text-forest/60 uppercase tracking-widest font-mono">
                Flagship Recipes
              </div>
            </div>

            <div className="text-center p-4">
              <div className="font-serif text-5xl md:text-6xl text-forest font-bold mb-2">
                {totalCount}
              </div>
              <div className="text-xs text-forest/60 uppercase tracking-widest font-mono">
                Batches Brewed
              </div>
            </div>

            <div className="text-center p-4">
              <div className="font-serif text-5xl md:text-6xl text-forest font-bold mb-2">
                1
              </div>
              <div className="text-xs text-forest/60 uppercase tracking-widest font-mono">
                Garage Lab
              </div>
            </div>

            <div className="text-center p-4">
              <div className="font-serif text-5xl md:text-6xl text-forest font-bold mb-2">
                &#8734;
              </div>
              <div className="text-xs text-forest/60 uppercase tracking-widest font-mono">
                Trails to Chase
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Action CTA Section */}
      <section className="py-20 md:py-32 bg-cream border-t border-forest/10 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Sparkles className="w-8 h-8 text-forest/30 mx-auto mb-6" />
          <h3 className="font-serif text-3xl text-forest mb-4 tracking-wide uppercase">
            Have questions or want to collaborate?
          </h3>
          <p className="text-base text-forest/70 font-light mb-8 leading-relaxed">
            Whether you want to trade yeast starter tips, ask about our water profiles, or plan a joint backcountry hike in Maryland, our doors are open to fellow explorers.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-forest text-tan hover:bg-forest/90 font-serif tracking-wide px-8 py-6 shadow-md hover:scale-[1.02] transition-transform"
          >
            <Link href="/contact" className="inline-flex items-center gap-2">
              Send Us a Dispatch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
