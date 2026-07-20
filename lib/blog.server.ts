import 'server-only';
import { activeClient } from "./sanity.server";
import { BlogPost } from "@/types";
import { ALL_POSTS_QUERY, POST_BY_SLUG_QUERY, ALL_POST_SLUGS_QUERY, ALL_POSTS_ADMIN_QUERY, ALL_JOURNAL_ENTRIES_QUERY } from "./blog";

export async function getAllJournalEntries(): Promise<BlogPost[]> {
  try {
    const entries = await activeClient.fetch(
      ALL_JOURNAL_ENTRIES_QUERY,
      {},
      { next: { tags: ["posts"], revalidate: 86400 } }
    );
    return entries || [];
  } catch (e) {
    console.error("Error fetching journal entries:", e);
    return [];
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const posts = await activeClient.fetch(
      ALL_POSTS_QUERY,
      {},
      { next: { tags: ["posts"], revalidate: 86400 } }
    );
    return posts || [];
  } catch (e) {
    console.error("Error fetching posts:", e);
    return [];
  }
}

/**
 * Highly optimized, database-level filtering query using GROQ parameters.
 * Eliminates in-memory Javascript filtering and reduces server memory pressure.
 */
export async function getFilteredPosts(category?: string, search?: string): Promise<BlogPost[]> {
  try {
    let filter = `_type == "post" && is_published == true && visibility in ["website", "both"] && !(_id in path("drafts.**"))`;
    const params: Record<string, any> = {};

    if (category && category !== "All") {
      filter += ` && category == $category`;
      params.category = category;
    }

    if (search) {
      filter += ` && (title match $search || excerpt match $search || tags match $search)`;
      params.search = `${search}*`; // Matches terms beginning with search string
    }

    const query = `
      *[${filter}] | order(date desc) {
        _id,
        "id": _id,
        title,
        "slug": slug.current,
        excerpt,
        content,
        author,
        date,
        category,
        featured,
        is_published,
        image,
        visibility,
        tags
      }
    `;

    const posts = await activeClient.fetch(
      query,
      params,
      { next: { tags: ["posts"], revalidate: 86400 } }
    );
    return posts || [];
  } catch (e) {
    console.error("Error fetching filtered posts:", e);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await activeClient.fetch(
      POST_BY_SLUG_QUERY,
      { slug },
      { next: { tags: [`post:${slug}`, "posts"], revalidate: 86400 } }
    );
    return post || null;
  } catch (e) {
    console.error("Error fetching post by slug:", e);
    return null;
  }
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const slugs = await activeClient.fetch(
      ALL_POST_SLUGS_QUERY,
      {},
      { next: { tags: ["posts"], revalidate: 86400 } }
    );
    return slugs || [];
  } catch (e) {
    console.error("Error fetching slugs:", e);
    return [];
  }
}

export async function getAllPostsWithAuth(): Promise<BlogPost[]> {
  try {
    const posts = await activeClient.fetch(
      ALL_POSTS_ADMIN_QUERY,
      {},
      { cache: "no-store" }
    );
    return posts || [];
  } catch (e) {
    console.error("Error fetching admin posts:", e);
    return [];
  }
}
