"use server";

import { serverClient as client } from "@/lib/sanity.server";
import { getResendClient } from "@/lib/resend";
import { transformPortableTextToEmailHtml } from "@/lib/newsletter-utils";
import { requireAdmin } from "@/lib/admin-auth";
import { escapeHtml } from "@/lib/html-escape";

/** Resend accepts at most 100 messages per batch call. */
const BATCH_SIZE = 100;

function buildEmailHtml(post: {
  title?: string;
  visibility?: string;
  slug?: { current?: string };
}, contentHtml: string, siteUrl: string, unsubscribeUrl: string): string {
  const readOnSite =
    post.visibility !== "newsletter" && post.slug?.current
      ? `
        <div style="margin-top: 40px; text-align: center;">
          <a href="${escapeHtml(`${siteUrl}/blog/${encodeURIComponent(post.slug.current)}`)}" style="background-color: #1A4132; color: #E8D7B5; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Read on Website</a>
        </div>
        `
      : "";

  return `
    <div style="font-family: serif; color: #1A4132; max-width: 600px; margin: 0 auto; border: 1px solid #E8D7B5; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1A4132; padding: 40px 20px; text-align: center;">
        <h1 style="color: #E8D7B5; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">The Brew Log</h1>
      </div>
      <div style="padding: 40px 30px; background-color: #F5F0E6;">
        <h2 style="font-size: 28px; margin-bottom: 20px;">${escapeHtml(post.title ?? "")}</h2>
        <div style="font-family: sans-serif;">
          ${contentHtml}
        </div>
        ${readOnSite}
      </div>
      <div style="background-color: #E8D7B5; padding: 20px; text-align: center; font-size: 12px; color: #1A4132;">
        <p>© ${new Date().getFullYear()} Infinite Trail Brewing. All rights reserved.</p>
        <p>You're receiving this because you're following the trail. <a href="${unsubscribeUrl}" style="color: #1A4132;">Unsubscribe</a></p>
      </div>
    </div>
  `;
}

export async function sendNewsletter(postId: string) {
  await requireAdmin();

  const resend = getResendClient();
  if (!resend) {
    return { success: false, message: "Email is not configured (RESEND_API_KEY missing)." };
  }

  try {
    const post = await client.fetch(`*[_id == $postId][0]`, { postId });
    if (!post) return { success: false, message: "Post not found" };

    const contentHtml = post.content
      ? transformPortableTextToEmailHtml(post.content)
      : `<p>${escapeHtml(post.excerpt)}</p>`;

    const subscribers: { email: string; token?: string }[] = await client.fetch(
      `*[_type == "subscriber" && status == "subscribed"]{ email, token }`,
    );
    if (subscribers.length === 0) return { success: false, message: "No active subscribers found" };

    // A subscriber created by hand in Studio has no token, which would send a
    // "?token=undefined" link that silently fails. Skip them and report it.
    const sendable = subscribers.filter((s) => typeof s.token === "string" && s.token.length > 0);
    const skipped = subscribers.length - sendable.length;

    if (sendable.length === 0) {
      return {
        success: false,
        message: "No subscribers have an unsubscribe token, so nothing was sent.",
      };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://infinitetrailbrewing.com";
    const fromEmail = process.env.CONTACT_RECEIVING_EMAIL || "newsletter@infinitetrailbrewing.com";

    let successCount = 0;
    let failCount = 0;

    // Batched rather than one request per subscriber: a sequential loop exceeds
    // the serverless function timeout once the list grows, leaving the rest of
    // the list unsent with no way to resume.
    for (let i = 0; i < sendable.length; i += BATCH_SIZE) {
      const chunk = sendable.slice(i, i + BATCH_SIZE);

      const payload = chunk.map((sub) => {
        const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${encodeURIComponent(sub.token as string)}`;
        return {
          from: `Infinite Trail Brewing <${fromEmail}>`,
          to: sub.email,
          subject: `The Brew Log: ${post.title}`,
          headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` },
          html: buildEmailHtml(post, contentHtml, siteUrl, unsubscribeUrl),
        };
      });

      try {
        // permissive keeps one bad address from rejecting the whole chunk.
        const { data, error } = await resend.batch.send(payload, {
          batchValidation: "permissive",
        });

        if (error) {
          console.error("Newsletter batch failed:", error);
          failCount += chunk.length;
          continue;
        }

        const failedInChunk = new Set(
          (data?.errors ?? []).map((e) => e.index),
        );
        failCount += failedInChunk.size;
        successCount += chunk.length - failedInChunk.size;
      } catch (error) {
        console.error("Newsletter batch threw:", error);
        failCount += chunk.length;
      }
    }

    const skippedNote = skipped > 0 ? ` ${skipped} skipped (no unsubscribe token).` : "";
    return {
      success: true,
      message: `Newsletter sent! ${successCount} successful, ${failCount} failed.${skippedNote}`,
    };
  } catch (error) {
    console.error("Newsletter send error:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function getSubscriberCount() {
    await requireAdmin();

    try {
        const count = await client.fetch(`count(*[_type == "subscriber" && status == "subscribed"])`);
        return count;
    } catch {
        return 0;
    }
}

export async function getResendStats() {
    await requireAdmin();

    const resend = getResendClient();
    if (!resend) return null;

    try {
        const { data, error } = await resend.emails.list();
        if (error || !data) throw error;

        return {
            recentEmails: (data.data || []).slice(0, 5).map(e => ({
                id: e.id,
                subject: e.subject,
                createdAt: e.created_at,
                to: e.to
            }))
        };
    } catch (e) {
        console.error("Error fetching Resend stats:", e);
        return null;
    }
}
