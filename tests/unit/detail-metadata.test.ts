/**
 * @jest-environment node
 */
import { generateMetadata as blogMetadata } from "../../app/blog/[slug]/page";
import { generateMetadata as beerMetadata } from "../../app/beers/[slug]/page";
import { getPostBySlug } from "../../lib/blog.server";
import { getBeerBySlug } from "../../lib/beers.server";

// The page modules import the Sanity client and image builders, which pull in
// ESM-only packages Jest cannot load. The metadata logic under test only needs
// the two fetchers, so the rest of the tree is stubbed out.
jest.mock("../../lib/sanity.client", () => ({
  client: { fetch: jest.fn() },
  urlFor: jest.fn(() => ({ width: () => ({ height: () => ({ fit: () => ({ auto: () => ({ url: () => "" }) }) }) }) })),
}));

jest.mock("../../lib/sanity.server", () => ({
  activeClient: { fetch: jest.fn() },
  serverClient: { fetch: jest.fn() },
}));

jest.mock("../../components/navbar", () => ({ Navbar: () => null }));
jest.mock("../../components/footer", () => ({ Footer: () => null }));

jest.mock("../../lib/blog.server", () => ({
  getPostBySlug: jest.fn(),
  getAllSlugs: jest.fn(async () => []),
}));

jest.mock("../../lib/beers.server", () => ({
  getBeerBySlug: jest.fn(),
  getAllBeerSlugs: jest.fn(async () => []),
}));

const post = (overrides: Record<string, unknown> = {}) =>
  ({
    _id: "p1",
    slug: "batch-12",
    title: "Batch 12: The Long Climb",
    excerpt: "Notes from a slow brew day.",
    date: "2025-06-01T00:00:00Z",
    author: "Chris",
    category: "Brew Day",
    ...overrides,
  }) as never;

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

describe("blog post metadata", () => {
  beforeEach(() => jest.clearAllMocks());

  it("titles the page from the post", async () => {
    (getPostBySlug as jest.Mock).mockResolvedValue(post());
    const meta = await blogMetadata(params("batch-12"));
    expect(meta.title).toBe("Batch 12: The Long Climb");
    expect(meta.description).toBe("Notes from a slow brew day.");
  });

  it("lets an editor override the title and description", async () => {
    (getPostBySlug as jest.Mock).mockResolvedValue(
      post({ seo: { title: "Custom SEO Title", description: "Custom description." } }),
    );
    const meta = await blogMetadata(params("batch-12"));
    expect(meta.title).toBe("Custom SEO Title");
    expect(meta.description).toBe("Custom description.");
  });

  it("points og:image at the post's own generated card", async () => {
    (getPostBySlug as jest.Mock).mockResolvedValue(post());
    const meta = await blogMetadata(params("batch-12"));
    const images = meta.openGraph?.images as { url: string }[];
    expect(images[0].url).toBe("/blog/batch-12/opengraph-image");
  });

  it("falls back to a safe title when the post is missing", async () => {
    (getPostBySlug as jest.Mock).mockResolvedValue(null);
    const meta = await blogMetadata(params("nope"));
    expect(meta.title).toBe("Post Not Found");
  });
});

describe("beer metadata", () => {
  beforeEach(() => jest.clearAllMocks());

  it("translates an enum style into its human-readable label", async () => {
    (getBeerBySlug as jest.Mock).mockResolvedValue({
      beer_name: "Horizon Hard Cider",
      style: "dry_cider",
      notes: null,
      abv: 6.5,
      ibu: null,
    });
    const meta = await beerMetadata(params("horizon-hard-cider"));
    // dry_cider is the stored enum; the page shows "Dry Cider".
    expect(meta.title).toBe("Horizon Hard Cider | Dry Cider");
  });

  it("uses a referenced style's title directly", async () => {
    (getBeerBySlug as jest.Mock).mockResolvedValue({
      beer_name: "Trailhead Lager",
      style: { title: "German Pilsner" },
      notes: null,
    });
    const meta = await beerMetadata(params("trailhead-lager"));
    expect(meta.title).toBe("Trailhead Lager | German Pilsner");
  });

  it("prefers the editor's notes as the description", async () => {
    (getBeerBySlug as jest.Mock).mockResolvedValue({
      beer_name: "Trailhead Lager",
      style: "lager",
      notes: "  Clean and crisp.  ",
    });
    const meta = await beerMetadata(params("trailhead-lager"));
    expect(meta.description).toBe("Clean and crisp.");
  });

  it("builds a description from ABV and IBU when there are no notes", async () => {
    (getBeerBySlug as jest.Mock).mockResolvedValue({
      beer_name: "Trailhead Lager",
      style: "lager",
      notes: null,
      abv: 5.2,
      ibu: 22,
    });
    const meta = await beerMetadata(params("trailhead-lager"));
    expect(meta.description).toContain("5.2% ABV");
    expect(meta.description).toContain("22 IBU");
  });

  it("does not produce a dangling separator with no style", async () => {
    (getBeerBySlug as jest.Mock).mockResolvedValue({
      beer_name: "Mystery Batch",
      style: "",
      notes: null,
    });
    const meta = await beerMetadata(params("mystery"));
    expect(meta.title).toBe("Mystery Batch");
    expect(meta.description).not.toContain("undefined");
  });

  it("points og:image at the beer's own generated card", async () => {
    (getBeerBySlug as jest.Mock).mockResolvedValue({
      beer_name: "Trailhead Lager",
      style: "lager",
      notes: null,
    });
    const meta = await beerMetadata(params("trailhead-lager"));
    const images = meta.openGraph?.images as { url: string }[];
    expect(images[0].url).toBe("/beers/trailhead-lager/opengraph-image");
  });

  it("falls back to a safe title when the beer is missing", async () => {
    (getBeerBySlug as jest.Mock).mockResolvedValue(null);
    const meta = await beerMetadata(params("nope"));
    expect(meta.title).toBe("Beer Not Found");
  });
});
