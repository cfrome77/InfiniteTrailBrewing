/**
 * @jest-environment node
 */
import { pageMetadata } from "../../lib/metadata";

/**
 * Next replaces a parent's `openGraph` object wholesale rather than merging into
 * it. A page that set `openGraph` without `images` therefore lost the inherited
 * social card, which is how five pages ended up with no og:image at all.
 */
describe("pageMetadata", () => {
  it("always includes an og:image, so a page cannot drop the social card", () => {
    const meta = pageMetadata({ title: "Our Beers", description: "Every beer." });
    expect(meta.openGraph?.images).toHaveLength(1);
  });

  it("uses the root generated card by default", () => {
    const meta = pageMetadata({ title: "Our Beers", description: "Every beer." });
    const images = meta.openGraph?.images as { url: string }[];
    expect(images[0].url).toBe("/opengraph-image");
  });

  it("accepts a page-specific card", () => {
    const meta = pageMetadata({
      title: "Horizon Hard Cider",
      description: "Dry cider.",
      ogImage: "/beers/horizon-hard-cider/opengraph-image",
    });
    const images = meta.openGraph?.images as { url: string }[];
    expect(images[0].url).toBe("/beers/horizon-hard-cider/opengraph-image");
  });

  it("declares a large summary card for Twitter", () => {
    const meta = pageMetadata({ title: "Our Beers", description: "Every beer." });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });
});
