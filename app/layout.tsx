import type { Metadata } from "next";
import { Oswald, Montserrat } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { BackToTop } from "@/components/back-to-top";
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
  title: "Infinite Trail Brewing | Frederick, MD",
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
  const snipcartApiKey = process.env.NEXT_PUBLIC_SNIPCART_API_KEY || "YOUR_SNIPCART_PUBLIC_API_KEY";

  return (
    <html lang="en" className={`${oswald.variable} ${montserrat.variable}`}>
      <head>
        <link rel="preconnect" href="https://app.snipcart.com" />
        <link rel="preconnect" href="https://cdn.snipcart.com" />
        <link
          rel="stylesheet"
          href="https://cdn.snipcart.com/themes/v3.4.0/default/snipcart.css"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <BackToTop />

        {process.env.NODE_ENV === "production" && <Analytics />}

        <Script
          src="https://cdn.snipcart.com/themes/v3.4.0/default/snipcart.js"
          strategy="lazyOnload"
        />
        <div
          hidden
          id="snipcart"
          data-api-key={snipcartApiKey}
          data-config-modal-style="side"
        ></div>
      </body>
    </html>
  );
}
