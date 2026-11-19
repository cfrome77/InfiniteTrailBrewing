import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { UnsubscribeForm } from "./unsubscribe-form";

export const metadata: Metadata = {
  title: "Unsubscribe | Infinite Trail Brewing",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string; success?: string; error?: string }>;
}) {
  const { token, email, success, error } = await searchParams;

  let content;

  if (success === "true") {
    content = (
      <div className="p-6 rounded-xl text-center bg-green-50 text-green-800">
        <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-600" />
        <p className="font-medium">
          You have been successfully unsubscribed from The Brew Log.
        </p>
      </div>
    );
  } else if (error === "true") {
    content = (
      <div className="p-6 rounded-xl text-center bg-red-50 text-red-800">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
        <p className="font-medium">
          That unsubscribe link is invalid or has expired.
        </p>
      </div>
    );
  } else if (token) {
    content = (
      <>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-tan/20 text-forest/80 text-sm mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>Confirm that you want to stop receiving The Brew Log.</p>
        </div>
        <form action={`/api/unsubscribe?token=${encodeURIComponent(token)}`} method="POST">
          <Button
            type="submit"
            className="w-full bg-forest text-tan hover:bg-forest/90 font-serif text-lg py-6"
          >
            Confirm Unsubscribe
          </Button>
        </form>
      </>
    );
  } else {
    content = <UnsubscribeForm initialEmail={email} />;
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="container mx-auto px-4 pt-40 pb-20 max-w-md">
        <div className="bg-white p-8 rounded-2xl border border-tan/30 shadow-xl">
          <h1 className="text-3xl font-serif text-forest mb-6 text-center">Unsubscribe</h1>
          {content}
        </div>
      </main>
      <Footer />
    </div>
  );
}
