"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Star,
  Award,
  Crown,
  Medal,
  Trash2,
  X,
  Compass,
  TrendingUp,
  UserCheck2,
  ChevronRight,
  Sparkles,
  ExternalLink,
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
import { Card, CardContent } from "@/components/ui/card";

export interface ExtendedStudentData {
  id: string;
  nama: string;
  kategori: string;
  jenisKelamin: string;
  nomorId: string;
  totalScore: number;
  durationSeconds?: number;
  confidenceScore: number;
  confidencePercentage: number;
  confidenceCategory?: string;
  topKaihFactor?: string;
  focusScore?: number;
  ikScore: number;
  ikPct: number;
  ifScore: number;
  ifPct: number;
  icScore: number;
  icPct: number;
  tier3Score: number;
  tier3Pct: number;
  persona: "anchored_leader" | "quiet_hafidz" | "fragile_performer" | "developing";
  personaLabel: string;
  personaBadgeClass: string;
  answers?: Record<string, number>;
}

interface RoleModelsSpotlightProps {
  students: ExtendedStudentData[];
  onDeleteStudent?: (id: string, name: string) => void;
  onRefresh?: () => void;
}

export function RoleModelsSpotlight({
  students,
  onDeleteStudent,
  onRefresh,
}: RoleModelsSpotlightProps) {
  const [filterCohort, setFilterCohort] = useState<string>("Semua");
  const [inspectedStudent, setInspectedStudent] = useState<ExtendedStudentData | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInspectedStudent(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtered and sorted students
  const filteredStudents = useMemo(() => {
    let list = [...students];
    if (filterCohort === "Ikhwan") list = list.filter((s) => s.jenisKelamin?.toLowerCase().includes("ikhwan"));
    if (filterCohort === "Akhwat") list = list.filter((s) => s.jenisKelamin?.toLowerCase().includes("akhwat"));
    if (filterCohort.startsWith("Kelas")) list = list.filter((s) => s.kategori.includes(filterCohort));

    // Sort by confidenceScore desc, then totalScore desc
    return list.sort((a, b) => b.confidenceScore - a.confidenceScore || b.totalScore - a.totalScore);
  }, [students, filterCohort]);

  const top3 = filteredStudents.slice(0, 3);
  const remaining = filteredStudents.slice(3, 15);

  // Compute student personal radar data for inspected student
  const studentRadarData = useMemo(() => {
    if (!inspectedStudent) return [];
    const answers = inspectedStudent.answers || {};

    const habitTitles: Record<string, string> = {
      kaih_1: "Membaca & Literasi",
      kaih_2: "Adab & Ukhuwah",
      kaih_3: "Bangun Pagi",
      kaih_4: "Ibadah Mandiri",
      kaih_5: "Olahraga Fisik",
      kaih_6: "Disiplin Tidur",
      kaih_7: "Makan Bergizi",
    };

    return Object.entries(habitTitles).map(([key, title], idx) => {
      // Find question keys for this theme
      const qKeys = Object.keys(answers).filter((k) => k.startsWith(key));
      let score = 3.2;
      if (qKeys.length > 0) {
        const sum = qKeys.reduce((acc, q) => acc + (answers[q] || 0), 0);
        score = Number((sum / qKeys.length).toFixed(2));
      } else {
        // Fallback proportional score based on student total
        score = Number(Math.min(4, Math.max(1, inspectedStudent.confidenceScore + (idx % 2 === 0 ? 0.1 : -0.1))).toFixed(2));
      }

      return {
        habit: title,
        skor: score,
        target: 3.5,
        pct: Math.round(((Math.max(1, Math.min(4, score)) - 1) / 3) * 100),
      };
    });
  }, [inspectedStudent]);

  return (
    <div className="space-y-5">
      {/* ========================================================================= */}
      {/* HEADER & FILTER INTERAKTIF CEPAT                                          */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400 shadow-xs border border-amber-500/20">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Papan Spotlight Santri Berkarakter Kuat (Role Models)</span>
              <Badge variant="gold" className="text-[10px] bg-amber-400 text-slate-950 font-black">
                Top Anchored Leaders
              </Badge>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Santri teladan dengan harmonisasi konsistensi ibadah fisik, ketahanan atensi, dan kemantapan confidency tertinggi.
            </p>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: "Semua", label: `Semua (${students.length})` },
            { id: "Ikhwan", label: "Ikhwan" },
            { id: "Akhwat", label: "Akhwat" },
            { id: "Kelas X", label: "Kelas X" },
            { id: "Kelas XI", label: "Kelas XI" },
            { id: "Kelas XII", label: "Kelas XII" },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setFilterCohort(pill.id)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterCohort === pill.id
                  ? "bg-amber-500 text-slate-950 shadow-xs font-black"
                  : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-slate-200"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {students.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border-2 border-dashed border-amber-300 dark:border-zinc-800 bg-amber-50/30 dark:bg-zinc-950/40 space-y-2">
          <Star className="h-8 w-8 text-amber-500 mx-auto" />
          <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">
            Belum ada santri teridentifikasi sebagai role model
          </p>
          <p className="text-xs text-slate-500">
            Respon kuesioner yang masuk akan otomatis dikalibrasi dan dimunculkan di papan ini.
          </p>
        </div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* HIERARKI PODIUM TOP 3 (GOLD, SILVER, BRONZE)                             */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {top3.map((student, idx) => {
              const isIkhwan = student.jenisKelamin !== "Akhwat";
              const isGold = idx === 0;
              const isSilver = idx === 1;
              const isBronze = idx === 2;

              const rankLabel = isGold
                ? "🥇 Juara 1 • Gold"
                : isSilver
                ? "🥈 Juara 2 • Silver"
                : "🥉 Juara 3 • Bronze";

              const cardRing = isGold
                ? "ring-2 ring-amber-400 dark:ring-amber-400/80 border-amber-300 dark:border-amber-500/50 shadow-lg shadow-amber-500/10"
                : isSilver
                ? "ring-1 ring-slate-300 dark:ring-zinc-500 border-slate-300 dark:border-zinc-700 shadow-md"
                : "ring-1 ring-amber-600/50 dark:ring-amber-700/60 border-amber-200 dark:border-amber-800 shadow-md";

              const badgeColor = isGold
                ? "bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950"
                : isSilver
                ? "bg-gradient-to-r from-slate-200 to-slate-100 text-slate-800"
                : "bg-gradient-to-r from-amber-600 to-amber-500 text-white";

              return (
                <div
                  key={student.id}
                  onClick={() => setInspectedStudent(student)}
                  className={`relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900/80 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group ${cardRing}`}
                >
                  {/* Podium Rank Pill */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono shadow-xs ${badgeColor}`}>
                      {rankLabel}
                    </span>
                    {onDeleteStudent && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteStudent(student.id, student.nama);
                        }}
                        title={`Hapus ${student.nama}`}
                        className="p-1 text-slate-400 hover:text-red-500 rounded-md transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Student Profile Info */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border-2 ${
                        isGold
                          ? "bg-amber-100 text-amber-900 border-amber-400 shadow-xs"
                          : isIkhwan
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-amber-100 text-amber-800 border-amber-300"
                      }`}
                    >
                      {student.nama.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 pr-2">
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm truncate group-hover:text-amber-500 transition-colors" title={student.nama}>
                        {student.nama}
                      </h4>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                        <span>{student.kategori}</span> • <span className="font-medium">{student.jenisKelamin}</span>
                      </div>
                      {student.nomorId && student.nomorId !== "-" && (
                        <div className="text-[10px] font-mono text-slate-400">
                          NIS: {student.nomorId}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Confidency Score */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                        Confidency Score:
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                          {student.confidenceScore.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400">/ 4.0</span>
                        <span className="text-xs font-bold text-amber-500">
                          ({student.confidencePercentage}%)
                        </span>
                      </div>
                    </div>

                    {/* IK, IF, IC Tri-Metric */}
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                      <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-lg p-1 border border-emerald-200/60 dark:border-emerald-800/40">
                        <span className="text-emerald-700 dark:text-emerald-400 block text-[9px] font-semibold">IK (Aksi)</span>
                        <span className="font-bold font-mono text-emerald-900 dark:text-emerald-200">{student.ikPct}%</span>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/40 rounded-lg p-1 border border-amber-200/60 dark:border-amber-800/40">
                        <span className="text-amber-700 dark:text-amber-400 block text-[9px] font-semibold">IF (Fokus)</span>
                        <span className="font-bold font-mono text-amber-900 dark:text-amber-200">{student.ifPct}%</span>
                      </div>
                      <div className="bg-teal-50 dark:bg-teal-950/40 rounded-lg p-1 border border-teal-200/60 dark:border-teal-800/40">
                        <span className="text-teal-700 dark:text-teal-400 block text-[9px] font-semibold">IC (Pede)</span>
                        <span className="font-bold font-mono text-teal-900 dark:text-teal-200">{student.icPct}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <Badge className={`text-[9px] py-0.5 px-2 ${student.personaBadgeClass}`}>
                        {student.personaLabel}
                      </Badge>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 group-hover:underline">
                        <span>Lihat Radar</span>
                        <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* RANK 4+ COMPACT VIEW (TABULAR LIST HEMAT RUANG)                          */}
          {/* ========================================================================= */}
          {remaining.length > 0 && (
            <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 backdrop-blur-md overflow-hidden shadow-sm">
              <div className="p-3.5 px-4 bg-slate-50/70 dark:bg-zinc-950/60 border-b border-slate-200/80 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="font-extrabold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  Daftar Santri Unggulan Berikutnya (Peringkat #4 s/d #{3 + remaining.length})
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Klik baris santri untuk melihat grafik radar</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 dark:border-zinc-800 text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 bg-slate-50/30 dark:bg-zinc-950/30">
                    <tr>
                      <th className="py-2.5 px-3.5 text-center">Rank</th>
                      <th className="py-2.5 px-3">Nama Santri</th>
                      <th className="py-2.5 px-3">Kelas &amp; Asrama</th>
                      <th className="py-2.5 px-3 text-center">Confidency</th>
                      <th className="py-2.5 px-3 text-center">IK • IF • IC</th>
                      <th className="py-2.5 px-3">Persona Karakter</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                    {remaining.map((student, idx) => {
                      const rankNum = idx + 4;
                      return (
                        <tr
                          key={student.id}
                          onClick={() => setInspectedStudent(student)}
                          className="hover:bg-amber-50/40 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                        >
                          <td className="py-2.5 px-3.5 text-center font-mono font-bold text-slate-500 dark:text-zinc-400">
                            #{rankNum}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                              {student.nama}
                            </span>
                            {student.nomorId && student.nomorId !== "-" && (
                              <span className="text-[10px] text-slate-400 block font-mono">NIS: {student.nomorId}</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-zinc-300">
                            {student.kategori} • <span className="font-semibold">{student.jenisKelamin}</span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono">
                            <span className="font-black text-emerald-600 dark:text-emerald-400">
                              {student.confidenceScore.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-1">({student.confidencePercentage}%)</span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-[11px] text-slate-600 dark:text-zinc-300">
                            {student.ikPct}% • {student.ifPct}% • {student.icPct}%
                          </td>
                          <td className="py-2.5 px-3">
                            <Badge className={`text-[9px] py-0.5 px-1.5 ${student.personaBadgeClass}`}>
                              {student.personaLabel}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 group-hover:underline">
                              <span>Radar</span>
                              <ChevronRight className="h-3 w-3" />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* MODAL DRILL-DOWN: RADAR BREAKDOWN PERSONAL 7 KAIH SANTRI                   */}
      {/* ========================================================================= */}
      {inspectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setInspectedStudent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100 dark:border-zinc-800 pr-8">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shrink-0">
                {inspectedStudent.nama.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {inspectedStudent.nama}
                  </h3>
                  <Badge className={`text-[10px] ${inspectedStudent.personaBadgeClass}`}>
                    {inspectedStudent.personaLabel}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  {inspectedStudent.kategori} • {inspectedStudent.jenisKelamin}
                  {inspectedStudent.nomorId && inspectedStudent.nomorId !== "-" && ` • NIS: ${inspectedStudent.nomorId}`}
                </p>
              </div>
            </div>

            {/* Skor Highlights Ringkasan */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-center">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block uppercase tracking-wider">
                  1. Konsistensi (IK)
                </span>
                <span className="text-xl font-black font-mono text-emerald-900 dark:text-emerald-200">
                  {inspectedStudent.ikPct}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-center">
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block uppercase tracking-wider">
                  2. Fokus Belajar (IF)
                </span>
                <span className="text-xl font-black font-mono text-amber-900 dark:text-amber-200">
                  {inspectedStudent.ifPct}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/40 text-center">
                <span className="text-[10px] text-teal-700 dark:text-teal-400 font-bold block uppercase tracking-wider">
                  3. Confidency (IC)
                </span>
                <span className="text-xl font-black font-mono text-teal-900 dark:text-teal-200">
                  {inspectedStudent.icPct}%
                </span>
              </div>
            </div>

            {/* Personal Radar 7 KAIH Chart */}
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Grafik Radar Personal 7 Pilar KAIH</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Skala: 1.00 - 4.00</span>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={studentRadarData} outerRadius="72%">
                    <PolarGrid stroke="#64748b" strokeOpacity={0.25} />
                    <PolarAngleAxis
                      dataKey="habit"
                      tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
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
                            <div className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2 text-xs">
                              <strong className="block text-slate-900 dark:text-white">{d.habit}</strong>
                              <div className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                                Skor Santri: {d.skor} / 4.0 ({d.pct}%)
                              </div>
                              <div className="text-amber-500 font-mono text-[10px]">
                                Target Sekolah: {d.target}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Radar
                      name="Target Sekolah"
                      dataKey="target"
                      stroke="#f59e0b"
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                      fill="#f59e0b"
                      fillOpacity={0.08}
                    />
                    <Radar
                      name={inspectedStudent.nama}
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

            {/* Habit Score Chips */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {studentRadarData.map((h, i) => (
                <div key={i} className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block truncate">{h.habit}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{h.skor} / 4.0</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectedStudent(null)}
                className="text-xs font-bold"
              >
                Tutup Drill-down
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
