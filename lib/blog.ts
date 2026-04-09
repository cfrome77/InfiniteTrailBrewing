import { createClient as createPublicClient } from "./supabase/client"; // browser/static
import { createClient as createServerClient } from "./supabase/server"; // runtime/auth

// Helper to get a Supabase client instance for static generation (no auth)
function getPublicSupabase() {
  return createPublicClient();
}

// ==============================
// Build-time: get all posts
// ==============================
export async function getAllPosts() {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}

// ==============================
// Build-time: get post by slug
// ==============================
export async function getPostBySlug(slug: string) {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) return null;
  return data;
}

// ==============================
// Build-time: get all slugs
// ==============================
export async function getAllSlugs() {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);

  if (error || !data) return [];
  return data.map((p: { slug: string }) => p.slug);
}

// ==============================
// Runtime / server-side with auth
// ==============================
export async function getAllPostsWithAuth() {
  const supabase = await createServerClient(); // async server client
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("date", { ascending: false }); // include drafts if user has access

  if (error) throw error;
  return data;
}

export async function getPostBySlugWithAuth(slug: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}
