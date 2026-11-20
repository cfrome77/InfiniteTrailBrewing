// lib/images.ts
import { urlFor } from "@/lib/sanity.client";

export function getBeerImage(beer: any, size: "card" | "thumb" = "card") {
  if (!beer?.image) return null;

  const base = urlFor(beer.image);

  const isArchive = size === "thumb";

  return base
    .width(isArchive ? 400 : 900)
    .height(isArchive ? 400 : 600)
    .fit("max") // Use "max" to avoid aggressive cropping of the artwork
    .auto("format")
    .url();
}