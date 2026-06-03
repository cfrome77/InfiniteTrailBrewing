// lib/images.ts
import { urlFor } from "@/lib/sanity";

export function getBeerImage(beer: any, size: "card" | "thumb" = "card") {
  if (!beer?.image) return null;

  const base = urlFor(beer.image);

  const isArchive = size === "thumb";

  const style = (beer.style || "").toLowerCase();

  // style-aware cropping
  const cropFocus =
    style.includes("ipa")
      ? "center"
      : style.includes("stout") || style.includes("porter")
        ? "center"
        : "center";

  return base
    .width(isArchive ? 400 : 900)
    .height(isArchive ? 400 : 600)
    .fit("crop")
    .crop("center")
    .auto("format")
    .url();
}