"use server";

import { serverClient as client } from "@/lib/sanity.server";
import { requireAdmin } from "@/lib/admin-auth";
import { ALL_BEERS_QUERY } from "@/lib/beers";
import { ALL_POSTS_ADMIN_QUERY } from "@/lib/blog";

/**
 * Admin data reads live behind Server Actions so the Studio never needs a
 * browser-side Sanity token. The dataset can stay private and subscriber
 * records are never exposed to an anonymous visitor.
 */

export async function getInventoryBeers() {
  await requireAdmin();
  return client.fetch(ALL_BEERS_QUERY);
}

export async function getAdminPosts() {
  await requireAdmin();
  return client.fetch(ALL_POSTS_ADMIN_QUERY);
}
