import Image from "next/image"
import Link from "next/link"
import { Instagram, Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-forest text-tan">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/InfiniteTrailBrewingWordmarkDeepForest-Transparent-mWmicyKGqRtwkNbzt0Qqv431s925IK.png"
              alt="Infinite Trail Brewing"
              width={200}
              height={67}
              className="h-14 w-auto brightness-0 invert mb-6"
            />
            <p className="text-tan/70 max-w-md leading-relaxed mb-6">
              Brewed for the Next Adventure. Hand-forged craft beers in Frederick, MD, built with the intention and endurance of an adventurer.
            </p>
            <div className="flex gap-4">
              <Link 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-tan/10 rounded-full flex items-center justify-center hover:bg-tan/20 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-tan/10 rounded-full flex items-center justify-center hover:bg-tan/20 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl mb-6">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/beers" className="text-tan/70 hover:text-tan transition-colors">Our Beers</Link>
              <Link href="/beers?tab=archive" className="text-tan/70 hover:text-tan transition-colors">Beer Archive</Link>
              <Link href="/blog" className="text-tan/70 hover:text-tan transition-colors">Blog</Link>
              <Link href="/our-story" className="text-tan/70 hover:text-tan transition-colors">Our Story</Link>
              <Link href="/contact" className="text-tan/70 hover:text-tan transition-colors">Contact</Link>
            </nav>
            <div className="mt-8 pt-8 border-t border-tan/10">
              <Link href="/login" className="text-tan/20 hover:text-tan transition-colors text-[10px] tracking-widest uppercase">
                Staff Access
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-xl mb-6">Contact</h4>
            <div className="space-y-3 text-tan/70">
              <p>Frederick, MD</p>
              <p className="pt-2">
                <Link href="mailto:hello@infinitetrailbrewing.com" className="hover:text-tan transition-colors">
                  hello@infinitetrailbrewing.com
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-tan/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-tan/50 text-sm">
            © {new Date().getFullYear()} Infinite Trail Brewing. All rights reserved.
          </p>
          <p className="text-tan/50 text-sm">
            Drink responsibly. Must be 21+ to enter.
          </p>
        </div>
      </div>
    </footer>
  )
}
