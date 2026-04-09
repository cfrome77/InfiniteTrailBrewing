import Link from "next/link"
import { Beer, BookOpen, Mail } from "lucide-react"

export function HomeCTA() {
  return (
    <section id="explore" className="bg-tan py-20 px-4 scroll-mt-24">
      <div className="container mx-auto max-w-5xl">
        <h2 className="font-serif text-3xl md:text-4xl text-forest text-center mb-4">
          Explore the Trail
        </h2>
        <p className="text-forest/70 text-center max-w-2xl mx-auto mb-12">
          Whether you&apos;re here for the beers, the stories, or to connect with a fellow homebrewer, there&apos;s a path for you.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Beers Card */}
          <Link 
            href="/beers"
            className="group bg-cream rounded-lg p-8 text-center hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-forest/20 transition-colors">
              <Beer className="w-8 h-8 text-forest" />
            </div>
            <h3 className="font-serif text-xl text-forest mb-3">Our Beers</h3>
            <p className="text-forest/70 text-sm leading-relaxed">
              From crisp lagers to robust stouts, explore what&apos;s currently on tap and our brewing history.
            </p>
          </Link>
          
          {/* Blog Card */}
          <Link 
            href="/blog"
            className="group bg-cream rounded-lg p-8 text-center hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-forest/20 transition-colors">
              <BookOpen className="w-8 h-8 text-forest" />
            </div>
            <h3 className="font-serif text-xl text-forest mb-3">The Blog</h3>
            <p className="text-forest/70 text-sm leading-relaxed">
              Brew day recaps, tasting notes, recipes, and lessons learned along the way.
            </p>
          </Link>
          
          {/* Contact Card */}
          <Link 
            href="/contact"
            className="group bg-cream rounded-lg p-8 text-center hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-forest/20 transition-colors">
              <Mail className="w-8 h-8 text-forest" />
            </div>
            <h3 className="font-serif text-xl text-forest mb-3">Get in Touch</h3>
            <p className="text-forest/70 text-sm leading-relaxed">
              Questions, feedback, or just want to talk beer? Drop us a line.
            </p>
          </Link>
        </div>
      </div>
    </section>
  )
}