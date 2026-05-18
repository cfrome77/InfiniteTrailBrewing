"use server"

import { sql } from "@/lib/db";
import { Beer } from "@/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session || (session.user as any).role !== 'admin') {
        throw new Error("Unauthorized");
    }
}

export async function getBeers() {
    return await sql`SELECT * FROM currently_brewing ORDER BY started_at DESC`;
}

export async function saveBeer(formData: Partial<Beer>, editingId: string | null) {
    await checkAdmin();

    if (editingId) {
        await sql`
            UPDATE currently_brewing
            SET beer_name = ${formData.beer_name},
                style = ${formData.style},
                status = ${formData.status},
                notes = ${formData.notes || null},
                abv = ${formData.abv || null},
                is_flagship = ${formData.is_flagship},
                color = ${formData.color || null},
                image_url = ${formData.image_url || null},
                updated_at = NOW()
            WHERE id = ${editingId}
        `;
    } else {
        await sql`
            INSERT INTO currently_brewing (beer_name, style, status, notes, abv, is_flagship, color, image_url, started_at)
            VALUES (${formData.beer_name}, ${formData.style}, ${formData.status}, ${formData.notes || null}, ${formData.abv || null}, ${formData.is_flagship}, ${formData.color || null}, ${formData.image_url || null}, CURRENT_DATE)
        `;
    }
    revalidatePath("/admin/beers");
    revalidatePath("/beers");
}

export async function deleteBeer(id: string) {
    await checkAdmin();
    await sql`DELETE FROM currently_brewing WHERE id = ${id}`;
    revalidatePath("/admin/beers");
    revalidatePath("/beers");
}
