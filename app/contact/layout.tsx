import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

// The contact page is a client component, so it cannot export metadata itself.
export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Infinite Trail Brewing in Frederick, MD — questions, distribution and events.",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
