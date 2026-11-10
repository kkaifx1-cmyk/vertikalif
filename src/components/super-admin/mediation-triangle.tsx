"use client";

import React from "react";
import { Sparkles, BrainCircuit, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MediationTriangleProps {
  consistencyPct: number;
  avgConsistency: number;
  focusPct: number;
  avgFocus: number;
  confidencePct: number;
  avgConfidence: number;
  rConsistencyFocus: number;
  rFocusConfidence: number;
  directEffect: number | string;
  mediationPct: number | string;
  pathStrength: string;
}

export function MediationTriangle({
  consistencyPct,
  avgConsistency,
  focusPct,
  avgFocus,
  confidencePct,
  avgConfidence,
  rConsistencyFocus,
  rFocusConfidence,
  directEffect,
  mediationPct,
  pathStrength,
}: MediationTriangleProps) {
  const rA = Number(rConsistencyFocus.toFixed(3));
  const rB = Number(rFocusConfidence.toFixed(3));
  const convA = Math.round(rConsistencyFocus * 100);
  const convB = Math.round(rFocusConfidence * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 backdrop-blur-md p-6 sm:p-7 shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300">
      {/* Ambient Glows */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-zinc-800 gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300 mb-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Arsitektur Kausalitas Baron &amp; Kenny / Hayes PROCESS</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Alur Segitiga Mediasi: Kebiasaan (X) ➔ Fokus (M) ➔ Confidency (Y)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Membuktikan secara empiris bahwa atensi belajar bertindak sebagai mediator penuh (<em>Full Mediator</em>) yang mengubah kedisiplinan fisik menjadi keberanian tampil.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-slate-50 dark:bg-zinc-950/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">Status Model:</span>
          <Badge className="bg-emerald-600 text-white font-extrabold text-[10px]">
            Mediasi Penuh ({mediationPct}%)
          </Badge>
        </div>
      </div>

      {/* Segitiga Mediasi Layout */}
      <div className="relative z-10 my-8">
        {/* Desktop / Tablet Triangle Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* ========================================================================= */}
          {/* TAHAP 1 (KIRI): INPUT VARIABEL X                                          */}
          {/* ========================================================================= */}
          <div className="md:mt-16 flex flex-col items-center">
            <div className="w-full p-5 sm:p-6 rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-50/70 via-white to-white dark:from-emerald-950/40 dark:via-zinc-900/90 dark:to-zinc-900 text-center space-y-2.5 shadow-sm hover:shadow-md transition-all duration-300">
              <Badge className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 shadow-xs">
                Tahap 1: Variabel X (Input)
              </Badge>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                Konsistensi 7 KAIH
              </h4>
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                {consistencyPct}%
              </div>
              <div className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                Skor: <strong>{avgConsistency}</strong> / 4.00
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 pt-1 border-t border-slate-100 dark:border-zinc-800">
                Kedisiplinan ibadah harian, qiyamul lail, tahfidz &amp; ritme fisik asrama (Butir #1)
              </p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAHAP 2 (TENGAH ATAS): MEDIATOR VARIABEL M                                */}
          {/* ========================================================================= */}
          <div className="flex flex-col items-center">
            {/* Jalur A Indicator Pill (X -> M) */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold font-mono mb-3 shadow-xs">
              <span>Jalur a: r = +{rA}</span>
              <span className="text-[10px] opacity-75">({convA}%)</span>
            </div>

            <div className="w-full p-5 sm:p-6 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-50/70 via-white to-white dark:from-amber-950/40 dark:via-zinc-900/90 dark:to-zinc-900 text-center space-y-2.5 shadow-sm hover:shadow-md transition-all duration-300 ring-2 ring-amber-400/20">
              <Badge className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 shadow-xs">
                Tahap 2: Variabel M (Mediator)
              </Badge>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                Fokus Belajar &amp; Regulasi Diri
              </h4>
              <div className="text-3xl sm:text-4xl font-black text-amber-500 font-mono tracking-tight">
                {focusPct}%
              </div>
              <div className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                Skor: <strong>{avgFocus}</strong> / 4.00
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 pt-1 border-t border-slate-100 dark:border-zinc-800">
                Inhibisi distraksi, kendali atensi selektif saat KBM, dan ketahanan kognitif (21 Butir)
              </p>
            </div>

            {/* Jalur B Indicator Pill (M -> Y) */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-bold font-mono mt-3 shadow-xs">
              <span>Jalur b: r = +{rB}</span>
              <span className="text-[10px] opacity-75">({convB}%)</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAHAP 3 (KANAN): OUTPUT VARIABEL Y                                        */}
          {/* ========================================================================= */}
          <div className="md:mt-16 flex flex-col items-center">
            <div className="w-full p-5 sm:p-6 rounded-2xl border-2 border-teal-500/40 bg-gradient-to-b from-teal-50/70 via-white to-white dark:from-teal-950/40 dark:via-zinc-900/90 dark:to-zinc-900 text-center space-y-2.5 shadow-sm hover:shadow-md transition-all duration-300">
              <Badge className="bg-teal-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 shadow-xs">
                Tahap 3: Variabel Y (Output)
              </Badge>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                Confidency Nyata Santri
              </h4>
              <div className="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400 font-mono tracking-tight">
                {confidencePct}%
              </div>
              <div className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                Skor: <strong>{avgConfidence}</strong> / 4.00
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 pt-1 border-t border-slate-100 dark:border-zinc-800">
                Keberanian memimpin musyawarah, tampil berbicara di panggung, &amp; kemantapan argumen
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DIRECT EFFECT (JALUR C') STRIP HORIZONTAL DI BAWAH                        */}
        {/* ========================================================================= */}
        <div className="mt-8 pt-5 border-t border-slate-200/80 dark:border-zinc-800/80">
          <div className="max-w-2xl mx-auto rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50/60 dark:bg-zinc-950/60 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-[10px] font-bold text-slate-700 dark:text-zinc-300">
                Jalur c&apos; (Direct Effect)
              </span>
              <span className="text-slate-600 dark:text-zinc-400 font-medium">
                Pengaruh langsung rutinitas tanpa mediasi fokus:
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono font-bold">
              <span className="text-slate-400 dark:text-zinc-500 line-through">Langsung</span>
              <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                {directEffect}% (Sisa Lemah)
              </span>
            </div>
          </div>
          <p className="text-[11px] text-center text-slate-400 dark:text-zinc-500 mt-2 italic">
            *Konfirmasi Hayes PROCESS: Jalur $c&apos;$ mendekati nol menandakan mediasi penuh sempurna ($a \times b = {pathStrength}$).
          </p>
        </div>
      </div>
    </div>
  );
}
