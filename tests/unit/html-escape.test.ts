import { escapeHtml, safeHref } from "../../lib/html-escape";

describe("escapeHtml", () => {
  it("escapes every character that can break out of markup", () => {
    expect(escapeHtml(`<script>alert("x")</script>&`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;&amp;",
    );
  });

  it("escapes single quotes so attribute values cannot be terminated", () => {
    expect(escapeHtml("it's")).toBe("it&#39;s");
  });

  it("renders null and undefined as empty strings", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });

  it("stringifies non-string values", () => {
    expect(escapeHtml(42)).toBe("42");
  });
});

describe("safeHref", () => {
  it.each([
    "https://example.com/path?q=1",
    "http://example.com",
    "mailto:hello@example.com",
    "tel:+15551234",
  ])("allows %s", (href) => {
    expect(safeHref(href)).toBe(href);
  });

  it.each([
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    "data:text/html;base64,PHNjcmlwdD4=",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
  ])("rejects the %s scheme", (href) => {
    expect(safeHref(href)).toBeNull();
  });

  it("rejects non-string input", () => {
    expect(safeHref(undefined)).toBeNull();
    expect(safeHref({ href: "https://example.com" })).toBeNull();
  });

  it("rejects empty and whitespace-only values", () => {
    expect(safeHref("")).toBeNull();
    expect(safeHref("   ")).toBeNull();
  });

  it("resolves a relative path against the provided base", () => {
    expect(safeHref("/blog/post", "https://infinitetrailbrewing.com")).toBe("/blog/post");
  });
});
