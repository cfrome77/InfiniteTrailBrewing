import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const FOREST = "#1A4132";
const TAN = "#E8D7B5";
const SKY = "#7BA3B8";

/**
 * Shared renderer for the generated social cards. Every card uses the same
 * layout so a beer page and a post page read as the same site when they sit
 * side by side in a feed.
 *
 * Fonts are intentionally left to the renderer's default: `next/font` gives us
 * CSS variables, not raw font buffers, and fetching a webfont here would add a
 * network dependency to image generation.
 */
export function renderOgCard({
  eyebrow,
  title,
  meta,
}: {
  eyebrow: string;
  title: string;
  meta?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: FOREST,
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 56, height: 6, backgroundColor: SKY }} />
          <div
            style={{
              color: TAN,
              fontSize: 30,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div
          style={{
            color: "#FFFFFF",
            fontSize: title.length > 46 ? 64 : 82,
            lineHeight: 1.1,
            display: "flex",
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `2px solid ${SKY}`,
            paddingTop: 28,
          }}
        >
          <div style={{ color: TAN, fontSize: 30 }}>
            {meta || "Brewed for the Next Adventure"}
          </div>
          <div
            style={{
              color: TAN,
              fontSize: 26,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Frederick, MD
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
