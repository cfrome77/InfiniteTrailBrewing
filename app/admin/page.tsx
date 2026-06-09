import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Mail, Beer, Users, LayoutDashboard, Settings } from "lucide-react";
import { getSubscriberCount } from "@/app/actions/send-newsletter";

export default async function AdminOverview() {
  const subscriberCount = await getSubscriberCount();

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
                {subscriberCount} Active
            </div>
          </Link>

          {/* Subscriber Management Link */}
          <Link
            href="/admin/subscribers"
            className="group bg-white p-8 rounded-2xl border border-tan/30 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center mb-6 text-forest group-hover:bg-forest group-hover:text-tan transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif text-forest mb-2">Subscribers</h2>
            <p className="text-forest/60 text-sm">View and manage your mailing list members.</p>
          </Link>

          {/* Beer Stats placeholder */}
          <div className="bg-tan/5 p-8 rounded-2xl border border-tan/10 border-dashed flex flex-col items-center justify-center text-center opacity-60">
            <Beer className="w-12 h-12 text-forest/20 mb-4" />
            <p className="text-forest/40 font-serif text-sm">Inventory Tracking Soon</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
