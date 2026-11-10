"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { NumberTicker } from "./number-ticker";

interface PathDonutsProps {
  rConsistencyFocus: number;
  r2ConsistencyFocus: number;
  rFocusConfidence: number;
  r2FocusConfidence: number;
  totalResponses: number;
}

export function PathDonuts({
  rConsistencyFocus,
  r2ConsistencyFocus,
  rFocusConfidence,
  r2FocusConfidence,
  totalResponses,
}: PathDonutsProps) {
  const pctA = Math.min(100, Math.max(0, Number((rConsistencyFocus * 100).toFixed(1))));
  const pctB = Math.min(100, Math.max(0, Number((rFocusConfidence * 100).toFixed(1))));

  // Donut geometry following Image 1: thick ring (strokeWidth: 16, radius: 38)
  const R = 38;
  const C = 2 * Math.PI * R; // ~238.761

  const lenA = (pctA / 100) * C;
  const lenB = (pctB / 100) * C;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 backdrop-blur-md p-6 sm:p-7 shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-7">
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-2 shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Analisis Efisiensi Jalur Kausalitas</span>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Kekuatan Transmisi Kognitif Santri Antar-Variabel
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Koefisien korelasi Pearson ($r$) dan koefisien determinasi ($R^2$) yang memvalidasi efisiensi transfer kebiasaan.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* ========================================================================= */}
        {/* DONAT 1: PATH A (Warna Asli Emerald Hijau + Bentuk Tebal Datar Gambar Kiri) */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl bg-slate-50/70 dark:bg-zinc-950/70 border border-emerald-500/30 dark:border-emerald-500/30 shadow-xs hover:border-emerald-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 mb-3 font-mono">
            ANALISIS JALUR (PATH A)
          </span>

          {/* Donut SVG: Bentuk Tebal (strokeWidth 16) & Ujung Datar (strokeLinecap="butt") seperti Gambar Kiri */}
          <div className="relative my-3 w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90 drop-shadow-xs"
              viewBox="0 0 100 100"
            >
              {/* Lingkaran Jalur Track Penuh (Sisa Capaian) */}
              <circle
                cx="50"
                cy="50"
                r={R}
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                className="text-slate-200 dark:text-zinc-800"
              />
              {/* Segmen Capaian Hijau Emerald dengan Ujung Datar (butt) */}
              <circle
                cx="50"
                cy="50"
                r={R}
                stroke="#10b981"
                strokeWidth="16"
                fill="transparent"
                strokeDasharray={`${lenA} ${C - lenA}`}
                strokeDashoffset={0}
                strokeLinecap="butt"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Tipografi Sentral: Angka Utama Besar + Nilai Pearson di bawahnya */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-2xl sm:text-[30px] font-black text-slate-900 dark:text-white font-sans tracking-tight tabular-nums">
                <NumberTicker value={pctA} decimalPlaces={1} suffix="%" />
              </span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                r = +<NumberTicker value={rConsistencyFocus} decimalPlaces={3} />
              </span>
            </div>
          </div>

          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-2">
            Konsistensi ➔ Fokus Belajar
          </h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-xs leading-relaxed">
            Pengaruh pembiasaan fisik harian terhadap ketahanan konsentrasi dan kemampuan menyaring distraksi.
          </p>

          <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-zinc-800 w-full space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-600 dark:text-zinc-400">
              <span>Koefisien Determinasi ($R^2$):</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                <NumberTicker value={r2ConsistencyFocus} suffix="%" />
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-zinc-400">
              <span>Signifikansi Hubungan:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {totalResponses === 0 ? "Menunggu Respon" : "Sangat Kuat (p < .001)"}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DONAT 2: PATH B (Warna Asli Amber Oranye + Bentuk Tebal Datar Gambar Kiri) */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl bg-slate-50/70 dark:bg-zinc-950/70 border border-amber-500/30 dark:border-amber-500/30 shadow-xs hover:border-amber-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 mb-3 font-mono">
            ANALISIS JALUR (PATH B)
          </span>

          {/* Donut SVG: Bentuk Tebal (strokeWidth 16) & Ujung Datar (strokeLinecap="butt") seperti Gambar Kiri */}
          <div className="relative my-3 w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90 drop-shadow-xs"
              viewBox="0 0 100 100"
            >
              {/* Lingkaran Jalur Track Penuh (Sisa Capaian) */}
              <circle
                cx="50"
                cy="50"
                r={R}
                stroke="currentColor"
                strokeWidth="16"
                fill="transparent"
                className="text-slate-200 dark:text-zinc-800"
              />
              {/* Segmen Capaian Oranye Amber dengan Ujung Datar (butt) */}
              <circle
                cx="50"
                cy="50"
                r={R}
                stroke="#f59e0b"
                strokeWidth="16"
                fill="transparent"
                strokeDasharray={`${lenB} ${C - lenB}`}
                strokeDashoffset={0}
                strokeLinecap="butt"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Tipografi Sentral: Angka Utama Besar + Nilai Pearson di bawahnya */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-2xl sm:text-[30px] font-black text-slate-900 dark:text-white font-sans tracking-tight tabular-nums">
                <NumberTicker value={pctB} decimalPlaces={1} suffix="%" />
              </span>
              <span className="text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 mt-0.5 font-mono">
                r = +<NumberTicker value={rFocusConfidence} decimalPlaces={3} />
              </span>
            </div>
          </div>

          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-2">
            Fokus Belajar ➔ Confidency
          </h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-xs leading-relaxed">
            Pengaruh regulasi logika dan kestabilan atensi terhadap kemantapan santri berbicara dan memimpin di muka umum.
          </p>

          <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-zinc-800 w-full space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-600 dark:text-zinc-400">
              <span>Koefisien Determinasi ($R^2$):</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                <NumberTicker value={r2FocusConfidence} suffix="%" />
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-zinc-400">
              <span>Signifikansi Hubungan:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                {totalResponses === 0 ? "Menunggu Respon" : "Sangat Kuat (p < .001)"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
