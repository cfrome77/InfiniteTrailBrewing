import Link from "next/link";
import { Beer, FileText, Globe, LayoutDashboard } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="w-8 h-8 text-forest" />
          <h1 className="font-serif text-3xl text-forest">Admin Dashboard</h1>
        </div>

        <p className="text-forest/70 mb-10 text-lg">
          Welcome to the Infinite Trail Brewing admin center. Manage your beers,
          blog posts, and more from here.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Beer Management Card */}
          <Link
            href="/admin/beers"
            className="group bg-white p-8 rounded-xl border border-tan/20 shadow-sm hover:shadow-md hover:border-forest/20 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="bg-forest/10 p-3 rounded-lg group-hover:bg-forest group-hover:text-tan transition-colors text-forest">
                <Beer className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-forest mb-2">
                  Beer Management
                </h2>
                <p className="text-forest/60 text-sm">
                  Update your tap list, manage flagship beers, and organize the
                  beer archive.
                </p>
              </div>
            </div>
          </Link>

          {/* Blog Management Card */}
          <Link
            href="/admin/blog"
            className="group bg-white p-8 rounded-xl border border-tan/20 shadow-sm hover:shadow-md hover:border-forest/20 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="bg-forest/10 p-3 rounded-lg group-hover:bg-forest group-hover:text-tan transition-colors text-forest">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-forest mb-2">
                  Blog Posts
                </h2>
                <p className="text-forest/60 text-sm">
                  Write new stories, share updates, and manage your brewery's
                  news feed.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="border-t border-tan/20 pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-forest/60 hover:text-forest transition-colors font-sans text-sm uppercase tracking-widest"
          >
            <Globe className="w-4 h-4" />
            View Live Site
          </Link>
        </div>
      </div>
    </div>
  );
}
