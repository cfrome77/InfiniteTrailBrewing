"use server"

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return { error: "All fields are required." };
  }

  try {
    const data = await resend.emails.send({
      from: "Infinite Trail Brewing <onboarding@resend.dev>",
      to: [process.env.CONTACT_RECEIVING_EMAIL!],
      subject: `Contact Form: ${subject}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    });

    if (data.error) {
      return { error: "Failed to send message. Please try again later." };
    }

    return { success: true };
  } catch (error) {
    console.error("Resend error:", error);
    return { error: "An unexpected error occurred." };
  }
}
