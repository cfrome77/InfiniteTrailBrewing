"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Beer, FlaskConical, TrendingUp, Info, Loader2 } from "lucide-react";
import { updateBeerStatus } from "@/app/actions/inventory";

interface BeerData {
    _id: string;
    beer_name: string;
    style: string;
    status: string;
    abv: number;
    ibu: number;
}

export function InventoryManager({ beers: initialBeers }: { beers: BeerData[] }) {
    const [beers, setBeers] = useState(initialBeers);
    const [updating, setUpdating] = useState<string | null>(null);

    const onTap = beers.filter(b => b.status === "ready");
    const brewing = beers.filter(b => b.status === "brewing");
    const onDeck = beers.filter(b => b.status === "on_deck");
    const avgAbv = onTap.length > 0 ? (onTap.reduce((acc, b) => acc + (b.abv || 0), 0) / onTap.length).toFixed(1) : 0;

    const handleStatusChange = async (beerId: string, newStatus: string) => {
        setUpdating(beerId);
        const result = await updateBeerStatus(beerId, newStatus);
        if (result.success) {
            setBeers(beers.map(b => b._id === beerId ? { ...b, status: newStatus } : b));
        }
        setUpdating(null);
    };

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6">
                <Card className="bg-forest text-tan border-tan/20 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs uppercase tracking-wider font-medium">On Tap</CardTitle>
                        <Beer className="h-4 w-4 text-tan/50" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-serif">{onTap.length}</div>
                    </CardContent>
                </Card>

                <Card className="border-tan/20 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs uppercase tracking-wider font-medium text-forest/60">Brewing</CardTitle>
                        <FlaskConical className="h-4 w-4 text-forest/30" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-serif text-forest">{brewing.length}</div>
                    </CardContent>
                </Card>

                <Card className="border-tan/20 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs uppercase tracking-wider font-medium text-forest/60">Avg. ABV</CardTitle>
                        <TrendingUp className="h-4 w-4 text-forest/30" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-serif text-forest">{avgAbv}%</div>
                    </CardContent>
                </Card>

                <Card className="border-tan/20 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs uppercase tracking-wider font-medium text-forest/60">Total Library</CardTitle>
                        <Info className="h-4 w-4 text-forest/30" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-serif text-forest">{beers.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Management Table */}
            <Card className="border-tan/20 shadow-md overflow-hidden">
                <CardHeader className="bg-forest/5 border-b border-tan/10">
                    <CardTitle className="font-serif text-2xl text-forest">Quick Taproom Controls</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-forest font-serif uppercase tracking-wider text-[10px] border-b border-tan/20">
                                    <th className="px-6 py-4 font-medium">Beer Name</th>
                                    <th className="px-6 py-4 font-medium">Current Status</th>
                                    <th className="px-6 py-4 font-medium">Quick Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-tan/10">
                                {beers.filter(b => b.status !== "archived").map(beer => (
                                    <tr key={beer._id} className="text-sm hover:bg-forest/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-forest">{beer.beer_name}</div>
                                            <div className="text-[10px] text-forest/40 uppercase tracking-tighter">{beer.style}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[9px] uppercase font-bold ${
                                                beer.status === 'ready' ? 'bg-green-100 text-green-700' :
                                                beer.status === 'brewing' ? 'bg-sky-100 text-sky-700' : 'bg-tan/20 text-forest/60'
                                            }`}>
                                                {beer.status === 'ready' ? 'On Tap' : beer.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {beer.status !== 'ready' && (
                                                    <button
                                                        onClick={() => handleStatusChange(beer._id, 'ready')}
                                                        disabled={updating === beer._id}
                                                        className="text-[10px] font-serif uppercase tracking-widest bg-forest text-tan px-3 py-1.5 rounded hover:bg-forest/90 transition-all disabled:opacity-50"
                                                    >
                                                        {updating === beer._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Put on Tap'}
                                                    </button>
                                                )}
                                                {beer.status === 'ready' && (
                                                    <button
                                                        onClick={() => handleStatusChange(beer._id, 'archived')}
                                                        disabled={updating === beer._id}
                                                        className="text-[10px] font-serif uppercase tracking-widest border border-forest text-forest px-3 py-1.5 rounded hover:bg-forest hover:text-tan transition-all disabled:opacity-50"
                                                    >
                                                        {updating === beer._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Archive'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
