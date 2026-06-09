"use server";

import { serverClient as client } from "@/lib/sanity.server";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeToNewsletter(email: string) {
  if (!email || !email.includes("@")) {
    return { success: false, message: "Invalid email address" };
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Check if already exists
    const existing = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email: normalizedEmail }
    );

    let token = existing?.token || uuidv4();

    if (existing) {
      if (existing.status === 'subscribed') {
        return { success: true, message: "You're already subscribed!" };
      }

      // Re-subscribe
      await client
        .patch(existing._id)
        .set({ status: 'subscribed', subscribedAt: new Date().toISOString(), token })
        .commit();
    } else {
      // Create new subscriber
      await client.create({
        _type: "subscriber",
        email: normalizedEmail,
        subscribedAt: new Date().toISOString(),
        status: "subscribed",
        token,
      });
    }

    // Send Welcome Email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://infinitetrailbrewing.com";
    const fromEmail = process.env.CONTACT_RECEIVING_EMAIL || "newsletter@infinitetrailbrewing.com";
    const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${token}`;

    await resend.emails.send({
      from: `Infinite Trail Brewing <${fromEmail}>`,
      to: normalizedEmail,
      subject: "Welcome to the Trail!",
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
      },
      html: `
        <div style="font-family: serif; color: #1A4132; max-width: 600px; margin: 0 auto; border: 1px solid #E8D7B5; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1A4132; padding: 40px 20px; text-align: center;">
            <h1 style="color: #E8D7B5; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">Infinite Trail Brewing</h1>
          </div>
          <div style="padding: 40px 30px; background-color: #F5F0E6;">
            <h2 style="font-size: 28px; margin-bottom: 20px;">Welcome to the Trail!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">Thanks for joining our mailing list. You're now set to receive <strong>The Trail Report</strong>, featuring brew day recaps, new beer announcements, and lessons from the brewhouse.</p>
            <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 20px;">We're glad to have you with us on this journey.</p>
            <div style="margin-top: 40px; text-align: center;">
              <a href="${siteUrl}/blog" style="background-color: #1A4132; color: #E8D7B5; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Explore The Trail Report</a>
            </div>
          </div>
          <div style="background-color: #E8D7B5; padding: 20px; text-align: center; font-size: 12px; color: #1A4132;">
            <p>© ${new Date().getFullYear()} Infinite Trail Brewing. All rights reserved.</p>
            <p>You received this because you signed up on our website. <a href="${unsubscribeUrl}" style="color: #1A4132;">Unsubscribe</a></p>
          </div>
        </div>
      `,
    });

    return { success: true, message: "Welcome to the trail! Check your inbox for a confirmation." };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}
