"use client";

import React, { useState, useMemo } from "react";
import { Activity, ArrowUpDown, ArrowDown, ArrowUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ItemData {
  name: string;
  val: number;
  pct: number;
}

interface DimensionData {
  name: string;
  score: number;
  pct: number;
  desc: string;
}

interface VariableDetailsBreakdownProps {
  consistencyItems: ItemData[];
  consistencySummary: { pct: number; avg: number };
  focusDimensions: DimensionData[];
  focusSummary: { pct: number; avg: number };
  confidenceItems: ItemData[];
  confidenceSummary: { pct: number; avg: number };
}

type SortOrder = "default" | "lowest" | "highest";

export function VariableDetailsBreakdown({
  consistencyItems,
  consistencySummary,
  focusDimensions,
  focusSummary,
  confidenceItems,
  confidenceSummary,
}: VariableDetailsBreakdownProps) {
  const [sortX, setSortX] = useState<SortOrder>("default");
  const [sortM, setSortM] = useState<SortOrder>("default");
  const [sortY, setSortY] = useState<SortOrder>("default");

  const sortedX = useMemo(() => {
    const list = [...consistencyItems];
    if (sortX === "lowest") return list.sort((a, b) => a.pct - b.pct);
    if (sortX === "highest") return list.sort((a, b) => b.pct - a.pct);
    return list;
  }, [consistencyItems, sortX]);

  const sortedM = useMemo(() => {
    const list = [...focusDimensions];
    if (sortM === "lowest") return list.sort((a, b) => a.pct - b.pct);
    if (sortM === "highest") return list.sort((a, b) => b.pct - a.pct);
    return list;
  }, [focusDimensions, sortM]);

  const sortedY = useMemo(() => {
    const list = [...confidenceItems];
    if (sortY === "lowest") return list.sort((a, b) => a.pct - b.pct);
    if (sortY === "highest") return list.sort((a, b) => b.pct - a.pct);
    return list;
  }, [confidenceItems, sortY]);

  const renderSortControls = (current: SortOrder, onChange: (val: SortOrder) => void) => (
    <div className="flex items-center gap-1 text-[10px]">
      <button
        type="button"
        onClick={() => onChange("default")}
        title="Urutan Indeks Standar"
        className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
          current === "default"
            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold"
            : "text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-800"
        }`}
      >
        Default
      </button>
      <button
        type="button"
        onClick={() => onChange("lowest")}
        title="Urutkan dari Skor Terendah (Titik Lemah)"
        className={`px-1.5 py-0.5 rounded flex items-center gap-0.5 transition-all cursor-pointer ${
          current === "lowest"
            ? "bg-red-500 text-white font-bold"
            : "text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-800"
        }`}
      >
        <ArrowDown className="h-2.5 w-2.5" />
        <span>Terendah</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("highest")}
        title="Urutkan dari Skor Tertinggi (Kekuatan)"
        className={`px-1.5 py-0.5 rounded flex items-center gap-0.5 transition-all cursor-pointer ${
          current === "highest"
            ? "bg-emerald-600 text-white font-bold"
            : "text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-800"
        }`}
      >
        <ArrowUp className="h-2.5 w-2.5" />
        <span>Tertinggi</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Rincian Capaian Indikator Variabel (Audit Titik Lemah &amp; Kekuatan)</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Gunakan tombol sortir untuk mengidentifikasi butir kebiasaan mana yang paling mendesak diintervensi oleh pembina asrama &amp; BK.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ========================================================================= */}
        {/* VARIABEL 1 (X): KONSISTENSI 7 BUTIR AKSI                                  */}
        {/* ========================================================================= */}
        <Card className="border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 backdrop-blur-md shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all">
          <CardHeader className="p-4 pb-3 border-b border-slate-100 dark:border-zinc-800 bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
                Variabel 1 (X: Input)
              </span>
              <Badge className="bg-emerald-600 text-white font-mono text-[10px]">
                {consistencySummary.pct}% ({consistencySummary.avg} / 4.0)
              </Badge>
            </div>
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              Konsistensi Tindakan (7 Butir Aksi)
            </CardTitle>
            <div className="pt-2 flex items-center justify-between border-t border-emerald-100/60 dark:border-emerald-900/30 mt-1">
              <span className="text-[10px] text-slate-400">Urutkan:</span>
              {renderSortControls(sortX, setSortX)}
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {sortedX.map((item, idx) => {
              const isWeak = item.pct < 70;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-medium truncate max-w-[190px] ${isWeak ? "text-amber-700 dark:text-amber-400 font-semibold" : "text-slate-700 dark:text-zinc-300"}`}>
                      {item.name}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {item.pct}% <span className="text-[10px] text-slate-400">({item.val})</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        isWeak ? "bg-amber-500" : "bg-emerald-600"
                      }`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* ========================================================================= */}
        {/* VARIABEL 2 (M): FOKUS BELAJAR (3 DIMENSI ATENSI KOGNITIF)                 */}
        {/* ========================================================================= */}
        <Card className="border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 backdrop-blur-md shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all">
          <CardHeader className="p-4 pb-3 border-b border-slate-100 dark:border-zinc-800 bg-amber-50/50 dark:bg-amber-950/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-mono">
                Variabel 2 (M: Mediator)
              </span>
              <Badge className="bg-amber-500 text-slate-950 font-mono text-[10px] font-black">
                {focusSummary.pct}% ({focusSummary.avg} / 4.0)
              </Badge>
            </div>
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              Fokus Belajar &amp; Regulasi (3 Dimensi)
            </CardTitle>
            <div className="pt-2 flex items-center justify-between border-t border-amber-100/60 dark:border-amber-900/30 mt-1">
              <span className="text-[10px] text-slate-400">Urutkan:</span>
              {renderSortControls(sortM, setSortM)}
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3.5">
            {sortedM.map((dim, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{dim.name}</span>
                  <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400">
                    {dim.pct}% <span className="text-[10px] text-slate-400">({dim.score})</span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${dim.pct}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  {dim.desc}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ========================================================================= */}
        {/* VARIABEL 3 (Y): CONFIDENCY NYATA (7 BUTIR UNJUK DIRI)                     */}
        {/* ========================================================================= */}
        <Card className="border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 backdrop-blur-md shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden hover:border-teal-500/40 transition-all">
          <CardHeader className="p-4 pb-3 border-b border-slate-100 dark:border-zinc-800 bg-teal-50/50 dark:bg-teal-950/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400 font-mono">
                Variabel 3 (Y: Output)
              </span>
              <Badge className="bg-teal-600 text-white font-mono text-[10px]">
                {confidenceSummary.pct}% ({confidenceSummary.avg} / 4.0)
              </Badge>
            </div>
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              Confidency Nyata (7 Butir Unjuk Diri)
            </CardTitle>
            <div className="pt-2 flex items-center justify-between border-t border-teal-100/60 dark:border-teal-900/30 mt-1">
              <span className="text-[10px] text-slate-400">Urutkan:</span>
              {renderSortControls(sortY, setSortY)}
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {sortedY.map((item, idx) => {
              const isWeak = item.pct < 70;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-medium truncate max-w-[190px] ${isWeak ? "text-amber-700 dark:text-amber-400 font-semibold" : "text-slate-700 dark:text-zinc-300"}`}>
                      {item.name}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {item.pct}% <span className="text-[10px] text-slate-400">({item.val})</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        isWeak ? "bg-amber-500" : "bg-teal-600"
                      }`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
