import Parser from "rss-parser";

const SUBSTACK_URL = process.env.SUBSTACK_URL;
const parser = new Parser();

export interface SubstackPost {
  id: string;
  title: string;
  content: string;
  contentSnippet: string;
  pubDate: string;
  link: string;
  categories?: string[];
}

export async function getSubstackPosts(): Promise<SubstackPost[]> {
  if (!SUBSTACK_URL) {
    console.error("SUBSTACK_URL is missing");
    return [];
  }

  try {
    const feed = await parser.parseURL(`${SUBSTACK_URL}/feed`);

    return feed.items.map(item => ({
      id: item.guid || item.link || "",
      title: item.title || "Untitled",
      content: item['content:encoded'] || item.content || "",
      contentSnippet: item.contentSnippet || "",
      pubDate: item.pubDate || "",
      link: item.link || "",
      categories: item.categories || [],
    }));
  } catch (error) {
    console.error("Error fetching Substack posts:", error);
    return [];
  }
}

export async function getSubstackPost(postId: string): Promise<SubstackPost | null> {
  const posts = await getSubstackPosts();
  // Using GUID or slug-like comparison if needed, but for RSS usually link or GUID is best
  return posts.find(p => p.id === postId || p.link.includes(postId)) || null;
}
