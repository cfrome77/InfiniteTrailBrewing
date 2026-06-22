"use client";

import { useEffect, useRef } from "react";

/**
 * EmbeddedStore Component
 *
 * This component integrates an Ecwid store into the React codebase.
 * It dynamically injects the Ecwid script to prevent layout shifts and SSR issues.
 *
 * To configure your store ID, add NEXT_PUBLIC_ECWID_STORE_ID to your .env.local file.
 */

export function EmbeddedStore() {
  const storeId = process.env.NEXT_PUBLIC_ECWID_STORE_ID || "YOUR_STORE_ID";
  const scriptInjected = useRef(false);

  useEffect(() => {
    // Only inject the script once
    if (scriptInjected.current) return;

    // Create the container element for Ecwid if it doesn't exist
    const containerId = `my-store-${storeId}`;
    let container = document.getElementById(containerId);

    if (!container) {
      console.warn(`Ecwid container with ID ${containerId} not found.`);
      return;
    }

    // Define the script injection logic
    window._load_ecwid = () => {
      if (window.xProductBrowser) {
        window.xProductBrowser(
          "categoriesPerRow=3",
          "views=grid(20,3) list(60) table(60)",
          "categoryView=grid",
          "searchView=list",
          `id=${containerId}`
        );
      }
    };

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://app.ecwid.com/script.js?${storeId}&data_platform=code&data_otm=true`;
    script.charset = "utf-8";
    script.async = true;

    script.onload = () => {
      // The Ecwid script automatically initializes things if it finds the container,
      // but we can also trigger specific behavior if needed.
      scriptInjected.current = true;
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup: removing the script might not be enough for Ecwid as it modifies the DOM extensively,
      // but we do our best to prevent multiple injections.
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      scriptInjected.current = false;
      // Note: Ecwid usually stays in the window object once loaded.
    };
  }, [storeId]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div
        id={`my-store-${storeId}`}
        className="ecwid-store-container min-h-[500px]"
      >
        {/* Ecwid will mount the store here */}
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <p className="text-forest/60 font-sans uppercase tracking-widest text-sm">
            Loading Merchandise...
          </p>
        </div>
      </div>
    </div>
  );
}

// Global type definitions for Ecwid
declare global {
  interface Window {
    xProductBrowser: any;
    _load_ecwid: () => void;
    ec: any;
    ecwid_script_id: string;
    ecwid_body_class: string;
  }
}
