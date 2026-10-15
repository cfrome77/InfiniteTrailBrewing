import { getAllBeers, getBeersForPage, getBeerBySlug, getAllBeerSlugs } from "../../lib/beers.server";
import { activeClient } from "../../lib/sanity.server";

jest.mock("server-only", () => ({}));

jest.mock("../../lib/sanity.client", () => ({
  client: {
    fetch: jest.fn(),
    config: jest.fn(() => ({
      projectId: "test-project",
      dataset: "production",
      useCdn: false,
    })),
  },
}));

jest.mock("../../lib/sanity.server", () => ({
  activeClient: {
    fetch: jest.fn(),
    config: jest.fn(() => ({
      projectId: "test-project",
      dataset: "production",
      useCdn: false,
    })),
  },
}));

describe("lib/beers.server", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches all beers from Sanity", async () => {
    const mockBeers = [
      { id: "1", beer_name: "Trailhead Hazy IPA", slug: "trailhead-ipa", status: "ready" },
    ];
    (activeClient.fetch as jest.Mock).mockResolvedValue(mockBeers);

    const beers = await getAllBeers();

    expect(activeClient.fetch).toHaveBeenCalled();
    expect(beers).toEqual(mockBeers);
  });

  it("fetches beers for catalog page", async () => {
    const mockBeers = [
      { id: "1", beer_name: "Blue Ridge Kölsch", slug: "blue-ridge-kolsch", status: "ready" },
    ];
    (activeClient.fetch as jest.Mock).mockResolvedValue(mockBeers);

    const beers = await getBeersForPage();

    expect(activeClient.fetch).toHaveBeenCalled();
    expect(beers).toEqual(mockBeers);
  });

  it("fetches a single beer by slug", async () => {
    const mockBeer = { id: "1", beer_name: "Catoctin Copper Lager", slug: "catoctin-lager" };
    (activeClient.fetch as jest.Mock).mockResolvedValue(mockBeer);

    const beer = await getBeerBySlug("catoctin-lager");

    expect(activeClient.fetch).toHaveBeenCalledWith(
      expect.any(String),
      { slug: "catoctin-lager" },
      expect.any(Object)
    );
    expect(beer).toEqual(mockBeer);
  });

  it("fetches all beer slugs for static paths", async () => {
    const mockSlugs = ["trailhead-ipa", "blue-ridge-kolsch"];
    (activeClient.fetch as jest.Mock).mockResolvedValue(mockSlugs);

    const slugs = await getAllBeerSlugs();

    expect(activeClient.fetch).toHaveBeenCalled();
    expect(slugs).toEqual(mockSlugs);
  });

  it("handles fetch errors gracefully and returns empty arrays/null", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    (activeClient.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const beers = await getAllBeers();
    const beer = await getBeerBySlug("non-existent");
    const slugs = await getAllBeerSlugs();

    expect(beers).toEqual([]);
    expect(beer).toBeNull();
    expect(slugs).toEqual([]);
    spy.mockRestore();
  });
});
