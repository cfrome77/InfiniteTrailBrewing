import { serverClient as client } from "@/lib/sanity.server";
import { redirect } from "next/navigation";

/**
 * Unsubscribe links from emails land here. The token is the only credential,
 * so a missing or unknown token never reveals whether an address is on the list.
 *
 * Two entry points share the same effect:
 * - GET, for the link a person clicks in the email body.
 * - POST, for RFC 8058 one-click unsubscribe. Mailbox providers POST to the
 *   List-Unsubscribe URL on the recipient's behalf and expect a 2xx with no
 *   redirect and no confirmation step.
 */
type Outcome = "unsubscribed" | "invalid" | "failed";

async function unsubscribeByToken(token: string): Promise<Outcome> {
  try {
    const subscriber: { _id: string; status?: string } | null = await client.fetch(
      `*[_type == "subscriber" && token == $unsubscribeToken][0]{ _id, status }`,
      { unsubscribeToken: token },
    );

    if (!subscriber) return "invalid";

    if (subscriber.status !== "unsubscribed") {
      await client.patch(subscriber._id).set({ status: "unsubscribed" }).commit();
    }

    return "unsubscribed";
  } catch (error) {
    console.error("API Unsubscribe error:", error);
    return "failed";
  }
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    redirect("/unsubscribe?error=missing");
  }

  const outcome = await unsubscribeByToken(token);

  redirect(
    outcome === "unsubscribed"
      ? "/unsubscribe?success=true"
      : outcome === "invalid"
        ? "/unsubscribe?error=invalid"
        : "/unsubscribe?error=failed",
  );
}

export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return new Response("Missing token", { status: 400 });
  }

  const outcome = await unsubscribeByToken(token);

  if (outcome === "failed") {
    return new Response("Unsubscribe failed", { status: 500 });
  }

  // A repeated one-click unsubscribe is still a success: the provider only
  // cares that the address ends up off the list.
  return new Response("Unsubscribed", { status: 200 });
}
