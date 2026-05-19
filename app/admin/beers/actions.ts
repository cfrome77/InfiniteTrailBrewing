"use server"

import { prisma } from "@/lib/prisma";
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
    const beers = await prisma.currentlyBrewing.findMany({
        orderBy: {
            startedAt: 'desc'
        }
    });
    return beers.map(b => ({
        id: b.id,
        beer_name: b.beerName,
        style: b.style,
        status: b.status as any,
        notes: b.notes,
        abv: b.abv,
        is_flagship: b.isFlagship,
        color: b.color,
        image_url: b.imageUrl,
        started_at: b.startedAt.toISOString().split('T')[0],
        is_active: b.isActive
    }));
}

export async function saveBeer(formData: Partial<Beer>, editingId: string | null) {
    await checkAdmin();

    const data = {
        beerName: formData.beer_name!,
        style: formData.style!,
        status: formData.status!,
        notes: formData.notes || null,
        abv: formData.abv || null,
        isFlagship: formData.is_flagship!,
        color: formData.color || null,
        imageUrl: formData.image_url || null,
        isActive: formData.is_active ?? true,
    };

    if (editingId) {
        await prisma.currentlyBrewing.update({
            where: { id: editingId },
            data
        });
    } else {
        await prisma.currentlyBrewing.create({
            data: {
                ...data,
                startedAt: new Date()
            }
        });
    }
    revalidatePath("/admin/beers");
    revalidatePath("/beers");
}

export async function deleteBeer(id: string) {
    await checkAdmin();
    await prisma.currentlyBrewing.delete({
        where: { id }
    });
    revalidatePath("/admin/beers");
    revalidatePath("/beers");
}
