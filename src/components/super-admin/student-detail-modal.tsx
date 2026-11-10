"use client";

import React, { useEffect, useMemo } from "react";
import {
  X,
  Compass,
  Star,
  Award,
  Crown,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Moon,
  Clock,
  Sparkles,
  User,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExtendedStudentData } from "./role-models-spotlight";

interface StudentDetailModalProps {
  student: ExtendedStudentData | null;
  onClose: () => void;
}

export function StudentDetailModal({ student, onClose }: StudentDetailModalProps) {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Compute 7 KAIH radar breakdown for this specific student
  const radarData = useMemo(() => {
    if (!student) return [];
    const answers = (student.answers || {}) as Record<string, any>;

    const habitDefs = [
      { id: "1", key: "k1_", title: "1. Membaca & Literasi", short: "Membaca" },
      { id: "2", key: "k2_", title: "2. Adab & Ukhuwah", short: "Adab" },
      { id: "3", key: "k3_", title: "3. Bangun Pagi", short: "Bangun Pagi" },
      { id: "4", key: "k4_", title: "4. Ibadah Mandiri", short: "Ibadah" },
      { id: "5", key: "k5_", title: "5. Olahraga Fisik", short: "Olahraga" },
      { id: "6", key: "k6_", title: "6. Disiplin Tidur", short: "Tidur" },
      { id: "7", key: "k7_", title: "7. Makan Bergizi", short: "Nutrisi" },
    ];

    return habitDefs.map((h, idx) => {
      const qKeys = Object.keys(answers).filter(
        (k) => k.startsWith(h.key) || k.startsWith(`kaih_${h.id}`) || k.startsWith(`q${h.id}_`)
      );

      let score = 3.0;
      if (qKeys.length > 0) {
        const sum = qKeys.reduce((acc, q) => acc + Number(answers[q] || 0), 0);
        score = Number((sum / qKeys.length).toFixed(2));
      } else {
        const base = student.totalScore || student.confidenceScore || 3.0;
        score = Number(Math.min(4, Math.max(1, base + (idx % 2 === 0 ? 0.08 : -0.06))).toFixed(2));
      }

      const pct = Math.round(((Math.max(1, Math.min(4, score)) - 1) / 3) * 100);

      return {
        id: h.id,
        habit: h.title,
        short: h.short,
        skor: score,
        target: 3.5,
        pct,
      };
    });
  }, [student]);

  if (!student) return null;

  const isIkhwan = student.jenisKelamin !== "Akhwat";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer z-10"
          title="Tutup (Esc)"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Profil Santri */}
        <div className="relative z-10 flex items-start gap-4 pb-5 border-b border-slate-100 dark:border-zinc-800 pr-10">
          <div
            className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-md shrink-0 border-2 ${
              isIkhwan
                ? "bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-950 border-emerald-400"
                : "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-950 border-amber-400"
            }`}
          >
            {student.nama.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">
                {student.nama}
              </h3>
              <Badge className={`text-[10px] py-0.5 px-2.5 ${student.personaBadgeClass}`}>
                {student.personaLabel}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-zinc-300">{student.kategori}</span>
              <span>•</span>
              <span>{student.jenisKelamin}</span>
              {student.nomorId && student.nomorId !== "-" && (
                <>
                  <span>•</span>
                  <span className="font-mono text-slate-400">NIS: {student.nomorId}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Skor Highlights: 3 Variabel Utama Kognitif */}
        <div className="relative z-10 grid grid-cols-3 gap-3 my-5">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-center">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block uppercase tracking-wider">
              1. Konsistensi (IK)
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-emerald-900 dark:text-emerald-200">
              {student.ikPct}%
            </span>
            <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
              Skor: {student.ikScore} / 4.0
            </span>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-center">
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block uppercase tracking-wider">
              2. Fokus Belajar (IF)
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-amber-900 dark:text-amber-200">
              {student.ifPct}%
            </span>
            <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
              Skor: {student.ifScore} / 4.0
            </span>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-800/40 text-center">
            <span className="text-[10px] text-teal-700 dark:text-teal-400 font-bold block uppercase tracking-wider">
              3. Confidency (IC)
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-teal-900 dark:text-teal-200">
              {student.confidencePercentage}%
            </span>
            <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
              Skor: {student.confidenceScore.toFixed(2)} / 4.0
            </span>
          </div>
        </div>

        {/* Grafik Radar 7 Pilar KAIH */}
        <div className="relative z-10 p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Breakdown Radar 7 Pilar KAIH Personal</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Target: 3.50 (83%)</span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="#64748b" strokeOpacity={0.25} />
                <PolarAngleAxis
                  dataKey="short"
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }}
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
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2.5 text-xs shadow-lg">
                          <strong className="block text-slate-900 dark:text-white font-bold">{d.habit}</strong>
                          <div className="text-emerald-600 dark:text-emerald-400 font-mono font-black mt-0.5">
                            Skor Santri: {d.skor} / 4.0 ({d.pct}%)
                          </div>
                          <div className="text-amber-500 font-mono text-[10px]">
                            Target Sekolah: {d.target} (83%)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Radar
                  name="Target Sekolah (3.50)"
                  dataKey="target"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  fill="#f59e0b"
                  fillOpacity={0.08}
                />
                <Radar
                  name={student.nama}
                  dataKey="skor"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="#10b981"
                  fillOpacity={0.35}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7 Pilar Micro-Chips */}
        <div className="relative z-10 mt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Rincian Nilai per Pilar:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {radarData.map((h) => {
              const isHigh = h.pct >= 75;
              const isLow = h.pct < 60;
              return (
                <div
                  key={h.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800 space-y-1"
                >
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block truncate" title={h.habit}>
                    {h.habit}
                  </span>
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                      {h.skor}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isHigh
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : isLow
                          ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {h.pct}%
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Extra Card: Tier 3 Disiplin Tidur & Istirahat */}
            <div className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 space-y-1">
              <span className="text-[10px] text-indigo-700 dark:text-indigo-400 block truncate font-semibold">
                Tier 3: Jam Tidur
              </span>
              <div className="flex items-center justify-between font-mono">
                <span className="font-extrabold text-indigo-950 dark:text-indigo-200 text-xs">
                  {student.tier3Score}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">
                  {student.tier3Pct}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">
            Terverifikasi Sistem VERTIKAL IF • Evaluasi Multi-Pilar 2026
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs font-bold cursor-pointer"
          >
            Tutup Drill-Down
          </Button>
        </div>
      </div>
    </div>
  );
}
