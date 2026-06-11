import 'server-only';
import { activeClient } from "./sanity.server";
import { BlogPost } from "@/types";
import { ALL_POSTS_QUERY, POST_BY_SLUG_QUERY, ALL_POST_SLUGS_QUERY, ALL_POSTS_ADMIN_QUERY } from "./blog";

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const posts = await activeClient.fetch(ALL_POSTS_QUERY);
    return posts || [];
  } catch (e) {
    console.error("Error fetching posts:", e);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await activeClient.fetch(POST_BY_SLUG_QUERY, { slug });
    return post || null;
  } catch (e) {
    console.error("Error fetching post by slug:", e);
    return null;
  }
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const slugs = await activeClient.fetch(ALL_POST_SLUGS_QUERY);
    return slugs || [];
  } catch (e) {
    console.error("Error fetching slugs:", e);
    return [];
  }
}

export async function getAllPostsWithAuth(): Promise<BlogPost[]> {
  try {
    const posts = await activeClient.fetch(ALL_POSTS_ADMIN_QUERY);
    return posts || [];
  } catch (e) {
    console.error("Error fetching admin posts:", e);
    return [];
  }
}
