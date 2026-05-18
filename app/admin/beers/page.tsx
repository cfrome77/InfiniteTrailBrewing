"use client";

import { useEffect, useState } from "react";
import { Beer, BeerStatus } from "@/types";
import { getBeers, saveBeer, deleteBeer } from "./actions";

export default function BeersAdminPage() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // --- Form state ---
  const [formData, setFormData] = useState<Partial<Beer>>({
    beer_name: "",
    style: "",
    status: "on_deck",
    notes: "",
    abv: "",
    is_flagship: false,
    color: "",
    image_url: "",
  });

  // --- Fetch ---
  const fetchBeers = async () => {
    try {
        const data = await getBeers();
        setBeers(data as Beer[]);
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

  // --- Start Editing ---
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
      image_url: beer.image_url || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Cancel ---
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
      image_url: "",
    });
  };

  // --- Save ---
  const handleSave = async () => {
    if (!formData.beer_name || !formData.style) {
      showStatus("error", "Beer name and style required.");
      return;
    }

    try {
      await saveBeer(formData, editingId);
      showStatus("success", editingId ? "Beer updated!" : "Beer added!");
      cancelEditing();
      fetchBeers();
    } catch (error) {
      showStatus("error", "Failed to save beer.");
    }
  };

  // --- Delete ---
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this beer?")) return;

    try {
      await deleteBeer(id);
      showStatus("success", "Beer deleted.");
      fetchBeers();
    } catch (error) {
      showStatus("error", "Delete failed.");
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
      <div className="flex justify-between mb-6">
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

        {/* IMAGE URL (Simplified for Neon) */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Beer Image URL</label>
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={formData.image_url ?? ""}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="border p-2 w-full rounded"
          />
          {formData.image_url && (
            <img
              src={formData.image_url}
              className="mt-2 h-24 rounded object-cover border"
            />
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
            onClick={handleSave}
            className="bg-forest text-tan px-6 py-2 rounded"
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

            {beer.image_url && (
              <img
                src={beer.image_url}
                className="h-32 w-full object-cover rounded mt-2"
              />
            )}

            <p className="text-sm text-gray-600">{beer.style}</p>

            <div className="flex gap-2 mt-3">
              <button onClick={() => startEditing(beer)}>Edit</button>
              <button onClick={() => handleDelete(beer.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
