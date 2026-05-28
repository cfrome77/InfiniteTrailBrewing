'use server'

import { serverClient } from '@/lib/sanity.server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin_auth")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || authCookie !== adminPassword) {
    throw new Error("Unauthorized");
  }
}

// --- Beer Actions ---

export async function saveBeerAction(formData: any, editingId?: string | null) {
  try {
    await verifyAdmin();

    const beerData: any = {
      _type: 'beer',
      beer_name: formData.beer_name,
      style: formData.style,
      status: formData.status,
      notes: formData.notes || null,
      abv: formData.abv || null,
      is_flagship: formData.is_flagship,
      color: formData.color || null,
    };

    if (formData.imageAssetId) {
      beerData.image = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: formData.imageAssetId,
        },
      };
    }

    if (editingId) {
      await serverClient.patch(editingId).set(beerData).commit();
    } else {
      beerData.started_at = new Date().toISOString().split("T")[0];
      await serverClient.create(beerData);
    }

    revalidatePath('/beers');
    revalidatePath('/admin/beers');
    revalidatePath('/our-story');
    return { success: true };
  } catch (error: any) {
    console.error("Error saving beer:", error);
    return { success: false, error: error.message || "Failed to save beer" };
  }
}

export async function deleteBeerAction(id: string) {
  try {
    await verifyAdmin();
    await serverClient.delete(id);
    revalidatePath('/beers');
    revalidatePath('/admin/beers');
    revalidatePath('/our-story');
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting beer:", error);
    return { success: false, error: error.message || "Failed to delete beer" };
  }
}

// --- Blog Actions ---

export async function savePostAction(formData: any, editingId?: string | null) {
  try {
    await verifyAdmin();
    let contentValue = formData.content;

    if (typeof contentValue === 'string') {
        contentValue = [{
            _type: 'block',
            children: [{ _type: 'span', text: contentValue }],
            markDefs: [],
            style: 'normal'
        }];
    }

    const postData: any = {
      _type: 'post',
      title: formData.title,
      slug: { _type: 'slug', current: formData.slug },
      excerpt: formData.excerpt ?? "",
      content: contentValue,
      author: formData.author ?? null,
      category: formData.category ?? null,
      featured: formData.featured ?? false,
      is_published: formData.is_published ?? false,
    };

    if (editingId) {
      await serverClient.patch(editingId).set(postData).commit();
    } else {
      postData.date = new Date().toISOString().split("T")[0];
      await serverClient.create(postData);
    }

    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    return { success: true };
  } catch (error: any) {
    console.error("Error saving post:", error);
    return { success: false, error: error.message || "Failed to save post" };
  }
}

export async function deletePostAction(id: string) {
  try {
    await verifyAdmin();
    await serverClient.delete(id);
    revalidatePath('/blog');
    revalidatePath('/admin/blog');
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return { success: false, error: error.message || "Failed to delete post" };
  }
}

// --- Image Asset Upload ---
export async function uploadImageAction(buffer: Buffer, filename: string, contentType: string) {
    try {
        await verifyAdmin();
        const asset = await serverClient.assets.upload('image', buffer, {
            filename,
            contentType
        });
        return { success: true, assetId: asset._id };
    } catch (error: any) {
        console.error("Error uploading image:", error);
        return { success: false, error: error.message || "Failed to upload image" };
    }
}
