"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Logout() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const performSignOut = async () => {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    };
    performSignOut();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-forest text-xl font-serif">Logging out...</div>
    </div>
  );
}
