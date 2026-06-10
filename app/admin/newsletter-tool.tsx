"use client";

import { useEffect, useState } from "react";
import { NewsletterManager } from "./newsletter-manager";
import { getAllPostsWithAuth } from "@/lib/blog";

export function NewsletterTool() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const allPosts = await getAllPostsWithAuth();
      setPosts(allPosts);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#1A4132', opacity: 0.5, fontFamily: 'serif' }}>Loading Newsletter Center...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', height: '100%', overflowY: 'auto', background: '#F5F0E6' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <NewsletterManager posts={posts} />
      </div>
    </div>
  );
}
