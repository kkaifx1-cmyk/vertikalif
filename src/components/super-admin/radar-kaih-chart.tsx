"use client";

import React, { useState, useMemo } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import { Compass, TrendingUp, BarChart3, Target, Sparkles, Award, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NumberTicker } from "./number-ticker";

interface ThemeAverage {
  id?: string;
  themeId?: string;
  title: string;
  average: number;
  count?: number;
}

interface RadarKaihChartProps {
  themeAverages: ThemeAverage[];
  schoolTarget?: number; // e.g. 3.50
  baselineScore?: number; // e.g. 2.80
}

const THEME_COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#06b6d4", "#f97316", "#6366f1"];

export function RadarKaihChart({
  themeAverages,
  schoolTarget = 3.5,
  baselineScore = 2.85,
}: RadarKaihChartProps) {
  const [chartMode, setChartMode] = useState<"radar" | "line" | "bar">("radar");

  // Transform theme averages to radar data format with short labels
  const radarData = useMemo(() => {
    const labelMap: Record<string, string> = {
      kaih_1: "1. Membaca & Literasi",
      kaih_2: "2. Adab & Ukhuwah",
      kaih_3: "3. Bangun Pagi",
      kaih_4: "4. Ibadah Mandiri",
      kaih_5: "5. Olahraga Fisik",
      kaih_6: "6. Disiplin Tidur",
      kaih_7: "7. Makan Bergizi",
    };

    return (themeAverages || []).map((t, idx) => {
      const key = t.themeId || t.id || `kaih_${idx + 1}`;
      // Derive short title
      let shortLabel = labelMap[key];
      if (!shortLabel) {
        const parts = t.title.split(":");
        shortLabel = parts.length > 1 ? parts[1].trim() : parts[0];
        if (shortLabel.length > 18) shortLabel = shortLabel.substring(0, 16) + "…";
      }

      return {
        id: key,
        fullTitle: t.title,
        subject: shortLabel,
        actual: Number(t.average.toFixed(2)),
        target: schoolTarget,
        baseline: baselineScore,
        pct: Math.round(((Math.max(1, Math.min(4, t.average)) - 1) / 3) * 100),
      };
    });
  }, [themeAverages, schoolTarget, baselineScore]);

  // Insights calculation
  const highestPillar = useMemo(() => {
    if (radarData.length === 0) return null;
    return [...radarData].sort((a, b) => b.actual - a.actual)[0];
  }, [radarData]);

  const lowestPillar = useMemo(() => {
    if (radarData.length === 0) return null;
    return [...radarData].sort((a, b) => a.actual - b.actual)[0];
  }, [radarData]);

  const avgComposite = useMemo(() => {
    if (radarData.length === 0) return 0;
    const sum = radarData.reduce((acc, curr) => acc + curr.actual, 0);
    return Number((sum / radarData.length).toFixed(2));
  }, [radarData]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 backdrop-blur-md p-5 sm:p-6 shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-emerald-500/40">
      {/* Ambient corner glow */}
      <div className="absolute -top-16 -right-16 w-60 h-60 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
            <Compass className="h-3 w-3" />
            <span>Pemetaan Holistik 7 Pilar KAIH</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Radar Analisis Karakter &amp; Kebiasaan Santri</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Membandingkan capaian aktual santri terhadap Target Keunggulan ({schoolTarget.toFixed(2)}) dan Standar Baseline ({baselineScore.toFixed(2)}).
          </p>
        </div>

        {/* View Switcher Buttons */}
        <div className="inline-flex rounded-xl border border-slate-200 dark:border-zinc-800 p-1 bg-slate-50 dark:bg-zinc-950/80 shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => setChartMode("radar")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
              chartMode === "radar"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Radar 7 Sumbu</span>
          </button>
          <button
            type="button"
            onClick={() => setChartMode("line")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
              chartMode === "line"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Garis</span>
          </button>
          <button
            type="button"
            onClick={() => setChartMode("bar")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
              chartMode === "bar"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Batang</span>
          </button>
        </div>
      </div>

      {/* Main Chart Visualization */}
      <div className="relative z-10 pt-4">
        <div className="h-[360px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === "radar" ? (
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="#64748b" strokeOpacity={0.25} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{
                    fontSize: 11,
                    fill: "#94a3b8",
                    fontWeight: 600,
                  }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[1, 4]}
                  stroke="#64748b"
                  strokeOpacity={0.3}
                  tick={{ fontSize: 9, fill: "#64748b" }}
                />

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const gap = (data.actual - data.target).toFixed(2);
                      const isAhead = Number(gap) >= 0;
                      return (
                        <div className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3 shadow-xl text-xs space-y-1.5 min-w-[200px]">
                          <div className="font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-1">
                            {data.fullTitle}
                          </div>
                          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                            <span>Capaian Aktual:</span>
                            <span className="font-mono text-sm">{data.actual} / 4.0 ({data.pct}%)</span>
                          </div>
                          <div className="flex items-center justify-between text-amber-500 font-medium text-[11px]">
                            <span>Target Sekolah:</span>
                            <span className="font-mono">{data.target} / 4.0</span>
                          </div>
                          <div className="flex items-center justify-between text-indigo-400 font-medium text-[11px]">
                            <span>Standar Baseline:</span>
                            <span className="font-mono">{data.baseline} / 4.0</span>
                          </div>
                          <div className="pt-1 border-t border-slate-100 dark:border-zinc-800 text-[10px] text-slate-500 dark:text-zinc-400">
                            Deviasi Target:{" "}
                            <span className={`font-mono font-bold ${isAhead ? "text-emerald-500" : "text-amber-500"}`}>
                              {isAhead ? `+${gap}` : gap} poin
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Layer 1: Baseline Nasional / Standar Min */}
                <Radar
                  name="Standar Baseline"
                  dataKey="baseline"
                  stroke="#818cf8"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  fill="#818cf8"
                  fillOpacity={0.06}
                />

                {/* Layer 2: Target Keunggulan Sekolah */}
                <Radar
                  name="Target Keunggulan Sekolah"
                  dataKey="target"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="#f59e0b"
                  fillOpacity={0.12}
                />

                {/* Layer 3: Capaian Aktual Santri (Highlight Utama) */}
                <Radar
                  name="Capaian Aktual Santri"
                  dataKey="actual"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="#10b981"
                  fillOpacity={0.35}
                />

                <Legend
                  wrapperStyle={{ paddingTop: "12px", fontSize: "11px" }}
                  formatter={(value) => (
                    <span className="text-slate-700 dark:text-zinc-300 font-semibold">{value}</span>
                  )}
                />
              </RadarChart>
            ) : chartMode === "line" ? (
              <LineChart data={radarData} margin={{ top: 15, right: 25, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b" strokeOpacity={0.2} />
                <XAxis
                  dataKey="subject"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={{ stroke: "#64748b", strokeOpacity: 0.3 }}
                  angle={-15}
                  textAnchor="end"
                  height={55}
                />
                <YAxis
                  domain={[1, 4]}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={{ stroke: "#64748b", strokeOpacity: 0.3 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    borderColor: "#27272a",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                    color: "#ffffff",
                  }}
                  formatter={(val: any) => [`${val} / 4.0`, "Skor"]}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }} />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Capaian Aktual Santri"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4, stroke: "#ffffff", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target Keunggulan (3.50)"
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  name="Standar Baseline (2.85)"
                  stroke="#818cf8"
                  strokeDasharray="2 2"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            ) : (
              <BarChart data={radarData} margin={{ top: 15, right: 25, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b" strokeOpacity={0.2} />
                <XAxis
                  dataKey="subject"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={{ stroke: "#64748b", strokeOpacity: 0.3 }}
                  angle={-15}
                  textAnchor="end"
                  height={55}
                />
                <YAxis
                  domain={[1, 4]}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={{ stroke: "#64748b", strokeOpacity: 0.3 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    borderColor: "#27272a",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                    color: "#ffffff",
                  }}
                  formatter={(val: any) => [`${val} / 4.0`, "Skor Rata-Rata"]}
                />
                <Bar dataKey="actual" name="Skor Capaian" radius={[6, 6, 0, 0]} maxBarSize={45}>
                  {radarData.map((_, index) => (
                    <Cell key={`bar-${index}`} fill={THEME_COLORS[index % THEME_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* 3 Micro-Badge Summary Pills */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/60 dark:border-zinc-800/80">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 dark:text-zinc-400 block font-semibold uppercase tracking-wider">
                Pilar Terkuat
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white truncate block">
                {highestPillar ? `${highestPillar.subject} (${highestPillar.actual})` : "-"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/60 dark:border-zinc-800/80">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Target className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 dark:text-zinc-400 block font-semibold uppercase tracking-wider">
                Area Intervensi
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white truncate block">
                {lowestPillar ? `${lowestPillar.subject} (${lowestPillar.actual})` : "-"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/60 dark:border-zinc-800/80">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 dark:text-zinc-400 block font-semibold uppercase tracking-wider">
                Rerata 7 KAIH
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white truncate block">
                <NumberTicker value={avgComposite} decimalPlaces={2} /> / 4.00
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
