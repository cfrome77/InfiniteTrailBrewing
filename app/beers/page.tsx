import { Beer } from "@/types";
import { sql } from "@/lib/db";
import { Suspense } from "react";

async function BeerList() {
    const beers = await sql`SELECT * FROM currently_brewing WHERE is_active = true ORDER BY started_at DESC`;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(beers as Beer[]).map((beer) => (
                <div key={beer.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-tan/20 flex flex-col">
                    {beer.image_url && (
                        <div className="h-64 relative overflow-hidden">
                            <img
                                src={beer.image_url}
                                alt={beer.beer_name}
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-2xl font-serif text-forest">{beer.beer_name}</h2>
                            {beer.is_flagship && (
                                <span className="bg-sky/20 text-sky text-[10px] uppercase px-2 py-1 rounded-full font-bold tracking-wider">Flagship</span>
                            )}
                        </div>
                        <p className="text-forest/60 font-medium mb-4">{beer.style} • {beer.abv}</p>
                        <p className="text-gray-600 mb-6 flex-grow">{beer.notes}</p>
                        <div className="pt-4 border-t border-tan/20">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                                beer.status === 'ready' ? 'bg-green-100 text-green-700' :
                                beer.status === 'brewing' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                                {beer.status.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function BeersPage() {
  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif text-forest mb-6">Our Current Brews</h1>
          <p className="text-xl text-forest/70 leading-relaxed">
            From crisp lagers to bold stouts, discover what's currently flowing at Infinite Trail.
            We rotate our taps frequently to showcase the best of seasonal brewing.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-20 text-forest font-serif text-2xl">Loading the taproom...</div>}>
            <BeerList />
        </Suspense>
      </div>
    </div>
  );
}
