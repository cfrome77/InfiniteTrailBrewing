"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Send, Beer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    const result = await subscribeToNewsletter(email);
    setIsLoading(false);

    if (result.success) {
      setIsSubmitted(true);
      setMessage(result.message);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 5000);
    } else {
      alert(result.message);
    }
  };

  return (
    <footer className="bg-forest text-tan relative overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23E8D7B5%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

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
            <p className="text-tan/70 max-w-md leading-relaxed mb-6">
              Brewed for the Next Adventure. Hand-forged craft beers in
              Frederick, MD, built with the intention and endurance of an
              adventurer.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://instagram.com/infinitetrailbrewing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-tan/10 rounded-full flex items-center justify-center hover:bg-tan/20 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl mb-6">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="/beers"
                className="text-tan/70 hover:text-tan transition-colors"
              >
                Our Beers
              </Link>
              <Link
                href="/beers?tab=archive"
                className="text-tan/70 hover:text-tan transition-colors"
              >
                Beer Archive
              </Link>
              <Link
                href="/blog"
                className="text-tan/70 hover:text-tan transition-colors"
              >
                The Trail Report
              </Link>
              <Link
                href="/our-story"
                className="text-tan/70 hover:text-tan transition-colors"
              >
                Our Story
              </Link>
              <Link
                href="/contact"
                className="text-tan/70 hover:text-tan transition-colors"
              >
                Contact
              </Link>
            </nav>
            <div className="mt-8 pt-8 border-t border-tan/10">
              <Link
                href="/admin"
                className="text-tan/20 hover:text-tan transition-colors text-xs py-2 px-1 inline-block tracking-widest uppercase"
              >
                Staff Access
              </Link>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-serif text-xl mb-6">Stay on the Trail</h4>
            <p className="text-tan/70 text-sm mb-6 leading-relaxed">
              Get brew day recaps and new beer announcements delivered to your inbox.
            </p>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-tan/10 border-tan/20 text-tan placeholder:text-tan/40 focus:border-tan focus:ring-tan"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading}
                  className="bg-tan text-forest hover:bg-tan/90 font-serif tracking-wide"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Subscribe
                </Button>
              </form>
            ) : (
              <div className="bg-tan/10 border border-tan/20 rounded-lg p-4 text-center animate-fade-in">
                <Beer className="w-6 h-6 text-tan mx-auto mb-2" />
                <p className="text-tan font-serif text-sm">{message || "Welcome to the trail!"}</p>
              </div>
            )}

            <div className="mt-10 space-y-3 text-tan/70 text-sm">
              <p>Frederick, MD</p>
              <p className="pt-1">
                <Link
                  href="mailto:hello@infinitetrailbrewing.com"
                  className="hover:text-tan transition-colors border-b border-tan/20"
                >
                  hello@infinitetrailbrewing.com
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-tan/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-tan/50 text-sm">
            © {new Date().getFullYear()} Infinite Trail Brewing. All rights
            reserved.
          </p>
          <p className="text-tan/50 text-sm">
            Drink responsibly. Must be 21+ to enter.
          </p>
        </div>
      </div>
    </footer>
  );
}
