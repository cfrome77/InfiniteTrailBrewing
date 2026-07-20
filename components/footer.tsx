"use client";

import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaFacebook } from "react-icons/fa6";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/beers", label: "The Brew Log" },
  { href: "/telemetry", label: "Brew Lab" },
  { href: "/journal", label: "Brew Journal" },
  { href: "/beers?tab=archive", label: "Archive Log" },
  { href: "/blog", label: "Lab Notes" },
  { href: "/our-story", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="bg-forest text-tan relative overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23E8D7B5%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
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
            <p className="text-tan/70 max-w-md leading-relaxed mb-6 font-light">
              Brewed for the Adventure. An experimental private craft beer lab
              and digital brew log documented in Frederick, MD.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://instagram.com/infinitetrailbrewing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-tan/10 rounded-full flex items-center justify-center hover:bg-tan/20 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </Link>
              <Link
                href="https://facebook.com/infinitetrailbrewing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-tan/10 rounded-full flex items-center justify-center hover:bg-tan/20 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl mb-6 tracking-wide uppercase text-xs font-mono text-tan/60">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={`footer-link-${link.href}`}
                  href={link.href}
                  className="text-tan/70 hover:text-tan transition-colors text-sm font-light"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 pt-8 border-t border-tan/10">
              <Link
                href="/admin"
                className="text-tan/20 hover:text-tan transition-colors text-xs py-2 px-1 inline-block tracking-widest uppercase font-mono"
              >
                Staff Access
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-xl mb-6 tracking-wide uppercase text-xs font-mono text-tan/60">Coordinates</h4>
            <div className="space-y-3 text-tan/70 font-light">
              <p className="font-mono text-sm tracking-widest">39.414° N, 77.411° W</p>
              <p className="text-sm">Frederick, MD</p>
              <p className="pt-2 text-sm">
                <Link
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "chris@chrisfrome.com"}`}
                  className="hover:text-tan transition-colors font-mono"
                >
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
                    "chris@chrisfrome.com"}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Private Lab Disclaimer */}
        <div className="mt-12 p-6 rounded-xl border border-tan/20 bg-tan/5 text-tan/80 text-sm leading-relaxed">
          <p className="font-serif text-lg mb-2 text-tan tracking-wide">Private Craft Lab Disclaimer</p>
          <p className="font-light">
            Infinite Trail Brewing is a private, non-commercial homebrew project. Our beers are crafted strictly for personal documentation, educational exploration, and sharing with friends & community events. Not for commercial sale or public distribution.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-tan/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-tan/50 text-sm font-light">
            © {new Date().getFullYear()} Infinite Trail Brewing. All rights reserved.
          </p>
          <p className="text-tan/50 text-sm font-light">
            Drink responsibly. Must be 21+ to enter.
          </p>
        </div>
      </div>
    </footer>
  );
}
