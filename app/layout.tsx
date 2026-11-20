import type { Metadata } from "next";
import { Oswald, Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { BackToTop } from "@/components/back-to-top";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  // Resolves relative URLs in metadata (canonical, Open Graph images) against
  // the real origin instead of localhost.
  metadataBase: new URL(siteUrl),
  title: {
    default: "Infinite Trail Brewing | Frederick, MD",
    // Child pages supply a bare title; the template keeps the site name on
    // every tab and search result without each page repeating it.
    template: "%s | Infinite Trail Brewing",
  },
  description:
    "Brewed for the Next Adventure. Hand-forged craft beers in Frederick, MD. Discover our flagship beers including Blue Ridge Kölsch, Catoctin Copper Lager, Sugarloaf Saison, and Stone Path Porter.",
  keywords: [
    "craft beer",
    "brewery",
    "Frederick MD",
    "Infinite Trail Brewing",
    "craft brewing",
  ],
  openGraph: {
    title: "Infinite Trail Brewing | Frederick, MD",
    description:
      "Brewed for the Next Adventure. Hand-forged craft beers in Frederick, MD.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <BackToTop />

        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
