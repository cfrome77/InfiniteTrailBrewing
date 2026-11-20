"use server";

import { serverClient as client } from "@/lib/sanity.server";
import { randomUUID } from "crypto";
import { getResendClient } from "@/lib/resend";
import { createRateLimiter } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Caps unsubscribe emails per address so this cannot be used to flood a mailbox.
const isLimited = createRateLimiter(3, 60 * 60 * 1000);

/**
 * Unsubscribe via a link token. The token is the only proof that the caller
 * controls the mailbox, so no email address is accepted here.
 */
export async function unsubscribeByToken(token: string) {
  if (typeof token !== "string" || token.trim().length === 0) {
    return { success: false, message: "Invalid unsubscribe link." };
  }

  try {
    const subscriber: { _id: string; status?: string } | null = await client.fetch(
      `*[_type == "subscriber" && token == $unsubscribeToken][0]{ _id, status }`,
      { unsubscribeToken: token.trim() },
    );

    if (!subscriber) {
      return { success: false, message: "This unsubscribe link is no longer valid." };
    }

    if (subscriber.status === "unsubscribed") {
      return { success: true, message: "You are already unsubscribed from The Brew Log." };
    }

    await client.patch(subscriber._id).set({ status: "unsubscribed" }).commit();
    return { success: true, message: "You have been successfully unsubscribed from The Brew Log." };
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return { success: false, message: "Something went wrong. Please try again later." };
  }
}

/**
 * Request an unsubscribe link by email. This never changes subscription state
 * directly; it only mails a link to the address owner, so an attacker cannot
 * unsubscribe someone else's address.
 */
export async function requestUnsubscribeLink(email: string) {
  const generic = {
    success: true,
    message: "If that address is on our list, an unsubscribe link is on its way.",
  };

  if (typeof email !== "string") return generic;

  const normalizedEmail = email.toLowerCase().trim();
  if (normalizedEmail.length > 254 || !EMAIL_RE.test(normalizedEmail)) return generic;

  if (isLimited(normalizedEmail)) return generic;

  try {
    const subscriber: { _id: string; token?: string } | null = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]{ _id, token }`,
      { email: normalizedEmail },
    );

    // Respond identically whether or not the address exists so this endpoint
    // cannot be used to enumerate subscribers.
    if (!subscriber) return generic;

    const token = subscriber.token || randomUUID();
    if (!subscriber.token) {
      await client.patch(subscriber._id).set({ token }).commit();
    }

    const resend = getResendClient();
    if (!resend) {
      console.error("Unsubscribe email skipped: RESEND_API_KEY is not configured.");
      return { success: false, message: "Email is temporarily unavailable. Please try again later." };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://infinitetrailbrewing.com";
    const fromEmail = process.env.CONTACT_RECEIVING_EMAIL || "newsletter@infinitetrailbrewing.com";
    // Two URLs on purpose. The page is where a human confirms; the API route is
    // the only one that answers RFC 8058's POST, and advertising a one-click
    // header that points at a page returns 405 and leaves the recipient
    // subscribed. The other senders already point the header at the API.
    const pageUrl = `${siteUrl}/unsubscribe?token=${token}`;
    const oneClickUrl = `${siteUrl}/api/unsubscribe?token=${encodeURIComponent(token)}`;

    const { error: sendError } = await resend.emails.send({
      from: `Infinite Trail Brewing <${fromEmail}>`,
      to: normalizedEmail,
      subject: "Unsubscribe from The Brew Log",
      headers: {
        "List-Unsubscribe": `<${oneClickUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
      text: `We're sorry to see you go.\n\nConfirm your unsubscribe here: ${pageUrl}\n\nIf you didn't request this, you can ignore this email.`,
    });

    // Still return the generic message: surfacing the failure would reveal
    // whether the address is on the list.
    if (sendError) console.error("Unsubscribe email failed:", sendError);

    return generic;
  } catch (error) {
    console.error("Unsubscribe request error:", error);
    return generic;
  }
}
