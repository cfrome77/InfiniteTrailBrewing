import { renderOgCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-card";
import { getBeerBySlug } from "@/lib/beers.server";

export const alt = "Infinite Trail Brewing";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = "then" in params ? await params : params;
  const beer = await getBeerBySlug(slug);

  const style =
    typeof beer?.style === "string" ? beer.style : beer?.style?.title;

  const meta = [style, beer?.abv ? `${beer.abv}% ABV` : null]
    .filter(Boolean)
    .join(" · ");

  return renderOgCard({
    eyebrow: "On Tap",
    title: beer?.beer_name || "Infinite Trail Brewing",
    meta,
  });
}
