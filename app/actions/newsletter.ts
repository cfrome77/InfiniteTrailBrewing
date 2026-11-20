"use server";

import { serverClient as client } from "@/lib/sanity.server";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { getResendClient } from "@/lib/resend";
import { isSubscribeLimited as isLimited } from "@/lib/subscribe-limiter";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// This action is publicly callable and both writes to Sanity and sends email,
// so it needs the same per-IP cap as the contact route. Keyed by IP rather than
// address: keying by address would still let one client mail many recipients.

// Every success path returns this exact wording. The branches are only
// reachable for new or re-subscribed addresses, so a distinct message per
// branch would tell a caller whether an address is already on the list.
const GENERIC_SUCCESS =
  "Thanks! If that address wasn't already on the list, a welcome email is on its way.";


async function clientKey(): Promise<string> {
  const forwarded = (await headers()).get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function subscribeToNewsletter(email: string) {
  if (typeof email !== "string") {
    return { success: false, message: "Invalid email address" };
  }

  if (isLimited(await clientKey())) {
    return { success: false, message: "Too many requests. Please try again later." };
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (normalizedEmail.length > 254 || !EMAIL_RE.test(normalizedEmail)) {
    return { success: false, message: "Invalid email address" };
  }

  try {
    // Check if already exists
    const existing = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email: normalizedEmail }
    );

    let token = existing?.token || randomUUID();

    if (existing) {
      if (existing.status === 'subscribed') {
        // Same wording as a new signup: distinguishing the two would let a
        // caller probe whether an address is on the list.
        return {
          success: true,
          message: GENERIC_SUCCESS,
        };
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

    const resend = getResendClient();

    // Send Welcome Email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://infinitetrailbrewing.com";
    const fromEmail = process.env.CONTACT_RECEIVING_EMAIL || "newsletter@infinitetrailbrewing.com";
    const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${token}`;

    if (!resend) {
      console.error("Welcome email skipped: RESEND_API_KEY is not configured.");
      return {
        success: true,
        message: GENERIC_SUCCESS,
      };
    }

    const { error: sendError } = await resend.emails.send({
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
            <p style="font-size: 16px; line-height: 1.6; color: #333;">Thanks for joining our mailing list. You're now set to receive <strong>The Brew Log</strong>, featuring brew day recaps, new beer announcements, and lessons from the brewhouse.</p>
            <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 20px;">We're glad to have you with us on this journey.</p>
            <div style="margin-top: 40px; text-align: center;">
              <a href="${siteUrl}/blog" style="background-color: #1A4132; color: #E8D7B5; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Explore The Brew Log</a>
            </div>
          </div>
          <div style="background-color: #E8D7B5; padding: 20px; text-align: center; font-size: 12px; color: #1A4132;">
            <p>© ${new Date().getFullYear()} Infinite Trail Brewing. All rights reserved.</p>
            <p>You received this because you signed up on our website. <a href="${unsubscribeUrl}" style="color: #1A4132;">Unsubscribe</a></p>
          </div>
        </div>
      `,
    });

    // Resend reports failures in its response rather than throwing; without this
    // check a dropped welcome email still reported success and the subscriber
    // never received their unsubscribe link.
    if (sendError) {
      console.error("Welcome email failed:", sendError);
      return {
        success: true,
        message: GENERIC_SUCCESS,
      };
    }

    return {
      success: true,
      message: GENERIC_SUCCESS,
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}
