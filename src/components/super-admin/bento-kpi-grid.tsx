"use client";

import React from "react";
import {
  ShieldCheck,
  TrendingUp,
  Users,
  AlertTriangle,
  Layers,
  Activity,
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
      <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 relative rounded-2xl border border-slate-800 dark:border-zinc-800 bg-slate-900 dark:bg-zinc-900 p-6 sm:p-7 text-white shadow-sm flex flex-col justify-between">
        {/* Content */}
        <div className="flex flex-col justify-between h-full space-y-6">
          {/* Top Status & Live Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Ringkasan Eksekutif 7 KAIH</span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>Pembaruan Langsung</span>
            </div>
          </div>

          {/* Main Number Ticker & Title */}
          <div>
            <span className="text-xs font-medium text-slate-400 block mb-1">
              Indeks Komposit Vertikal (IKV)
            </span>
            <div className="flex items-baseline gap-3 flex-wrap">
              <div className="text-4xl sm:text-5xl font-semibold font-mono tracking-tight text-white">
                <NumberTicker value={ikvScore} suffix="%" />
              </div>
              <div className="text-sm text-slate-400 font-mono">
                (<NumberTicker value={avgWeightedScore} decimalPlaces={2} /> / 4.00)
              </div>
              <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5">
                {ikvStatus}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-300/80 max-w-xl leading-relaxed mt-2.5">
              Dihitung menggunakan algoritma multi-tier terbobot (Tier 1: ×3, Tier 2: ×2, Tier 3: ×1) memadukan pembiasaan ibadah mandiri, ketahanan fokus, dan unjuk percaya diri santri.
            </p>
          </div>

          {/* 3 Cognitive Pipeline Pillars (IK, IF, IC) */}
          <div className="pt-4 border-t border-slate-800 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* 1. Konsistensi (IK) */}
            <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
                <span>1. Konsistensi (IK)</span>
                <span className="text-[10px] text-slate-400 font-mono">Input</span>
              </div>
              <div className="text-lg font-semibold font-mono text-white">
                <NumberTicker value={consistencyPct} suffix="%" />
              </div>
              <div className="w-full bg-slate-700/60 rounded-full h-1 mt-2 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${consistencyPct}%` }} />
              </div>
            </div>

            {/* 2. Fokus Belajar (IF) */}
            <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
                <span>2. Fokus Belajar (IF)</span>
                <span className="text-[10px] text-slate-400 font-mono">Mediator</span>
              </div>
              <div className="text-lg font-semibold font-mono text-white">
                <NumberTicker value={focusPct} suffix="%" />
              </div>
              <div className="w-full bg-slate-700/60 rounded-full h-1 mt-2 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${focusPct}%` }} />
              </div>
            </div>

            {/* 3. Confidency (IC) */}
            <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
                <span>3. Confidency (IC)</span>
                <span className="text-[10px] text-slate-400 font-mono">Output</span>
              </div>
              <div className="text-lg font-semibold font-mono text-white">
                <NumberTicker value={confidencePct} suffix="%" />
              </div>
              <div className="w-full bg-slate-700/60 rounded-full h-1 mt-2 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${confidencePct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BENTO CELL: TOTAL RESPONDEN & PARTISIPASI (1X1)                        */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs transition-colors duration-150 hover:border-slate-300 dark:hover:border-zinc-700 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
            Total Responden
          </span>
          <div className="rounded-lg bg-slate-100 dark:bg-zinc-800 p-2 text-slate-600 dark:text-zinc-400">
            <Users className="h-4 w-4" />
          </div>
        </div>

        <div className="my-2">
          <div className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white font-mono">
            <NumberTicker value={totalResponses} />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 font-medium mt-1">
            <span>Partisipasi:</span>
            <span className="font-mono text-slate-900 dark:text-white font-semibold">{participationPct}%</span>
            <span className="text-[11px] text-slate-400">(dari 777 santri)</span>
          </div>
        </div>

        <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-500"
            style={{ width: `${participationPct}%` }}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BENTO CELL: DATA INTEGRITY & ANOMALY SENTINEL (1X1)                    */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs transition-colors duration-150 hover:border-slate-300 dark:hover:border-zinc-700 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
            Audit Integritas Data
          </span>
          <div className={`rounded-lg p-2 ${anomaliesCount > 0 ? "bg-amber-500/10 text-amber-600" : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400"}`}>
            {anomaliesCount > 0 ? <AlertTriangle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
          </div>
        </div>

        <div className="my-2">
          <div className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white font-mono">
            {anomaliesCount > 0 ? (
              <span className="text-amber-600 dark:text-amber-400">{anomaliesCount} Outlier</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400">100%</span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            {anomaliesCount > 0
              ? "Waktu isi <45 detik atau pola jawaban seragam"
              : "Seluruh respon valid dan diverifikasi"}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <Activity className="h-3 w-3 text-emerald-600" />
          <span>Filter Anomali Otomatis</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BENTO CELL: PILAR TERTINGGI (TOP DRIVER) (1X1)                         */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs transition-colors duration-150 hover:border-slate-300 dark:hover:border-zinc-700 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
            Pilar Tertinggi
          </span>
          <div className="rounded-lg bg-slate-100 dark:bg-zinc-800 p-2 text-slate-600 dark:text-zinc-400">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>

        <div className="my-2">
          <h5 className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={highestTheme.title}>
            {highestTheme.title}
          </h5>
          <div className="text-xs text-slate-600 dark:text-zinc-400 font-mono mt-1">
            Skor: <span className="font-semibold text-slate-900 dark:text-white"><NumberTicker value={highestTheme.score} decimalPlaces={2} /></span> / 4.0
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <Badge variant="outline" className="text-[10px] text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 font-normal">
            Kekuatan Utama
          </Badge>
          <span>Retensi Kokoh</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. BENTO CELL: PRIORITAS EVALUASI (1X1)                                   */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs transition-colors duration-150 hover:border-slate-300 dark:hover:border-zinc-700 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
            Prioritas Evaluasi
          </span>
          <div className="rounded-lg bg-slate-100 dark:bg-zinc-800 p-2 text-slate-600 dark:text-zinc-400">
            <Layers className="h-4 w-4" />
          </div>
        </div>

        <div className="my-2">
          <h5 className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={lowestTheme.title}>
            {lowestTheme.title}
          </h5>
          <div className="text-xs text-slate-600 dark:text-zinc-400 font-mono mt-1">
            Skor: <span className="font-semibold text-slate-900 dark:text-white"><NumberTicker value={lowestTheme.score} decimalPlaces={2} /></span> / 4.0
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <Badge variant="outline" className="text-[10px] text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 font-normal">
            Fokus Intervensi
          </Badge>
          <span>Rekomendasi BK</span>
        </div>
      </div>
    </div>
  );
}
