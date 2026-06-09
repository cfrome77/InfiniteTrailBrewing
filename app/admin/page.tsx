import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Mail, Beer, Users, LayoutDashboard, Settings, TrendingUp } from "lucide-react";
import { getSubscriberCount } from "@/app/actions/send-newsletter";
import { getAllBeers } from "@/lib/beers";

export default async function AdminOverview() {
  const [subscriberCount, beers] = await Promise.all([
    getSubscriberCount(),
    getAllBeers()
  ]);

  const beersOnTap = beers.filter(b => b.status === "ready").length;

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20 max-w-5xl">
        <div className="flex items-center gap-3 mb-12">
            <div className="p-2 bg-forest/10 rounded-lg">
                <LayoutDashboard className="w-8 h-8 text-forest" />
            </div>
            <h1 className="text-4xl font-serif text-forest">Brewery Overview</h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Studio Link */}
          <Link
            href="/admin/studio"
            className="group bg-white p-8 rounded-2xl border border-tan/30 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-sky/10 rounded-xl flex items-center justify-center mb-6 text-sky group-hover:bg-sky group-hover:text-tan transition-colors">
              <Settings className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif text-forest mb-2">Content Studio</h2>
            <p className="text-forest/60 text-sm">Manage beers, the Trail Report, and site assets directly in Sanity.</p>
          </Link>

          {/* Newsletter Link */}
          <Link
            href="/admin/studio/newsletter"
            className="group bg-white p-8 rounded-2xl border border-tan/30 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center mb-6 text-forest group-hover:bg-forest group-hover:text-tan transition-colors">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif text-forest mb-2">Newsletter Center</h2>
            <p className="text-forest/60 text-sm mb-4">Send broadcasts to your subscribers.</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-forest/5 rounded-full text-xs font-medium text-forest/70">
                <Users className="w-3 h-3" />
                {subscriberCount} Active Subscribers
            </div>
          </Link>

          {/* Inventory Link */}
          <Link
            href="/admin/inventory"
            className="group bg-white p-8 rounded-2xl border border-tan/30 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center mb-6 text-forest group-hover:bg-forest group-hover:text-tan transition-colors">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif text-forest mb-2">Inventory Metrics</h2>
            <p className="text-forest/60 text-sm mb-4">View brewing stats and taproom availability.</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-forest/5 rounded-full text-xs font-medium text-forest/70">
                <Beer className="w-3 h-3" />
                {beersOnTap} Beers on Tap
            </div>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
