/**
 * Escaping for HTML that is assembled by string concatenation.
 *
 * React escapes automatically, so this is only needed where markup is built as
 * a string and handed to something that renders it verbatim, such as the
 * newsletter email body.
 */
const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[&<>"']/g, (char) => HTML_ENTITIES[char]);
}

const SAFE_URL_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

/**
 * Returns a URL only if it parses and uses an allowlisted protocol.
 *
 * Escaping alone is not enough for an href: `javascript:alert(1)` contains no
 * characters that escaping touches, so the scheme has to be checked separately.
 * Returns null for anything unusable so the caller can drop the link.
 */
export function safeHref(value: unknown, base = "https://placeholder.invalid"): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed, base);
    if (!SAFE_URL_PROTOCOLS.has(url.protocol)) return null;
    return trimmed;
  } catch {
    return null;
  }
}
