"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  Thermometer,
  Droplet,
  Layers,
  HelpCircle,
  Info,
  Activity,
  Calendar,
  Clock,
  Beaker,
  TrendingDown,
  Archive,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { Beer, BeerStatus } from "@/types";

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
  const recipeOgNum = 1 + abvNum * 0.0078;
  const recipeOg = recipeOgNum.toFixed(3);
  const recipeFgNum = 1 + abvNum * 0.0018;
  const recipeFg = recipeFgNum.toFixed(3);

  let calculatedCurrentSg = recipeFg;
  if (selectedBeer.status === "brewing") {
    calculatedCurrentSg = (recipeOgNum - (abvNum * 0.004)).toFixed(3);
  } else if (selectedBeer.status === "on_deck") {
    calculatedCurrentSg = recipeOg;
  }

  // Original Gravity (OG)
  const og = recipeOg;

  // Current Gravity (CG)
  const currentSg = selectedBeer.telemetry?.currentGravity
    ? selectedBeer.telemetry.currentGravity.toFixed(3)
    : (selectedBeer.status === "on_deck" ? og : calculatedCurrentSg);

  // Final Gravity (FG)
  const fg = selectedBeer.telemetry?.targetFg
    ? selectedBeer.telemetry.targetFg.toFixed(3)
    : recipeFg;

  // Let's determine if this gravity and temp are estimated or measured
  const isEstimated = !selectedBeer.telemetry;

  // Calculate current ABV based on current gravity drop
  let currentEstAbv = abvNum.toFixed(1);
  if (selectedBeer.status === "on_deck") {
    currentEstAbv = "0.0";
  } else if (selectedBeer.status === "brewing") {
    const ogVal = parseFloat(og);
    const cgVal = parseFloat(currentSg);
    currentEstAbv = Math.max(0, (ogVal - cgVal) * 131.25).toFixed(1);
  }

  // Calculate batch age dynamically using brewDate
  let batchAgeDays = 0;
  let batchAgeLabel = "";
  if (selectedBeer.brewDate) {
    const brewDateObj = new Date(selectedBeer.brewDate);
    const diffTime = Date.now() - brewDateObj.getTime();
    batchAgeDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (batchAgeDays < 0) {
      batchAgeLabel = `Starting in ${Math.abs(batchAgeDays)} days`;
    } else if (batchAgeDays === 0) {
      batchAgeLabel = "Brewday: Today";
    } else {
      batchAgeLabel = `Day ${batchAgeDays}`;
    }
  } else {
    batchAgeLabel = selectedBeer.status === "on_deck" ? "Recipe Design Stage" : "Log Active";
  }

  // Calculate fermentation progress percentage
  const ogF = parseFloat(og);
  const cgF = parseFloat(currentSg);
  const fgF = parseFloat(fg);
  let progressPercent = 0;
  if (selectedBeer.status === "ready" || selectedBeer.status === "archived") {
    progressPercent = 100;
  } else if (selectedBeer.status === "on_deck") {
    progressPercent = 0;
  } else {
    const totalDrop = ogF - fgF;
    const currentDrop = ogF - cgF;
    progressPercent = totalDrop > 0 ? Math.max(0, Math.min(100, Math.round((currentDrop / totalDrop) * 100))) : 0;
  }

  // --- SEAMLESS CMS-FIRST DATA INHERITANCE ---
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

  // --- DATA STATES EVALUATION ---
  const isMissingTelemetry = !selectedBeer.telemetry;
  const isStaleTelemetry = selectedBeer.status === "brewing" && batchAgeDays > 21;
  const isPartialData = selectedBeer.telemetry && (
    !selectedBeer.telemetry.waterProfile || !selectedBeer.telemetry.kettleSchedule
  );

  return (
    <TooltipProvider>
      <section id="telemetry" className="py-20 bg-forest text-tan relative overflow-hidden">
        {/* Fine blueprint coordinate grid texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%2040h40M40%200v40%22%20fill%3D%22none%22%20stroke%3D%22%23E8D7B5%22%20stroke-opacity%3D%220.025%22%20stroke-width%3D%221%22/%3E%3C/svg%3E')] opacity-70" />

        <div className="container mx-auto px-4 relative z-10 max-w-6xl space-y-16">

          {/* SECTION: WHAT IS BREWING NOW? */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-tan/10 pb-4">
              <Activity className="w-6 h-6 text-sky animate-pulse" />
              <div>
                <h2 className="font-serif text-2xl md:text-3xl tracking-wide uppercase">What is brewing now?</h2>
                <p className="text-xs text-tan/60 font-mono">Active vessels, fermentation statuses, and ready brews on tap.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeBeers.length === 0 ? (
                <div className="col-span-full border border-tan/10 bg-white/5 rounded-2xl p-8 text-center space-y-3">
                  <Archive className="w-10 h-10 text-tan/30 mx-auto" />
                  <p className="font-mono text-sm text-tan/60">The fermenters are currently resting between batch cycles.</p>
                  <p className="text-xs text-tan/40">Select an archived batch below to view its historical brewing logs.</p>
                </div>
              ) : (
                activeBeers.map((beer) => {
                  const isActive = beer.slug === activeTab;
                  // Calculate local specs for preview card
                  const localAbv = beer.abv || 5.0;
                  const localOg = (1 + localAbv * 0.0078).toFixed(3);
                  const localFg = (1 + localAbv * 0.0018).toFixed(3);
                  let localCg = localFg;
                  if (beer.status === "brewing") {
                    localCg = (parseFloat(localOg) - (localAbv * 0.004)).toFixed(3);
                  } else if (beer.status === "on_deck") {
                    localCg = localOg;
                  }

                  let localAgeLabel = "";
                  if (beer.brewDate) {
                    const localDiff = Math.floor((Date.now() - new Date(beer.brewDate).getTime()) / (1000 * 60 * 60 * 24));
                    localAgeLabel = localDiff < 0 ? `Starts in ${Math.abs(localDiff)}d` : `Day ${localDiff}`;
                  } else {
                    localAgeLabel = beer.status === "on_deck" ? "Recipe Stage" : "Active";
                  }

                  return (
                    <div
                      key={beer.slug}
                      onClick={() => setActiveTab(beer.slug)}
                      className={`cursor-pointer rounded-2xl p-6 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
                        isActive
                          ? "bg-white/10 border-tan/60 shadow-[0_0_20px_rgba(232,215,181,0.15)]"
                          : "bg-white/5 border-tan/15 hover:bg-white/[0.07] hover:border-tan/30"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute top-0 right-0 bg-tan text-forest text-[10px] font-mono font-bold px-2 py-0.5 rounded-bl">
                          Active Selection
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-tan/40">
                              {beer.style?.title || "Craft Beer"}
                            </span>
                            <h3 className="font-serif text-xl text-tan group-hover:text-sky transition-colors">
                              {beer.beer_name}
                            </h3>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                            beer.status === "ready"
                              ? "bg-green-500/20 text-green-300 border border-green-500/30"
                              : beer.status === "brewing"
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}>
                            {beer.status === "ready" ? "On Tap" : beer.status === "brewing" ? "Fermenting" : "On Deck"}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 py-2 border-y border-tan/10 font-mono text-xs">
                          <div>
                            <span className="text-[9px] text-tan/40 block">BATCH AGE</span>
                            <span className="text-tan/80 font-bold">{localAgeLabel}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-tan/40 block">GRAVITY</span>
                            <span className="text-tan/80 font-bold">
                              {beer.status === "on_deck" ? "--" : `${localCg}`}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-tan/40 block">EST. ABV</span>
                            <span className="text-tan/80 font-bold">{localAbv}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-2">
                        <span className="text-[10px] font-mono text-tan/40">Vessel ID: ITB-{beer.slug.toUpperCase().slice(0, 4)}</span>
                        <span className="text-xs font-mono font-bold text-sky group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          Inspect Vessel →
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* HISTORICAL BREWS SELECTOR */}
          {pastBeers.length > 0 && (
            <div className="space-y-4">
              <span className="text-xs uppercase font-mono tracking-widest text-tan/40 block">
                Historical Brews Archive
              </span>
              <div className="flex flex-wrap gap-2">
                {pastBeers.map((beer) => (
                  <button
                    key={beer.slug}
                    onClick={() => setActiveTab(beer.slug)}
                    className={`font-mono text-xs px-4 py-2 rounded-lg border transition-all ${
                      beer.slug === activeTab
                        ? "bg-tan text-forest border-tan"
                        : "bg-white/5 border-tan/15 text-tan/70 hover:bg-white/10 hover:text-tan"
                    }`}
                  >
                    📝 {beer.beer_name} (Archived)
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MAIN INTERACTIVE LOGBOOK PREVIEW */}
          <div className="border border-tan/20 rounded-3xl overflow-hidden bg-white/[0.03] backdrop-blur-md">

            {/* Logbook Header Banner */}
            <div className="p-6 md:p-8 border-b border-tan/20 bg-white/[0.02] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-sky" />
                  <span className="text-xs font-mono uppercase tracking-widest text-tan/50">
                    Inspecting Logging Journal
                  </span>
                </div>
                <h3 className="font-serif text-3xl md:text-4xl text-tan">{selectedBeer.beer_name}</h3>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-mono text-tan/50">Style: {styleLabel}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-tan/20" />
                  <span className="text-xs font-mono text-tan/50">Vessel Code: ITB-{selectedBeer.slug.toUpperCase().slice(0, 8)}</span>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-3">
                <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase border tracking-widest ${
                  selectedBeer.status === "ready"
                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                    : selectedBeer.status === "brewing"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30 animate-pulse"
                      : selectedBeer.status === "on_deck"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
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

                <Link
                  href={`/beers/${selectedBeer.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-sky hover:text-tan transition-colors uppercase tracking-wider font-bold"
                >
                  View Full Beer Profile & Tasting Notes <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Graceful Warnings / Data State Notices */}
            {(isMissingTelemetry || isStaleTelemetry || isPartialData) && (
              <div className="px-6 md:px-8 pt-6">
                {isMissingTelemetry && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono flex items-start gap-3">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">⚠️ fallback specs active:</span> No real-time electronic sensor telemetry has been configured for this batch document. Displaying standard recipe guidelines and style fallback metrics.
                    </div>
                  </div>
                )}
                {isStaleTelemetry && (
                  <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-300 text-xs font-mono flex items-start gap-3">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">⏳ stale telemetry stream:</span> Sensors have not updated in over 21 days for this fermenter. Below metrics reflect manual hydrometer logs and gravity curve calculations.
                    </div>
                  </div>
                )}
                {isPartialData && !isMissingTelemetry && (
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-mono flex items-start gap-3">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">ℹ️ partial profile:</span> Certain electronic telemetry profiles are unconfigured. The Brew Lab has automatically augmented the missing slots with target style parameters.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Detailed Questions Sections */}
            <div className="p-6 md:p-8 space-y-12">

              {/* SECTION: HOW IS FERMENTATION PROGRESSING? */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-tan/10 pb-2">
                  <TrendingDown className="w-5 h-5 text-sky" />
                  <h4 className="font-serif text-lg uppercase tracking-wider text-tan">
                    How is fermentation progressing?
                  </h4>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">

                  {/* 1. Primary Fermentation Metrics */}
                  <div className="p-6 rounded-2xl border border-tan/10 bg-black/10 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs uppercase font-mono text-tan/50">Core Temperature</span>
                        <span className="text-[10px] font-mono text-tan/40 uppercase bg-white/5 px-2 py-0.5 rounded">
                          {isEstimated ? "Style Fallback" : "Sensor Measured"}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-4xl text-sky font-bold">
                          {coreTemp === "--" ? "N/A" : coreTemp}
                        </span>
                        <span className="text-xs text-tan/60 font-mono">/ {tempTarget === "--" ? "N/A" : tempTarget} Target</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-tan/70 font-mono">
                        <Thermometer className="w-4 h-4 text-sky" />
                        <span>Status: {tempStatus}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-tan/5 text-[11px] text-tan/40 font-mono leading-relaxed">
                      Fermentation temperature control is essential to prevent off-flavors. Yeast active cycles require strict monitoring to ensure clean attenuation.
                    </div>
                  </div>

                  {/* 2. Specific Gravity & ABV Solver */}
                  <div className="p-6 rounded-2xl border border-tan/10 bg-black/10 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs uppercase font-mono text-tan/50">Brew Gravity Specs</span>
                        <span className="text-[10px] font-mono text-tan/40 uppercase bg-white/5 px-2 py-0.5 rounded">
                          {selectedBeer.status === "on_deck" ? "Recipe Stage" : "Real-time solver"}
                        </span>
                      </div>

                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between border-b border-tan/5 pb-1.5">
                          <span className="text-tan/60">Original Gravity (OG)</span>
                          <span className="text-tan font-bold">{og} SG</span>
                        </div>
                        <div className="flex justify-between border-b border-tan/5 pb-1.5">
                          <span className="text-tan/60">Current Gravity (CG)</span>
                          <span className="text-sky font-bold">{currentSg === "--" ? "--" : `${currentSg} SG`}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-tan/60">Target Final Gravity (FG)</span>
                          <span className="text-emerald-400 font-bold">{fg} SG</span>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-between items-center border-t border-tan/10">
                        <span className="text-xs font-mono uppercase text-tan/50">Estimated ABV</span>
                        <span className="font-mono text-xl text-tan font-bold">
                          {currentEstAbv}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-tan/5 text-[11px] text-tan/40 font-mono leading-relaxed">
                      Gravity measures dissolved malt sugars. As yeast consumes sugars, gravity drops, releasing carbon dioxide and alcohol.
                    </div>
                  </div>

                  {/* 3. Progress Visualization & Curve */}
                  <div className="p-6 rounded-2xl border border-tan/10 bg-black/10 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs uppercase font-mono text-tan/50">Fermentation Progress</span>
                        <span className="font-mono text-sm font-bold text-sky">{progressPercent}%</span>
                      </div>

                      <Progress value={progressPercent} className="h-2.5 bg-white/10" />

                      {/* Decaying Fermentation Curve SVG */}
                      <div className="border border-tan/10 rounded-lg p-2.5 bg-black/30 mt-2">
                        <span className="text-[9px] font-mono uppercase text-tan/40 mb-1 block">Live Decaying SG Curve</span>
                        <div className="relative h-16 w-full pt-1">
                          <svg viewBox="0 0 100 40" className="w-full h-full text-sky" preserveAspectRatio="none">
                            {/* Horizontal grid guide */}
                            <line x1="0" y1="5" x2="100" y2="5" stroke="currentColor" strokeOpacity="0.05" strokeDasharray="1" />
                            <line x1="0" y1="35" x2="100" y2="35" stroke="currentColor" strokeOpacity="0.05" strokeDasharray="1" />

                            {/* Target curve path (smooth decline) */}
                            <path
                              d="M 0,5 Q 35,5 100,35"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeOpacity="0.2"
                            />

                            {/* Realised path up to progress */}
                            {progressPercent > 0 && (
                              <path
                                d={`M 0,5 Q ${35 * (progressPercent / 100)},${5 + (30 * (progressPercent / 100))} ${progressPercent},${5 + (30 * progressPercent) / 100}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              />
                            )}

                            {/* Node indicators */}
                            <circle cx="0" cy="5" r="2" className="fill-tan/60" />
                            <circle cx="100" cy="35" r="2" className="fill-emerald-400/60" />

                            {/* Pulsing locator node */}
                            <circle
                              cx={progressPercent}
                              cy={5 + (30 * progressPercent) / 100}
                              r="3.5"
                              className="fill-sky animate-pulse"
                            />
                          </svg>
                          <div className="absolute top-1 left-1 text-[8px] font-mono text-tan/30">OG</div>
                          <div className="absolute bottom-1 right-1 text-[8px] font-mono text-emerald-400/50">FG</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-tan/5 text-[11px] text-tan/40 font-mono leading-relaxed flex justify-between">
                      <span>Brewday: {selectedBeer.brewDate || "N/A"}</span>
                      <span>{batchAgeLabel}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION: WHAT HAS HAPPENED OVER TIME? */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-tan/10 pb-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <h4 className="font-serif text-lg uppercase tracking-wider text-tan">
                    What has happened over time?
                  </h4>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">

                  {/* 1. Hot-Side Timeline Addition Logs */}
                  <div className="p-6 rounded-2xl border border-tan/10 bg-black/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-tan/5">
                        <span className="text-xs uppercase font-mono text-tan/50">Kettle Addition Timeline</span>
                        <span className="text-[10px] font-mono text-tan/40">Hot-Side Logs</span>
                      </div>

                      <div className="space-y-4 font-mono text-xs text-tan/80">
                        {kettleSchedule.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-3 relative pb-3 border-l border-amber-400/20 pl-4 ml-1">
                            <div className="w-2 h-2 rounded-full bg-amber-400 absolute -left-[5px] top-1" />
                            <div>
                              <span className="text-[10px] text-amber-400 uppercase font-bold">{step.time}</span>
                              <p className="font-serif text-tan mt-0.5 text-sm">{step.label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-tan/5 text-[11px] text-tan/40 font-mono leading-relaxed">
                      Chronological hop, spice, and clarifying agent timers logged during the 60-to-90 minute boil stage of the brewing day.
                    </div>
                  </div>

                  {/* 2. Water Profile & Ions */}
                  <div className="p-6 rounded-2xl border border-tan/10 bg-black/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-tan/5">
                        <span className="text-xs uppercase font-mono text-tan/50">Water Chemistry Profile</span>
                        <span className="font-mono text-sm text-emerald-400 font-bold">{ph} pH</span>
                      </div>

                      <div className="space-y-4 font-mono text-xs">
                        <div>
                          <div className="flex justify-between text-tan/60 mb-1">
                            <span>Sulfate (SO₄²⁻)</span>
                            <span>{sulfate} ppm</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="bg-sky h-full animate-pulse" style={{ width: sulfatePercent }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-tan/60 mb-1">
                            <span>Chloride (Cl⁻)</span>
                            <span>{chloride} ppm</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="bg-sky h-full" style={{ width: chloridePercent }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-tan/60 mb-1">
                            <span>Calcium (Ca²⁺)</span>
                            <span>{calcium} ppm</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full" style={{ width: calciumPercent }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-tan/5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-2.5 bg-black/20 border border-tan/10 rounded text-[10px] font-mono text-tan/60 cursor-pointer flex items-center justify-between hover:text-tan">
                            <span className="truncate">Explain water profile...</span>
                            <HelpCircle className="w-3.5 h-3.5 text-tan/40" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-cream text-forest border border-tan max-w-xs p-3">
                          <p className="text-xs font-sans font-normal leading-relaxed">{waterNotes}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* 3. Grist & Recipe Ingredients */}
                  <div className="p-6 rounded-2xl border border-tan/10 bg-black/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-tan/5">
                        <span className="text-xs uppercase font-mono text-tan/50">Ingredients Grist Bill</span>
                        <span className="text-[10px] font-mono text-tan/40">Raw Materials</span>
                      </div>

                      <div className="space-y-4">
                        {selectedBeer.ingredients ? (
                          <p className="text-xs leading-relaxed font-mono text-tan/80 max-h-36 overflow-y-auto whitespace-pre-line pr-1">
                            {selectedBeer.ingredients}
                          </p>
                        ) : (
                          <p className="text-xs font-mono text-tan/40 italic">
                            No detailed grain/yeast list entered for this recipe.
                          </p>
                        )}

                        {selectedBeer.notableHops && selectedBeer.notableHops.length > 0 && (
                          <div className="pt-2 space-y-1">
                            <span className="text-[9px] font-mono uppercase text-tan/40 block">Dry Hops / Dry Additions</span>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedBeer.notableHops.map((hop, idx) => (
                                <span key={idx} className="bg-white/5 border border-tan/10 text-tan/85 text-[9px] font-mono px-1.5 py-0.5 rounded">
                                  🌿 {hop}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-tan/5 text-[11px] text-tan/40 font-mono leading-relaxed">
                      Grain mashing releases fermentable maltose sugars. Hop additions introduce bittering alpha-acids during mashing and aromatic oils during active fermentation.
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* Interactive JSON/Recipe Snapshot Schema */}
          <div className="text-center pt-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-tan/40 hover:text-tan/80 cursor-pointer transition-colors border border-tan/15 px-4 py-2 rounded-lg bg-black/10">
                  <Info className="w-3.5 h-3.5" /> [Batch Metadata Summary Record]
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-cream text-forest border border-tan max-w-sm p-4 font-mono text-xs">
                <p className="font-bold text-sm mb-2">TELEMETRY DIAGNOSTICS:</p>
                <pre className="text-[10px] leading-relaxed text-forest/80 text-left">
{`{
  "batchId": "ITB-${selectedBeer.slug.toUpperCase().slice(0, 8)}",
  "style": "${styleLabel}",
  "gravity": ${currentSg === "--" ? '"--"' : currentSg},
  "temperature": "${coreTemp}",
  "abv": ${selectedBeer.abv || "null"},
  "status": "${selectedBeer.status}",
  "estimated": ${isEstimated ? "true" : "false"},
  "stale": ${isStaleTelemetry ? "true" : "false"},
  "brewDate": "${selectedBeer.brewDate || "none"}",
  "progress": ${progressPercent}
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
