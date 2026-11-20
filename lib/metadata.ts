import type { Metadata } from "next";

/**
 * Default social card, served by `app/opengraph-image.tsx`. Declared here
 * because a page that sets `openGraph` replaces the parent's object outright
 * rather than merging into it, which silently drops the inherited image.
 */
const DEFAULT_OG_IMAGE = "/opengraph-image";

export function pageMetadata({
  title,
  description,
  ogImage = DEFAULT_OG_IMAGE,
}: {
  title: string;
  description: string;
  ogImage?: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
