import Parser from "rss-parser";

const SUBSTACK_FEED_URL = process.env.SUBSTACK_FEED_URL;
const parser = new Parser();

export interface SubstackPost {
  id: string;
  title: string;
  content: string;
  contentSnippet: string;
  pubDate: string;
  link: string;
}

export async function getSubstackPosts(): Promise<SubstackPost[]> {
  if (!SUBSTACK_FEED_URL) {
    console.warn("SUBSTACK_FEED_URL is not set");
    return [];
  }

  try {
    const feed = await parser.parseURL(SUBSTACK_FEED_URL);
    return feed.items.map((item) => ({
      id: item.guid || item.link || "",
      title: item.title || "Untitled",
      content: item["content:encoded"] || item.content || "",
      contentSnippet: item.contentSnippet || "",
      pubDate: item.pubDate || "",
      link: item.link || "",
    }));
  } catch (error) {
    console.error("Error fetching Substack posts:", error);
    return [];
  }
}
