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
    // patch() takes a raw document id and does not check its type. A beer
    // status written onto another document would corrupt it silently --
    // "ready" on a subscriber drops them from every future send -- so the
    // id is confirmed to be a beer first.
    const target = await client.fetch<{ _type?: string } | null>(
      `*[_id == $beerId][0]{ _type }`,
      { beerId },
    );

    if (!target || target._type !== "beer") {
      return { success: false, message: "That beer could not be found." };
    }

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
