"use client";

import { useActionState } from "react";
import { requestUnsubscribe } from "@/app/actions/unsubscribe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export function UnsubscribeForm({ initialEmail = "" }: { initialEmail?: string }) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { success: boolean; message: string } | null, formData: FormData) =>
      requestUnsubscribe(String(formData.get("email") ?? "")),
    null,
  );

  if (state) {
    return (
      <div
        className={`p-6 rounded-xl text-center ${state.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
      >
        {state.success ? (
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-600" />
        ) : (
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
        )}
        <p className="font-medium">{state.message}</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-forest/70 mb-8 text-center leading-relaxed">
        Enter your email address and we&apos;ll send you a link to confirm.
      </p>

      <form action={formAction} className="space-y-4">
        <Input
          type="email"
          name="email"
          placeholder="your@email.com"
          defaultValue={initialEmail}
          required
          className="border-tan/50 focus-visible:border-forest"
        />
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-forest text-tan hover:bg-forest/90 font-serif text-lg py-6"
        >
          {isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : "Send Confirmation"}
        </Button>
      </form>
    </>
  );
}
