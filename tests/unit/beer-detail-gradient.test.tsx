/**
 * @jest-environment node
 */
jest.mock("next/navigation", () => ({
  usePathname: () => "/beers/sunlit-helles",
  notFound: () => { throw new Error("notFound"); },
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/lib/sanity.client", () => ({ urlFor: () => ({ width: () => ({ url: () => "x" }) }) }));
jest.mock("@/lib/beers.server", () => ({
  getBeerBySlug: jest.fn(),
  getAllBeerSlugs: jest.fn(async () => []),
}));

import { renderToStaticMarkup } from "react-dom/server";
import BeerDetailPage from "../../app/beers/[slug]/page";
import { getBeerBySlug } from "../../lib/beers.server";

const beer = {
  beer_name: "Sunlit Helles", slug: "sunlit-helles", style: "helles",
  status: "ready", resolvedPh: "5.2", resolvedSulfate: 50, resolvedChloride: 60,
  resolvedCalcium: 70, resolvedWaterNotes: "", resolvedKettleSchedule: [],
  is_flagship: false, abv: 4.8,
};

// Guards the page's own choice of gradient. An earlier version of this file
// recomputed beerStyleLabel+getBeerStyleGradient in the test, which passed even
// when the page was wrong; this renders the page instead.
it("colours a Helles with the lager gradient", async () => {
  (getBeerBySlug as jest.Mock).mockResolvedValue(beer);
  const tree = await BeerDetailPage({ params: Promise.resolve({ slug: "sunlit-helles" }) });
  const html = renderToStaticMarkup(tree as any);
  expect(html).toContain("from-amber-400 to-amber-500");
  expect(html).not.toContain("from-amber-200 to-amber-300");
});

it("still shows the readable style label", async () => {
  (getBeerBySlug as jest.Mock).mockResolvedValue(beer);
  const tree = await BeerDetailPage({ params: Promise.resolve({ slug: "sunlit-helles" }) });
  expect(renderToStaticMarkup(tree as any)).toContain("Helles Lager");
});
