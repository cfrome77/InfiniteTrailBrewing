import { renderOgCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-card";
import { getBeerBySlug } from "@/lib/beers.server";
import { beerStyleLabel } from "@/lib/beer-style-label";
import { getAllBeerSlugs } from "@/lib/beers.server";

export const alt = "Infinite Trail Brewing";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const revalidate = 86400;

// Without this the card is rendered per request; the page it belongs to is
// statically generated, so the card should be too.
export async function generateStaticParams() {
  const slugs = await getAllBeerSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = "then" in params ? await params : params;
  const beer = await getBeerBySlug(slug);

  const style = beerStyleLabel(beer?.style);

  const meta = [style, beer?.abv ? `${beer.abv}% ABV` : null]
    .filter(Boolean)
    .join(" · ");

  return renderOgCard({
    eyebrow: "On Tap",
    title: beer?.beer_name || "Infinite Trail Brewing",
    meta,
  });
}
