import { client } from "./sanity";
import { serverClient } from "./sanity.server";

const WEBSITE_VISIBILITY_FILTER = `(visibility == "website" || visibility == "both" || !defined(visibility))`;

// ==============================
// Build-time: get all posts
// ==============================
export async function getAllPosts() {
  try {
    const activeClient = process.env.SANITY_API_TOKEN ? serverClient : client;
    if (process.env.NODE_ENV !== 'production') {
      console.log('Fetching posts with config:', {
        projectId: activeClient.config().projectId,
        dataset: activeClient.config().dataset,
        useCdn: activeClient.config().useCdn,
        usingToken: !!process.env.SANITY_API_TOKEN
      });
    }
    const posts = await activeClient.fetch(`
      *[_type == "post" && is_published == true && ${WEBSITE_VISIBILITY_FILTER}] | order(date desc) {
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
        visibility
      }
    `);

    if (process.env.NODE_ENV !== 'production') {
      console.log('POSTS QUERY RESULT:', posts);
    }
    return posts || [];
  } catch (e) {
    console.error("Error fetching posts from Sanity:", e);
    return [];
  }
}

// ==============================
// Build-time: get post by slug
// ==============================
export async function getPostBySlug(slug: string) {
  try {
    const activeClient = process.env.SANITY_API_TOKEN ? serverClient : client;
    const post = await activeClient.fetch(
      `*[_type == "post" && slug.current == $slug && is_published == true && ${WEBSITE_VISIBILITY_FILTER}][0] {
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
        visibility
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
export async function getAllSlugs() {
  try {
    const activeClient = process.env.SANITY_API_TOKEN ? serverClient : client;
    const slugs = await activeClient.fetch(`*[_type == "post" && is_published == true && ${WEBSITE_VISIBILITY_FILTER}].slug.current`);
    return slugs || [];
  } catch (e) {
    console.error("Error fetching slugs from Sanity:", e);
    return [];
  }
}

// ==============================
// Runtime / server-side with auth
// ==============================
export async function getAllPostsWithAuth() {
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
        visibility
      }
    `);

    return posts;
  } catch (e) {
    console.error("Error fetching posts with auth from Sanity:", e);
    return [];
  }
}

export async function getPostBySlugWithAuth(slug: string) {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
  try {
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0] {
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
        visibility
      }`,
      { slug }
    );

    return post || null;
  } catch (e) {
    console.error("Error fetching post by slug with auth from Sanity:", e);
    return null;
  }
}
