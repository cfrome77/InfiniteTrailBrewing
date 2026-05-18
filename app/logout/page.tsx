"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      await authClient.signOut();
      router.push("/");
    };
    performLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <div className="text-center">
        <h1 className="text-2xl font-serif text-forest mb-2">Logging out...</h1>
        <p className="text-gray-600">Please wait while we secure your session.</p>
      </div>
    </div>
  );
}
