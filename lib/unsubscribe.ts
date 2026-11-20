import { serverClient as client } from "@/lib/sanity.server";

export type UnsubscribeOutcome =
  | "unsubscribed"
  | "already"
  | "invalid"
  | "failed";

/**
 * Marks the subscriber holding `token` as unsubscribed.
 *
 * Shared by the API route (both the GET link and the RFC 8058 POST) and the
 * unsubscribe Server Action, which previously each carried their own copy of
 * this query and patch. Two copies of a security-relevant write drift apart:
 * a fix to one leaves the other marking the wrong document.
 *
 * The token is the only credential, so an unknown token is reported as
 * "invalid" without revealing whether any address is on the list.
 */
export async function unsubscribeByToken(token: string): Promise<UnsubscribeOutcome> {
  try {
    const subscriber: { _id: string; status?: string } | null = await client.fetch(
      `*[_type == "subscriber" && token == $unsubscribeToken][0]{ _id, status }`,
      { unsubscribeToken: token },
    );

    if (!subscriber) return "invalid";

    if (subscriber.status === "unsubscribed") return "already";

    await client.patch(subscriber._id).set({ status: "unsubscribed" }).commit();
    return "unsubscribed";
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return "failed";
  }
}
