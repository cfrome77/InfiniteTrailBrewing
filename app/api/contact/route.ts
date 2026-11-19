import { Resend } from "resend";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("A valid email is required").max(200),
  subject: z.string().trim().min(1).max(120),
  message: z.string().trim().min(10, "Message is too short").max(5000),
  // Honeypot: bots fill every field they find.
  company: z.string().max(0).optional(),
});

const RECEIVING_EMAIL = process.env.CONTACT_RECEIVING_EMAIL;
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY || !FROM_EMAIL || !RECEIVING_EMAIL) {
    console.error(
      "Contact form is not configured: RESEND_API_KEY, CONTACT_FROM_EMAIL and CONTACT_RECEIVING_EMAIL are required.",
    );
    return Response.json({ success: false, error: "Email is not configured." }, { status: 503 });
  }

  if (!(await rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60 * 1000))) {
    return Response.json({ success: false, error: "Too many requests." }, { status: 429 });
  }

  let parsed;
  try {
    parsed = ContactSchema.safeParse(await req.json());
  } catch {
    return Response.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!parsed.success) {
    return Response.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const { name, email, subject, message, company } = parsed.data;
  if (company) {
    // Silently accept so the bot does not retry with a different payload.
    return Response.json({ success: true });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: `Infinite Trail Brewing <${FROM_EMAIL}>`,
      to: RECEIVING_EMAIL,
      replyTo: email,
      subject: `New Contact Form: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("Contact form send failed:", error);
      return Response.json({ success: false, error: "Unable to send message." }, { status: 502 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return Response.json({ success: false, error: "Unable to send message." }, { status: 500 });
  }
}
