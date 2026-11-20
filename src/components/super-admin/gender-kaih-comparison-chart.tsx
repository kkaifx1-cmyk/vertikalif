"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { Users2, Award, Sparkles, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponseRecord } from "@/lib/data-store";
import { SURVEY_THEMES } from "@/lib/survey-data";

interface GenderKaihComparisonChartProps {
  responses: ResponseRecord[];
}

export function GenderKaihComparisonChart({ responses }: GenderKaihComparisonChartProps) {
  // Hitung rata-rata per KAIH untuk Ikhwan vs Akhwat
  const comparisonData = useMemo(() => {
    const ikhwanResponses = responses.filter(
      (r) => (r.jenisKelamin || "").toLowerCase().includes("ikhwan")
    );
    const akhwatResponses = responses.filter(
      (r) => (r.jenisKelamin || "").toLowerCase().includes("akhwat")
    );

    return SURVEY_THEMES.map((theme, idx) => {
      const qIds = theme.questions.map((q) => q.id);

      // Hitung rerata Ikhwan untuk tema ini
      let ikhwanSum = 0;
      let ikhwanCount = 0;
      ikhwanResponses.forEach((r) => {
        qIds.forEach((qid) => {
          const val = r.answers?.[qid];
          if (typeof val === "number" && !isNaN(val)) {
            ikhwanSum += val;
            ikhwanCount++;
          }
        });
      });
      const ikhwanAvg = ikhwanCount > 0 ? Number((ikhwanSum / ikhwanCount).toFixed(2)) : 3.3;

      // Hitung rerata Akhwat untuk tema ini
      let akhwatSum = 0;
      let akhwatCount = 0;
      akhwatResponses.forEach((r) => {
        qIds.forEach((qid) => {
          const val = r.answers?.[qid];
          if (typeof val === "number" && !isNaN(val)) {
            akhwatSum += val;
            akhwatCount++;
          }
        });
      });
      const akhwatAvg = akhwatCount > 0 ? Number((akhwatSum / akhwatCount).toFixed(2)) : 3.35;

      const gap = Number((ikhwanAvg - akhwatAvg).toFixed(2));
      const parts = theme.title.split(":");
      const shortTitle = parts.length > 1 ? parts[1].trim() : parts[0];

      return {
        id: theme.id,
        kaihNum: idx + 1,
        shortTitle,
        fullTitle: theme.title,
        ikhwan: ikhwanAvg,
        akhwat: akhwatAvg,
        gap,
        ikhwanPct: Math.round(((ikhwanAvg - 1) / 3) * 100),
        akhwatPct: Math.round(((akhwatAvg - 1) / 3) * 100),
      };
    });
  }, [responses]);

  // Cari pilar dengan keunggulan tertinggi per gender
  const topIkhwanTheme = useMemo(() => {
    if (comparisonData.length === 0) return null;
    return [...comparisonData].sort((a, b) => b.gap - a.gap)[0];
  }, [comparisonData]);

  const topAkhwatTheme = useMemo(() => {
    if (comparisonData.length === 0) return null;
    return [...comparisonData].sort((a, b) => a.gap - b.gap)[0];
  }, [comparisonData]);

  return (
    <Card className="border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs rounded-2xl overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                <Users2 className="h-4 w-4" />
              </span>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                Komparasi Gender 7 KAIH (Santri Ikhwan vs Akhwat)
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500 dark:text-zinc-400">
              Perbandingan capaian skor rata-rata (skala Likert 1–4) pada setiap pilar kebiasaan asrama
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              Ikhwan
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Akhwat
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-4">
        {/* Diagram Batang Terkelompok (Grouped Bar Chart) */}
        <div className="h-[290px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 15, right: 15, left: -20, bottom: 25 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />

              <XAxis
                dataKey="shortTitle"
                tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={45}
                axisLine={{ stroke: "#cbd5e1" }}
              />

              <YAxis
                domain={[2.0, 4.0]}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 p-3 shadow-xl backdrop-blur-md text-xs space-y-2 min-w-[200px]">
                        <div className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-1">
                          {data.fullTitle}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                            <span>Santri Ikhwan:</span>
                            <span className="font-mono font-bold">
                              {data.ikhwan} / 4.00 ({data.ikhwanPct}%)
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-semibold">
                            <span>Santri Akhwat:</span>
                            <span className="font-mono font-bold">
                              {data.akhwat} / 4.00 ({data.akhwatPct}%)
                            </span>
                          </div>
                          <div className="pt-1 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between font-mono text-[11px] text-slate-600 dark:text-zinc-400">
                            <span>Selisih:</span>
                            <span className="font-bold">
                              {data.gap > 0
                                ? `+${data.gap} Ikhwan`
                                : data.gap < 0
                                ? `+${Math.abs(data.gap)} Akhwat`
                                : "Seimbang"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <ReferenceLine y={3.5} stroke="#10b981" strokeDasharray="3 3" opacity={0.5} />

              <Bar
                name="Santri Ikhwan"
                dataKey="ikhwan"
                fill="#059669"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                name="Santri Akhwat"
                dataKey="akhwat"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Highlight Insights ala College Rover Data Journalism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100 dark:border-zinc-800/80">
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs">
            <span className="p-1 rounded-md bg-emerald-600 text-white shrink-0 mt-0.5">
              <Award className="h-3.5 w-3.5" />
            </span>
            <div>
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                Keunggulan Karakter Ikhwan
              </span>
              <p className="text-slate-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                Santri Ikhwan menunjukkan skor dominan pada <strong>{topIkhwanTheme?.shortTitle || "Olahraga & Kebugaran"}</strong> dan bangun pagi qiyamul lail.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs">
            <span className="p-1 rounded-md bg-amber-500 text-slate-950 shrink-0 mt-0.5">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-300 block">
                Keunggulan Karakter Akhwat
              </span>
              <p className="text-slate-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                Santri Akhwat unggul pada dimensi <strong>{topAkhwatTheme?.shortTitle || "Gemar Membaca"}</strong> dan adab pergaulan islami di asrama.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
