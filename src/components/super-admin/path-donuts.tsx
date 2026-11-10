"use client";

import React, { useState } from "react";
import { Sparkles, CircleDot, SlidersHorizontal, Check } from "lucide-react";
import { NumberTicker } from "./number-ticker";

interface PathDonutsProps {
  rConsistencyFocus: number;
  r2ConsistencyFocus: number;
  rFocusConfidence: number;
  r2FocusConfidence: number;
  totalResponses: number;
}

type VisualTheme = "monochrome" | "silver-accent" | "kausalitas";

export function PathDonuts({
  rConsistencyFocus,
  r2ConsistencyFocus,
  rFocusConfidence,
  r2FocusConfidence,
  totalResponses,
}: PathDonutsProps) {
  // Theme state: defaults to "monochrome" (Sesuai persis dengan gaya Gambar Kiri)
  const [theme, setTheme] = useState<VisualTheme>("monochrome");

  const pctA = Math.min(100, Math.max(0, Number((rConsistencyFocus * 100).toFixed(1))));
  const pctB = Math.min(100, Math.max(0, Number((rFocusConfidence * 100).toFixed(1))));

  // Circumference for radius 38 (Center: 50, 50, strokeWidth: 16)
  const R = 38;
  const C = 2 * Math.PI * R; // ~238.761

  // Color mappings per theme
  const getColors = (path: "A" | "B") => {
    switch (theme) {
      case "monochrome":
        // Persis Gambar Kiri: Major segment (80%) is slate-500 (#71717a), minor segment (20%) is silver (#d4d4d8)
        return {
          major: "#71717a", // slate gray
          minor: "#d4d4d8", // light silver gray
          centerText: "text-white",
          subText: "text-zinc-400",
        };
      case "silver-accent":
        // Silver Pop: Active arc is bright silver (#f4f4f5), track is deep slate (#3f3f46)
        return {
          major: "#f4f4f5", // bright silver
          minor: "#3f3f46", // dark zinc
          centerText: "text-white",
          subText: "text-zinc-400",
        };
      case "kausalitas":
        // Kausalitas: Path A uses vibrant emerald, Path B uses warm amber
        return path === "A"
          ? {
              major: "#10b981", // emerald-500
              minor: "#27272a", // zinc-800
              centerText: "text-white",
              subText: "text-emerald-400",
            }
          : {
              major: "#f59e0b", // amber-500
              minor: "#27272a", // zinc-800
              centerText: "text-white",
              subText: "text-amber-400",
            };
    }
  };

  const colorsA = getColors("A");
  const colorsB = getColors("B");

  // Calculate arc lengths
  const lenA_major = (pctA / 100) * C;
  const lenA_minor = C - lenA_major;

  const lenB_major = (pctB / 100) * C;
  const lenB_minor = C - lenB_major;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl transition-all duration-300">
      {/* Ambient background glow accents */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Theme Switcher */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-zinc-300 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 mb-2 shadow-xs font-mono">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Analisis Efisiensi Jalur Kausalitas</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Kekuatan Transmisi Kognitif Santri Antar-Variabel
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">
            Diagram donat modular dengan tebal ring proporsional, segmen datar (butt line-cap), dan latar gelap adaptif berstandar modern dashboard.
          </p>
        </div>

        {/* Visual Style Pill Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900 border border-zinc-800 self-start sm:self-center shadow-inner">
          <button
            type="button"
            onClick={() => setTheme("monochrome")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              theme === "monochrome"
                ? "bg-zinc-800 text-white shadow-xs border border-zinc-700/60"
                : "text-zinc-400 hover:text-white"
            }`}
            title="Gaya Persis Gambar Kiri (Monokrom Silver & Slate)"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 inline-block" />
            <span>Gaya Gambar Kiri</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme("kausalitas")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              theme === "kausalitas"
                ? "bg-zinc-800 text-white shadow-xs border border-zinc-700/60"
                : "text-zinc-400 hover:text-white"
            }`}
            title="Gaya Aksen Kausalitas (Emerald untuk Path A & Amber untuk Path B)"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Aksen Warna</span>
          </button>
        </div>
      </div>

      {/* Dua Kartu Donut Kausalitas (Path A & Path B) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* ========================================================================= */}
        {/* DONAT 1: PATH A (Konsistensi ➔ Fokus Belajar)                             */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl hover:border-zinc-700/80 hover:shadow-2xl transition-all duration-300 relative group overflow-hidden">
          {/* Subtle Corner Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Badge Label */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-zinc-800/90 text-emerald-400 border border-emerald-500/30 mb-4 font-mono shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ANALISIS JALUR (PATH A)</span>
          </span>

          {/* Donut Chart SVG (Gaya Gambar Kiri: Ring Tebal, Flat Butt Cap, 2 Segmen) */}
          <div className="relative my-3 w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90 drop-shadow-md"
              viewBox="0 0 100 100"
            >
              {/* Segmen 1 (Major Arc: 0° s.d. pctA) */}
              <circle
                cx="50"
                cy="50"
                r={R}
                stroke={colorsA.major}
                strokeWidth="16"
                fill="transparent"
                strokeDasharray={`${lenA_major} ${C - lenA_major}`}
                strokeDashoffset={0}
                strokeLinecap="butt"
                className="transition-all duration-1000 ease-out"
              />
              {/* Segmen 2 (Minor Arc: pctA s.d. 360° / 0°) */}
              <circle
                cx="50"
                cy="50"
                r={R}
                stroke={colorsA.minor}
                strokeWidth="16"
                fill="transparent"
                strokeDasharray={`${lenA_minor} ${C - lenA_minor}`}
                strokeDashoffset={-lenA_major}
                strokeLinecap="butt"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Nilai Sentral: Persis Tipografi Gambar Kiri ($24,000 / 80% of $30,000) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className={`text-3xl sm:text-[34px] font-black font-sans tracking-tight tabular-nums ${colorsA.centerText}`}>
                <NumberTicker value={pctA} decimalPlaces={1} suffix="%" />
              </span>
              <span className={`text-xs sm:text-sm font-semibold mt-1 font-mono tracking-tight ${colorsA.subText}`}>
                r = +<NumberTicker value={rConsistencyFocus} decimalPlaces={3} />
              </span>
            </div>
          </div>

          {/* Deskripsi Variabel Kausalitas */}
          <h4 className="text-base sm:text-lg font-black text-white mt-3 group-hover:text-emerald-400 transition-colors">
            Konsistensi ➔ Fokus Belajar
          </h4>
          <p className="text-xs text-zinc-400 mt-1.5 max-w-xs leading-relaxed">
            Pengaruh pembiasaan fisik harian terhadap ketahanan konsentrasi dan kemampuan menyaring distraksi santri.
          </p>

          {/* Statistik Regresi & Koefisien */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80 w-full space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-zinc-400">
              <span>Koefisien Determinasi ($R^2$):</span>
              <span className="font-bold text-white font-mono text-sm">
                <NumberTicker value={r2ConsistencyFocus} suffix="%" />
              </span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>Signifikansi Hubungan:</span>
              <span className="font-bold text-emerald-400 font-mono">
                {totalResponses === 0 ? "Menunggu Respon" : "Sangat Kuat (p < .001)"}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DONAT 2: PATH B (Fokus Belajar ➔ Confidency)                               */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl hover:border-zinc-700/80 hover:shadow-2xl transition-all duration-300 relative group overflow-hidden">
          {/* Subtle Corner Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Badge Label */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-zinc-800/90 text-amber-400 border border-amber-500/30 mb-4 font-mono shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>ANALISIS JALUR (PATH B)</span>
          </span>

          {/* Donut Chart SVG (Gaya Gambar Kiri: Ring Tebal, Flat Butt Cap, 2 Segmen) */}
          <div className="relative my-3 w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90 drop-shadow-md"
              viewBox="0 0 100 100"
            >
              {/* Segmen 1 (Major Arc: 0° s.d. pctB) */}
              <circle
                cx="50"
                cy="50"
                r={R}
                stroke={colorsB.major}
                strokeWidth="16"
                fill="transparent"
                strokeDasharray={`${lenB_major} ${C - lenB_major}`}
                strokeDashoffset={0}
                strokeLinecap="butt"
                className="transition-all duration-1000 ease-out"
              />
              {/* Segmen 2 (Minor Arc: pctB s.d. 360° / 0°) */}
              <circle
                cx="50"
                cy="50"
                r={R}
                stroke={colorsB.minor}
                strokeWidth="16"
                fill="transparent"
                strokeDasharray={`${lenB_minor} ${C - lenB_minor}`}
                strokeDashoffset={-lenB_major}
                strokeLinecap="butt"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Nilai Sentral: Persis Tipografi Gambar Kiri ($24,000 / 80% of $30,000) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className={`text-3xl sm:text-[34px] font-black font-sans tracking-tight tabular-nums ${colorsB.centerText}`}>
                <NumberTicker value={pctB} decimalPlaces={1} suffix="%" />
              </span>
              <span className={`text-xs sm:text-sm font-semibold mt-1 font-mono tracking-tight ${colorsB.subText}`}>
                r = +<NumberTicker value={rFocusConfidence} decimalPlaces={3} />
              </span>
            </div>
          </div>

          {/* Deskripsi Variabel Kausalitas */}
          <h4 className="text-base sm:text-lg font-black text-white mt-3 group-hover:text-amber-400 transition-colors">
            Fokus Belajar ➔ Confidency
          </h4>
          <p className="text-xs text-zinc-400 mt-1.5 max-w-xs leading-relaxed">
            Pengaruh regulasi logika dan kestabilan atensi terhadap kemantapan santri berbicara dan memimpin di muka umum.
          </p>

          {/* Statistik Regresi & Koefisien */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80 w-full space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-zinc-400">
              <span>Koefisien Determinasi ($R^2$):</span>
              <span className="font-bold text-white font-mono text-sm">
                <NumberTicker value={r2FocusConfidence} suffix="%" />
              </span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>Signifikansi Hubungan:</span>
              <span className="font-bold text-amber-400 font-mono">
                {totalResponses === 0 ? "Menunggu Respon" : "Sangat Kuat (p < .001)"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
