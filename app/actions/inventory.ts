"use server";

import { serverClient as client } from "@/lib/sanity.server";
import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import type { BeerStatus } from "@/types";

const ALLOWED_STATUSES: readonly BeerStatus[] = [
  "on_deck",
  "brewing",
  "ready",
  "archived",
];

function isBeerStatus(value: unknown): value is BeerStatus {
  return typeof value === "string" && (ALLOWED_STATUSES as readonly string[]).includes(value);
}

export async function updateBeerStatus(beerId: string, newStatus: string) {
  await requireAdmin();

  if (typeof beerId !== "string" || beerId.trim().length === 0) {
    return { success: false, message: "A beer id is required." };
  }

  if (!isBeerStatus(newStatus)) {
    return { success: false, message: "Invalid status value." };
  }

  try {
    await client
      .patch(beerId)
      .set({ status: newStatus })
      .commit();

    updateTag("beers");
    return { success: true };
  } catch (error) {
    console.error("Error updating beer status:", error);
    return { success: false, message: "Failed to update status." };
  }
}
