import { renderOgCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-card";

export const alt = "Infinite Trail Brewing — Brewed for the Next Adventure";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgCard({
    eyebrow: "Infinite Trail Brewing",
    title: "Brewed for the Next Adventure",
    meta: "Hand-forged craft beer in Frederick, MD",
  });
}
