"use client";

import { useEffect, useState } from "react";
import { Beer, BeerStatus } from "@/types";
import { createClient } from "@/lib/supabase/client";

export default function BeersAdminPage() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // --- New/Edit Beer Form ---
  const [formData, setFormData] = useState<Partial<Beer>>({
    beer_name: "",
    style: "",
    status: "on_deck",
    notes: "",
    abv: "",
    is_flagship: false,
    color: "",
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

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // --- Start Editing ---
  const startEditing = (beer: Beer) => {
    setEditingId(beer.id);
    setFormData(beer);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Cancel Editing ---
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
  };

  // --- Save (Add or Update) Beer ---
  const saveBeer = async () => {
    if (!formData.beer_name || !formData.style) {
      showStatus('error', "Beer name and style are required.");
      return;
    }

    const supabase = createClient();

    if (editingId) {
      // Update
      const { error } = await supabase
        .from("currently_brewing")
        .update({
          beer_name: formData.beer_name,
          style: formData.style,
          status: formData.status,
          notes: formData.notes || null,
          abv: formData.abv || null,
          is_flagship: formData.is_flagship,
          color: formData.color || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId);

      if (error) {
        showStatus('error', "Failed to update beer.");
        return;
      }

      setBeers((prev) =>
        prev.map((b) => (b.id === editingId ? { ...b, ...formData } as Beer : b))
      );
      showStatus('success', "Beer updated successfully!");
      cancelEditing();
    } else {
      // Add
      const { data, error } = await supabase
        .from("currently_brewing")
        .insert([
          {
            beer_name: formData.beer_name,
            style: formData.style,
            status: formData.status,
            notes: formData.notes || null,
            abv: formData.abv || null,
            is_flagship: formData.is_flagship,
            color: formData.color || null,
            started_at: new Date().toISOString().split("T")[0],
          },
        ])
        .select();

      if (error) {
        showStatus('error', "Failed to add beer.");
        return;
      }

      setBeers((prev) => [data![0], ...prev]);
      showStatus('success', "Beer added successfully!");
      cancelEditing();
    }
  };

  // --- Delete Beer ---
  const deleteBeer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this beer?")) return;

    const { error } = await createClient()
      .from("currently_brewing")
      .delete()
      .eq("id", id);

    if (error) {
      showStatus('error', "Failed to delete beer.");
      return;
    }

    setBeers((prev) => prev.filter((b) => b.id !== id));
    showStatus('success', "Beer deleted.");
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

  if (loading) return <div className="text-center mt-10 text-forest">Loading beers...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-serif text-forest">
          Beers Admin Panel
        </h1>
        {statusMsg && (
          <div className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all duration-500 ${
            statusMsg.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {statusMsg.text}
          </div>
        )}
      </div>

      {/* --- New/Edit Beer Form --- */}
      <div className="bg-white border border-tan/20 rounded-xl p-6 mb-8 shadow-md">
        <h2 className="font-serif text-2xl text-forest mb-4">
          {editingId ? "Edit Beer" : "Add New Beer"}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-forest/70 mb-1">Beer Name</label>
            <input
              type="text"
              placeholder="Summit Trail IPA"
              value={formData.beer_name ?? ""}
              onChange={(e) => setFormData({ ...formData, beer_name: e.target.value })}
              className="w-full border border-tan/30 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-forest/70 mb-1">Style</label>
            <input
              type="text"
              placeholder="West Coast IPA"
              value={formData.style ?? ""}
              onChange={(e) => setFormData({ ...formData, style: e.target.value })}
              className="w-full border border-tan/30 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-forest/70 mb-1">ABV</label>
            <input
              type="text"
              placeholder="6.8%"
              value={formData.abv ?? ""}
              onChange={(e) => setFormData({ ...formData, abv: e.target.value })}
              className="w-full border border-tan/30 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-forest/70 mb-1">Color (CSS Gradient)</label>
            <input
              type="text"
              placeholder="from-orange-400 to-orange-500"
              value={formData.color ?? ""}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full border border-tan/30 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <label className="block text-xs font-semibold uppercase text-forest/70">Status</label>
            <select
              value={formData.status ?? "on_deck"}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as BeerStatus })}
              className="border border-tan/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-forest font-serif cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_flagship ?? false}
              onChange={(e) => setFormData({ ...formData, is_flagship: e.target.checked })}
              className="w-5 h-5 accent-forest"
            />
            Flagship Beer
          </label>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase text-forest/70 mb-1">Notes</label>
          <textarea
            placeholder="A description of the beer, hops used, etc."
            value={formData.notes ?? ""}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full border border-tan/30 rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-forest/20"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={saveBeer}
            className="bg-forest text-tan px-6 py-2 rounded-lg font-serif hover:bg-forest/90 transition-all shadow-md active:scale-95"
          >
            {editingId ? "Update Beer" : "Add Beer"}
          </button>
          {editingId && (
            <button
              onClick={cancelEditing}
              className="bg-tan/50 text-forest px-6 py-2 rounded-lg font-serif hover:bg-tan/70 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* --- Existing Beers List --- */}
      <div className="grid md:grid-cols-2 gap-6">
        {beers.map((beer) => (
          <div
            key={beer.id}
            className="bg-white border border-tan/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-serif text-2xl text-forest">
                    {beer.beer_name}
                  </h2>
                  {beer.is_flagship && (
                    <span className="bg-forest text-tan text-[10px] uppercase px-2 py-0.5 rounded-full font-bold">
                      Flagship
                    </span>
                  )}
                </div>
                <p className="text-forest/60 font-medium">{beer.style}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(
                  beer.status,
                )}`}
              >
                {beer.status.replace("_", " ")}
              </span>
            </div>

            {beer.abv && (
              <div className="mb-2">
                <span className="text-xs font-bold text-forest/40 uppercase mr-2">ABV:</span>
                <span className="text-forest/80 font-semibold">{beer.abv}</span>
              </div>
            )}

            {beer.notes && (
              <p className="text-forest/70 text-sm italic mb-4 line-clamp-2">"{beer.notes}"</p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-tan/10">
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(beer)}
                  className="bg-sky/10 text-sky hover:bg-sky hover:text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteBeer(beer.id)}
                  className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
                >
                  Delete
                </button>
              </div>
              <div className="text-[10px] text-forest/30 uppercase font-bold">
                Brewed: {beer.started_at}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
