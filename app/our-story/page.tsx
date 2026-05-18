import { sql } from "@/lib/db";
import { Beer } from "@/types";

async function FlagshipBrews() {
    const flagshipBeers = await sql`SELECT * FROM currently_brewing WHERE is_flagship = true LIMIT 3`;

    if (flagshipBeers.length === 0) return null;

    return (
        <section className="py-20 bg-forest text-tan">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-serif mb-12 italic">The Foundation of Our Craft</h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {(flagshipBeers as Beer[]).map(beer => (
                        <div key={beer.id} className="p-8 border border-tan/20 rounded-2xl bg-white/5 backdrop-blur-sm">
                            <h3 className="text-2xl font-serif mb-2">{beer.beer_name}</h3>
                            <p className="text-tan/60 text-sm italic mb-4">{beer.style}</p>
                            <p className="text-tan/80 leading-relaxed text-sm">{beer.notes}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function OurStory() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Story Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="/placeholder.jpg"
          alt="Our Brewery"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-tan px-4 max-w-4xl">
          <span className="uppercase tracking-[0.3em] text-sm mb-4 block font-bold">Infinite Trail Brewing</span>
          <h1 className="text-6xl md:text-7xl font-serif mb-6 leading-tight">Born in the Pines, <br/>Raised in the PNW.</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 container mx-auto px-4 max-w-4xl">
        <div className="space-y-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-serif text-forest mb-6">Our Philosophy</h2>
            <p className="text-xl text-forest/70 leading-relaxed italic">
              "We believe that the best trails don't have an end, and neither should the search for the perfect pint."
            </p>
          </div>

          <div className="prose prose-forest lg:prose-xl mx-auto text-forest/80 leading-loose">
            <p>
              Infinite Trail Brewing started as a conversation between two friends at the end of a long hike in the Cascade Mountains.
              Exhausted, thirsty, and surrounded by the immense beauty of the Pacific Northwest, we realized that the spirit of exploration
              was exactly what the local brewing scene needed.
            </p>
            <p>
              In 2018, we converted a small garage into a 3-barrel system. Our mission was simple: craft beers that honor the landscape we love.
              That means using local hops from the Yakima Valley, pure glacier-fed water, and a willingness to take the path less traveled with our recipes.
            </p>
            <div className="my-16 border-l-4 border-tan pl-8 italic text-2xl font-serif text-forest">
              "We don't just brew for the enthusiasts; we brew for the explorers."
            </div>
            <p>
              Today, our brewery in the heart of the PNW serves as a gathering point for the community. Whether you're coming off the mountain
              covered in dust or looking for a comfortable place to share a story, our taps are always open. We remain independent,
              locally focused, and perpetually curious about what the next trail might bring.
            </p>
          </div>
        </div>
      </section>

      <FlagshipBrews />

      {/* Values */}
      <section className="py-24 bg-cream border-t border-tan/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            <div>
              <div className="w-16 h-16 bg-tan/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-4 h-4 bg-forest rounded-full" />
              </div>
              <h3 className="text-xl font-serif text-forest mb-4">Pure Ingredients</h3>
              <p className="text-forest/60 leading-relaxed">Glacier water and Yakima hops. If it's not the best nature has to offer, it's not in our tanks.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-tan/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-4 h-4 bg-forest rounded-full" />
              </div>
              <h3 className="text-xl font-serif text-forest mb-4">Sustainability</h3>
              <p className="text-forest/60 leading-relaxed">We love the trails we hike on. Our brewery is committed to carbon neutrality and waste reduction.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-tan/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-4 h-4 bg-forest rounded-full" />
              </div>
              <h3 className="text-xl font-serif text-forest mb-4">Community</h3>
              <p className="text-forest/60 leading-relaxed">The brewery is our campfire. Everyone is welcome to join the circle and share their story.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
