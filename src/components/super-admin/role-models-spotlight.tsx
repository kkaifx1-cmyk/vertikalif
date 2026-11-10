"use client";

import React, { useState, useMemo } from "react";
import {
  Star,
  Award,
  Crown,
  Trash2,
  ChevronRight,
  Sparkles,
  LayoutGrid,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NumberTicker } from "./number-ticker";
import { StudentDetailModal } from "./student-detail-modal";

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
  confidenceCategory: string;
  topKaihFactor: string;
  focusScore?: number;
  createdAt: string;
  feedback?: string;
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
  sessionBadge?: string;
  sessionName?: string;
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
}: RoleModelsSpotlightProps) {
  const [filterCohort, setFilterCohort] = useState<string>("Semua");
  const [viewMode, setViewMode] = useState<"podium" | "grid">("podium");
  const [inspectedStudent, setInspectedStudent] = useState<ExtendedStudentData | null>(null);

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

  return (
    <div className="space-y-5">
      {/* ========================================================================= */}
      {/* HEADER, FILTER INTERAKTIF CEPAT, & VIEW TOGGLE                            */}
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
              Santri teladan dengan harmonisasi konsistensi ibadah fisik, ketahanan atensi, dan kemantapan confidency tertinggi. Klik kartu untuk melihat <strong>Radar Breakdown Personal 7 Pilar KAIH</strong>.
            </p>
          </div>
        </div>

        {/* Action Controls: Filter Pills & View Mode Toggle */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-1">
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
                    : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* View Switcher (Podium vs Full Grid) */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setViewMode("podium")}
              title="Tampilan Podium Top 3 + Tabel Padat"
              className={`p-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === "podium"
                  ? "bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-xs font-bold"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-800"
              }`}
            >
              <Trophy className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-[11px]">Podium</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              title="Tampilan Kartu Grid Lengkap"
              className={`p-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-xs font-bold"
                  : "text-slate-500 dark:text-zinc-400 hover:text-slate-800"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-[11px]">Semua Kartu</span>
            </button>
          </div>
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
      ) : viewMode === "grid" ? (
        /* ========================================================================= */
        /* FULL GRID VIEW (SEMUA SANTRI ROLE MODEL DALAM BENTUK KARTU)              */
        /* ========================================================================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((student, idx) => {
            const isIkhwan = student.jenisKelamin !== "Akhwat";
            const isGold = idx === 0;
            const isSilver = idx === 1;
            const isBronze = idx === 2;

            const rankBadge = isGold
              ? "bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black"
              : isSilver
              ? "bg-gradient-to-r from-slate-200 to-slate-100 text-slate-800 font-bold"
              : isBronze
              ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold"
              : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-mono";

            const rankText = isGold
              ? "🥇 Juara 1 • Gold"
              : isSilver
              ? "🥈 Juara 2 • Silver"
              : isBronze
              ? "🥉 Juara 3 • Bronze"
              : `Peringkat #${idx + 1}`;

            return (
              <div
                key={student.id}
                onClick={() => setInspectedStudent(student)}
                className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-500/10"
              >
                {/* Podium Rank Pill */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono shadow-xs ${rankBadge}`}>
                    {rankText}
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
                    <h4
                      className="font-extrabold text-slate-900 dark:text-white text-sm truncate group-hover:text-amber-500 transition-colors"
                      title={student.nama}
                    >
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
                        <NumberTicker value={student.confidenceScore} decimalPlaces={2} />
                      </span>
                      <span className="text-xs text-slate-400">/ 4.0</span>
                      <span className="text-xs font-bold text-amber-500">
                        (<NumberTicker value={student.confidencePercentage} suffix="%" />)
                      </span>
                    </div>
                  </div>

                  {/* IK, IF, IC Tri-Metric */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-lg p-1 border border-emerald-200/60 dark:border-emerald-800/40">
                      <span className="text-emerald-700 dark:text-emerald-400 block text-[9px] font-semibold">IK (Aksi)</span>
                      <span className="font-bold font-mono text-emerald-900 dark:text-emerald-200">
                        <NumberTicker value={student.ikPct} suffix="%" />
                      </span>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/40 rounded-lg p-1 border border-amber-200/60 dark:border-amber-800/40">
                      <span className="text-amber-700 dark:text-amber-400 block text-[9px] font-semibold">IF (Fokus)</span>
                      <span className="font-bold font-mono text-amber-900 dark:text-amber-200">
                        <NumberTicker value={student.ifPct} suffix="%" />
                      </span>
                    </div>
                    <div className="bg-teal-50 dark:bg-teal-950/40 rounded-lg p-1 border border-teal-200/60 dark:border-teal-800/40">
                      <span className="text-teal-700 dark:text-teal-400 block text-[9px] font-semibold">IC (Pede)</span>
                      <span className="font-bold font-mono text-teal-900 dark:text-teal-200">
                        <NumberTicker value={student.icPct} suffix="%" />
                      </span>
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
      ) : (
        /* ========================================================================= */
        /* PODIUM TOP 3 + TABULAR LIST HEMAT RUANG                                   */
        /* ========================================================================= */
        <>
          {/* HIERARKI PODIUM TOP 3 (GOLD, SILVER, BRONZE) */}
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
                ? "bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black"
                : isSilver
                ? "bg-gradient-to-r from-slate-200 to-slate-100 text-slate-800 font-bold"
                : "bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold";

              return (
                <div
                  key={student.id}
                  onClick={() => setInspectedStudent(student)}
                  className={`relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900/80 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group hover:border-amber-400/50 hover:shadow-lg ${cardRing}`}
                >
                  {/* Podium Rank Pill */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono shadow-xs ${badgeColor}`}>
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
                      <h4
                        className="font-extrabold text-slate-900 dark:text-white text-sm truncate group-hover:text-amber-500 transition-colors"
                        title={student.nama}
                      >
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
                          <NumberTicker value={student.confidenceScore} decimalPlaces={2} />
                        </span>
                        <span className="text-xs text-slate-400">/ 4.0</span>
                        <span className="text-xs font-bold text-amber-500">
                          (<NumberTicker value={student.confidencePercentage} suffix="%" />)
                        </span>
                      </div>
                    </div>

                    {/* IK, IF, IC Tri-Metric */}
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                      <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-lg p-1 border border-emerald-200/60 dark:border-emerald-800/40">
                        <span className="text-emerald-700 dark:text-emerald-400 block text-[9px] font-semibold">IK (Aksi)</span>
                        <span className="font-bold font-mono text-emerald-900 dark:text-emerald-200">
                          <NumberTicker value={student.ikPct} suffix="%" />
                        </span>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/40 rounded-lg p-1 border border-amber-200/60 dark:border-amber-800/40">
                        <span className="text-amber-700 dark:text-amber-400 block text-[9px] font-semibold">IF (Fokus)</span>
                        <span className="font-bold font-mono text-amber-900 dark:text-amber-200">
                          <NumberTicker value={student.ifPct} suffix="%" />
                        </span>
                      </div>
                      <div className="bg-teal-50 dark:bg-teal-950/40 rounded-lg p-1 border border-teal-200/60 dark:border-teal-800/40">
                        <span className="text-teal-700 dark:text-teal-400 block text-[9px] font-semibold">IC (Pede)</span>
                        <span className="font-bold font-mono text-teal-900 dark:text-teal-200">
                          <NumberTicker value={student.icPct} suffix="%" />
                        </span>
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

          {/* RANK 4+ COMPACT VIEW (TABULAR LIST HEMAT RUANG) */}
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
                          className="hover:bg-amber-50/40 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer group hover:border-amber-400/50"
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
      {/* MODAL DRILL-DOWN RADAR 7 PILAR KAIH PERSONAL SANTRI                       */}
      {/* ========================================================================= */}
      <StudentDetailModal
        student={inspectedStudent}
        onClose={() => setInspectedStudent(null)}
      />
    </div>
  );
}
