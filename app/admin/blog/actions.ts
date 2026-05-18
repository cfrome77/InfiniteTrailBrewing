"use server"

import { sql } from "@/lib/db";
import { BlogPost } from "@/types";
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

export async function getPosts() {
    return await sql`SELECT * FROM blog_posts ORDER BY date DESC`;
}

export async function savePost(formData: Partial<BlogPost>, editingId: string | null) {
    await checkAdmin();

    if (editingId) {
        await sql`
            UPDATE blog_posts
            SET slug = ${formData.slug},
                title = ${formData.title},
                excerpt = ${formData.excerpt || ""},
                content = ${formData.content},
                author = ${formData.author || null},
                category = ${formData.category || null},
                featured = ${formData.featured ?? false},
                is_published = ${formData.is_published ?? false},
                updated_at = NOW()
            WHERE id = ${editingId}
        `;
    } else {
        await sql`
            INSERT INTO blog_posts (slug, title, excerpt, content, author, category, featured, is_published, date)
            VALUES (${formData.slug}, ${formData.title}, ${formData.excerpt || ""}, ${formData.content}, ${formData.author || null}, ${formData.category || null}, ${formData.featured ?? false}, ${formData.is_published ?? false}, CURRENT_DATE)
        `;
    }
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
}

export async function deletePost(id: string) {
    await checkAdmin();
    await sql`DELETE FROM blog_posts WHERE id = ${id}`;
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
}
