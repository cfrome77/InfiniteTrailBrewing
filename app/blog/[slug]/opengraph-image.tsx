import { renderOgCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-card";
import { getPostBySlug, getAllSlugs } from "@/lib/blog.server";

export const alt = "Infinite Trail Brewing";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const revalidate = 86400;

// Matches the post page, which is statically generated; without this the card
// is rendered on every crawler request.
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = "then" in params ? await params : params;
  const post = await getPostBySlug(slug);

  const meta = [post?.category, post?.author].filter(Boolean).join(" · ");

  return renderOgCard({
    eyebrow: "The Brew Log",
    // Same precedence as the page and its metadata: an editor's seo.title wins.
    title: post?.seo?.title || post?.title || "Infinite Trail Brewing",
    meta,
  });
}
