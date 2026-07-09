"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Thermometer, Droplet, Layers, HelpCircle, Activity, Info } from "lucide-react";

export function TelemetryDashboard() {
  const [activeBatch, setActiveBatch] = useState("batch-42");

  return (
    <TooltipProvider>
      <section id="telemetry" className="py-20 bg-forest text-tan relative overflow-hidden border-t border-b border-tan/20">
        {/* Fine blueprint coordinate grid texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%2040h40M40%200v40%22%20fill%3D%22none%22%20stroke%3D%22%23E8D7B5%22%20stroke-opacity%3D%220.025%22%20stroke-width%3D%221%22/%3E%3C/svg%3E')] opacity-70" />

        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky/30 bg-sky/5 text-sky text-xs font-mono uppercase tracking-widest mb-4">
              <Activity className="w-3 h-3 animate-pulse" /> Active Brew Lab Telemetry
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-tan mb-4 tracking-wide">Kettle Telemetry</h2>
            <div className="w-24 h-1 bg-tan mx-auto mb-6" />
            <p className="text-tan/70 max-w-2xl mx-auto italic">
              Real-time fermentation parameters, water profile chemistry, and timing logs retrieved straight from our active private lab fermenters.
            </p>
          </div>

          <Tabs defaultValue="batch-42" className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="bg-white/5 border border-tan/20 p-1 rounded-xl">
                <TabsTrigger value="batch-42" className="font-serif tracking-wide text-sm px-6 py-2 rounded-lg data-[state=active]:bg-tan data-[state=active]:text-forest">
                  Active: Batch #42 (Cold IPA)
                </TabsTrigger>
                <TabsTrigger value="batch-41" className="font-serif tracking-wide text-sm px-6 py-2 rounded-lg data-[state=active]:bg-tan data-[state=active]:text-forest">
                  Historical: Batch #41 (Catoctin Stout)
                </TabsTrigger>
              </TabsList>
            </div>

            {/* BATCH 42 */}
            <TabsContent value="batch-42" className="space-y-8">
              {/* Batch Banner Info */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl border border-tan/20 bg-white/5 backdrop-blur-sm gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-tan">Mountain Squall Cold IPA</h3>
                  <p className="text-xs font-mono text-tan/50 mt-1">Recipe Code: ITB-COLD-042 | Brewed: Oct 12, 2024</p>
                </div>
                <span className="px-3 py-1 rounded bg-sky/20 text-sky text-xs font-mono font-semibold uppercase border border-sky/30 animate-pulse">
                  Fermentation: Active Cold Crash
                </span>
              </div>

              {/* Grid Layout */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* 1. Fermentation Metrics */}
                <div className="p-6 rounded-2xl border border-tan/15 bg-white/5 backdrop-blur-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-6 border-b border-tan/10 pb-4">
                    <Thermometer className="w-5 h-5 text-sky" />
                    <h4 className="font-serif text-lg text-tan">Fermentation Logs</h4>
                  </div>

                  <div className="space-y-6 flex-grow">
                    {/* Temperature */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-tan/70">Lab Core Temp</span>
                      <div className="text-right">
                        <span className="font-mono text-2xl text-sky font-bold">54.2°F</span>
                        <span className="text-[10px] block text-sky/60 uppercase font-mono">Target: 54.0°F (Stable)</span>
                      </div>
                    </div>

                    {/* Specific Gravity */}
                    <div className="flex justify-between items-center border-t border-tan/5 pt-4">
                      <span className="text-sm text-tan/70">Specific Gravity</span>
                      <div className="text-right">
                        <span className="font-mono text-2xl text-tan font-bold">1.011 SG</span>
                        <span className="text-[10px] block text-tan/60 uppercase font-mono">OG: 1.054 | FG Target: 1.009</span>
                      </div>
                    </div>

                    {/* Gravity Curve Graph */}
                    <div className="border border-tan/10 rounded-lg p-3 bg-black/20 mt-4">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-tan/40 mb-2 block">Gravity Conversion Curve</span>
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
                      <h4 className="font-serif text-lg text-tan">Water Chemistry</h4>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-tan/40 cursor-help hover:text-tan/70 transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-cream text-forest border border-tan max-w-xs p-3">
                        <p className="text-xs font-sans">
                          Sulfate-to-Chloride ratio set to 2.5:1 to dry out the malt character and amplify the crisp, refreshing hop bite of the mountain spring.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="space-y-6 flex-grow">
                    {/* pH Level */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-tan/70">Mash Water pH</span>
                      <span className="font-mono text-xl text-emerald-400 font-bold">5.25 pH</span>
                    </div>
                    <Progress value={90} className="h-1.5 bg-white/10" />

                    {/* Ion Breakdown */}
                    <div className="space-y-4 border-t border-tan/5 pt-4">
                      <div>
                        <div className="flex justify-between text-xs font-mono text-tan/60 mb-1">
                          <span>Sulfate (SO₄²⁻)</span>
                          <span>150 ppm (Target: 150)</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="bg-sky h-full" style={{ width: "100%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono text-tan/60 mb-1">
                          <span>Chloride (Cl⁻)</span>
                          <span>60 ppm (Target: 60)</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="bg-sky h-full" style={{ width: "40%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono text-tan/60 mb-1">
                          <span>Calcium (Ca²⁺)</span>
                          <span>75 ppm (Target: 75)</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full" style={{ width: "75%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Hop Timeline */}
                <div className="p-6 rounded-2xl border border-tan/15 bg-white/5 backdrop-blur-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-6 border-b border-tan/10 pb-4">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <h4 className="font-serif text-lg text-tan">Kettle Addition Schedule</h4>
                  </div>

                  <div className="space-y-5 flex-grow font-mono text-sm text-tan/80">
                    <div className="flex items-start gap-3 relative pb-4 border-l border-amber-400/20 pl-4 ml-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute -left-[5.5px] top-1.5" />
                      <div>
                        <span className="text-xs text-amber-400 uppercase font-bold">60 min (Boil Start)</span>
                        <p className="font-serif text-tan mt-0.5">Magnum Hops (15 IBU)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 relative pb-4 border-l border-amber-400/20 pl-4 ml-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute -left-[5.5px] top-1.5" />
                      <div>
                        <span className="text-xs text-amber-400 uppercase font-bold">15 min (Flavor)</span>
                        <p className="font-serif text-tan mt-0.5">Citra & Mosaic (10 IBU)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 relative pb-4 border-l border-amber-400/20 pl-4 ml-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute -left-[5.5px] top-1.5 animate-ping" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute -left-[5.5px] top-1.5" />
                      <div>
                        <span className="text-xs text-amber-400 uppercase font-bold">0 min (Whirlpool)</span>
                        <p className="font-serif text-tan mt-0.5">Double Dry Hop: Citra Cryo & Simcoe</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* BATCH 41 */}
            <TabsContent value="batch-41" className="space-y-8">
              {/* Batch Banner Info */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl border border-tan/20 bg-white/5 backdrop-blur-sm gap-4">
                <div>
                  <h3 className="font-serif text-2xl text-tan">Catoctin Stout</h3>
                  <p className="text-xs font-mono text-tan/50 mt-1">Recipe Code: ITB-STOUT-041 | Brewed: Sep 08, 2024</p>
                </div>
                <span className="px-3 py-1 rounded bg-zinc-600/30 text-zinc-300 text-xs font-mono font-semibold uppercase border border-zinc-500/30">
                  Status: Completed / Logged
                </span>
              </div>

              {/* Grid Layout */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* 1. Fermentation Metrics */}
                <div className="p-6 rounded-2xl border border-tan/15 bg-white/5 backdrop-blur-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-6 border-b border-tan/10 pb-4">
                    <Thermometer className="w-5 h-5 text-tan" />
                    <h4 className="font-serif text-lg text-tan">Fermentation Logs</h4>
                  </div>

                  <div className="space-y-6 flex-grow">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-tan/70">Final Temp</span>
                      <span className="font-mono text-2xl text-tan font-bold">65.0°F</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-tan/5 pt-4">
                      <span className="text-sm text-tan/70">Final Gravity</span>
                      <div className="text-right">
                        <span className="font-mono text-2xl text-tan font-bold">1.020 SG</span>
                        <span className="text-[10px] block text-emerald-400 uppercase font-mono">OG: 1.082 | Attenuation: 76%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Chemistry Profile */}
                <div className="p-6 rounded-2xl border border-tan/15 bg-white/5 backdrop-blur-sm flex flex-col">
                  <div className="flex items-center justify-between mb-6 border-b border-tan/10 pb-4">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-5 h-5 text-tan" />
                      <h4 className="font-serif text-lg text-tan">Water Chemistry</h4>
                    </div>
                  </div>

                  <div className="space-y-6 flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-tan/70">Mash Water pH</span>
                      <span className="font-mono text-xl text-emerald-400 font-bold">5.45 pH</span>
                    </div>
                    <Progress value={100} className="h-1.5 bg-white/10" />

                    <div className="space-y-4 border-t border-tan/5 pt-4">
                      <div className="flex justify-between text-xs font-mono text-tan/60">
                        <span>Chloride (Cl⁻)</span>
                        <span>120 ppm (Target: 120)</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono text-tan/60 border-t border-tan/5 pt-2">
                        <span>Sulfate (SO₄²⁻)</span>
                        <span>40 ppm (Target: 40)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Mash Bill */}
                <div className="p-6 rounded-2xl border border-tan/15 bg-white/5 backdrop-blur-sm flex flex-col">
                  <div className="flex items-center gap-2 mb-6 border-b border-tan/10 pb-4">
                    <Layers className="w-5 h-5 text-tan" />
                    <h4 className="font-serif text-lg text-tan">Mash Bill (Grain Profile)</h4>
                  </div>

                  <div className="space-y-4 flex-grow font-mono text-sm text-tan/80">
                    <div className="flex justify-between border-b border-tan/5 pb-2">
                      <span>Maris Otter Malt</span>
                      <span>72%</span>
                    </div>
                    <div className="flex justify-between border-b border-tan/5 pb-2">
                      <span>Flaked Oats</span>
                      <span>12%</span>
                    </div>
                    <div className="flex justify-between border-b border-tan/5 pb-2">
                      <span>Chocolate Malt</span>
                      <span>10%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Roasted Barley</span>
                      <span>6%</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Raw JSON telemetry data Dialog trigger */}
          <div className="mt-12 text-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-tan/40 hover:text-tan/80 cursor-pointer transition-colors border border-tan/15 px-4 py-2 rounded-lg bg-black/10">
                  <Info className="w-3.5 h-3.5" /> [system-telemetry-protocol: active-keg-logs.json]
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-cream text-forest border border-tan max-w-sm p-4 font-mono text-xs">
                <p className="font-bold text-sm mb-2">RAW BREW LOG PAYLOAD:</p>
                <pre className="text-[10px] leading-relaxed text-forest/80">
{`{
  "batchId": "ITB-COLD-042",
  "fermentTempSensor": "FC-01",
  "tiltGravitySg": 1.0112,
  "lastIngestTimestamp": "2024-10-14T21:42:00Z"
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
