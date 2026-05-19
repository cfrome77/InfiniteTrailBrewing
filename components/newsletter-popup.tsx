"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Beer, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the popup recently (within 7 days)
    const dismissedAt = localStorage.getItem("itb-substack-dismissed")
    
    if (dismissedAt) {
      const dismissedDate = new Date(dismissedAt)
      const now = new Date()
      const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysSinceDismissed < 7) {
        return
      }
    }
    
    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem("itb-substack-dismissed", new Date().toISOString())
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-forest/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-cream rounded-lg shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-2 text-tan/60 hover:text-tan transition-colors z-10"
          aria-label="Close popup"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Header with logo */}
        <div className="bg-forest px-6 py-10 text-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/InfiniteTrailBrewingLogo-Transparent-v6FezPtqxZNb3SWQzDZTLQnNvIqEf6.png"
            alt="Infinite Trail Brewing"
            width={100}
            height={100}
            className="w-20 h-24 mx-auto mb-4"
          />
          <h2 className="font-serif text-3xl text-tan">Join the Trail</h2>
          <p className="text-tan/60 text-xs uppercase tracking-[0.2em] mt-2 font-bold">Now on Substack</p>
        </div>
        
        {/* Content */}
        <div className="px-8 py-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 text-forest/70">
            <Mail className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Weekly Field Notes</span>
          </div>

          <p className="text-forest/80 mb-8 leading-relaxed">
            Get our latest brew day recaps, exclusive recipes, and homebrewing tips delivered directly to your inbox via Substack.
          </p>

          <div className="space-y-4">
            <Button
              asChild
              className="w-full bg-forest text-tan hover:bg-forest/90 font-serif text-lg py-6 rounded-full shadow-lg group"
            >
              <a
                href={process.env.NEXT_PUBLIC_SUBSTACK_URL || "https://infinitetrail.substack.com"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
              >
                Subscribe on Substack
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>

            <button
              onClick={handleClose}
              className="text-xs text-forest/40 hover:text-forest/60 transition-colors uppercase tracking-widest font-bold"
            >
              No thanks, maybe later
            </button>
          </div>

          <p className="text-[10px] text-forest/30 mt-8 uppercase tracking-widest">
            Free forever • Unsubscribe anytime
          </p>
        </div>
      </div>
    </div>
  )
}
