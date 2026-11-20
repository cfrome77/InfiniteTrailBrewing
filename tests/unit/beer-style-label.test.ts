/**
 * @jest-environment node
 */
import { beerStyleLabel } from "../../lib/beer-style-label";

describe("beerStyleLabel", () => {
  it("translates an enum value to its human-readable label", () => {
    // The social card used to print the raw enum here.
    expect(beerStyleLabel("dry_cider")).toBe("Dry Cider");
    expect(beerStyleLabel("ipa")).toBe("IPA");
    expect(beerStyleLabel("neipa")).toBe("New England / Hazy IPA");
  });

  it("uses a resolved reference's title as-is", () => {
    expect(beerStyleLabel({ _id: "s1", title: "German Pilsner", slug: "pilsner" })).toBe(
      "German Pilsner",
    );
  });

  it("passes through an unknown enum rather than dropping it", () => {
    expect(beerStyleLabel("something_new")).toBe("something_new");
  });

  it("returns an empty string when there is no style", () => {
    expect(beerStyleLabel(undefined)).toBe("");
    expect(beerStyleLabel(null)).toBe("");
  });
});
