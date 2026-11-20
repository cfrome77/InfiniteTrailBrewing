/**
 * @jest-environment node
 */
import Image from "../../app/blog/[slug]/opengraph-image";
import { getPostBySlug } from "../../lib/blog.server";
import { renderOgCard } from "../../lib/og-card";

jest.mock("../../lib/og-card", () => ({
  renderOgCard: jest.fn(() => null),
  OG_SIZE: { width: 1200, height: 630 },
  OG_CONTENT_TYPE: "image/png",
}));

jest.mock("../../lib/blog.server", () => ({
  getPostBySlug: jest.fn(),
  getAllSlugs: jest.fn(async () => []),
}));

const render = async (slug: string) => Image({ params: Promise.resolve({ slug }) });
const cardProps = () => (renderOgCard as jest.Mock).mock.calls[0][0];

describe("blog social card", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows the post title", async () => {
    (getPostBySlug as jest.Mock).mockResolvedValue({
      title: "Batch 12: The Long Climb",
      category: "Brew Day",
      author: "Chris",
    });

    await render("batch-12");

    const { title, meta } = cardProps();
    expect(title).toBe("Batch 12: The Long Climb");
    expect(meta).toBe("Brew Day · Chris");
  });

  it("honours an editor's seo.title, as the page and og:title do", async () => {
    (getPostBySlug as jest.Mock).mockResolvedValue({
      title: "Batch 12: The Long Climb",
      seo: { title: "A Slow Brew Day" },
      category: "Brew Day",
    });

    await render("batch-12");

    // Regression: the card ignored seo.title, so the shared image disagreed
    // with the title a crawler read from the same page.
    expect(cardProps().title).toBe("A Slow Brew Day");
  });

  it("falls back to brand copy for an unknown slug", async () => {
    (getPostBySlug as jest.Mock).mockResolvedValue(null);

    await render("nope");

    expect(cardProps().title).toBe("Infinite Trail Brewing");
  });
});
