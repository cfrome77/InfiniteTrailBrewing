"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Instagram, Facebook, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/components/auth-provider";

const navLinks = [
  { href: "/beers", label: "Our Beers" },
  { href: "/blog", label: "Blog" },
  { href: "/our-story", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // SINGLE SOURCE OF TRUTH FOR AUTH
  const { user } = useAuth();

  // admin check (derived, not stored state)
  const isAdmin =
    user?.app_metadata?.role === "admin" ||
    user?.user_metadata?.role === "admin";

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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-sans text-sm tracking-wide uppercase transition-colors ${
                pathname === link.href
                  ? "text-tan"
                  : "text-tan/70 hover:text-tan"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* 🔥 ADMIN NAVIGATION */}
          {isAdmin && (
            <div className="flex items-center gap-1">
              <Link
                href="/admin"
                className={`font-sans text-sm tracking-wide uppercase transition-colors ${
                  pathname === "/admin"
                    ? "text-tan"
                    : "text-tan/70 hover:text-tan"
                }`}
              >
                Admin
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="font-sans text-sm tracking-wide uppercase flex items-center gap-1 text-tan/70 hover:text-tan transition-colors outline-none">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="bg-forest border-tan/20 text-tan"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin/beers"
                      className="cursor-pointer hover:bg-tan/10"
                    >
                      Beer Panel
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin/blog"
                      className="cursor-pointer hover:bg-tan/10"
                    >
                      Blog Panel
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href="/logout"
                      className="cursor-pointer text-red-400 hover:bg-red-400/10"
                    >
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
          )}

          {/* Social */}
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-tan/30">
            <Link
              href="https://instagram.com"
              target="_blank"
              className="text-tan/70 hover:text-tan"
            >
              <Instagram className="w-5 h-5" />
            </Link>

            <Link
              href="https://facebook.com"
              target="_blank"
              className="text-tan/70 hover:text-tan"
            >
              <Facebook className="w-5 h-5" />
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
        <div className="md:hidden bg-forest/95 backdrop-blur-md border-t border-tan/20">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-lg uppercase py-2 text-tan/70 hover:text-tan"
              >
                {link.label}
              </Link>
            ))}

            {/* 🔥 ADMIN MOBILE MENU */}
            {isAdmin && (
              <>
                <div className="h-px bg-tan/20 my-2" />

                <Link
                  href="/admin"
                  className={`font-sans text-lg uppercase py-2 ${
                    pathname === "/admin"
                      ? "text-tan"
                      : "text-tan/70 hover:text-tan"
                  }`}
                >
                  Admin Dashboard
                </Link>

                <Link
                  href="/admin/beers"
                  className="text-tan/70 hover:text-tan pl-4"
                >
                  Beer Panel
                </Link>

                <Link
                  href="/admin/blog"
                  className="text-tan/70 hover:text-tan pl-4"
                >
                  Blog Panel
                </Link>

                <Link
                  href="/logout"
                  className="text-red-400 hover:text-red-300 pt-2"
                >
                  Logout
                </Link>
              </>
            )}

            {/* Social */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-tan/20">
              <Link
                href="https://instagram.com/infinitetrailbrewing"
                target="_blank"
                className="w-10 h-10 bg-tan/10 rounded-full flex items-center justify-center"
              >
                <Instagram className="w-5 h-5" />
              </Link>

              <Link
                href="https://facebook.com"
                target="_blank"
                className="w-10 h-10 bg-tan/10 rounded-full flex items-center justify-center"
              >
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
