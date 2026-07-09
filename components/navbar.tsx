"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { FaInstagram, FaFacebook } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/beers", label: "The Brew Log" },
  { href: process.env.NEXT_PUBLIC_FOURTHWALL_SHOP_URL, label: "Shop Merch", isExternal: true },
  { href: "/blog", label: "Lab Notes" },
  { href: "/our-story", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const showSolidBg = isScrolled || !isHomePage;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showSolidBg
          ? "bg-forest/95 backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <nav className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/InfiniteTrailBrewingWordmarkDeepForest-Transparent-mWmicyKGqRtwkNbzt0Qqv431s925IK.png"
            alt="Infinite Trail Brewing"
            width={240}
            height={80}
            className={`transition-all duration-300 ${
              showSolidBg
                ? "h-12 w-auto brightness-0 invert"
                : "h-16 w-auto brightness-0 invert"
            }`}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isExternal = "isExternal" in link && link.isExternal;
            return (
              <Link
                key={link.href}
                href={link.href || "/"}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={`font-sans text-sm tracking-wide uppercase transition-colors ${
                  pathname === link.href
                    ? "text-tan"
                    : "text-tan/70 hover:text-tan"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Social */}
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-tan/30">
            <Link
              href="https://instagram.com/infinitetrailbrewing"
              target="_blank"
              className="text-tan/70 hover:text-tan"
            >
              <FaInstagram className="w-5 h-5" />
            </Link>
            <Link
              href="https://facebook.com/infinitetrailbrewing"
              target="_blank"
              className="text-tan/70 hover:text-tan"
            >
              <FaFacebook className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Mobile Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-tan hover:bg-tan/10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-forest/95 backdrop-blur-md border-t border-tan/20 animate-fade-in duration-300">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => {
              const isExternal = "isExternal" in link && link.isExternal;
              return (
                <Link
                  key={link.href}
                  href={link.href || "/"}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="font-sans text-lg uppercase py-2 text-tan/70 hover:text-tan"
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Social */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-tan/20">
              <Link
                href="https://instagram.com/infinitetrailbrewing"
                target="_blank"
                className="w-10 h-10 bg-tan/10 rounded-full flex items-center justify-center"
              >
                <FaInstagram className="w-5 h-5" />
              </Link>

              <Link
                href="https://facebook.com"
                target="_blank"
                className="w-10 h-10 bg-tan/10 rounded-full flex items-center justify-center"
              >
                <FaFacebook className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
