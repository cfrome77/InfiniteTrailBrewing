"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Thermometer, Droplet, Layers, HelpCircle, Info } from "lucide-react";
import { Beer } from "@/types";

interface TelemetryDashboardProps {
  initialBeers: Beer[];
}

export function TelemetryDashboard({ initialBeers }: TelemetryDashboardProps) {
  // Separate into active cellar (ready, brewing, on_deck) and past logs (archived)
  const activeBeers = initialBeers.filter((b) => b.status !== "archived");
  const pastBeers = initialBeers.filter((b) => b.status === "archived");

  const [activeTab, setActiveTab] = useState<string>(
    activeBeers.length > 0 ? activeBeers[0].slug : pastBeers.length > 0 ? pastBeers[0].slug : ""
  );

  const allVisibleBeers = [...activeBeers, ...pastBeers];
  const selectedBeer = allVisibleBeers.find((b) => b.slug === activeTab);

  if (!selectedBeer) {
    return (
      <section className="py-20 bg-forest text-tan text-center">
        <p className="font-mono text-sm text-tan/50">No batch logs found in the database.</p>
      </section>
    );
  }

  // --- STYLE-BASED AND STATUS-BASED DETERMINISTIC FORMULAS ---
  // Core Temps resolution based on current cellar status
  let coreTemp = "38.2°F";
  let tempTarget = "38.0°F";
  let tempStatus = "Stable Draft Temp";

  if (selectedBeer.status === "brewing") {
    coreTemp = "64.5°F";
    tempTarget = "64.0°F";
    tempStatus = "Primary Fermentation Stage";
  } else if (selectedBeer.status === "on_deck") {
    coreTemp = "--";
    tempTarget = "--";
    tempStatus = "Not Yet Brewed (Upcoming Batch)";
  } else if (selectedBeer.status === "archived") {
    coreTemp = "34.0°F";
    tempTarget = "34.0°F";
    tempStatus = "Completed / Cellared";
  }

  // Gravity calculations
  const abvNum = selectedBeer.abv || 5.0;
  const recipeOg = (1 + abvNum * 0.0078).toFixed(3);
  const recipeFg = (1 + abvNum * 0.0018).toFixed(3);
  let calculatedCurrentSg = recipeFg;
  if (selectedBeer.status === "brewing") {
    calculatedCurrentSg = (parseFloat(recipeOg) - (abvNum * 0.004)).toFixed(3);
  } else if (selectedBeer.status === "on_deck") {
    calculatedCurrentSg = 0; // represent as N/A in UI
  }

  const currentSg = selectedBeer.telemetry?.currentGravity
    ? selectedBeer.telemetry.currentGravity.toFixed(3)
    : (selectedBeer.status === "on_deck" ? "--" : calculatedCurrentSg);
  const fg = selectedBeer.telemetry?.targetFg
    ? selectedBeer.telemetry.targetFg.toFixed(3)
    : recipeFg;

  // Let's determine if this gravity and temp are estimated or measured
  const isEstimated = !selectedBeer.telemetry;

  // --- SEAMLESS CMS-FIRST DATA INHERITANCE ---
  // Read our server-side coalesced values with zero frontend string checking!
  const ph = parseFloat(selectedBeer.resolvedPh || "5.32").toFixed(2);
  const sulfate = selectedBeer.resolvedSulfate;
  const chloride = selectedBeer.resolvedChloride;
  const calcium = selectedBeer.resolvedCalcium;
  const waterNotes = selectedBeer.resolvedWaterNotes;
  const kettleSchedule = selectedBeer.resolvedKettleSchedule;

  // Calculate visual bar percentages based on ppm levels relative to standards
  const maxSulfate = 180;
  const maxChloride = 150;
  const maxCalcium = 100;
  const sulfatePercent = `${Math.min((sulfate / maxSulfate) * 100, 100)}%`;
  const chloridePercent = `${Math.min((chloride / maxChloride) * 100, 100)}%`;
  const calciumPercent = `${Math.min((calcium / maxCalcium) * 100, 100)}%`;

  const styleLabel = selectedBeer.style?.title || "Special Style";

  return (
    <TooltipProvider>
      <section id="telemetry" className="py-20 bg-forest text-tan relative overflow-hidden">
        {/* Fine blueprint coordinate grid texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%2040h40M40%200v40%22%20fill%3D%22none%22%20stroke%3D%22%23E8D7B5%22%20stroke-opacity%3D%220.025%22%20stroke-width%3D%221%22/%3E%3C/svg%3E')] opacity-70" />

        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Split selectors for active and historical logs */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Active Cellar Selection */}
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-tan/40 mb-3 block">Active Batches</span>
                <TabsList className="bg-white/5 border border-tan/10 p-1 rounded-xl w-full flex flex-wrap h-auto gap-1">
                  {activeBeers.length === 0 ? (
                    <div className="text-xs font-mono p-3 text-tan/30 w-full text-center">No active batches in cellar.</div>
                  ) : (
                    activeBeers.map((beer) => (
                      <TabsTrigger
                        key={beer.slug}
                        value={beer.slug}
                        className="font-serif tracking-wide text-xs px-4 py-2 rounded-lg data-[state=active]:bg-tan data-[state=active]:text-forest flex-grow text-center"
                      >
                        {beer.beer_name}
                      </TabsTrigger>
                    ))
                  )}
                </TabsList>
              </div>

              {/* Historical Logs Selection */}
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-tan/40 mb-3 block">Archived Batches</span>
                <TabsList className="bg-white/5 border border-tan/10 p-1 rounded-xl w-full flex flex-wrap h-auto gap-1">
                  {pastBeers.length === 0 ? (
                    <div className="text-xs font-mono p-3 text-tan/30 w-full text-center">No archived logs available.</div>
                  ) : (
                    pastBeers.slice(0, 4).map((beer) => (
                      <TabsTrigger
                        key={beer.slug}
                        value={beer.slug}
                        className="font-serif tracking-wide text-xs px-4 py-2 rounded-lg data-[state=active]:bg-tan data-[state=active]:text-forest flex-grow text-center"
                      >
                        {beer.beer_name}
                      </TabsTrigger>
                    ))
                  )}
                </TabsList>
              </div>
            </div>

            {/* TAB CONTENTS (RENDERED DYNAMICALLY) */}
            <TabsContent value={activeTab} className="space-y-8 animate-fade-in duration-300">
              {/* Batch Banner Info */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl border border-tan/20 bg-white/5 backdrop-blur-sm gap-4">
                <div>
                  <h3 className="font-serif text-3xl text-tan">{selectedBeer.beer_name}</h3>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="text-xs font-mono text-tan/50">Style: {styleLabel}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-tan/20" />
                    <span className="text-xs font-mono text-tan/50">Code: ITB-{selectedBeer.slug.toUpperCase().slice(0, 8)}</span>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded text-xs font-mono font-semibold uppercase border ${
                  selectedBeer.status === "ready"
                    ? "bg-green-500/20 text-green-300 border-green-500/30 animate-pulse"
                    : selectedBeer.status === "brewing"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30 animate-pulse"
                      : selectedBeer.status === "on_deck"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse"
                        : "bg-zinc-600/30 text-zinc-300 border-zinc-500/30"
                }`}>
                  {selectedBeer.status === "ready"
                    ? "On Tap: In the Kegerator"
                    : selectedBeer.status === "brewing"
                      ? "Fermenting: In the Carboy"
                      : selectedBeer.status === "on_deck"
                        ? "On Deck: Recipe Stage"
                        : "Completed Batch"
                  }
                </span>
              </div>

              {/* Grid Layout */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* 1. Fermentation Metrics */}
                <div className="p-6 rounded-2xl border border-tan/15 bg-white/5 backdrop-blur-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-6 border-b border-tan/10 pb-4">
                    <Thermometer className="w-5 h-5 text-sky" />
                    <h4 className="font-serif text-lg text-tan">Fermentation Status</h4>
                  </div>

                  <div className="space-y-6 flex-grow">
                    {/* Temperature */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-tan/70">Fermentation Temperature</span>
                      <div className="text-right">
                        <span className="font-mono text-2xl text-sky font-bold">
                          {coreTemp === "--" ? "--" : `${coreTemp}`}
                        </span>
                        <span className="text-[10px] block text-sky/60 uppercase font-mono">
                          Target: {tempTarget === "--" ? "--" : tempTarget} ({tempStatus})
                          {selectedBeer.status !== "on_deck" && (isEstimated ? " • Estimated" : " • Measured")}
                        </span>
                      </div>
                    </div>

                    {/* Gravity */}
                    <div className="flex justify-between items-center border-t border-tan/5 pt-4">
                      <span className="text-sm text-tan/70">Gravity</span>
                      <div className="text-right">
                        <span className="font-mono text-2xl text-tan font-bold">
                          {currentSg === "--" ? "--" : `${currentSg} SG`}
                        </span>
                        <span className="text-[10px] block text-tan/60 uppercase font-mono">
                          Recipe OG: {recipeOg} | Target FG: {fg}
                          {selectedBeer.status !== "on_deck" && (isEstimated ? " • Estimated" : " • Measured")}
                        </span>
                      </div>
                    </div>

                    {/* Gravity Curve Graph */}
                    <div className="border border-tan/10 rounded-lg p-3 bg-black/20 mt-4">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-tan/40 mb-2 block">Gravity Progress</span>
                      <div className="h-20 w-full flex items-end gap-1.5 pt-2">
                        <div className="bg-tan/15 h-full w-[12%] rounded-t" />
                        <div className="bg-tan/20 h-[85%] w-[12%] rounded-t" />
                        <div className="bg-tan/30 h-[70%] w-[12%] rounded-t" />
                        <div className="bg-tan/45 h-[50%] w-[12%] rounded-t" />
                        <div className="bg-tan/60 h-[32%] w-[12%] rounded-t" />
                        <div className="bg-sky h-[22%] w-[12%] rounded-t animate-pulse" />
                        <div className="border border-dashed border-sky/30 h-[18%] w-[12%] rounded-t" />
                        <div className="border border-dashed border-sky/30 h-[18%] w-[12%] rounded-t" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Chemistry Profile */}
                <div className="p-6 rounded-2xl border border-tan/15 bg-white/5 backdrop-blur-sm flex flex-col">
                  <div className="flex items-center justify-between mb-6 border-b border-tan/10 pb-4">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-5 h-5 text-sky" />
                      <h4 className="font-serif text-lg text-tan">Water Profile</h4>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-tan/40 cursor-help hover:text-tan/70 transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-cream text-forest border border-tan max-w-xs p-3">
                        <p className="text-xs font-sans">{waterNotes}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="space-y-6 flex-grow">
                    {/* pH Level */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-tan/70">Mash Water pH</span>
                      <span className="font-mono text-xl text-emerald-400 font-bold">{ph} pH</span>
                    </div>
                    <Progress value={90} className="h-1.5 bg-white/10" />

                    {/* Ion Breakdown */}
                    <div className="space-y-4 border-t border-tan/5 pt-4">
                      <div>
                        <div className="flex justify-between text-xs font-mono text-tan/60 mb-1">
                          <span>Sulfate (SO₄²⁻)</span>
                          <span>{sulfate} ppm</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="bg-sky h-full" style={{ width: sulfatePercent }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono text-tan/60 mb-1">
                          <span>Chloride (Cl⁻)</span>
                          <span>{chloride} ppm</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="bg-sky h-full" style={{ width: chloridePercent }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono text-tan/60 mb-1">
                          <span>Calcium (Ca²⁺)</span>
                          <span>{calcium} ppm</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full" style={{ width: calciumPercent }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Hop/Grain Timeline */}
                <div className="p-6 rounded-2xl border border-tan/15 bg-white/5 backdrop-blur-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-6 border-b border-tan/10 pb-4">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <h4 className="font-serif text-lg text-tan">Brew Day Timeline</h4>
                  </div>

                  <div className="space-y-5 flex-grow font-mono text-sm text-tan/80">
                    {kettleSchedule.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 relative pb-4 border-l border-amber-400/20 pl-4 ml-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute -left-[5.5px] top-1.5" />
                        <div>
                          <span className="text-xs text-amber-400 uppercase font-bold">{step.time}</span>
                          <p className="font-serif text-tan mt-0.5">{step.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Recipe Snapshot & Batch Summary trigger */}
          <div className="mt-12 text-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-tan/40 hover:text-tan/80 cursor-pointer transition-colors border border-tan/15 px-4 py-2 rounded-lg bg-black/10">
                  <Info className="w-3.5 h-3.5" /> [Batch Summary & Recipe Snapshot]
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-cream text-forest border border-tan max-w-sm p-4 font-mono text-xs">
                <p className="font-bold text-sm mb-2">RECIPE SNAPSHOT ({selectedBeer.slug}):</p>
                <pre className="text-[10px] leading-relaxed text-forest/80">
{`{
  "batchId": "ITB-${selectedBeer.slug.toUpperCase().slice(0, 8)}",
  "style": "${styleLabel}",
  "gravity": ${currentSg === "--" ? '"--"' : currentSg},
  "temperature": "${coreTemp}",
  "abv": ${selectedBeer.abv || "null"},
  "ibu": ${selectedBeer.ibu || "null"},
  "status": "${selectedBeer.status}",
  "estimated": ${isEstimated ? "true" : "false"}
}`}
                </pre>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}
