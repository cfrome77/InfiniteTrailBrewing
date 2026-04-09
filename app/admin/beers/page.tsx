"use client";

import { useEffect, useState } from "react";
import { Beer, BeerStatus } from "@/types";
import { createClient } from "@/lib/supabase/client";

export default function BeersAdminPage() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);

  // --- New Beer Form ---
  const [newBeer, setNewBeer] = useState<Partial<Beer>>({
    beer_name: "",
    style: "",
    status: "on_deck",
    notes: "",
    abv: "",
    is_flagship: false,
  });

  // --- Fetch Beers ---
  const fetchBeers = async () => {
    const { data, error } = await createClient()
      .from("currently_brewing")
      .select("*")
      .order("started_at", { ascending: false });
    if (error) {
      console.error("Error fetching beers:", error);
      return;
    }
    setBeers(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBeers();
  }, []);

  // --- Update Beer ---
  const updateBeer = async (id: string, updates: Partial<Beer>) => {
    const { error } = await createClient()
      .from("currently_brewing")
      .update(updates)
      .eq("id", id);
    if (error) {
      console.error("Error updating beer:", error);
      return;
    }
    setBeers((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    );
  };

  // --- Delete Beer ---
  const deleteBeer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this beer?")) return;

    const { error } = await createClient()
      .from("currently_brewing")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting beer:", error);
      return;
    }

    setBeers((prev) => prev.filter((b) => b.id !== id));
  };

  // --- Add New Beer ---
  const addNewBeer = async () => {
    if (!newBeer.beer_name || !newBeer.style) {
      alert("Beer name and style are required.");
      return;
    }

    const { data, error } = await createClient()
      .from("currently_brewing")
      .insert([
        {
          beer_name: newBeer.beer_name,
          style: newBeer.style,
          status: newBeer.status,
          notes: newBeer.notes || null,
          abv: newBeer.abv || null,
          is_flagship: newBeer.is_flagship,
          started_at: new Date().toISOString().split("T")[0],
        },
      ])
      .select();

    if (error) {
      console.error("Error adding beer:", error);
      return;
    }

    setBeers((prev) => [data![0], ...prev]);
    setNewBeer({
      beer_name: "",
      style: "",
      status: "on_deck",
      notes: "",
      abv: "",
      is_flagship: false,
    });
  };

  const statusOptions: BeerStatus[] = [
    "on_deck",
    "fermenting",
    "conditioning",
    "finished",
    "archived",
  ];

  const getStatusColor = (status: BeerStatus) => {
    switch (status) {
      case "on_deck":
        return "bg-gray-200 text-gray-800";
      case "fermenting":
        return "bg-yellow-200 text-yellow-800";
      case "conditioning":
        return "bg-blue-200 text-blue-800";
      case "finished":
        return "bg-green-200 text-green-800";
      case "archived":
        return "bg-gray-400 text-white";
    }
  };

  if (loading) return <div className="text-center mt-10">Loading beers...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif text-forest mb-6">
        Beers Admin Panel
      </h1>

      {/* --- Add New Beer --- */}
      <div className="border rounded-lg p-6 mb-8 shadow">
        <h2 className="font-serif text-2xl text-forest mb-4">Add New Beer</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Beer Name"
            value={newBeer.beer_name ?? ""}
            onChange={(e) =>
              setNewBeer({ ...newBeer, beer_name: e.target.value })
            }
            className="border px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="Style"
            value={newBeer.style ?? ""}
            onChange={(e) => setNewBeer({ ...newBeer, style: e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="ABV (optional)"
            value={newBeer.abv ?? ""}
            onChange={(e) => setNewBeer({ ...newBeer, abv: e.target.value })}
            className="border px-2 py-1 rounded"
          />
        </div>

        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2 text-forest font-serif">
            <input
              type="checkbox"
              checked={newBeer.is_flagship ?? false}
              onChange={(e) =>
                setNewBeer({ ...newBeer, is_flagship: e.target.checked })
              }
              className="w-5 h-5 accent-forest"
            />
            Flagship Beer
          </label>

          <select
            value={newBeer.status ?? "on_deck"}
            onChange={(e) =>
              setNewBeer({ ...newBeer, status: e.target.value as BeerStatus })
            }
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Notes (optional)"
          value={newBeer.notes ?? ""}
          onChange={(e) => setNewBeer({ ...newBeer, notes: e.target.value })}
          className="border w-full rounded px-2 py-1 mb-4"
        />

        <button
          onClick={addNewBeer}
          className="bg-forest text-tan px-4 py-2 rounded hover:bg-forest/90"
        >
          Add Beer
        </button>
      </div>

      {/* --- Existing Beers --- */}
      <div className="grid md:grid-cols-2 gap-6">
        {beers.map((beer) => (
          <div
            key={beer.id}
            className="border rounded-lg p-6 shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-serif text-2xl text-forest">
                {beer.beer_name}
              </h2>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                  beer.status,
                )}`}
              >
                {beer.status.replace("_", " ").toUpperCase()}
              </span>
            </div>

            <p className="text-forest/70 mb-2">{beer.style}</p>
            {beer.abv && (
              <p className="text-forest/70 mb-2 font-semibold">
                {beer.abv} ABV
              </p>
            )}
            {beer.notes && (
              <p className="text-forest/60 mb-2 italic">Notes: {beer.notes}</p>
            )}

            <div className="flex items-center gap-4 mt-3">
              <label className="flex items-center gap-2 text-forest font-serif">
                <input
                  type="checkbox"
                  checked={beer.is_flagship}
                  onChange={(e) =>
                    updateBeer(beer.id, { is_flagship: e.target.checked })
                  }
                  className="w-5 h-5 accent-forest"
                />
                Flagship Beer
              </label>

              <select
                value={beer.status}
                onChange={(e) =>
                  updateBeer(beer.id, { status: e.target.value as BeerStatus })
                }
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ").toUpperCase()}
                  </option>
                ))}
              </select>

              <button
                onClick={() => deleteBeer(beer.id)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
