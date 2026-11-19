import { serverClient as client } from "@/lib/sanity.server";
import { redirect } from "next/navigation";

/**
 * Unsubscribe links from emails land here. The token is the only credential,
 * so a missing or unknown token never reveals whether an address is on the list.
 */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    redirect("/unsubscribe?error=missing");
  }

  let found = false;

  try {
    const subscriber: { _id: string; status?: string } | null = await client.fetch(
      `*[_type == "subscriber" && token == $unsubscribeToken][0]{ _id, status }`,
      { unsubscribeToken: token },
    );

    if (subscriber) {
      found = true;
      if (subscriber.status !== "unsubscribed") {
        await client.patch(subscriber._id).set({ status: "unsubscribed" }).commit();
      }
    }
  } catch (error) {
    console.error("API Unsubscribe error:", error);
    redirect("/unsubscribe?error=failed");
  }

  redirect(found ? "/unsubscribe?success=true" : "/unsubscribe?error=invalid");
}
