import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Mail, BookOpen, Beer, Settings } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20 max-w-5xl">
        <h1 className="text-4xl font-serif text-forest mb-12">Staff Dashboard</h1>

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
            <p className="text-forest/60 text-sm">Manage beers, blog posts, and site content directly in Sanity.</p>
          </Link>

          {/* Newsletter Link */}
          <Link
            href="/admin/newsletter"
            className="group bg-white p-8 rounded-2xl border border-tan/30 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center mb-6 text-forest group-hover:bg-forest group-hover:text-tan transition-colors">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif text-forest mb-2">Newsletter Center</h2>
            <p className="text-forest/60 text-sm">Send out The Trail Report to your subscribers using Resend.</p>
          </Link>

          {/* Analytics/Other Placeholder */}
          <div className="bg-tan/5 p-8 rounded-2xl border border-tan/10 border-dashed flex flex-col items-center justify-center text-center opacity-60">
            <Beer className="w-12 h-12 text-forest/20 mb-4" />
            <p className="text-forest/40 font-serif">More Staff Tools Coming Soon</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
