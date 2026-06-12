import { Resend } from "resend";

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY || "fallback_for_build");

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    const data = await resend.emails.send({
      from: "Infinite Trail brewing <noreply@mail.chrisfrome.com>",
      to: "chris@chrisfrome.com", // <- where YOU receive emails
      replyTo: email,
      subject: `New Contact Form: ${subject}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, error }, { status: 500 });
  }
}
