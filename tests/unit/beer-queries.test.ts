/**
 * @jest-environment node
 */
import { ALL_POSTS_QUERY, POST_BY_SLUG_QUERY } from "../../lib/blog";
import { BEER_BY_SLUG_QUERY } from "../../lib/beers";

/**
 * Every query that reaches a public page must apply the same publish rules.
 * The related-posts subquery previously filtered drafts only, so it returned
 * unpublished and newsletter-only posts and the beer page rendered their
 * titles and images.
 */
const PUBLIC_POST_FILTERS = [
  "is_published == true",
  'visibility in ["website", "both"]',
  '!(_id in path("drafts.**"))',
];

describe("public post queries", () => {
  it.each([
    ["ALL_POSTS_QUERY", ALL_POSTS_QUERY],
    ["POST_BY_SLUG_QUERY", POST_BY_SLUG_QUERY],
  ])("%s applies every publish filter", (_name, query) => {
    for (const filter of PUBLIC_POST_FILTERS) {
      expect(query).toContain(filter);
    }
  });

  it("BEER_BY_SLUG_QUERY applies every publish filter to its related posts", () => {
    const related = BEER_BY_SLUG_QUERY.slice(
      BEER_BY_SLUG_QUERY.indexOf("relatedPosts"),
    );
    for (const filter of PUBLIC_POST_FILTERS) {
      expect(related).toContain(filter);
    }
  });

  it("BEER_BY_SLUG_QUERY still filters draft beers", () => {
    expect(BEER_BY_SLUG_QUERY).toContain('!(_id in path("drafts.**"))');
  });
});

describe("query projections", () => {
  it("does not project fields that exist nowhere in the schema", () => {
    // isJournalEntry was selected but never defined in sanity/schema/post.ts
    // and never read by any component.
    expect(BEER_BY_SLUG_QUERY).not.toContain("isJournalEntry");
    expect(ALL_POSTS_QUERY).not.toContain("isJournalEntry");
  });
});
