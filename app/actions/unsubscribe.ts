"use server";

import { serverClient as client } from "@/lib/sanity.server";
import { Resend } from "resend";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Anyone can type any address here, so this must not unsubscribe directly.
 * It only sends a confirmation link to the address owner.
 */
export async function requestUnsubscribe(email: string) {
  if (!email || !email.includes("@")) {
    return { success: false, message: "Invalid email address" };
  }

  if (!rateLimit(`unsub:${email.toLowerCase().trim()}`, 3, 15 * 60 * 1000)) {
    return { success: false, message: "Too many requests. Please try again later." };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const genericMessage =
    "If that address is on our list, you'll receive a confirmation email shortly.";

  try {
    const existing = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email: normalizedEmail },
    );

    // Same response either way so the endpoint cannot be used to enumerate subscribers.
    if (!existing?.token) return { success: true, message: genericMessage };

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured; unsubscribe email cannot send.");
      return { success: false, message: "Email is not configured." };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://infinitetrailbrewing.com";
    const fromEmail = process.env.CONTACT_RECEIVING_EMAIL || "newsletter@infinitetrailbrewing.com";
    const confirmUrl = `${siteUrl}/api/unsubscribe?token=${existing.token}`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: `Infinite Trail Brewing <${fromEmail}>`,
      to: normalizedEmail,
      subject: "Confirm your unsubscribe request",
      text: `You asked to stop receiving The Brew Log. Confirm here: ${confirmUrl}\n\nIf this wasn't you, ignore this email.`,
    });

    if (error) {
      console.error("Unsubscribe email failed:", error);
      return { success: false, message: "Something went wrong. Please try again later." };
    }

    return { success: true, message: genericMessage };
  } catch (error) {
    console.error("Unsubscribe request error:", error);
    return { success: false, message: "Something went wrong. Please try again later." };
  }
}
