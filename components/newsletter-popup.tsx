"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { X, Beer, Mail, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { subscribeToNewsletter } from "@/app/actions/newsletter"

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

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

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose()
        return
      }

      if (event.key !== "Tab" || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    (result ? closeButtonRef.current : inputRef.current)?.focus()
  }, [isOpen, result])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const response = await subscribeToNewsletter(email)
    setResult(response)
    setIsSubmitting(false)

    if (response.success) {
      localStorage.setItem("itb-newsletter-subscribed", "true")
    }
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
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-popup-title"
        className="relative bg-cream rounded-lg shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={handleClose}
          className="absolute top-2 right-2 p-2 text-tan hover:text-white transition-colors z-10 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tan"
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
          <h2 id="newsletter-popup-title" className="font-serif text-2xl text-tan">Join the Trail</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {!result?.success ? (
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
                    ref={inputRef}
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-white border-forest/20 text-forest placeholder:text-forest/40 focus-visible:border-forest"
                  />
                </div>

                {result && !result.success && (
                  <div role="alert" className="flex items-start gap-2 p-3 rounded-md bg-red-50 text-red-800 text-sm">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{result.message}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-forest text-tan hover:bg-forest/90 font-serif tracking-wide"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
                </Button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full text-xs text-forest/50 hover:text-forest/70 transition-colors uppercase tracking-widest mt-2"
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
              <p className="text-forest/70">{result.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
