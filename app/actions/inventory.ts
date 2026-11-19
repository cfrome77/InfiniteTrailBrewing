"use server";

import { serverClient as client } from "@/lib/sanity.server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";

const ALLOWED_STATUSES = ["on_deck", "brewing", "ready", "archived"] as const;

export async function updateBeerStatus(beerId: string, newStatus: string) {
  await requireAdmin();

  if (!ALLOWED_STATUSES.includes(newStatus as (typeof ALLOWED_STATUSES)[number])) {
    return { success: false, message: "Invalid status." };
  }

  try {
    await client
      .patch(beerId)
      .set({ status: newStatus })
      .commit();

    revalidatePath("/admin/inventory");
    revalidatePath("/beers");
    revalidateTag("beers", "max");
    return { success: true };
  } catch (error) {
    console.error("Error updating beer status:", error);
    return { success: false, message: "Failed to update status." };
  }
}
