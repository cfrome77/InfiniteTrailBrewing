import { redirect } from "next/navigation";
import { unsubscribeByToken } from "@/lib/unsubscribe";

/**
 * Mail scanners and link prefetchers issue GET requests for every URL in an
 * email, so GET must never mutate state. It only forwards to the confirmation
 * page; the actual opt-out happens on POST.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response("Missing unsubscribe token", { status: 400 });
  }

  redirect(`/unsubscribe?token=${encodeURIComponent(token)}`);
}

/**
 * Handles the confirmation form and RFC 8058 one-click unsubscribe
 * (List-Unsubscribe-Post), which sends a POST with an empty body.
 * Browsers get a redirect to the result page; programmatic callers get JSON.
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const contentType = request.headers.get("content-type") ?? "";
  const isBrowserForm = contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data");

  let token = searchParams.get("token");

  if (!token) {
    if (contentType.includes("application/json")) {
      token = ((await request.json().catch(() => ({}))) as { token?: string }).token ?? null;
    } else {
      const form = await request.formData().catch(() => null);
      token = (form?.get("token") as string | null) ?? null;
    }
  }

  if (!token) {
    if (isBrowserForm) redirect("/unsubscribe");
    return Response.json({ success: false, error: "Missing unsubscribe token" }, { status: 400 });
  }

  const result = await unsubscribeByToken(token);

  if (isBrowserForm) {
    redirect(result.status === "unsubscribed" ? "/unsubscribe?success=true" : "/unsubscribe?error=true");
  }

  if (result.status === "unsubscribed") return Response.json({ success: true });
  if (result.status === "not_found") {
    return Response.json({ success: false, error: "Invalid unsubscribe token" }, { status: 404 });
  }
  return Response.json({ success: false, error: "Unable to unsubscribe" }, { status: 500 });
}
