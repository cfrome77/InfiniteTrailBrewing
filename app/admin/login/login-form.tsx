"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginResult } from "@/app/actions/admin-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LockKeyhole, AlertCircle } from "lucide-react";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginResult | null, FormData>(
    loginAdmin,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-forest">
          Admin password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="border-forest/20 focus:border-forest focus:ring-forest"
        />
      </div>

      {state && !state.success && (
        <p
          role="alert"
          className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{state.message}</span>
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="w-full bg-forest text-tan hover:bg-forest/90 font-serif tracking-wide py-6"
      >
        <LockKeyhole className="w-4 h-4 mr-2" />
        {pending ? "Checking..." : "Sign In"}
      </Button>
    </form>
  );
}
