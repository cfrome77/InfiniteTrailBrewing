/**
 * @jest-environment node
 */
import { renderToStaticMarkup } from "react-dom/server";
import { InventoryManager } from "../../app/admin/inventory-manager";
import { ALL_BEERS_QUERY } from "../../lib/beers";
import { POST_BY_SLUG_QUERY } from "../../lib/blog";

jest.mock("@/app/actions/inventory", () => ({
  updateBeerStatus: jest.fn(async () => ({ ok: true })),
}));

const beer = {
  _id: "b1",
  beer_name: "Horizon Hard Cider",
  style: "dry_cider",
  status: "ready",
  abv: 6.5,
  ibu: 0,
} as any;

describe("style label on secondary surfaces", () => {
  // The admin table printed `beer.style` raw, so staff saw "dry_cider".
  it("shows the admin inventory row's style as a readable label", () => {
    const html = renderToStaticMarkup(<InventoryManager beers={[beer]} />);
    expect(html).toContain("Dry Cider");
    expect(html).not.toContain(">dry_cider<");
  });

  // The related-beer card on a post rendered nothing because the projection
  // never selected `style`. Guard the query, which is the actual cause.
  it("projects style for related beers on a post", () => {
    const related = POST_BY_SLUG_QUERY.slice(
      POST_BY_SLUG_QUERY.indexOf("relatedBeers[]->"),
    );
    expect(related).toMatch(/relatedBeers\[\]->\{[^}]*\bstyle\b/);
  });

  it("projects style for the catalogue query", () => {
    expect(ALL_BEERS_QUERY).toMatch(/\bstyle\b/);
  });
});
