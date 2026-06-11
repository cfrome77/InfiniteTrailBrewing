import { serverClient as client } from "@/lib/sanity.server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response("Missing unsubscribe token", { status: 400 });
  }

  let subscriber;
  try {
    subscriber = await client.fetch(
      `*[_type == "subscriber" && token == $token][0]`,
      { token }
    );

    if (subscriber) {
      await client
        .patch(subscriber._id)
        .set({ status: "unsubscribed" })
        .commit();
    }
  } catch (error) {
    console.error("API Unsubscribe error:", error);
    return new Response("An error occurred while processing your request", { status: 500 });
  }

  if (subscriber) {
    // Redirect to a success page or the main unsubscribe page with a success flag
    redirect("/unsubscribe?success=true");
  } else {
    return new Response("Invalid unsubscribe token", { status: 404 });
  }
}
