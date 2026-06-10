import { client } from "./sanity";
import { serverClient } from "./sanity.server";
import { BlogPost } from "@/types";

// ==============================
// Build-time: get all posts
// ==============================
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const activeClient = process.env.SANITY_API_TOKEN ? serverClient : client;
    const posts = await activeClient.fetch(`
      *[_type == "post" && is_published == true && visibility in ["website", "both"]] | order(date desc) {
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
    `);
    return posts || [];
  } catch (e) {
    console.error("Error fetching posts from Sanity:", e);
    return [];
  }
}

// ==============================
// Build-time: get post by slug
// ==============================
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const activeClient = process.env.SANITY_API_TOKEN ? serverClient : client;
    const post = await activeClient.fetch(
      `*[_type == "post" && slug.current == $slug && is_published == true && visibility in ["website", "both"]][0] {
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
        tags,
        seo,
        relatedBeers[]->{
          _id,
          beer_name,
          "slug": slug.current,
          style,
          image
        }
      }`,
      { slug }
    );
    return post || null;
  } catch (e) {
    console.error("Error fetching post by slug from Sanity:", e);
    return null;
  }
}

// ==============================
// Build-time: get all slugs
// ==============================
export async function getAllSlugs(): Promise<string[]> {
  try {
    const activeClient = process.env.SANITY_API_TOKEN ? serverClient : client;
    const slugs = await activeClient.fetch(`*[_type == "post" && is_published == true && visibility in ["website", "both"]].slug.current`);
    return slugs || [];
  } catch (e) {
    console.error("Error fetching slugs from Sanity:", e);
    return [];
  }
}

// ==============================
// Runtime / server-side with auth
// ==============================
export async function getAllPostsWithAuth(): Promise<BlogPost[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    const posts = await client.fetch(`
      *[_type == "post"] | order(date desc) {
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
    `);
    return posts;
  } catch (e) {
    console.error("Error fetching posts with auth from Sanity:", e);
    return [];
  }
}
