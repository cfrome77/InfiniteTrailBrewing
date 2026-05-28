"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "../login/actions";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    logoutAction().then(() => {
        router.push("/");
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <p className="text-forest font-serif text-xl">Logging out...</p>
    </div>
  );
}
