"use client";

import React from "react";
import {
  Award,
  ShieldCheck,
  TrendingUp,
  Users,
  AlertTriangle,
  Layers,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NumberTicker } from "./number-ticker";

interface BentoKpiGridProps {
  isLoading: boolean;
  totalResponses: number;
  participationPct: number; // Percentage of 777 students
  ikvScore: number;
  avgWeightedScore: number;
  ikvStatus: string;
  consistencyPct: number;
  focusPct: number;
  confidencePct: number;
  highestTheme: { title: string; score: number };
  lowestTheme: { title: string; score: number };
  anomaliesCount: number;
}

export function BentoKpiGrid({
  isLoading,
  totalResponses,
  participationPct,
  ikvScore,
  avgWeightedScore,
  ikvStatus,
  consistencyPct,
  focusPct,
  confidencePct,
  highestTheme,
  lowestTheme,
  anomaliesCount,
}: BentoKpiGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 animate-pulse">
        {/* Skeleton Hero Bento (Spans 2 cols, 2 rows) */}
        <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 rounded-2xl bg-slate-200/60 dark:bg-zinc-900/60 border border-slate-300/40 dark:border-zinc-800 p-6 sm:p-8 space-y-6 min-h-[340px]">
          <div className="h-6 w-48 bg-slate-300 dark:bg-zinc-800 rounded-full" />
          <div className="space-y-3">
            <div className="h-14 w-36 bg-slate-300 dark:bg-zinc-800 rounded-xl" />
            <div className="h-4 w-3/4 bg-slate-300 dark:bg-zinc-800 rounded-md" />
          </div>
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200 dark:border-zinc-800">
            <div className="h-16 bg-slate-300 dark:bg-zinc-800 rounded-xl" />
            <div className="h-16 bg-slate-300 dark:bg-zinc-800 rounded-xl" />
            <div className="h-16 bg-slate-300 dark:bg-zinc-800 rounded-xl" />
          </div>
        </div>

        {/* Skeleton 4 Small Bento Cards */}
        <div className="rounded-2xl bg-slate-200/60 dark:bg-zinc-900/60 border border-slate-300/40 dark:border-zinc-800 p-5 space-y-3 h-[160px]">
          <div className="h-4 w-24 bg-slate-300 dark:bg-zinc-800 rounded" />
          <div className="h-8 w-20 bg-slate-300 dark:bg-zinc-800 rounded-lg" />
          <div className="h-3 w-32 bg-slate-300 dark:bg-zinc-800 rounded" />
        </div>
        <div className="rounded-2xl bg-slate-200/60 dark:bg-zinc-900/60 border border-slate-300/40 dark:border-zinc-800 p-5 space-y-3 h-[160px]">
          <div className="h-4 w-24 bg-slate-300 dark:bg-zinc-800 rounded" />
          <div className="h-8 w-20 bg-slate-300 dark:bg-zinc-800 rounded-lg" />
          <div className="h-3 w-32 bg-slate-300 dark:bg-zinc-800 rounded" />
        </div>
        <div className="rounded-2xl bg-slate-200/60 dark:bg-zinc-900/60 border border-slate-300/40 dark:border-zinc-800 p-5 space-y-3 h-[160px]">
          <div className="h-4 w-24 bg-slate-300 dark:bg-zinc-800 rounded" />
          <div className="h-6 w-3/4 bg-slate-300 dark:bg-zinc-800 rounded-lg" />
          <div className="h-3 w-28 bg-slate-300 dark:bg-zinc-800 rounded" />
        </div>
        <div className="rounded-2xl bg-slate-200/60 dark:bg-zinc-900/60 border border-slate-300/40 dark:border-zinc-800 p-5 space-y-3 h-[160px]">
          <div className="h-4 w-24 bg-slate-300 dark:bg-zinc-800 rounded" />
          <div className="h-6 w-3/4 bg-slate-300 dark:bg-zinc-800 rounded-lg" />
          <div className="h-3 w-28 bg-slate-300 dark:bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* ========================================================================= */}
      {/* 1. HERO BENTO CARD: IKV & 7 KAIH COMPOSITE (SPANS 2 COLS, 2 ROWS)        */}
      {/* ========================================================================= */}
      <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 relative overflow-hidden rounded-2xl border border-emerald-500/30 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-950/80 via-zinc-900/90 to-zinc-950 p-6 sm:p-8 text-white shadow-xl dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-emerald-500/20 transition-all duration-300 hover:border-emerald-500/60 group">
        {/* Ambient Corner Glows */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-70" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
          {/* Top Status & Live Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-200">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
              <span>Executive Command Core • 7 KAIH</span>
            </div>

            {/* Tremor-style Live Indicator Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>LIVE TRANSMISSION</span>
            </div>
          </div>

          {/* Main Number Ticker & Title */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-300/90 block mb-1">
              Indeks Komposit Vertikal (IKV)
            </span>
            <div className="flex items-baseline gap-3 flex-wrap">
              <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-md">
                <NumberTicker value={ikvScore} suffix="%" />
              </div>
              <div className="text-sm sm:text-base text-zinc-300 font-mono">
                (<NumberTicker value={avgWeightedScore} decimalPlaces={2} /> / 4.00)
              </div>
              <Badge className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 shadow-sm">
                {ikvStatus}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300/90 max-w-xl leading-relaxed mt-2.5">
              Dihitung menggunakan algoritma multi-tier terbobot (Tier 1: ×3, Tier 2: ×2, Tier 3: ×1) memadukan pembiasaan ibadah mandiri, ketahanan fokus, dan unjuk percaya diri santri.
            </p>
          </div>

          {/* 3 Cognitive Pipeline Pillars (IK, IF, IC) */}
          <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* 1. Konsistensi (IK) */}
            <div className="rounded-xl bg-white/5 backdrop-blur-xs border border-white/10 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-300 text-[11px] font-medium mb-1">
                <span>1. Konsistensi (IK)</span>
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-emerald-400/40 text-emerald-200">
                  Input
                </Badge>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                <NumberTicker value={consistencyPct} suffix="%" />
              </div>
              <div className="w-full bg-white/10 rounded-full h-1 mt-2 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-700" style={{ width: `${consistencyPct}%` }} />
              </div>
            </div>

            {/* 2. Fokus Belajar (IF) */}
            <div className="rounded-xl bg-white/5 backdrop-blur-xs border border-white/10 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-amber-300 text-[11px] font-medium mb-1">
                <span>2. Fokus Belajar (IF)</span>
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-amber-400/40 text-amber-200">
                  Mediator
                </Badge>
              </div>
              <div className="text-xl font-bold font-mono text-amber-300">
                <NumberTicker value={focusPct} suffix="%" />
              </div>
              <div className="w-full bg-white/10 rounded-full h-1 mt-2 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full transition-all duration-700" style={{ width: `${focusPct}%` }} />
              </div>
            </div>

            {/* 3. Confidency (IC) */}
            <div className="rounded-xl bg-white/5 backdrop-blur-xs border border-white/10 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-teal-300 text-[11px] font-medium mb-1">
                <span>3. Confidency (IC)</span>
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-teal-400/40 text-teal-200">
                  Output
                </Badge>
              </div>
              <div className="text-xl font-bold font-mono text-teal-300">
                <NumberTicker value={confidencePct} suffix="%" />
              </div>
              <div className="w-full bg-white/10 rounded-full h-1 mt-2 overflow-hidden">
                <div className="bg-teal-400 h-full rounded-full transition-all duration-700" style={{ width: `${confidencePct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BENTO CELL: TOTAL RESPONDEN & PARTISIPASI (1X1)                        */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 backdrop-blur-md p-5 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Total Responden
          </span>
          <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
            <Users className="h-4 w-4" />
          </div>
        </div>

        <div className="my-2">
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
            <NumberTicker value={totalResponses} />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
            <span>Partisipasi:</span>
            <span className="font-mono text-slate-900 dark:text-white font-black">{participationPct}%</span>
            <span className="text-[10px] text-slate-400">(dari 777 Santri)</span>
          </div>
        </div>

        <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-700"
            style={{ width: `${participationPct}%` }}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BENTO CELL: DATA INTEGRITY & ANOMALY SENTINEL (1X1)                    */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 backdrop-blur-md p-5 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Audit Integritas Data
          </span>
          <div className={`rounded-xl p-2.5 ${anomaliesCount > 0 ? "bg-amber-500/15 text-amber-600" : "bg-emerald-500/10 text-emerald-600"}`}>
            {anomaliesCount > 0 ? <AlertTriangle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
          </div>
        </div>

        <div className="my-2">
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
            {anomaliesCount > 0 ? (
              <span className="text-amber-500 font-bold">{anomaliesCount} Outlier</span>
            ) : (
              <span className="text-emerald-500 font-bold">100%</span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            {anomaliesCount > 0
              ? "Terdeteksi waktu isi <45s / pola seragam"
              : "Seluruh respon valid & bebas spam klik"}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
          <Activity className="h-3 w-3 text-emerald-500" />
          <span>Realtime Anti-Spam Guard</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BENTO CELL: PILAR TERTINGGI (TOP DRIVER) (1X1)                         */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 backdrop-blur-md p-5 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Pilar Tertinggi
          </span>
          <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>

        <div className="my-2">
          <h5 className="text-base font-extrabold text-slate-900 dark:text-white truncate" title={highestTheme.title}>
            {highestTheme.title}
          </h5>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-bold font-mono mt-1">
            Skor: <NumberTicker value={highestTheme.score} decimalPlaces={2} /> / 4.0
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[9px] border-blue-500/20">
            Kekuatan Utama
          </Badge>
          <span>Retensi Kokoh</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. BENTO CELL: PRIORITAS EVALUASI (1X1)                                   */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 backdrop-blur-md p-5 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Prioritas Evaluasi
          </span>
          <div className="rounded-xl bg-orange-500/10 p-2.5 text-orange-600 dark:text-orange-400">
            <Layers className="h-4 w-4" />
          </div>
        </div>

        <div className="my-2">
          <h5 className="text-base font-extrabold text-slate-900 dark:text-white truncate" title={lowestTheme.title}>
            {lowestTheme.title}
          </h5>
          <div className="text-xs text-orange-600 dark:text-orange-400 font-bold font-mono mt-1">
            Skor: <NumberTicker value={lowestTheme.score} decimalPlaces={2} /> / 4.0
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-300 text-[9px] border-orange-500/20">
            Fokus Intervensi
          </Badge>
          <span>Rekomendasi BK</span>
        </div>
      </div>
    </div>
  );
}
