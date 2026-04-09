import type { Metadata } from 'next'
import { Oswald, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const oswald = Oswald({ 
  subsets: ["latin"],
  variable: '--font-oswald',
  weight: ['400', '500', '600', '700']
});

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'Infinite Trail Brewing | Frederick, MD',
  description: 'Brewed for the Next Adventure. Hand-forged craft beers in Frederick, MD. Discover our flagship beers including Blue Ridge Kölsch, Catoctin Copper Lager, Sugarloaf Saison, and Stone Path Porter.',
  keywords: ['craft beer', 'brewery', 'Frederick MD', 'Infinite Trail Brewing', 'craft brewing'],
  openGraph: {
    title: 'Infinite Trail Brewing | Frederick, MD',
    description: 'Brewed for the Next Adventure. Hand-forged craft beers in Frederick, MD.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
