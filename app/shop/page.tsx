import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  Tag,
  ArrowRight,
  Store,
} from "lucide-react";

export const metadata = {
  title: "Shop Merch | Infinite Trail Brewing",
  description:
    "Explore official apparel, gear, stickers, and merchandise from Infinite Trail Brewing, powered by Fourthwall.",
};

export default function ShopPage() {
  const shopUrl =
    process.env.NEXT_PUBLIC_FOURTHWALL_SHOP_URL ||
    "https://shop.infinitetrailbrewing.chrisfrome.com/";

  // Featured merchandise preview items
  const featuredItems = [
    {
      id: "sticker",
      title: "Infinite Trail Brewing Logo Sticker",
      price: "$6.78",
      category: "Stickers & Decals",
      description:
        "High-durability, weatherproof vinyl sticker featuring our classic forest crest. Perfect for water bottles, coolers, and gear cases.",
      image:
        "https://imgproxy.fourthwall.dev/7bYP6u28r3m5bWhzWsvfZCIOljD5Qu_taMTPl1osXoY/w:720/sm:1/enc/U9nWhZtnRnGZZ1np/aL0Fjn5PAlhG86NJ/plJY1mBMQ4Dya_fp/42AcLboWJPJbi5Ce/8Cmmww17-M5c7sAn/YwRQslRRcVUeRzGa/YCWRlGVrK07xkB3k/lJMgs7Zp2ki4EAyG/_i2BpE5uU7PpX-sC/rGPSZYfrJLLENWpl/R63XCyoqLwERAr-z/Vk9EIMRbASugjb6R/JhkTltfyCfachjHA/cPe0GYEcgmbfquTj/WEFKo3q5rxM.webp",
      url: `${shopUrl.replace(/\/$/, "")}/products/infinite-trail-brewing-logo-sticker`,
    },
    {
      id: "apparel",
      title: "Trailhead Craft Apparel Collection",
      price: "Featured Collection",
      category: "Apparel & Gear",
      description:
        "Premium organic tees, hoodies, and trail caps featuring custom Infinite Trail artwork. Built for comfort on the trail and in the taproom.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/InfiniteTrailBrewingLogo-Transparent-v6FezPtqxZNb3SWQzDZTLQnNvIqEf6.png",
      url: shopUrl,
    },
  ];

  return (
    <main className="min-h-screen bg-cream text-forest flex flex-col">
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-forest text-tan overflow-hidden">
        {/* Background texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23E8D7B5%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50 pointer-events-none" />

        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tan/10 border border-tan/20 text-xs font-mono uppercase tracking-widest text-tan/80 mb-6">
            <ShoppingBag className="w-3.5 h-3.5 text-tan" />
            <span>Official Trail Store • Embedded Fourthwall Shop</span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4 tracking-wide uppercase">
            Shop Merch & Gear
          </h1>
          <div className="w-24 h-1 bg-tan mx-auto mb-6" />
          <p className="text-lg md:text-xl text-tan/90 font-light max-w-2xl mx-auto italic">
            Official Infinite Trail Brewing merchandise, trail accessories, and limited-run apparel.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-tan text-forest hover:bg-tan/90 font-serif tracking-wide px-8 py-6 shadow-md hover:scale-[1.02] transition-transform"
            >
              <Link
                href="#embedded-store"
                className="inline-flex items-center gap-2 text-base font-bold"
              >
                <Store className="w-5 h-5" />
                <span>Browse Embedded Store Below</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Embedded Store Container */}
      <section id="embedded-store" className="py-12 bg-white border-b border-forest/10">
        <div className="container mx-auto px-2 sm:px-4 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-forest/60">
              Interactive Storefront
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-forest mt-1 tracking-wide uppercase">
              Embedded Fourthwall Store
            </h2>
            <div className="w-16 h-1 bg-forest/20 mx-auto mt-3" />
          </div>

          <div className="relative w-full rounded-2xl border border-forest/15 overflow-hidden shadow-lg bg-cream/30 min-h-[700px]">
            <iframe
              src={shopUrl}
              title="Infinite Trail Brewing Merch Store"
              className="w-full h-[80vh] min-h-[650px] border-0 rounded-2xl"
              allow="payment; camera; microphone; geolocation"
            />
          </div>

          <div className="mt-4 text-center text-xs text-forest/60 font-light flex items-center justify-center gap-2">
            <span>If browser security or adblockers prevent the embedded window from displaying:</span>
            <Link
              href={shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-forest hover:underline inline-flex items-center gap-1"
            >
              Open store in direct window
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection Showcase */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-forest/60">
              Featured Items
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-forest mt-2 tracking-wide uppercase">
              Merchandise Highlights
            </h2>
            <div className="w-16 h-1 bg-forest/20 mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-forest/10 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-square w-full bg-forest/5 flex items-center justify-center p-8 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={400}
                      height={400}
                      className="object-contain max-h-72 group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute top-4 left-4 bg-forest text-tan text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-6 md:p-8 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-xl md:text-2xl text-forest font-semibold">
                        {item.title}
                      </h3>
                      <span className="font-mono text-base font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-sm text-forest/75 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 md:p-8 pt-0">
                  <Button
                    asChild
                    className="w-full bg-forest text-tan hover:bg-forest/90 font-serif tracking-wide py-5"
                  >
                    <Link
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      <span>Order on Fourthwall Store</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Guarantee & Store Info */}
          <div className="mt-16 bg-white rounded-2xl border border-forest/10 p-8 md:p-12 shadow-sm text-center max-w-4xl mx-auto space-y-6">
            <div className="w-12 h-12 bg-forest/5 rounded-2xl flex items-center justify-center mx-auto text-forest">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-forest font-semibold uppercase tracking-wide">
                Seamless Checkout via Fourthwall
              </h3>
              <p className="text-forest/75 text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed">
                All merchandise orders are fulfilled through our official Fourthwall storefront. Enjoy worldwide shipping, multiple payment currencies, and order tracking.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-forest/10 text-left max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-forest font-mono uppercase">Worldwide Shipping</p>
                  <p className="text-xs text-forest/60 font-light">Direct to your door</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-forest font-mono uppercase">Secure Checkout</p>
                  <p className="text-xs text-forest/60 font-light">Encrypted transactions</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-forest font-mono uppercase">Authentic Gear</p>
                  <p className="text-xs text-forest/60 font-light">Designed for explorers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
