"use client";

import { useEffect, useState } from "react";
import { Beer, BeerStatus } from "@/types";
import { client, urlFor } from "@/lib/sanity";
import { saveBeerAction, deleteBeerAction, uploadImageAction } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BeersAdminPage() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<Partial<Beer>>({
    beer_name: "",
    style: "",
    status: "on_deck",
    notes: "",
    abv: "",
    is_flagship: false,
    color: "",
  });

  const [imageAssetId, setImageAssetId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchBeers = async () => {
    try {
      const data = await client.fetch(`
        *[_type == "beer"] | order(started_at desc) {
          _id,
          "id": _id,
          beer_name,
          style,
          status,
          notes,
          abv,
          color,
          is_flagship,
          started_at,
          image
        }
      `);
      setBeers(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeers();
  }, []);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    try {
        const reader = new FileReader();
        const bufferPromise = new Promise<Buffer>((resolve, reject) => {
            reader.onload = () => resolve(Buffer.from(reader.result as ArrayBuffer));
            reader.onerror = reject;
        });
        reader.readAsArrayBuffer(file);
        const buffer = await bufferPromise;

        const result = await uploadImageAction(buffer, file.name, file.type);
        if (result.success && result.assetId) {
            setImageAssetId(result.assetId);
            showStatus("success", "Image uploaded!");
        } else {
            showStatus("error", result.error || "Upload failed");
        }
    } catch (error) {
        console.error(error);
        showStatus("error", "Upload failed");
    } finally {
        setUploading(false);
    }
  };

  const startEditing = (beer: Beer) => {
    setEditingId(beer.id);
    setFormData({
      beer_name: beer.beer_name || "",
      style: beer.style || "",
      status: beer.status,
      notes: beer.notes || "",
      abv: beer.abv || "",
      is_flagship: beer.is_flagship || false,
      color: beer.color || "",
    });

    if (beer.image) {
        setPreviewUrl(urlFor(beer.image).url());
        setImageAssetId(null); // Keep original unless changed
    } else {
        setPreviewUrl(null);
        setImageAssetId(null);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({
      beer_name: "",
      style: "",
      status: "on_deck",
      notes: "",
      abv: "",
      is_flagship: false,
      color: "",
    });
    setPreviewUrl(null);
    setImageAssetId(null);
  };

  const saveBeer = async () => {
    if (!formData.beer_name || !formData.style) {
      showStatus("error", "Beer name and style required.");
      return;
    }

    const dataToSend = {
        ...formData,
        imageAssetId
    };

    const result = await saveBeerAction(dataToSend, editingId);

    if (result.success) {
      showStatus("success", editingId ? "Beer updated!" : "Beer added!");
      cancelEditing();
      fetchBeers();
    } else {
      showStatus("error", result.error || "Failed to save beer.");
    }
  };

  const deleteBeer = async (id: string) => {
    if (!confirm("Delete this beer?")) return;

    const result = await deleteBeerAction(id);
    if (result.success) {
      setBeers((prev) => prev.filter((b) => b.id !== id));
      showStatus("success", "Beer deleted.");
    } else {
      showStatus("error", result.error || "Delete failed.");
    }
  };

  const statusOptions: BeerStatus[] = [
    "on_deck",
    "brewing",
    "ready",
    "archived",
  ];

  if (loading) {
    return (
      <div className="text-center mt-10 text-forest">Loading beers...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-forest/60 hover:text-forest transition-colors mb-4 text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-serif text-forest">Beers Admin</h1>

          {statusMsg && (
            <div
              className={`px-4 py-2 rounded ${
                statusMsg.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {statusMsg.text}
            </div>
          )}
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl mb-8 border">
        <h2 className="text-2xl font-serif mb-4">
          {editingId ? "Edit Beer" : "Add Beer"}
        </h2>

        {/* Inputs */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <input
            placeholder="Beer Name"
            value={formData.beer_name}
            onChange={(e) =>
              setFormData({ ...formData, beer_name: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Style"
            value={formData.style}
            onChange={(e) =>
              setFormData({ ...formData, style: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="ABV"
            value={formData.abv ?? ''}
            onChange={(e) => setFormData({ ...formData, abv: e.target.value })}
            className="border p-2 rounded"
          />

          <input
            placeholder="Color"
            value={formData.color ?? ''}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Beer Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border p-2 w-full"
            disabled={uploading}
          />
          {uploading && <p className="text-xs text-forest mt-1 italic">Uploading...</p>}
          {previewUrl && (
            <div className="mt-2 relative w-32 h-32 border rounded overflow-hidden">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* STATUS */}
        <div className="flex gap-4 mb-4">
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as BeerStatus,
              })
            }
            className="border p-2 rounded"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_flagship}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_flagship: e.target.checked,
                })
              }
            />
            Flagship
          </label>
        </div>

        {/* NOTES */}
        <textarea
          placeholder="Notes"
          value={formData.notes ?? ""}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="border w-full p-2 rounded mb-4"
        />

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={saveBeer}
            disabled={uploading}
            className="bg-forest text-tan px-6 py-2 rounded disabled:opacity-50"
          >
            {editingId ? "Update" : "Add"}
          </button>

          {editingId && (
            <button onClick={cancelEditing} className="px-4 py-2">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-2 gap-6">
        {beers.map((beer) => (
          <div key={beer.id} className="border p-4 rounded bg-white">
            <h2 className="font-serif text-xl">{beer.beer_name}</h2>
            <p className="text-sm text-gray-600">{beer.style}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => startEditing(beer)}>Edit</button>
              <button onClick={() => deleteBeer(beer.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
