"use server";

import { serverClient as client } from "@/lib/sanity.server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewsletter(postId: string) {
  try {
    // 1. Fetch the post
    const post = await client.fetch(`*[_id == $postId][0]`, { postId });
    if (!post) return { success: false, message: "Post not found" };

    // 2. Fetch all active subscribers
    const subscribers = await client.fetch(`*[_type == "subscriber" && status == "subscribed"]`);
    if (subscribers.length === 0) return { success: false, message: "No active subscribers found" };

    const emails = subscribers.map((s: any) => s.email);

    // 3. Send email via Resend
    // Note: Resend allows sending to multiple recipients at once in some tiers,
    // but for larger lists, you'd want to batch them or use an audience.
    // For now, we'll send it as a broadcast to the list.

    const { data, error } = await resend.emails.send({
      from: `Infinite Trail Brewing <${process.env.CONTACT_RECEIVING_EMAIL || "newsletter@infinitetrailbrewing.com"}>`,
      to: [process.env.CONTACT_RECEIVING_EMAIL || "newsletter@infinitetrailbrewing.com"],
      bcc: emails,
      subject: `The Trail Report: ${post.title}`,
      html: `
        <div style="font-family: serif; color: #1A4132; max-width: 600px; margin: 0 auto; border: 1px solid #E8D7B5; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1A4132; padding: 40px 20px; text-align: center;">
            <h1 style="color: #E8D7B5; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">The Trail Report</h1>
          </div>
          <div style="padding: 40px 30px; background-color: #F5F0E6;">
            <h2 style="font-size: 28px; margin-bottom: 20px;">${post.title}</h2>
            <p style="font-size: 16px; line-height: 1.6; color: rgba(26, 65, 50, 0.8);">${post.excerpt}</p>
            <div style="margin-top: 40px; text-align: center;">
              <a href="https://infinitetrailbrewing.com/blog/${post.slug.current}" style="background-color: #1A4132; color: #E8D7B5; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Read the Full Story</a>
            </div>
          </div>
          <div style="background-color: #E8D7B5; padding: 20px; text-align: center; font-size: 12px; color: #1A4132;">
            <p>© ${new Date().getFullYear()} Infinite Trail Brewing. All rights reserved.</p>
            <p>You're receiving this because you're following the trail. <a href="https://infinitetrailbrewing.com/unsubscribe" style="color: #1A4132;">Unsubscribe</a></p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, message: error.message };
    }

    return { success: true, message: `Newsletter sent successfully to ${emails.length} subscribers!` };
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
