"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Instagram, Facebook, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"

const navLinks = [
  { href: "/beers", label: "Our Beers" },
  { href: "/blog", label: "Blog" },
  { href: "/our-story", label: "Our Story" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAdmin(!!session)
    })

    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAdmin(!!session)
    }
    checkInitialSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const showSolidBg = isScrolled || !isHomePage

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
            width={180}
            height={60}
            className={`transition-all duration-300 ${
              showSolidBg ? "h-10 w-auto brightness-0 invert" : "h-12 w-auto brightness-0 invert"
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

          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="font-sans text-sm tracking-wide uppercase flex items-center gap-1 text-tan/70 hover:text-tan transition-colors outline-none">
                  Admin <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-forest border-tan/20 text-tan">
                <DropdownMenuItem asChild>
                  <Link href="/admin/beers" className="cursor-pointer hover:bg-tan/10 focus:bg-tan/10 focus:text-tan">
                    Beer Panel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/blog" className="cursor-pointer hover:bg-tan/10 focus:bg-tan/10 focus:text-tan">
                    Blog Panel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/logout" className="cursor-pointer text-red-400 hover:bg-red-400/10 focus:bg-red-400/10 focus:text-red-400">
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-tan/30">
            <Link 
              href="https://instagram.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-tan/70 hover:text-tan transition-colors"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-5 h-5" />
            </Link>
            <Link 
              href="https://facebook.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-tan/70 hover:text-tan transition-colors"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-tan hover:bg-tan/10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                className={`font-sans text-lg tracking-wide uppercase py-2 transition-colors ${
                  pathname === link.href
                    ? "text-tan"
                    : "text-tan/70 hover:text-tan"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <>
                <div className="h-px bg-tan/20 my-2" />
                <Link
                  href="/admin/beers"
                  className="font-sans text-lg tracking-wide uppercase py-2 text-tan/70 hover:text-tan"
                >
                  Admin: Beer Panel
                </Link>
                <Link
                  href="/admin/blog"
                  className="font-sans text-lg tracking-wide uppercase py-2 text-tan/70 hover:text-tan"
                >
                  Admin: Blog Panel
                </Link>
                <Link
                  href="/logout"
                  className="font-sans text-lg tracking-wide uppercase py-2 text-red-400 hover:text-red-300"
                >
                  Logout
                </Link>
              </>
            )}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-tan/20">
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
        </div>
      )}
    </header>
  )
}
