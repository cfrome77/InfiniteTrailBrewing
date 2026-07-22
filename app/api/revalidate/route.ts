import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("content-signature");
    const body = await req.text();
    const secret = process.env.SANITY_REVALIDATE_SECRET;

    // Validate Signature if secret is configured
    if (secret) {
      if (!signature) {
        return NextResponse.json({ message: "Missing signature header" }, { status: 401 });
      }

      const computedSignature = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");

      if (computedSignature !== signature) {
        return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(body);
    const { _type, slug } = payload;

    if (!_type) {
      return NextResponse.json({ message: "Missing document _type" }, { status: 400 });
    }

    // Revalidate target tags based on document type
    if (_type === "beer") {
      // @ts-ignore
      revalidateTag("beers");
      if (slug) {
        // @ts-ignore
        revalidateTag(`beer:${slug}`);
      }
    } else if (_type === "post") {
      // @ts-ignore
      revalidateTag("posts");
      if (slug) {
        // @ts-ignore
        revalidateTag(`post:${slug}`);
      }
    }

    return NextResponse.json({
      revalidated: true,
      type: _type,
      slug: slug || null,
      now: Date.now(),
    });
  } catch (err: any) {
    console.error("Revalidation error:", err);
    return NextResponse.json(
      { message: "Error revalidating", error: err?.message },
      { status: 500 }
    );
  }
}
