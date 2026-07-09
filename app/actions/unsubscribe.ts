"use server";

import { serverClient as client } from "@/lib/sanity.server";

export async function unsubscribe(email: string) {
  if (!email || !email.includes("@")) {
    return { success: false, message: "Invalid email address" };
  }

  try {
    const existing = await client.fetch(
      `*[_type == "subscriber" && email == $email && !(_id in path("drafts.**"))][0]`,
      { email }
    );

    if (existing) {
      await client
        .patch(existing._id)
        .set({ status: 'unsubscribed' })
        .commit();
      return { success: true, message: "You have been successfully unsubscribed." };
    }

    return { success: true, message: "You were not found in our list." };
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return { success: false, message: "Something went wrong. Please try again later." };
  }
}
