"use server"

import { sql } from "@/lib/db";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    throw new Error("All fields are required.");
  }

  try {
    await sql`
      INSERT INTO contact_submissions (name, email, subject, message)
      VALUES (${name}, ${email}, ${subject}, ${message})
    `;
    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw new Error("Failed to send message. Please try again later.");
  }
}
