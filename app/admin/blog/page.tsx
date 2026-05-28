"use client";

import { useEffect, useState } from "react";
import { BlogPost } from "@/types";
import { client } from "@/lib/sanity";
import { savePostAction, deletePostAction } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    featured: false,
    is_published: false,
  });

  const fetchPosts = async () => {
    try {
      const data = await client.fetch(`
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
      setPosts(data ?? []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const startEditing = (post: BlogPost) => {
    setEditingId(post.id);
    setFormData({
        ...post,
        content: Array.isArray(post.content) ? JSON.stringify(post.content, null, 2) : post.content
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({
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

  const savePost = async () => {
    if (!formData.title || !formData.content || !formData.slug) {
      showStatus('error', "Title, slug, and content are required.");
      return;
    }

    const result = await savePostAction(formData, editingId);

    if (result.success) {
      showStatus('success', editingId ? "Post updated!" : "Post published!");
      cancelEditing();
      fetchPosts();
    } else {
      showStatus('error', result.error || "Failed to save post.");
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const result = await deletePostAction(id);
    if (result.success) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      showStatus('success', "Post deleted.");
    } else {
      showStatus('error', result.error || "Failed to delete post.");
    }
  };

  if (loadingPosts)
    return <div className="text-center mt-10 text-forest">Loading posts...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-forest/60 hover:text-forest transition-colors mb-4 text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-serif text-forest">Blog Admin Panel</h1>
          {statusMsg && (
            <div className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all duration-500 ${
              statusMsg.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {statusMsg.text}
            </div>
          )}
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white border border-tan/20 rounded-xl p-6 mb-8 shadow-md">
        <h2 className="font-serif text-2xl text-forest mb-4">
          {editingId ? "Edit Post" : "Add New Post"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-forest/70 mb-1">Title</label>
            <input
              type="text"
              placeholder="Post Title"
              value={formData.title ?? ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-tan/30 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-forest/70 mb-1">Slug</label>
            <input
              type="text"
              placeholder="post-url-slug"
              value={formData.slug ?? ""}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full border border-tan/30 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-forest/70 mb-1">Author</label>
            <input
              type="text"
              placeholder="John Brewer"
              value={formData.author ?? ""}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full border border-tan/30 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-forest/70 mb-1">Category</label>
            <input
              type="text"
              placeholder="News / Brewing"
              value={formData.category ?? ""}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-tan/30 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase text-forest/70 mb-1">Excerpt</label>
          <textarea
            placeholder="Brief summary of the post..."
            value={formData.excerpt ?? ""}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full border border-tan/30 rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-forest/20"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase text-forest/70 mb-1">Content (Markdown/JSON)</label>
          <textarea
            placeholder="The full story goes here..."
            value={typeof formData.content === 'string' ? formData.content : JSON.stringify(formData.content, null, 2)}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full border border-tan/30 rounded-lg px-3 py-2 h-60 focus:outline-none focus:ring-2 focus:ring-forest/20 font-mono text-sm"
          />
        </div>

        <div className="flex items-center gap-8 mb-6">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.featured ?? false}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5 accent-forest"
            />
            <span className="text-forest font-serif group-hover:text-forest/80 transition-colors">Featured Post</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.is_published ?? false}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-5 h-5 accent-forest"
            />
            <span className="text-forest font-serif group-hover:text-forest/80 transition-colors">Published</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={savePost}
            className="bg-forest text-tan px-8 py-2 rounded-lg font-serif hover:bg-forest/90 transition-all shadow-md active:scale-95"
          >
            {editingId ? "Update Post" : "Publish Post"}
          </button>
          {editingId && (
            <button
              onClick={cancelEditing}
              className="bg-tan/50 text-forest px-8 py-2 rounded-lg font-serif hover:bg-tan/70 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-tan/20 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-serif text-xl text-forest">{post.title}</h2>
                {post.featured && (
                  <span className="bg-sky/20 text-sky text-[10px] uppercase px-2 py-0.5 rounded font-bold">Featured</span>
                )}
                {!post.is_published && (
                  <span className="bg-amber-100 text-amber-700 text-[10px] uppercase px-2 py-0.5 rounded font-bold">Draft</span>
                )}
              </div>
              <p className="text-forest/50 text-sm mb-1">{post.excerpt}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => startEditing(post)}
                className="bg-sky/10 text-sky hover:bg-sky hover:text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => deletePost(post.id)}
                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all"
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
