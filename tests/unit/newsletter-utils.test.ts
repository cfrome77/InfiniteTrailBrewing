/**
 * @jest-environment node
 */
import { transformPortableTextToEmailHtml } from "../../lib/newsletter-utils";

jest.mock("../../lib/sanity.client", () => ({
  urlFor: () => ({
    width: () => ({ url: () => "https://cdn.sanity.io/images/x.jpg" }),
  }),
}));

function block(children: unknown[], markDefs: unknown[] = []) {
  return {
    _type: "block",
    _key: "b1",
    style: "normal",
    markDefs,
    children,
  };
}

describe("transformPortableTextToEmailHtml", () => {
  it("returns an empty string for non-array input", () => {
    expect(transformPortableTextToEmailHtml(undefined as unknown as unknown[])).toBe("");
    expect(transformPortableTextToEmailHtml("nope" as unknown as unknown[])).toBe("");
  });

  it("escapes image alt text so it cannot inject markup", () => {
    const html = transformPortableTextToEmailHtml([
      {
        _type: "image",
        _key: "img1",
        asset: { _ref: "image-abc-600x400-jpg" },
        alt: '"><script>alert(1)</script>',
      },
    ]);

    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("keeps an https link intact", () => {
    const html = transformPortableTextToEmailHtml([
      block(
        [{ _type: "span", _key: "s1", text: "site", marks: ["l1"] }],
        [{ _key: "l1", _type: "link", href: "https://example.com" }],
      ),
    ]);

    expect(html).toContain('href="https://example.com"');
  });

  it("drops a javascript: link but keeps its text", () => {
    const html = transformPortableTextToEmailHtml([
      block(
        [{ _type: "span", _key: "s1", text: "click me", marks: ["l1"] }],
        [{ _key: "l1", _type: "link", href: "javascript:alert(1)" }],
      ),
    ]);

    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("<a href=");
    expect(html).toContain("click me");
  });

  it("escapes quotes in an otherwise valid href", () => {
    const html = transformPortableTextToEmailHtml([
      block(
        [{ _type: "span", _key: "s1", text: "x", marks: ["l1"] }],
        [{ _key: "l1", _type: "link", href: 'https://example.com/?q="onmouseover=alert(1)' }],
      ),
    ]);

    expect(html).not.toContain('"onmouseover=');
    expect(html).toContain("&quot;");
  });
});
