"use client";

import { useState } from "react";
import { logoutAdmin } from "@/app/actions/admin-auth";
import { LogOut } from "lucide-react";

export function LogoutTool() {
  const [pending, setPending] = useState(false);

  return (
    <div style={{ padding: "2rem", background: "#F5F0E6", height: "100%" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "serif",
            color: "#1A4132",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "0.5rem",
          }}
        >
          Staff Session
        </h2>
        <p style={{ color: "#1A4132", opacity: 0.6, marginBottom: "2rem" }}>
          Signing out ends this browser session. You will need the staff password
          to return to the Studio.
        </p>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            setPending(true);
            void logoutAdmin();
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#1A4132",
            color: "#E8D7B5",
            border: "none",
            borderRadius: "6px",
            padding: "0.75rem 1.5rem",
            fontFamily: "serif",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: pending ? "wait" : "pointer",
            opacity: pending ? 0.7 : 1,
          }}
        >
          <LogOut size={16} />
          {pending ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );
}
