import { getResendClient } from "@/lib/resend";
import { createRateLimiter } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// Per-instance limiter: slows a single client abusing the send endpoint. The
// address is the abuse vector (outbound email), so cap submissions per IP.
const isLimited = createRateLimiter(5, 60 * 60 * 1000);

const MAX_BODY_BYTES = 16 * 1024;
const MAX_LEN = { name: 120, email: 254, subject: 200, message: 5000 };
// Deliberately simple: rejects the obvious junk without pretending to be a full
// RFC 5322 parser, which would reject valid addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fail(message: string, status: number) {
  return Response.json({ success: false, message }, { status });
}

function clientKey(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: Request) {
  if (isLimited(clientKey(req))) {
    return fail("Too many messages. Please try again later.", 429);
  }

  // Reject an oversized body before reading it. Without this the handler
  // buffered the whole request in memory and only then compared its length, so
  // an oversized POST cost memory on every instance that received it. The
  // header can be absent (chunked) or wrong, so the length is checked again
  // after reading.
  const declaredLength = Number(req.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return fail("Message is too large.", 413);
  }

  const raw = await req.text();

  if (raw.length > MAX_BODY_BYTES) {
    return fail("Message is too large.", 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail("Malformed request body.", 400);
  }

  if (typeof body !== "object" || body === null) {
    return fail("Malformed request body.", 400);
  }

  const { name, email, subject, message } = body as Record<string, unknown>;

  const field = (value: unknown, key: keyof typeof MAX_LEN) => {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    if (!trimmed || trimmed.length > MAX_LEN[key]) return null;
    return trimmed;
  };

  const safeName = field(name, "name");
  const safeEmail = field(email, "email");
  const safeSubject = field(subject, "subject");
  const safeMessage = field(message, "message");

  if (!safeName || !safeEmail || !safeSubject || !safeMessage) {
    return fail("Please complete every field.", 400);
  }

  if (!EMAIL_RE.test(safeEmail)) {
    return fail("Please provide a valid email address.", 400);
  }

  const resend = getResendClient();
  if (!resend) {
    console.error("Contact form unavailable: RESEND_API_KEY is not configured.");
    return fail("The contact form is temporarily unavailable.", 503);
  }

  const to = process.env.CONTACT_RECEIVING_EMAIL || "chris@chrisfrome.com";

  try {
    const { error } = await resend.emails.send({
      from: "Infinite Trail Brewing <noreply@mail.chrisfrome.com>",
      to,
      replyTo: safeEmail,
      subject: `New Contact Form: ${safeSubject}`,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\nSubject: ${safeSubject}\n\nMessage:\n${safeMessage}`,
    });

    // Resend reports failures in the response rather than throwing, so an
    // unchecked `error` previously produced a success response for a dropped email.
    if (error) {
      console.error("Contact form delivery failed:", error);
      return fail("We could not send your message. Please try again.", 502);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return fail("We could not send your message. Please try again.", 502);
  }
}
