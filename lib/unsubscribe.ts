import "server-only";
import { serverClient as client } from "./sanity.server";

const SUBSCRIBER_BY_TOKEN_QUERY: string = `*[_type == "subscriber" && token == $token][0]{ _id }`;

export type UnsubscribeResult =
  | { status: "unsubscribed" }
  | { status: "not_found" }
  | { status: "error" };

export async function unsubscribeByToken(token: string): Promise<UnsubscribeResult> {
  try {
    const params: Record<string, unknown> = { token };
    const subscriber = await client.fetch(SUBSCRIBER_BY_TOKEN_QUERY, params);

    if (!subscriber) return { status: "not_found" };

    await client.patch(subscriber._id).set({ status: "unsubscribed" }).commit();
    return { status: "unsubscribed" };
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return { status: "error" };
  }
}
