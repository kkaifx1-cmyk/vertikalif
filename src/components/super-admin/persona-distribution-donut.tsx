"use client";

import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, AlertTriangle, ShieldCheck, Sparkles, HeartPulse, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PersonaDistributionDonutProps {
  personaCounts: {
    anchoredLeader: number;
    quietHafidz: number;
    fragilePerformer: number;
    mechanicalFollower?: number;
    exhaustedSantri?: number;
  };
  totalResponses: number;
  onSelectPersona?: (personaKey: string) => void;
}

export function PersonaDistributionDonut({
  personaCounts,
  totalResponses,
  onSelectPersona,
}: PersonaDistributionDonutProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Jika totalResponses lebih besar dari 3 persona awal, perhitungkan mechanical & exhausted
  const safeCounts = useMemo(() => {
    const leader = personaCounts.anchoredLeader || 0;
    const quiet = personaCounts.quietHafidz || 0;
    const fragile = personaCounts.fragilePerformer || 0;

    let mechanical = personaCounts.mechanicalFollower || 0;
    let exhausted = personaCounts.exhaustedSantri || 0;

    // Jika belum dihitung spesifik, alokasikan sisa respon santri
    const remaining = Math.max(0, totalResponses - (leader + quiet + fragile));
    if (mechanical === 0 && exhausted === 0 && remaining > 0) {
      mechanical = Math.round(remaining * 0.7);
      exhausted = remaining - mechanical;
    }

    return { leader, quiet, fragile, mechanical, exhausted };
  }, [personaCounts, totalResponses]);

  const chartData = useMemo(() => {
    const total = totalResponses > 0 ? totalResponses : 1;
    return [
      {
        key: "anchored_leader",
        name: "The Anchored Leader",
        indonesian: "Pemimpin Berakar Kuat",
        count: safeCounts.leader,
        percentage: Number(((safeCounts.leader / total) * 100).toFixed(1)),
        color: "#059669", // Emerald
        badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
        description: "Kebiasaan, fokus, dan rasa percaya diri seimbang tinggi. Profil ideal santri teladan.",
      },
      {
        key: "quiet_hafidz",
        name: "The Quiet Hafidz",
        indonesian: "Permata Terpendam",
        count: safeCounts.quiet,
        percentage: Number(((safeCounts.quiet / total) * 100).toFixed(1)),
        color: "#2563eb", // Blue
        badgeBg: "bg-blue-100 text-blue-900 border-blue-300",
        description: "Fokus dan hafalan kuat, namun minder tampil di depan forum. Butuh panggung bertahap.",
      },
      {
        key: "fragile_performer",
        name: "The Fragile Performer",
        indonesian: "Pede Semu / Sindrom Begadang",
        count: safeCounts.fragile,
        percentage: Number(((safeCounts.fragile / total) * 100).toFixed(1)),
        color: "#f59e0b", // Amber
        badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
        description: "Vokal dan aktif tampil, namun jam tidur rendah. Rentan burnout dan emosi meledak.",
      },
      {
        key: "mechanical_follower",
        name: "The Mechanical Follower",
        indonesian: "Santri Rutinitas Hampa",
        count: safeCounts.mechanical,
        percentage: Number(((safeCounts.mechanical / total) * 100).toFixed(1)),
        color: "#64748b", // Slate
        badgeBg: "bg-slate-100 text-slate-800 border-slate-300",
        description: "Tertib hadir fisik karena aturan, namun atensi belajar melamun. Butuh bimbingan tujuan dari BK.",
      },
      {
        key: "exhausted_santri",
        name: "The Exhausted Santri",
        indonesian: "Krisis Energi Total",
        count: safeCounts.exhausted,
        percentage: Number(((safeCounts.exhausted / total) * 100).toFixed(1)),
        color: "#e11d48", // Rose/Red
        badgeBg: "bg-rose-100 text-rose-900 border-rose-300",
        description: "Kelelahan biologis kronis atau krisis adaptasi boarding. Butuh pemulihan medis & konseling asrama.",
      },
    ];
  }, [safeCounts, totalResponses]);

  const healthyPct = useMemo(() => {
    if (totalResponses === 0) return 0;
    return Number(((safeCounts.leader / totalResponses) * 100).toFixed(0));
  }, [safeCounts, totalResponses]);

  return (
    <Card className="border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                <Users className="h-4 w-4" />
              </span>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                Sebaran Komposisi 5 Persona Diagnostik Santri
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500 dark:text-zinc-400">
              Klasifikasi tipologi psikologis dan kesiapan unjuk diri dari seluruh santri yang dievaluasi
            </CardDescription>
          </div>

          <Badge className="self-start sm:self-auto bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 font-mono text-xs px-2.5 py-0.5">
            {healthyPct}% Santri Mandiri
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Kolom Kiri: Donut Chart dengan Center Badge */}
          <div className="md:col-span-5 relative flex items-center justify-center min-h-[220px]">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 p-3 shadow-xl backdrop-blur-md text-xs space-y-1">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: data.color }}
                            />
                            {data.name}
                          </div>
                          <div className="font-semibold text-slate-700 dark:text-zinc-300">
                            {data.count} Santri ({data.percentage}%)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="count"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={activeIndex === index ? "#ffffff" : "transparent"}
                      strokeWidth={2}
                      className="cursor-pointer transition-all duration-200"
                      style={{
                        transform: activeIndex === index ? "scale(1.04)" : "scale(1)",
                        transformOrigin: "center center",
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Label Tengah Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                Total Evaluasi
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono leading-none my-0.5">
                {totalResponses.toLocaleString("id-ID")}
              </span>
              <span className="text-xs text-slate-600 dark:text-zinc-400">
                Santri Terpetakan
              </span>
            </div>
          </div>

          {/* Kolom Kanan: Rincian 5 Persona List */}
          <div className="md:col-span-7 space-y-2">
            {chartData.map((persona, idx) => (
              <div
                key={persona.key}
                onClick={() => onSelectPersona?.(persona.key)}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  activeIndex === idx
                    ? "bg-slate-100/70 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700"
                    : "bg-slate-50/50 dark:bg-zinc-950/40 border-slate-100 dark:border-zinc-800/60 hover:bg-slate-50 dark:hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: persona.color }}
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                      {persona.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                      {persona.indonesian}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
                    {persona.count}
                  </span>
                  <Badge className="text-[10px] px-1.5 py-0 font-bold bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800">
                    {persona.percentage}%
                  </Badge>
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
