/**
 * @jest-environment node
 */
import Image from "../../app/beers/[slug]/opengraph-image";
import { getBeerBySlug } from "../../lib/beers.server";
import { renderOgCard } from "../../lib/og-card";

jest.mock("../../lib/og-card", () => ({
  renderOgCard: jest.fn(() => null),
  OG_SIZE: { width: 1200, height: 630 },
  OG_CONTENT_TYPE: "image/png",
}));

jest.mock("../../lib/beers.server", () => ({
  getBeerBySlug: jest.fn(),
}));

const render = async (slug: string) =>
  Image({ params: Promise.resolve({ slug }) });

const cardProps = () => (renderOgCard as jest.Mock).mock.calls[0][0];

describe("beer social card", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows the human-readable style, not the stored enum", async () => {
    (getBeerBySlug as jest.Mock).mockResolvedValue({
      beer_name: "Horizon Hard Cider",
      style: "dry_cider",
      abv: 6.5,
    });

    await render("horizon-hard-cider");

    const { title, meta } = cardProps();
    expect(title).toBe("Horizon Hard Cider");
    // Regression: this card printed the raw enum while the page said "Dry Cider".
    expect(meta).toBe("Dry Cider · 6.5% ABV");
    expect(meta).not.toContain("dry_cider");
  });

  it("uses a referenced style's title", async () => {
    (getBeerBySlug as jest.Mock).mockResolvedValue({
      beer_name: "Trailhead Lager",
      style: { title: "German Pilsner" },
    });

    await render("trailhead-lager");

    expect(cardProps().meta).toBe("German Pilsner");
  });

  it("falls back to brand copy for an unknown slug", async () => {
    (getBeerBySlug as jest.Mock).mockResolvedValue(null);

    await render("does-not-exist");

    const { title, meta } = cardProps();
    expect(title).toBe("Infinite Trail Brewing");
    expect(meta).toBe("");
  });
});
