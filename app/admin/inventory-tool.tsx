"use client";

import { useEffect, useState } from "react";
import { InventoryManager } from "./inventory-manager";
import { getAllBeers } from "@/lib/beers";

export function InventoryTool() {
  const [beers, setBeers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBeers() {
      const allBeers = await getAllBeers();
      setBeers(allBeers);
      setLoading(false);
    }
    fetchBeers();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#1A4132', opacity: 0.5, fontFamily: 'serif' }}>Loading Inventory Manager...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', height: '100%', overflowY: 'auto', background: '#F5F0E6' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <InventoryManager beers={beers} />
      </div>
    </div>
  );
}
