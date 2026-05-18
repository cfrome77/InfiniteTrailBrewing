import { sql } from "./db";
import { auth } from "./auth";
import { headers } from "next/headers";

// ==============================
// Build-time: get all posts
// ==============================
export async function getAllPosts() {
  return await sql`SELECT * FROM blog_posts WHERE is_published = true ORDER BY date DESC`;
}

// ==============================
// Build-time: get post by slug
// ==============================
export async function getPostBySlug(slug: string) {
  const posts = await sql`SELECT * FROM blog_posts WHERE slug = ${slug} AND is_published = true LIMIT 1`;
  return posts[0] || null;
}

// ==============================
// Build-time: get all slugs
// ==============================
export async function getAllSlugs() {
  const posts = await sql`SELECT slug FROM blog_posts WHERE is_published = true`;
  return posts.map((p: any) => p.slug);
}

// ==============================
// Runtime / server-side with auth
// ==============================
export async function getAllPostsWithAuth() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // If admin, show all posts (including drafts)
  if (session?.user && (session.user as any).role === 'admin') {
    return await sql`SELECT * FROM blog_posts ORDER BY date DESC`;
  }

  return getAllPosts();
}

export async function getPostBySlugWithAuth(slug: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // If admin, can see unpublished posts
  if (session?.user && (session.user as any).role === 'admin') {
    const posts = await sql`SELECT * FROM blog_posts WHERE slug = ${slug} LIMIT 1`;
    return posts[0] || null;
  }

  return getPostBySlug(slug);
}
