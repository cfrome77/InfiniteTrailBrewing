"use client";

import { useEffect, useState } from "react";
import { BlogPost } from "@/types";
import { createClient } from "@/lib/supabase/client";

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    featured: false,
    is_published: false,
  });

  // --- Fetch blog posts ---
  const fetchPosts = async () => {
    const { data, error } = await createClient()
      .from("blog_posts")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      return;
    }

    setPosts(data ?? []);
    setLoadingPosts(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addNewPost = async () => {
    if (!newPost.title || !newPost.content || !newPost.slug) {
      alert("Title, slug, and content are required.");
      return;
    }

    const { data, error } = await createClient()
      .from("blog_posts")
      .insert([
        {
          slug: newPost.slug,
          title: newPost.title,
          excerpt: newPost.excerpt ?? "",
          content: newPost.content,
          author: newPost.author ?? null,
          category: newPost.category ?? null,
          featured: newPost.featured ?? false,
          is_published: newPost.is_published ?? false,
          date: new Date().toISOString().split("T")[0],
        },
      ])
      .select();

    if (error) {
      console.error("Error adding post:", error);
      return;
    }

    setPosts((prev) => [data![0], ...prev]);
    setNewPost({
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      author: "",
      category: "",
      featured: false,
      is_published: false,
    });
  };

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    const { error } = await createClient()
      .from("blog_posts")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating post:", error);
      return;
    }

    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  const deletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await createClient()
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting post:", error);
      return;
    }

    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loadingPosts)
    return <div className="text-center mt-10">Loading posts...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif text-forest mb-6">Blog Admin Panel</h1>

      {/* Add New Post Form */}
      <div className="border rounded-lg p-6 mb-8 shadow">
        <h2 className="font-serif text-2xl text-forest mb-4">Add New Post</h2>

        {/* ... form inputs same as before ... */}

        <button
          onClick={addNewPost}
          className="bg-forest text-tan px-4 py-2 rounded hover:bg-forest/90"
        >
          Add Post
        </button>
      </div>

      {/* Existing Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-serif text-xl text-forest">{post.title}</h2>
              <span className="text-sm text-gray-600">{post.date}</span>
            </div>
            <p className="text-forest/70 mb-2">{post.excerpt}</p>
            <p className="text-forest/70 mb-2">
              Author: {post.author ?? "Unknown"} | Category:{" "}
              {post.category ?? "None"}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() =>
                  updatePost(post.id, { featured: !post.featured })
                }
                className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
              >
                {post.featured ? "Unfeature" : "Feature"}
              </button>
              <button
                onClick={() =>
                  updatePost(post.id, { is_published: !post.is_published })
                }
                className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm"
              >
                {post.is_published ? "Unpublish" : "Publish"}
              </button>
              <button
                onClick={() => deletePost(post.id)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
