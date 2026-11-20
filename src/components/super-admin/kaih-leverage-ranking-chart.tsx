"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Award, Zap, BrainCircuit, Info, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KaihImpactItem } from "@/lib/data-store";

interface KaihLeverageRankingChartProps {
  impactScheme: KaihImpactItem[];
}

export function KaihLeverageRankingChart({ impactScheme }: KaihLeverageRankingChartProps) {
  const [metricMode, setMetricMode] = useState<"impact" | "correlation">("impact");

  // Format data urut dari nilai terbesar ke terkecil
  const chartData = useMemo(() => {
    const list = [...(impactScheme || [])];
    if (metricMode === "impact") {
      list.sort((a, b) => b.impactPercentage - a.impactPercentage);
    } else {
      list.sort((a, b) => b.correlationR - a.correlationR);
    }

    return list.map((item, idx) => ({
      id: item.kaihId,
      rank: idx + 1,
      shortTitle: item.shortTitle,
      fullTitle: item.kaihTitle,
      tier: item.tier,
      impactPct: item.impactPercentage,
      correlationR: item.correlationR,
      r2: item.rSquared,
      mechanism: item.mechanism,
      isTopTier: item.tier.includes("Tier 1") || idx < 2,
    }));
  }, [impactScheme, metricMode]);

  return (
    <Card className="border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                <Zap className="h-4 w-4" />
              </span>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                Ranking Daya Ungkit 7 KAIH terhadap Kepercayaan Diri
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500 dark:text-zinc-400">
              Menunjukkan pilar pembiasaan harian yang paling efektif mengonversi ketahanan fokus menjadi keberanian nyata
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 p-0.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs font-medium self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setMetricMode("impact")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                metricMode === "impact"
                  ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              Kontribusi Relatif (%)
            </button>
            <button
              type="button"
              onClick={() => setMetricMode("correlation")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                metricMode === "correlation"
                  ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              Korelasi Pearson (r)
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-4">
        {/* Horizontal Bar Chart Recharts */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 35, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" opacity={0.6} />

              <XAxis
                type="number"
                domain={metricMode === "impact" ? [0, 25] : [0.4, 1.0]}
                tick={{ fill: "#64748b", fontSize: 11 }}
                unit={metricMode === "impact" ? "%" : ""}
                axisLine={{ stroke: "#cbd5e1" }}
              />

              <YAxis
                type="category"
                dataKey="shortTitle"
                tick={{ fill: "#334155", fontSize: 11, fontWeight: 700 }}
                width={125}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-2 max-w-[280px]">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-zinc-800 pb-1.5">
                          <span className="font-bold text-slate-900 dark:text-white">
                            #{data.rank} {data.shortTitle}
                          </span>
                          <Badge className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0 font-bold">
                            {data.tier}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 font-semibold">
                            <span>Kontribusi Pengaruh:</span>
                            <span className="font-mono font-bold">{data.impactPct}%</span>
                          </div>
                          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                            <span>Korelasi Pearson (r):</span>
                            <span className="font-mono font-bold">r = {data.correlationR}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                            <span>Koef. Determinasi (R²):</span>
                            <span>{data.r2}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-zinc-400 pt-1.5 border-t border-slate-100 dark:border-zinc-800 leading-relaxed italic">
                          &ldquo;{data.mechanism}&rdquo;
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Bar
                dataKey={metricMode === "impact" ? "impactPct" : "correlationR"}
                radius={[0, 6, 6, 0]}
                barSize={20}
              >
                {chartData.map((entry, index) => {
                  let fillColor = "#64748b"; // default slate
                  if (entry.isTopTier) {
                    fillColor = index === 0 ? "#f59e0b" : "#10b981"; // Gold for #1, Emerald for #2
                  } else if (entry.tier.includes("Tier 2")) {
                    fillColor = "#0d9488"; // Teal
                  }
                  return <Cell key={`cell-${index}`} fill={fillColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Golden Hook Insight Callout */}
        <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-400/40 text-xs flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-slate-700 dark:text-zinc-300 text-[11px] leading-relaxed">
            <strong>The Core Finding:</strong> Dua pilar dengan daya ungkit tertinggi adalah{" "}
            <span className="font-bold text-amber-700 dark:text-amber-400">Literasi Riset (KAIH 1)</span> dan{" "}
            <span className="font-bold text-emerald-700 dark:text-emerald-400">Al-Qur&apos;an (KAIH 4)</span>.
            Kombinasi antara kedalaman ilmu dan marwah spiritual menyumbang hampir <strong>40%</strong> dari total pembentukan rasa percaya diri santri.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
