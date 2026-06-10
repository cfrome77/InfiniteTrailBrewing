"use server";

import { serverClient as client } from "@/lib/sanity.server";
import { Resend } from "resend";
import { transformPortableTextToEmailHtml } from "@/lib/newsletter-utils";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewsletter(postId: string) {
  try {
    // 1. Fetch the post
    const post = await client.fetch(`*[_id == $postId][0]`, { postId });
    if (!post) return { success: false, message: "Post not found" };

    const contentHtml = post.content ? transformPortableTextToEmailHtml(post.content) : `<p>${post.excerpt}</p>`;

    // 2. Fetch all active subscribers
    const subscribers = await client.fetch(`*[_type == "subscriber" && status == "subscribed"]`);
    if (subscribers.length === 0) return { success: false, message: "No active subscribers found" };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://infinitetrailbrewing.com";
    const fromEmail = process.env.CONTACT_RECEIVING_EMAIL || "newsletter@infinitetrailbrewing.com";

    // 3. Send emails
    // For individual tokens, we have to send emails separately or use Resend's batching
    // To implement List-Unsubscribe, we send individually.

    let successCount = 0;
    let failCount = 0;

    for (const sub of subscribers) {
      const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${sub.token}`;

      const { data, error } = await resend.emails.send({
        from: `Infinite Trail Brewing <${fromEmail}>`,
        to: sub.email,
        subject: `The Trail Report: ${post.title}`,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
        },
        html: `
          <div style="font-family: serif; color: #1A4132; max-width: 600px; margin: 0 auto; border: 1px solid #E8D7B5; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #1A4132; padding: 40px 20px; text-align: center;">
              <h1 style="color: #E8D7B5; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">The Trail Report</h1>
            </div>
            <div style="padding: 40px 30px; background-color: #F5F0E6;">
              <h2 style="font-size: 28px; margin-bottom: 20px;">${post.title}</h2>
              <div style="font-family: sans-serif;">
                ${contentHtml}
              </div>
              ${post.visibility !== 'newsletter' ? `
              <div style="margin-top: 40px; text-align: center;">
                <a href="${siteUrl}/blog/${post.slug.current}" style="background-color: #1A4132; color: #E8D7B5; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Read on Website</a>
              </div>
              ` : ''}
            </div>
            <div style="background-color: #E8D7B5; padding: 20px; text-align: center; font-size: 12px; color: #1A4132;">
              <p>© ${new Date().getFullYear()} Infinite Trail Brewing. All rights reserved.</p>
              <p>You're receiving this because you're following the trail. <a href="${unsubscribeUrl}" style="color: #1A4132;">Unsubscribe</a></p>
            </div>
          </div>
        `,
      });

      if (error) failCount++;
      else successCount++;
    }

    return {
      success: true,
      message: `Newsletter sent! ${successCount} successful, ${failCount} failed.`
    };
  } catch (error) {
    console.error("Newsletter send error:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function getSubscriberCount() {
    try {
        const count = await client.fetch(`count(*[_type == "subscriber" && status == "subscribed"])`);
        return count;
    } catch (e) {
        return 0;
    }
}

export async function getResendStats() {
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
