"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Logout() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.signOut();

      // 🔥 let AuthProvider handle UI state reset
      router.replace("/");
    };

    signOut();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-forest text-xl font-serif">Logging out...</div>
    </div>
  );
}
