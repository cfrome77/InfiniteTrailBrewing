"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Lock } from "lucide-react";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-tan/40 shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-forest rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-tan" />
          </div>
          <h1 className="font-serif text-2xl text-forest tracking-wide">Staff Access</h1>
          <p className="text-xs font-mono uppercase tracking-widest text-forest/50 mt-2">
            Infinite Trail Brewing
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-forest">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              required
              autoFocus
              className="border-forest/20 focus-visible:border-forest"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-forest">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="border-forest/20 focus-visible:border-forest"
            />
          </div>

          {state?.error && (
            <div
              role="alert"
              className="flex items-start gap-2 p-3 rounded-md bg-red-50 text-red-800 text-sm"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-forest text-tan hover:bg-forest/90 font-serif tracking-wide py-5"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
