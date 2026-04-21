"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Beer, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    // Never show to subscribers
    const isSubscribed = localStorage.getItem("itb-newsletter-subscribed")
    if (isSubscribed) return
    
    // Check if user has dismissed the popup recently (within 7 days)
    const dismissedAt = localStorage.getItem("itb-newsletter-dismissed")
    
    if (dismissedAt) {
      const dismissedDate = new Date(dismissedAt)
      const now = new Date()
      const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      
      // Don't show if dismissed within the last 7 days
      if (daysSinceDismissed < 7) {
        return
      }
    }
    
    // Show popup after 3 seconds
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    // Store the dismissal date so we can show again after 7 days
    localStorage.setItem("itb-newsletter-dismissed", new Date().toISOString())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup here
    setIsSubmitted(true)
    // Store a permanent flag for subscribers so they never see it again
    localStorage.setItem("itb-newsletter-subscribed", "true")
    
    // Close popup after showing success message
    setTimeout(() => {
      setIsOpen(false)
    }, 2000)
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
        <div className="bg-forest px-6 py-8 text-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/InfiniteTrailBrewingLogo-Transparent-v6FezPtqxZNb3SWQzDZTLQnNvIqEf6.png"
            alt="Infinite Trail Brewing"
            width={120}
            height={120}
            className="w-24 h-24 mx-auto mb-4"
          />
          <h2 className="font-serif text-2xl text-tan">Join the Trail</h2>
        </div>
        
        {/* Content */}
        <div className="px-6 py-8">
          {!isSubmitted ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-4 text-forest/70">
                <Beer className="w-5 h-5" />
                <span className="text-sm font-medium">Homebrew Updates</span>
              </div>
              
              <p className="text-center text-forest/80 mb-6">
                Get brew day recaps, new beer announcements, recipes, and homebrewing tips delivered to your inbox.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-white border-forest/20 text-forest placeholder:text-forest/40 focus:border-forest focus:ring-forest"
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-forest text-tan hover:bg-forest/90 font-serif tracking-wide"
                >
                  Subscribe
                </Button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full text-xs text-forest/40 hover:text-forest/60 transition-colors uppercase tracking-widest mt-2"
                >
                  No thanks, maybe later
                </button>
              </form>
              
              <p className="text-center text-xs text-forest/50 mt-4">
                No spam, ever. Unsubscribe anytime.
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Beer className="w-8 h-8 text-forest" />
              </div>
              <h3 className="font-serif text-xl text-forest mb-2">Welcome to the Trail!</h3>
              <p className="text-forest/70">Check your inbox for a confirmation email.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
