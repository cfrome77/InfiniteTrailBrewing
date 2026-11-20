import type { MetadataRoute } from "next";
import { getAllBeerSlugs } from "@/lib/beers.server";
import { getAllSlugs } from "@/lib/blog.server";
import { siteUrl } from "@/lib/site-url";

/**
 * Both slug fetchers already exclude drafts, and the post query also requires
 * `is_published` and a website-visible `visibility`, so unpublished work cannot
 * leak into the sitemap. Reusing them means the sitemap follows the publish
 * rules automatically instead of restating them here.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [beerSlugs, postSlugs] = await Promise.all([
    getAllBeerSlugs(),
    getAllSlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/beers`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/beers/archive`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/our-story`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const beerRoutes: MetadataRoute.Sitemap = beerSlugs.map((slug) => ({
    url: `${siteUrl}/beers/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${siteUrl}/blog/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...beerRoutes, ...postRoutes];
}
