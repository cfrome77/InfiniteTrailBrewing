"use server";

import { serverClient as client } from "@/lib/sanity.server";
import { v4 as uuidv4 } from "uuid";

export async function subscribeToNewsletter(email: string) {
  if (!email || !email.includes("@")) {
    return { success: false, message: "Invalid email address" };
  }

  try {
    // Check if already exists
    const existing = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email }
    );

    if (existing) {
      if (existing.status === 'unsubscribed') {
        await client
          .patch(existing._id)
          .set({ status: 'subscribed', subscribedAt: new Date().toISOString() })
          .commit();
        return { success: true, message: "Re-subscribed successfully!" };
      }
      return { success: true, message: "You're already subscribed!" };
    }

    await client.create({
      _type: "subscriber",
      email,
      subscribedAt: new Date().toISOString(),
      status: "subscribed",
      token: uuidv4(),
    });

    return { success: true, message: "Subscribed successfully!" };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}
