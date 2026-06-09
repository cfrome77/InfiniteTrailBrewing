"use server";

import { serverClient as client } from "@/lib/sanity.server";
import { revalidatePath } from "next/cache";

export async function updateBeerStatus(beerId: string, newStatus: string) {
  try {
    await client
      .patch(beerId)
      .set({ status: newStatus })
      .commit();

    revalidatePath("/admin/inventory");
    revalidatePath("/beers");
    return { success: true };
  } catch (error) {
    console.error("Error updating beer status:", error);
    return { success: false, message: "Failed to update status." };
  }
}
