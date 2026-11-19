import type { MetadataRoute } from "next";
import { getAllBeers } from "@/lib/beers.server";
import { getAllPosts } from "@/lib/blog.server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://infinitetrailbrewing.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/beers`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/beers/archive`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/our-story`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const [beers, posts] = await Promise.all([getAllBeers(), getAllPosts()]);

  const beerRoutes: MetadataRoute.Sitemap = beers.map((beer) => ({
    url: `${SITE_URL}/beers/${beer.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...beerRoutes, ...postRoutes];
}
