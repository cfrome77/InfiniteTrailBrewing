"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Instagram, Facebook, Send, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-forest text-tan">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-4 tracking-wide">
            Contact Us
          </h1>
          <div className="w-24 h-1 bg-tan mx-auto mb-6" />
          <p className="text-lg text-tan/80 max-w-2xl mx-auto">
            Have a question, feedback, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-3xl text-forest mb-6">Send Us a Message</h2>
              
              {isSubmitted ? (
                <Card className="bg-white border-none shadow-lg">
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-forest mx-auto mb-6" />
                    <h3 className="font-serif text-2xl text-forest mb-4">Message Sent!</h3>
                    <p className="text-forest/70 mb-6">
                      Thanks for reaching out. We&apos;ll get back to you as soon as we can.
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="border-forest text-forest hover:bg-forest/5"
                    >
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white border-none shadow-lg">
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium text-forest">
                            Name
                          </label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Your name"
                            required
                            className="border-forest/20 focus:border-forest focus:ring-forest"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium text-forest">
                            Email
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            className="border-forest/20 focus:border-forest focus:ring-forest"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium text-forest">
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          className="w-full h-10 px-3 rounded-md border border-forest/20 bg-background text-forest focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="feedback">Beer Feedback</option>
                          <option value="collaboration">Collaboration</option>
                          <option value="media">Media / Press</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-forest">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          placeholder="Tell us what's on your mind..."
                          required
                          className="w-full px-3 py-2 rounded-md border border-forest/20 bg-background text-forest focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest resize-none"
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-forest text-tan hover:bg-forest/90 font-serif tracking-wide py-6"
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            Send Message
                            <Send className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-3xl text-forest mb-6">Get in Touch</h2>
              
              <div className="space-y-6 mb-12">
                <Card className="bg-white border-none shadow-md">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-forest" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-forest mb-1">Location</h3>
                      <p className="text-forest/70">Frederick, MD</p>
                      <p className="text-sm text-forest/50 mt-1">Home brewery—not open to the public</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-md">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-forest" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-forest mb-1">Email</h3>
                      <Link 
                        href="mailto:hello@infinitetrailbrewing.com"
                        className="text-forest/70 hover:text-forest transition-colors"
                      >
                        hello@infinitetrailbrewing.com
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Links */}
              <div className="mb-12">
                <h3 className="font-serif text-xl text-forest mb-4">Follow Along</h3>
                <div className="flex gap-4">
                  <Link 
                    href="https://instagram.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-forest text-tan rounded-full flex items-center justify-center hover:bg-forest/90 transition-colors"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </Link>
                  <Link 
                    href="https://facebook.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-forest text-tan rounded-full flex items-center justify-center hover:bg-forest/90 transition-colors"
                    aria-label="Follow us on Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Logo */}
              <div className="bg-forest/5 rounded-2xl p-8 text-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/InfiniteTrailBrewingLogo-Transparent-v6FezPtqxZNb3SWQzDZTLQnNvIqEf6.png"
                  alt="Infinite Trail Brewing"
                  width={200}
                  height={200}
                  className="w-40 h-40 mx-auto mb-4"
                />
                <p className="font-serif text-forest text-lg">Brewed for the Next Adventure.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
