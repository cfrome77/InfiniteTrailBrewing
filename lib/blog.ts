import { client } from "./sanity";

// ==============================
// Build-time: get all posts
// ==============================
export async function getAllPosts() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Fetching posts with config:', {
        projectId: client.config().projectId,
        dataset: client.config().dataset,
        useCdn: client.config().useCdn
      });
    }
    const posts = await client.fetch(`
      *[_type == "post" && is_published == true] | order(date desc) {
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
        is_published
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
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
  try {
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug && is_published == true][0] {
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
        is_published
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
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    const slugs = await client.fetch(`*[_type == "post" && is_published == true].slug.current`);
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
        is_published
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
        is_published
      }`,
      { slug }
    );

    return post || null;
  } catch (e) {
    console.error("Error fetching post by slug with auth from Sanity:", e);
    return null;
  }
}
