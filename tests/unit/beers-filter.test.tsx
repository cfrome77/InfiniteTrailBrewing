/**
 * @jest-environment node
 */
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("style=cider_hybrid"),
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/beers",
}));
jest.mock("@/lib/sanity.client", () => ({
  urlFor: () => ({ width: () => ({ height: () => ({ url: () => "x" }) }) }),
}));

import { renderToStaticMarkup } from "react-dom/server";
import { BeersContent } from "../../app/beers/beers-content";

const beer = {
  _id: "1",
  id: "1",
  beer_name: "Bramble Melomel",
  slug: "bramble-melomel",
  style: "melomel",
  status: "ready",
  is_flagship: false,
  resolvedPh: "—",
  resolvedSulfate: 0,
  resolvedChloride: 0,
  resolvedCalcium: 0,
  resolvedWaterNotes: "",
  resolvedKettleSchedule: [],
} as any;

describe("beer listing style filter", () => {
  // Regression: the filter ran on the stored enum, and `melomel` shares no
  // substring with any category branch, so the beer was invisible under every
  // filter. 30 of the 101 style values had this problem.
  it("shows a Melomel under Ciders, Meads & Hybrids", () => {
    const html = renderToStaticMarkup(
      <BeersContent initialBeers={[beer]} mode="active" />,
    );
    expect(html).toContain("Bramble Melomel");
  });

  it("still labels the style for display", () => {
    const html = renderToStaticMarkup(
      <BeersContent initialBeers={[beer]} mode="active" />,
    );
    expect(html).toContain("Melomel (Fruit Mead)");
  });
});
