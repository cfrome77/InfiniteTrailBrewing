import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

/**
 * Admin surfaces are disallowed here and also carry `robots: noindex` on the
 * pages themselves, so a crawler that ignores this file still does not index
 * them.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
