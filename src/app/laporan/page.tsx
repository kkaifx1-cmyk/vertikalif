"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
  LabelList,
} from "recharts";
import {
  BookOpen,
  Users,
  Clock,
  Sparkles,
  HeartPulse,
  Moon,
  Flame,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  FileText,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Search,
  Activity,
  Zap,
  Layers,
  Compass,
  BarChart3,
  GraduationCap,
  Award,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CohortData {
  name: string;
  count: number;
  ikv: number;
  avgAction: number;
  avgFocus: number;
  avgConfidence: number;
  kaihScores: number[];
  dimScores: number[];
  correlations: number[];
  mediation: {
    pathA: number;
    pathB: number;
    pathCPrime: number;
    indirect: number;
    totalEffect: number;
    mediationPct: number;
  };
  personas: {
    anchoredLeader: number;
    quietHafidz: number;
    fragilePerformer: number;
    mechanicalFollower: number;
    exhaustedSantri: number;
    progressing: number;
  };
  categories: {
    sangatPede: number;
    pede: number;
    cukupPede: number;
    perluBimbingan: number;
  };
}

const KAIH_METADATA = [
  { id: 1, name: "Gemar Membaca & Riset", short: "Membaca", tier: "Tier 1 (Bobot 3)", color: "#059669", icon: BookOpen },
  { id: 2, name: "Bermasyarakat & Adab", short: "Bermasyarakat", tier: "Tier 1 (Bobot 3)", color: "#047857", icon: Users },
  { id: 3, name: "Bangun Pagi & Qiyam", short: "Bangun Pagi", tier: "Tier 2 (Bobot 2)", color: "#0284c7", icon: Clock },
  { id: 4, name: "Ibadah & Al-Qur'an", short: "Ibadah", tier: "Tier 2 (Bobot 2)", color: "#7c3aed", icon: Sparkles },
  { id: 5, name: "Olahraga & Kebugaran", short: "Olahraga", tier: "Tier 2 (Bobot 2)", color: "#d97706", icon: HeartPulse },
  { id: 6, name: "Istirahat & Jam Tidur", short: "Jam Tidur", tier: "Tier 3 (Bobot 1)", color: "#ea580c", icon: Moon },
  { id: 7, name: "Makan Sehat & Gizi", short: "Makan Sehat", tier: "Tier 3 (Bobot 1)", color: "#0d9488", icon: Flame },
];

const DESCRIPTIVE_TABLE = [
  { pilar: "KAIH 1 (Gemar Membaca & Riset)", mean: "72.12%", sd: "15.48%", median: "66.67%", min: "26.7%", max: "100.0%", status: "Perlu Ditingkatkan" },
  { pilar: "KAIH 2 (Bermasyarakat & Adab)", mean: "74.58%", sd: "15.12%", median: "73.33%", min: "13.3%", max: "100.0%", status: "Baik (Top Leverage)" },
  { pilar: "KAIH 3 (Bangun Pagi & Qiyam)", mean: "75.13%", sd: "14.74%", median: "73.33%", min: "6.7%", max: "100.0%", status: "Sangat Baik" },
  { pilar: "KAIH 4 (Ibadah & Al-Qur'an)", mean: "75.73%", sd: "14.39%", median: "73.33%", min: "26.7%", max: "100.0%", status: "Sangat Baik (Stabil)" },
  { pilar: "KAIH 5 (Olahraga & Kebugaran)", mean: "74.86%", sd: "15.58%", median: "73.33%", min: "6.7%", max: "100.0%", status: "Baik" },
  { pilar: "KAIH 6 (Istirahat & Jam Tidur)", mean: "73.89%", sd: "14.97%", median: "73.33%", min: "26.7%", max: "100.0%", status: "Cukup (Fondasi)" },
  { pilar: "KAIH 7 (Makan Sehat & Gizi)", mean: "77.35%", sd: "14.95%", median: "73.33%", min: "6.7%", max: "100.0%", status: "Tertinggi (Homeostasis)" },
  { pilar: "Confidency (Kepercayaan Diri)", mean: "74.14%", sd: "14.90%", median: "71.43%", min: "19.0%", max: "100.0%", status: "91.3% Positif" },
];

const TRAJECTORY_DATA = [
  { grade: "Kelas X (Baru)", confidency: 72.3, ikv: 73.0, anchoredLeaderPct: 19.0, exhaustedPct: 3.0 },
  { grade: "Kelas XI (Transisi)", confidency: 75.0, ikv: 75.2, anchoredLeaderPct: 25.7, exhaustedPct: 4.3 },
  { grade: "Kelas XII (Maturasi)", confidency: 80.4, ikv: 80.7, anchoredLeaderPct: 40.0, exhaustedPct: 0.0 },
];

const COHORT_DATA: Record<string, CohortData> = {
  all: {
    name: "Seluruh Santri (N=3.152)",
    count: 3152,
    ikv: 74.48,
    avgAction: 74.2,
    avgFocus: 75.23,
    avgConfidence: 74.14,
    kaihScores: [72.12, 74.58, 75.13, 75.73, 74.86, 73.89, 77.35],
    dimScores: [74.2, 73.03, 76.87, 75.8, 74.14],
    correlations: [0.7439, 0.7714, 0.6774, 0.7277, 0.7395, 0.7304, 0.6836],
    mediation: {
      pathA: 0.7957,
      pathB: 0.6984,
      pathCPrime: 0.1355,
      indirect: 0.5557,
      totalEffect: 0.6912,
      mediationPct: 80.4,
    },
    personas: {
      anchoredLeader: 742,
      quietHafidz: 24,
      fragilePerformer: 10,
      mechanicalFollower: 10,
      exhaustedSantri: 123,
      progressing: 2243,
    },
    categories: {
      sangatPede: 1472,
      pede: 1405,
      cukupPede: 273,
      perluBimbingan: 2,
    },
  },
  ikhwan: {
    name: "Santri Ikhwan (N=1.614)",
    count: 1614,
    ikv: 73.34,
    avgAction: 72.89,
    avgFocus: 74.13,
    avgConfidence: 73.26,
    kaihScores: [71.09, 72.71, 73.39, 74.46, 75.29, 73.15, 75.87],
    dimScores: [72.89, 72.23, 75.61, 74.56, 73.26],
    correlations: [0.7186, 0.7646, 0.6547, 0.6913, 0.7253, 0.7102, 0.678],
    mediation: {
      pathA: 0.7648,
      pathB: 0.6786,
      pathCPrime: 0.1424,
      indirect: 0.519,
      totalEffect: 0.6614,
      mediationPct: 78.47,
    },
    personas: {
      anchoredLeader: 326,
      quietHafidz: 10,
      fragilePerformer: 6,
      mechanicalFollower: 8,
      exhaustedSantri: 81,
      progressing: 1183,
    },
    categories: {
      sangatPede: 730,
      pede: 721,
      cukupPede: 162,
      perluBimbingan: 1,
    },
  },
  akhwat: {
    name: "Santriwati Akhwat (N=1.538)",
    count: 1538,
    ikv: 75.69,
    avgAction: 75.58,
    avgFocus: 76.39,
    avgConfidence: 75.06,
    kaihScores: [73.2, 76.55, 76.96, 77.07, 74.4, 74.67, 78.9],
    dimScores: [75.58, 73.87, 78.19, 77.11, 75.06],
    correlations: [0.7699, 0.7793, 0.7002, 0.7643, 0.7622, 0.7504, 0.6869],
    mediation: {
      pathA: 0.8262,
      pathB: 0.7197,
      pathCPrime: 0.1271,
      indirect: 0.5946,
      totalEffect: 0.7217,
      mediationPct: 82.39,
    },
    personas: {
      anchoredLeader: 416,
      quietHafidz: 14,
      fragilePerformer: 4,
      mechanicalFollower: 2,
      exhaustedSantri: 42,
      progressing: 1060,
    },
    categories: {
      sangatPede: 742,
      pede: 684,
      cukupPede: 111,
      perluBimbingan: 1,
    },
  },
  kelas_x: {
    name: "Kelas X (Santri Baru / N=1.018)",
    count: 1018,
    ikv: 73.01,
    avgAction: 72.91,
    avgFocus: 74.05,
    avgConfidence: 72.27,
    kaihScores: [70.03, 73.04, 74.44, 74.08, 73.24, 72.9, 76.52],
    dimScores: [72.91, 71.41, 75.66, 75.08, 72.27],
    correlations: [0.6703, 0.7163, 0.611, 0.6726, 0.6914, 0.6773, 0.6252],
    mediation: {
      pathA: 0.7708,
      pathB: 0.6245,
      pathCPrime: 0.1424,
      indirect: 0.4813,
      totalEffect: 0.6237,
      mediationPct: 77.18,
    },
    personas: {
      anchoredLeader: 193,
      quietHafidz: 13,
      fragilePerformer: 2,
      mechanicalFollower: 3,
      exhaustedSantri: 31,
      progressing: 776,
    },
    categories: {
      sangatPede: 424,
      pede: 513,
      cukupPede: 80,
      perluBimbingan: 1,
    },
  },
  kelas_xi: {
    name: "Kelas XI (Fase Transisi / N=2.134)",
    count: 2134,
    ikv: 75.19,
    avgAction: 74.82,
    avgFocus: 75.8,
    avgConfidence: 75.03,
    kaihScores: [73.12, 75.31, 75.46, 76.52, 75.63, 74.36, 77.75],
    dimScores: [74.82, 73.81, 77.45, 76.15, 75.03],
    correlations: [0.7717, 0.7916, 0.7046, 0.7471, 0.7567, 0.7509, 0.7078],
    mediation: {
      pathA: 0.8042,
      pathB: 0.7277,
      pathCPrime: 0.1311,
      indirect: 0.5852,
      totalEffect: 0.7163,
      mediationPct: 81.69,
    },
    personas: {
      anchoredLeader: 549,
      quietHafidz: 11,
      fragilePerformer: 8,
      mechanicalFollower: 7,
      exhaustedSantri: 92,
      progressing: 1467,
    },
    categories: {
      sangatPede: 1048,
      pede: 892,
      cukupPede: 193,
      perluBimbingan: 1,
    },
  },
  kelas_xii: {
    name: "Kelas XII (Fase Kelulusan / N=970)",
    count: 970,
    ikv: 80.67,
    avgAction: 80.73,
    avgFocus: 81.13,
    avgConfidence: 80.43,
    kaihScores: [79.55, 80.15, 80.71, 81.84, 81.16, 80.08, 82.85],
    dimScores: [80.73, 79.77, 82.15, 81.46, 80.43],
    correlations: [0.753, 0.7841, 0.7437, 0.7555, 0.7305, 0.7441, 0.7055],
    mediation: {
      pathA: 0.8007,
      pathB: 0.7361,
      pathCPrime: 0.1335,
      indirect: 0.5894,
      totalEffect: 0.7229,
      mediationPct: 81.53,
    },
    personas: {
      anchoredLeader: 388,
      quietHafidz: 5,
      fragilePerformer: 1,
      mechanicalFollower: 0,
      exhaustedSantri: 0,
      progressing: 576,
    },
    categories: {
      sangatPede: 624,
      pede: 337,
      cukupPede: 9,
      perluBimbingan: 0,
    },
  },
};

type PillarTab = "all" | "descriptive" | "diagnostic" | "predictive" | "prescriptive";

export default function PublicResearchReportPage() {
  const [selectedCohort, setSelectedCohort] = useState<string>("all");
  const [activePillar, setActivePillar] = useState<PillarTab>("all");
  const [simInhibitionBoost, setSimInhibitionBoost] = useState<number>(5);
  const [categoryChartLayout, setCategoryChartLayout] = useState<"horizontal" | "vertical">("horizontal");

  const cohort = COHORT_DATA[selectedCohort];

  const positivePercentage = useMemo(() => {
    return Number(
      (((cohort.categories.sangatPede + cohort.categories.pede) / cohort.count) * 100).toFixed(1)
    );
  }, [cohort]);

  const confidenceCategoryData = useMemo(() => {
    const total = cohort.count;
    return [
      {
        key: "sangatPede",
        category: "Sangat Percaya Diri",
        range: "Skor > 85%",
        fullName: "Sangat Percaya Diri (skor di atas 85%)",
        shortLabel: "Sangat Percaya Diri",
        count: cohort.categories.sangatPede,
        pct: Number(((cohort.categories.sangatPede / total) * 100).toFixed(1)),
        color: "#059669",
        bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
        borderLight: "border-emerald-200 dark:border-emerald-800",
        textColor: "text-emerald-700 dark:text-emerald-400",
        desc: "Santri proaktif, siap memimpin forum diskusi, berani berpendapat, dan memiliki rasa aman diri yang matang.",
      },
      {
        key: "pede",
        category: "Percaya Diri",
        range: "Skor 70% – 84%",
        fullName: "Percaya Diri (skor 70% sampai 84%)",
        shortLabel: "Percaya Diri",
        count: cohort.categories.pede,
        pct: Number(((cohort.categories.pede / total) * 100).toFixed(1)),
        color: "#0d9488",
        bgLight: "bg-teal-50 dark:bg-teal-950/30",
        borderLight: "border-teal-200 dark:border-teal-800",
        textColor: "text-teal-700 dark:text-teal-400",
        desc: "Santri mandiri, nyaman berdiskusi dalam kelompok, dan stabil menjalankan rutinitas kebiasaan harian.",
      },
      {
        key: "cukupPede",
        category: "Cukup Percaya Diri",
        range: "Skor 55% – 69%",
        fullName: "Cukup Percaya Diri (skor 55% sampai 69%)",
        shortLabel: "Cukup Percaya Diri",
        count: cohort.categories.cukupPede,
        pct: Number(((cohort.categories.cukupPede / total) * 100).toFixed(1)),
        color: "#d97706",
        bgLight: "bg-amber-50 dark:bg-amber-950/30",
        borderLight: "border-amber-200 dark:border-amber-800",
        textColor: "text-amber-700 dark:text-amber-400",
        desc: "Santri cenderung pasif pada forum besar, namun mampu unjuk diri jika didorong dan dipandu bertahap.",
      },
      {
        key: "perluBimbingan",
        category: "Perlu Pendampingan",
        range: "Skor < 55%",
        fullName: "Perlu Pendampingan Khusus (skor di bawah 55%)",
        shortLabel: "Perlu Pendampingan",
        count: cohort.categories.perluBimbingan,
        pct: Number(((cohort.categories.perluBimbingan / total) * 100).toFixed(1)),
        color: "#e11d48",
        bgLight: "bg-rose-50 dark:bg-rose-950/30",
        borderLight: "border-rose-200 dark:border-rose-800",
        textColor: "text-rose-700 dark:text-rose-400",
        desc: "Santri mengalami hambatan adaptasi sosial atau kecemasan unjuk diri; prioritas pendampingan konselor BK.",
      },
    ];
  }, [cohort]);

  const leverageChartData = useMemo(() => {
    return KAIH_METADATA.map((k, idx) => ({
      name: k.short,
      fullName: k.name,
      r: cohort.correlations[idx],
      r2: Number((cohort.correlations[idx] ** 2 * 100).toFixed(1)),
      score: cohort.kaihScores[idx],
      tier: k.tier,
      color: k.color,
    })).sort((a, b) => b.r - a.r);
  }, [cohort]);

  const dimensionChartData = useMemo(() => {
    const dimLabels = [
      { name: "D1: Tindakan Fisik", key: "Tindakan Fisik", desc: "Konsistensi menjalankan rutinitas harian di asrama." },
      { name: "D2: Atensi Selektif", key: "Atensi Selektif", desc: "Kemampuan menahan distraksi suara dan obrolan saat belajar." },
      { name: "D3: Atensi Terbuka", key: "Atensi Terbuka", desc: "Kepekaan terhadap lingkungan sekitar dan dinamika sosial." },
      { name: "D4: Atensi Eksekutif", key: "Atensi Eksekutif", desc: "Kemampuan mengelola emosi dan menyusun jalan keluar masalah." },
      { name: "D5: Confidency", key: "Unjuk Diri", desc: "Keberanian berbicara, memimpin, dan menyampaikan pendapat." },
    ];
    return dimLabels.map((d, i) => ({
      ...d,
      score: cohort.dimScores[i],
    }));
  }, [cohort]);

  const personaChartData = useMemo(() => {
    const p = cohort.personas;
    return [
      { name: "The Anchored Leader", count: p.anchoredLeader, color: "#059669", desc: "Disiplin tinggi, fokus terjaga, dan berani tampil memimpin forum." },
      { name: "Progressing / Balanced", count: p.progressing, color: "#0284c7", desc: "Perkembangan karakter berjalan stabil mengikuti arahan pembina." },
      { name: "The Quiet Hafidz", count: p.quietHafidz, color: "#d97706", desc: "Hafalan dan fokus belajar kuat, namun enggan tampil di panggung." },
      { name: "The Exhausted Santri", count: p.exhaustedSantri, color: "#e11d48", desc: "Kelelahan akibat jam tidur yang belum tertib di kamar." },
      { name: "The Mechanical Follower", count: p.mechanicalFollower, color: "#64748b", desc: "Hadir secara fisik di setiap agenda, namun kurang menyimak materi." },
      { name: "The Fragile Performer", count: p.fragilePerformer, color: "#9333ea", desc: "Antusias tampil, namun mudah cemas saat argumennya diuji." },
    ].filter((item) => item.count > 0);
  }, [cohort]);

  // Model Simulasi Prediktif
  const simulatedImpact = useMemo(() => {
    const bCoeff = cohort.mediation.pathB;
    const focusGain = simInhibitionBoost / 3;
    const confidenceGain = Number((bCoeff * focusGain).toFixed(2));
    const newConfidence = Number((cohort.avgConfidence + confidenceGain).toFixed(1));
    const convertedStudents = Math.round((cohort.count * (confidenceGain / 100)) * 0.45);

    return {
      boost: simInhibitionBoost,
      confidenceGain,
      newConfidence,
      convertedStudents,
    };
  }, [cohort, simInhibitionBoost]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* ========================================================================= */}
      {/* 1. HEADER LAPORAN PENELITIAN RESMI                                        */}
      {/* ========================================================================= */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
            <span className="font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2.5 py-1 rounded">
              Laporan Penelitian Kognitif Terpadu
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-600 dark:text-slate-400">Litbang SMAIT Ihsanul Fikri Mungkid</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500 font-mono">Tahun Ajaran 2026/2027</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
            Bagaimana 7 Kebiasaan Harian Membentuk Kepercayaan Diri Santri: Kajian Sistem Atensi dan Regulasi Kognitif
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
            Hasil pengolahan data terhadap <strong>3.152 responden santri</strong> SMAIT Ihsanul Fikri membuktikan secara empiris bahwa rasa percaya diri santri merupakan hasil terstruktur dari pembiasaan fisik yang menopang ketahanan fokus belajar di sekolah dan asrama.
          </p>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Penyusun: Tim Litbang Pendidikan Karakter Vertikal IF
              </p>
              <p className="text-[11px] text-slate-500">
                Data dihimpun dari evaluasi instrumen 7 KAIH periode semester ganjil
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Metode: 4 Pilar Data Science Terintegrasi
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Sampel: 3.152 santri
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. TAB SWITCHER 4 PILAR DATA SCIENCE (INTERAKTIF)                         */}
      {/* ========================================================================= */}
      <section className="bg-emerald-950 text-white border-b border-emerald-800/80 py-4 px-4 sm:px-6 sticky top-16 z-40 shadow-md">
        <div className="mx-auto max-w-5xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                Pilih Tampilan Pilar Analisis Data Science:
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Menampilkan {activePillar === "all" ? "Seluruh 4 Pilar" : `Pilar ${activePillar.toUpperCase()}`}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setActivePillar("all")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activePillar === "all"
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "bg-emerald-900/80 hover:bg-emerald-850 text-emerald-100 border border-emerald-700/60"
              }`}
            >
              <span>🌐 Semua Pilar (Lengkap)</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePillar("descriptive")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activePillar === "descriptive"
                  ? "bg-emerald-400 text-slate-950 shadow-sm"
                  : "bg-emerald-900/80 hover:bg-emerald-850 text-emerald-100 border border-emerald-700/60"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>1. Analisis Deskriptif</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePillar("diagnostic")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activePillar === "diagnostic"
                  ? "bg-blue-400 text-slate-950 shadow-sm"
                  : "bg-emerald-900/80 hover:bg-emerald-850 text-emerald-100 border border-emerald-700/60"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              <span>2. Analisis Diagnostik</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePillar("predictive")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activePillar === "predictive"
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "bg-emerald-900/80 hover:bg-emerald-850 text-emerald-100 border border-emerald-700/60"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>3. Analisis Prediktif</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePillar("prescriptive")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activePillar === "prescriptive"
                  ? "bg-purple-400 text-slate-950 shadow-sm"
                  : "bg-emerald-900/80 hover:bg-emerald-850 text-emerald-100 border border-emerald-700/60"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              <span>4. Analisis Preskriptif</span>
            </button>
          </div>
        </div>
      </section>

      {/* FILTER PILIHAN RESPONDEN (COHORT) */}
      <nav aria-label="Pemilihan kelompok responden" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 py-2.5 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Filter Kelompok Responden:
            </span>
          </div>

          <div className="flex flex-wrap gap-1 text-xs">
            {[
              { id: "all", label: "Semua (3.152)" },
              { id: "ikhwan", label: "Ikhwan (1.614)" },
              { id: "akhwat", label: "Akhwat (1.538)" },
              { id: "kelas_x", label: "Kelas X (1.018)" },
              { id: "kelas_xi", label: "Kelas XI (2.134)" },
              { id: "kelas_xii", label: "Kelas XII (970)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCohort(tab.id)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  selectedCohort === tab.id
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* ========================================================================= */}
        {/* RINGKASAN POIN UTAMA (KEY TAKEAWAYS)                                      */}
        {/* ========================================================================= */}
        <section aria-labelledby="heading-ringkasan" className="space-y-4">
          <h2 id="heading-ringkasan" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Ringkasan Eksekutif (Executive Summary)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                Pengaruh Mediasi Kausalitas
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                {cohort.mediation.mediationPct}%
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Rasa percaya diri mengalir melalui perantara ketahanan konsentrasi dan regulasi diri santri.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                Pengungkit Tertinggi
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                r = 0,771
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Adab bermasyarakat dan kebiasaan membaca menjadi faktor paling kuat mendorong keberanian bicara.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400">
                Hambatan Utama
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                {cohort.dimScores[1]}%
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Kemampuan menepis gangguan suara dan obrolan sekamar tercatat sebagai skor paling rendah.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                Indeks Karakter IKV
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                {cohort.ikv}%
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Rata-rata mutu pembiasaan angkatan tergolong berkategori kondusif dan berkarakter baik.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PILAR 1: ANALISIS DESKRIPTIF (WHAT HAPPENED?)                             */}
        {/* ========================================================================= */}
        {(activePillar === "all" || activePillar === "descriptive") && (
          <section id="pilar-deskriptif" aria-labelledby="heading-pilar-1" className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 text-white font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5">
                Pilar 1
              </Badge>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Analisis Deskriptif (Descriptive Analytics)
              </span>
            </div>

            <div className="border-l-2 border-emerald-600 pl-3">
              <h2 id="heading-pilar-1" className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                1. Kondisi Faktual &amp; Sebaran Statistik Kepercayaan Diri Santri
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Menjawab pertanyaan: <em>&ldquo;Apa yang sedang terjadi pada 3.152 santri saat ini? Bagaimana sebaran skor dan demografinya?&rdquo;</em>
              </p>
            </div>

            {/* ========================================================================= */}
            {/* DIAGRAM BATANG SEBARAN KATEGORI KEPERCAYAAN DIRI (LANDSCAPE DIPERBESAR)    */}
            {/* ========================================================================= */}
            <Card className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                        Diagram Batang Sebaran Kategori Kepercayaan Diri ({cohort.name})
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-slate-500 mt-1">
                      Visualisasi komparatif proporsi santri pada tiap tingkatan kematangan unjuk diri — Format Landscape Diperbesar.
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Badge variant="outline" className="font-mono text-xs px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700">
                      {positivePercentage}% Kategori Positif
                    </Badge>

                    {/* Switcher Orientasi Landscape vs Kolom */}
                    <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-100/70 dark:bg-slate-800 text-[11px] font-medium">
                      <button
                        type="button"
                        onClick={() => setCategoryChartLayout("horizontal")}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          categoryChartLayout === "horizontal"
                            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                        title="Orientasi Batang Mendatar (Landscape)"
                      >
                        Landscape
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategoryChartLayout("vertical")}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          categoryChartLayout === "vertical"
                            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                        title="Orientasi Kolom Vertikal"
                      >
                        Kolom
                      </button>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-6">
                {/* Visualisasi Diagram Batang Diperbesar */}
                <div className="h-80 sm:h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {categoryChartLayout === "horizontal" ? (
                      <BarChart
                        data={confidenceCategoryData}
                        layout="vertical"
                        margin={{ top: 10, right: 130, left: 160, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} horizontal={false} />
                        <XAxis
                          type="number"
                          stroke="#94a3b8"
                          fontSize={12}
                          tickFormatter={(v) => `${v}`}
                        />
                        <YAxis
                          type="category"
                          dataKey="category"
                          stroke="#94a3b8"
                          fontSize={12}
                          fontWeight={600}
                          tickLine={false}
                          width={150}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-slate-950/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-2xl border border-slate-800 text-xs max-w-xs space-y-2">
                                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                                    <span className="font-bold text-sm text-slate-100">{data.category}</span>
                                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-semibold">
                                      {data.range}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between font-mono pt-1">
                                    <span className="text-slate-400">Populasi:</span>
                                    <span className="font-bold text-sm text-emerald-400">
                                      {data.count.toLocaleString("id-ID")} santri ({data.pct}%)
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-300 leading-relaxed italic bg-slate-900/60 p-2 rounded border border-slate-800/80">
                                    &ldquo;{data.desc}&rdquo;
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar
                          dataKey="count"
                          radius={[0, 8, 8, 0]}
                          barSize={38}
                        >
                          {confidenceCategoryData.map((entry) => (
                            <Cell key={entry.key} fill={entry.color} />
                          ))}
                          <LabelList
                            dataKey="count"
                            position="right"
                            formatter={(val: any) => {
                              const item = confidenceCategoryData.find((c) => c.count === val);
                              return item ? `  ${item.count.toLocaleString("id-ID")} santri (${item.pct}%)` : `  ${val}`;
                            }}
                            style={{ fontSize: 12, fontWeight: 700, fill: "#334155" }}
                            className="dark:fill-slate-200"
                          />
                        </Bar>
                      </BarChart>
                    ) : (
                      <BarChart
                        data={confidenceCategoryData}
                        layout="horizontal"
                        margin={{ top: 25, right: 30, left: 10, bottom: 25 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                        <XAxis
                          type="category"
                          dataKey="shortLabel"
                          stroke="#94a3b8"
                          fontSize={12}
                          fontWeight={600}
                          tickLine={false}
                        />
                        <YAxis
                          type="number"
                          stroke="#94a3b8"
                          fontSize={12}
                          tickFormatter={(v) => `${v}`}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-slate-950/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-2xl border border-slate-800 text-xs max-w-xs space-y-2">
                                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                                    <span className="font-bold text-sm text-slate-100">{data.category}</span>
                                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-semibold">
                                      {data.range}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between font-mono pt-1">
                                    <span className="text-slate-400">Populasi:</span>
                                    <span className="font-bold text-sm text-emerald-400">
                                      {data.count.toLocaleString("id-ID")} santri ({data.pct}%)
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-300 leading-relaxed italic bg-slate-900/60 p-2 rounded border border-slate-800/80">
                                    &ldquo;{data.desc}&rdquo;
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar
                          dataKey="count"
                          radius={[8, 8, 0, 0]}
                          barSize={56}
                        >
                          {confidenceCategoryData.map((entry) => (
                            <Cell key={entry.key} fill={entry.color} />
                          ))}
                          <LabelList
                            dataKey="count"
                            position="top"
                            formatter={(val: any) => {
                              const item = confidenceCategoryData.find((c) => c.count === val);
                              return item ? `${item.count} (${item.pct}%)` : `${val}`;
                            }}
                            style={{ fontSize: 12, fontWeight: 700, fill: "#334155" }}
                            className="dark:fill-slate-200"
                          />
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* 4 Kartu Breakdown Terpisah di Bawah Grafik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {confidenceCategoryData.map((item) => (
                    <div
                      key={item.key}
                      className={`p-3.5 rounded-lg border ${item.borderLight} ${item.bgLight} space-y-2 transition-all`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.category}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/70 dark:bg-slate-900/70 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                          {item.range}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                          {item.count.toLocaleString("id-ID")}
                        </span>
                        <span className={`text-xs font-bold font-mono ${item.textColor}`}>
                          ({item.pct}%)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Kotak Fakta Deskriptif Kunci */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-1.5">
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Fakta Deskriptif Kunci ({cohort.name}):</span>
                  </div>
                  <p>
                    Sebanyak <strong>{positivePercentage}% santri</strong> berada pada kategori percaya diri hingga sangat percaya diri (skor di atas 70%). Hanya <strong>{cohort.categories.perluBimbingan} santri ({Number(((cohort.categories.perluBimbingan / cohort.count) * 100).toFixed(1))}%)</strong> yang berada pada kategori perlu pendampingan khusus. Suasana komunal pesantren memberikan rasa aman dasar (<em>basic psychological safety</em>) sehingga santri tidak merasa terkucilkan dan terbiasa dengan interaksi harian.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* ========================================================================= */}
            {/* PERBANDINGAN DEMOGRAFI TERPISAH (LANDSCAPE LEBIH BESAR & SANGAT MUDAH DIBACA) */}
            {/* ========================================================================= */}
            <Card className="w-full border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                          Komparasi Demografi &amp; Dinamika Maturasi Santri
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm text-slate-500 mt-0.5">
                          Temuan kunci bagaimana masa tinggal di asrama (Kelas X &rarr; XI &rarr; XII) dan faktor gender membentuk kematangan rasa percaya diri.
                        </CardDescription>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    <Badge variant="outline" className="font-mono text-xs px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                      N = 3.152 Santri Riil
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      3 Tingkat Angkatan
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-8 space-y-8">
                {/* 3 BLOK HERO LANDSCAPE BESAR BERDAMPINGAN */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* KARTU 1: MATURASI 3 TAHUN KELAS XII */}
                  <div className="p-5 sm:p-6 rounded-2xl border-2 border-emerald-200/80 dark:border-emerald-900/60 bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 space-y-5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wide bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                        <GraduationCap className="h-3.5 w-3.5" />
                        Maturasi Asrama 3 Tahun
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                        Kelas X &rarr; XII
                      </span>
                    </div>

                    <div>
                      <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 tracking-tight">
                        +8,2%
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                        Lonjakan Kepercayaan Diri di Kelas XII
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Skor rata-rata naik konsisten dari <strong>72,3%</strong> (Kelas X) menjadi <strong>80,4%</strong> (Kelas XII).
                      </p>
                    </div>

                    {/* Visual Progress Bar Komparasi Antar Tingkat */}
                    <div className="space-y-2.5 pt-2 border-t border-emerald-100 dark:border-emerald-900/40">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Traktori Progres per Angkatan:
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-600 dark:text-slate-400">Kelas X (Adaptasi Awal)</span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">72,3%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-slate-400 dark:bg-slate-600 rounded-full" style={{ width: "72.3%" }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-600 dark:text-slate-400">Kelas XI (Konsolidasi)</span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">74,1%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: "74.1%" }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-emerald-800 dark:text-emerald-300 font-bold">Kelas XII (Puncak Maturasi)</span>
                          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">80,4%</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: "80.4%" }} />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <div className="font-bold text-emerald-900 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                        <ArrowUpRight className="h-4 w-4" />
                        <span>Lonjakan Pemimpin Mandiri (2,1x Lipat):</span>
                      </div>
                      Proporsi santri berkategori <em>The Anchored Leader</em> (siap berpidato, memimpin rapat, dan vokal) melompat dari <strong>19,0%</strong> di kelas X menjadi <strong>40,0%</strong> di kelas XII.
                    </div>
                  </div>

                  {/* KARTU 2: DINAMIKA GENDER (AKHWAT VS IKHWAN) */}
                  <div className="p-5 sm:p-6 rounded-2xl border-2 border-teal-200/80 dark:border-teal-900/60 bg-gradient-to-b from-teal-50/50 to-white dark:from-teal-950/20 dark:to-slate-900 space-y-5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wide bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300">
                        <Award className="h-3.5 w-3.5" />
                        Dinamika Gender
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-teal-700 dark:text-teal-400">
                        1.538 vs 1.614
                      </span>
                    </div>

                    <div>
                      <div className="text-3xl sm:text-4xl font-extrabold font-mono text-teal-700 dark:text-teal-400 tracking-tight">
                        75,7% <span className="text-xl font-normal text-slate-400">vs</span> 73,3%
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                        Keteraturan Habituasi Santriwati Akhwat
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Santriwati mencatatkan konsistensi jadwal dan kerapian adab komunal lebih tertib daripada santriwan.
                      </p>
                    </div>

                    {/* Visual Progress Bar Komparasi Gender */}
                    <div className="space-y-2.5 pt-2 border-t border-teal-100 dark:border-teal-900/40">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Perbandingan Dimensi Kunci:
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-teal-800 dark:text-teal-300 font-bold">Akhwat: Ibadah &amp; Adab Kamar</span>
                          <span className="font-mono font-bold text-teal-700 dark:text-teal-400">76,8%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-teal-600 rounded-full" style={{ width: "76.8%" }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-600 dark:text-slate-400">Ikhwan: Ibadah &amp; Adab Kamar</span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">74,7%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-slate-400 dark:bg-slate-600 rounded-full" style={{ width: "74.7%" }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-blue-700 dark:text-blue-300 font-bold">Ikhwan: Aksi Fisik &amp; Percaya Diri</span>
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">74,6%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: "74.6%" }} />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-teal-100/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <div className="font-bold text-teal-900 dark:text-teal-300 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Karakteristik Unik Dua Kelompok:</span>
                      </div>
                      Santriwati Akhwat unggul dalam ketelitian catatan belajar, ketepatan halaqah, dan adab sesama teman. Sementara santriwan Ikhwan lebih berani dalam unjuk suara spontan dan aktivitas fisik lapangan.
                    </div>
                  </div>

                  {/* KARTU 3: PENURUNAN MASALAH KURANG TIDUR */}
                  <div className="p-5 sm:p-6 rounded-2xl border-2 border-amber-200/80 dark:border-amber-900/60 bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900 space-y-5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wide bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                        <Moon className="h-3.5 w-3.5" />
                        Adaptasi Sirkadian Asrama
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-amber-700 dark:text-amber-400">
                        Kasus Nihil di Kelas XII
                      </span>
                    </div>

                    <div>
                      <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-700 dark:text-amber-400 tracking-tight">
                        3,9% &rarr; 0,0%
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                        Penyusutan Masalah Kurang Tidur
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Kelompok santri yang mengalami kelelahan kronis tereliminasi total seiring bertambahnya usia tinggal.
                      </p>
                    </div>

                    {/* Visual Progress Bar Penyusutan Santri Lelah */}
                    <div className="space-y-2.5 pt-2 border-t border-amber-100 dark:border-amber-900/40">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Tingkat Santri Lelah Kronis (The Exhausted Santri):
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-600 dark:text-slate-400">Kelas X (Transisi Jam Tidur)</span>
                          <span className="font-mono font-bold text-rose-600 dark:text-rose-400">5,5% (Rentang Awal)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: "55%" }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-600 dark:text-slate-400">Kelas XI (Mulai Menyesuaikan)</span>
                          <span className="font-mono font-bold text-amber-600 dark:text-amber-400">3,9%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: "39%" }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-emerald-800 dark:text-emerald-300 font-bold">Kelas XII (Tuntas Tereliminasi)</span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">0,0% (Nol Kasus)</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "0%" }} />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <div className="font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Bukti Keberhasilan Jam Biologis:</span>
                      </div>
                      Santri senior kelas XII berhasil membangun ritme biologis sirkadian mandiri tanpa begadang sia-sia di kamar, menjaga stamina optimal untuk persiapan ujian dan pengabdian.
                    </div>
                  </div>

                </div>

                {/* CALLOUT BANNER STRATEGIS INSTITUSI (SANGAT MUDAH DIBACA PEMANGKU KEPENTINGAN) */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-blue-950/30 border border-emerald-200 dark:border-emerald-800/80 flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs border border-emerald-100 dark:border-emerald-900 shrink-0">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                      Implikasi Kebijakan untuk Pimpinan Sekolah &amp; Pengasuh Asrama:
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      Data ini membuktikan bahwa <strong>sistem pembiasaan asrama (boarding school) bukan sekadar mendisiplinkan fisik</strong>, melainkan secara empiris berfungsi sebagai inkubator pematangan karakter. Transisi 3 tahun berhasil melipatgandakan figur pemimpin berani (+8,2% rasa percaya diri) dan menuntaskan masalah kelelahan santri secara berkelanjutan.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* TABEL STATISTIK DESKRIPTIF LENGKAP */}
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span>Tabel Statistik Deskriptif Parameter Instrumen (N = 3.152)</span>
                  <span className="text-[11px] font-mono text-slate-500">Skala Dinormalisasi 0 - 100%</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Ringkasan parameter statistik: Nilai Tengah (Mean), Standar Deviasi (SD), Median, serta Nilai Ekstrem (Min-Max).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <th className="py-2.5 px-3">Parameter Pembiasaan</th>
                        <th className="py-2.5 px-3">Rata-rata (Mean)</th>
                        <th className="py-2.5 px-3">Standar Deviasi</th>
                        <th className="py-2.5 px-3">Median</th>
                        <th className="py-2.5 px-3">Rentang (Min - Max)</th>
                        <th className="py-2.5 px-3">Status Karakter</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                      {DESCRIPTIVE_TABLE.map((row) => (
                        <tr key={row.pilar} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                            {row.pilar}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                            {row.mean}
                          </td>
                          <td className="py-2.5 px-3 font-mono">{row.sd}</td>
                          <td className="py-2.5 px-3 font-mono">{row.median}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">{row.min} - {row.max}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* ========================================================================= */}
        {/* PILAR 2: ANALISIS DIAGNOSTIK (WHY DID IT HAPPEN?)                         */}
        {/* ========================================================================= */}
        {(activePillar === "all" || activePillar === "diagnostic") && (
          <section id="pilar-diagnostik" aria-labelledby="heading-pilar-2" className="space-y-8 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600 text-white font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5">
                Pilar 2
              </Badge>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                Analisis Diagnostik (Diagnostic Analytics)
              </span>
            </div>

            <div className="border-l-2 border-blue-600 pl-3">
              <h2 id="heading-pilar-2" className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                2. Diagnostik Kausalitas: Mengapa Santri Percaya Diri &amp; Di Mana Titik Hambatannya?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Menjawab: <em>&ldquo;Mengapa hubungan tersebut terbentuk? Kebiasaan mana yang menjadi pengungkit dan di mana kebocoran transmisi terjadi?&rdquo;</em>
              </p>
            </div>

            {/* Sub-Bab 2A: Daya Hubung Korelasi Pearson */}
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-sm font-bold">Diagnostik Daya Ungkit (Korelasi Pearson &amp; R²)</CardTitle>
                  <span className="text-xs font-mono text-slate-500">Nilai r mendekati 1,00 menunjukkan hubungan yang semakin kuat</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-72 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={leverageChartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 85, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="2 2" opacity={0.15} horizontal={false} />
                      <XAxis type="number" domain={[0, 1]} tickFormatter={(v) => `r=${v}`} stroke="#94a3b8" fontSize={11} />
                      <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip
                        formatter={(val: any, name: any, item: any) => [
                          `r = ${val} (R² = ${item.payload.r2}%)`,
                          item.payload.fullName,
                        ]}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderRadius: "8px",
                          border: "1px solid #334155",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="r" radius={[0, 4, 4, 0]}>
                        {leverageChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? "#059669" : index === 1 ? "#0284c7" : "#64748b"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-5 p-3.5 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>Diagnosa Pengungkit:</strong> Kebiasaan <strong>Bermasyarakat &amp; Adab (r = 0,771)</strong> serta <strong>Gemar Membaca (r = 0,744)</strong> terbukti memiliki korelasi tertinggi dengan rasa percaya diri. Membaca membekali santri dengan keluasan kosakata dan konsep argumen, sedangkan adab bermasyarakat melatih kepekaan sosial sehingga santri tidak cemas saat berhadapan dengan audiens umum.
                </div>
              </CardContent>
            </Card>

            {/* Sub-Bab 2B: Titik Bocor Transmisi Kognitif */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-600" />
                Diagnostik Pipa Transmisi Kognitif: Di Mana Titik Hambatan Santri?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {dimensionChartData.map((d, idx) => {
                  const isBottleneck = idx === 1;
                  return (
                    <Card
                      key={d.name}
                      className={`border ${
                        isBottleneck
                          ? "border-rose-400/80 bg-rose-50/30 dark:bg-rose-950/20"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                      }`}
                    >
                      <CardHeader className="p-3.5 pb-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Dimensi {idx + 1}</span>
                          {isBottleneck && (
                            <Badge variant="danger" className="text-[9px] px-1 py-0 uppercase">
                              Hambatan
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                          {d.key}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3.5 pt-1 space-y-1">
                        <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
                          {d.score}%
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">{d.desc}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="p-4 rounded-md border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-xs text-slate-700 dark:text-slate-300 space-y-1 leading-relaxed">
                <strong className="text-rose-900 dark:text-rose-300 flex items-center gap-1.5 font-bold">
                  <AlertCircle className="h-4 w-4" />
                  Diagnosa Bottleneck: Mengapa Atensi Selektif (73,03%) Paling Rendah?
                </strong>
                <p>
                  Santri konsisten hadir secara fisik (D1: 74,20%) dan memiliki empati sosial yang peka (D3: 76,87%). Namun, ketahanan menahan godaan mengobrol atau gangguan suara saat belajar malam (D2: 73,03%) menjadi titik paling rentan. Kelesuan kontrol inhibisi ini membuat materi pelajaran tidak terserap optimal, sehingga saat diminta berbicara di depan forum, santri merasa ragu atas isi argumennya.
                </p>
              </div>
            </div>

            {/* Sub-Bab 2C: Pembuktian Jalur Mediasi Barron & Kenny */}
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">
                  Diagnostik Mediasi Kausalitas: Rutinitas ➔ Fokus ➔ Percaya Diri
                </CardTitle>
                <CardDescription className="text-xs">
                  Membuktikan secara ilmiah apakah pembiasaan fisik langsung memicu rasa percaya diri atau harus melewati pintu fokus.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                <div className="p-6 rounded-lg bg-slate-900 text-white border border-slate-800">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center">
                    <div className="p-3.5 rounded border border-slate-700 bg-slate-800/80 space-y-0.5">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Variabel X</span>
                      <h4 className="text-sm font-bold text-white">Rutinitas Fisik 7 KAIH</h4>
                      <p className="text-xs text-slate-400">Tindakan Disiplin Asrama</p>
                      <div className="text-xs font-mono font-bold text-emerald-300 pt-1">
                        Rata-rata: {cohort.avgAction}%
                      </div>
                    </div>

                    <div className="p-4 rounded border-2 border-emerald-500 bg-emerald-950/40 space-y-0.5">
                      <span className="text-[10px] font-mono uppercase text-amber-300 font-bold">Variabel Mediator (M)</span>
                      <h4 className="text-sm font-bold text-white">Fokus Belajar &amp; Regulasi Diri</h4>
                      <p className="text-xs text-slate-300">Konsentrasi &amp; Pengendalian Emosi</p>
                      <div className="text-xs font-mono font-bold text-amber-300 pt-1">
                        Rata-rata: {cohort.avgFocus}%
                      </div>
                    </div>

                    <div className="p-3.5 rounded border border-slate-700 bg-slate-800/80 space-y-0.5">
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Variabel Y</span>
                      <h4 className="text-sm font-bold text-white">Kepercayaan Diri Santri</h4>
                      <p className="text-xs text-slate-400">Keberanian Tampil &amp; Bicara</p>
                      <div className="text-xs font-mono font-bold text-amber-300 pt-1">
                        Rata-rata: {cohort.avgConfidence}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-center">
                    <div className="p-2.5 rounded bg-slate-800/50">
                      <span className="text-slate-400 text-[11px]">Jalur a (Rutinitas → Fokus):</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">β = {cohort.mediation.pathA}</div>
                    </div>
                    <div className="p-2.5 rounded bg-slate-800/50">
                      <span className="text-slate-400 text-[11px]">Jalur b (Fokus → Percaya Diri):</span>
                      <div className="text-base font-bold text-amber-400 mt-0.5">β = {cohort.mediation.pathB}</div>
                    </div>
                    <div className="p-2.5 rounded bg-slate-800/50">
                      <span className="text-slate-400 text-[11px]">Jalur c&#39; (Pengaruh Langsung):</span>
                      <div className="text-base font-bold text-slate-300 mt-0.5">β = {cohort.mediation.pathCPrime}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <p>
                    <strong>Hasil Pengujian Jalur:</strong> Total pengaruh kebiasaan terhadap rasa percaya diri bernilai r = {cohort.mediation.totalEffect}. Sebagian besar pengaruh tersebut dialirkan lewat jalur tidak langsung (efek mediasi sebesar {cohort.mediation.indirect}).
                  </p>
                  <p>
                    Apabila santri menjalankan rutinitas asrama sebatas formalitas tanpa kesadaran menyimak materi pelajaran, pengaruh langsungnya terhadap keberanian berbicara hanya tersisa 19,6% (β = {cohort.mediation.pathCPrime}).
                  </p>
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                    Ketika rutinitas berhasil membentuk kemampuan konsentrasi dan pengendalian emosi santri, dorongan terhadap rasa percaya diri meningkat hingga 80,4%.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sub-Bab 2D: Enam Profil Karakter Santri */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Diagnostik Enam Profil Karakter Persona Santri
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personaChartData.map((p) => (
                  <Card key={p.name} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
                          {p.count} santri ({((p.count / cohort.count) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
                        {p.name}
                      </CardTitle>
                      <CardDescription className="text-xs">{p.desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      {p.name === "The Anchored Leader" && (
                        <p>Santri disiplin dengan konsentrasi kuat dan siap memimpin organisasi santri serta menjadi teladan di kamar.</p>
                      )}
                      {p.name === "The Quiet Hafidz" && (
                        <p>Hafalan dan ketekunan belajar sangat baik, namun memerlukan latihan tampil bertahap agar tidak cemas saat berpidato.</p>
                      )}
                      {p.name === "The Exhausted Santri" && (
                        <p>Mengalami penurunan stamina akibat jam tidur malam yang belum tertib. Memerlukan penyesuaian jadwal istirahat asrama.</p>
                      )}
                      {p.name === "Progressing / Balanced" && (
                        <p>Kelompok santri terbesar yang menunjukkan perkembangan karakter secara wajar sesuai tahapan usianya.</p>
                      )}
                      {p.name === "The Fragile Performer" && (
                        <p>Percaya diri tampil di depan umum, namun mudah berkecil hati saat mendapat koreksi atau sanggahan dalam diskusi.</p>
                      )}
                      {p.name === "The Mechanical Follower" && (
                        <p>Selalu hadir di setiap kegiatan, namun pikirannya sering melamun sehingga membutuhkan bimbingan minat belajar dari guru.</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* PILAR 3: ANALISIS PREDIKTIF (WHAT WILL HAPPEN?)                           */}
        {/* ========================================================================= */}
        {(activePillar === "all" || activePillar === "predictive") && (
          <section id="pilar-prediktif" aria-labelledby="heading-pilar-3" className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-600 text-slate-950 font-bold font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5">
                Pilar 3
              </Badge>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Analisis Prediktif (Predictive Analytics)
              </span>
            </div>

            <div className="border-l-2 border-amber-600 pl-3">
              <h2 id="heading-pilar-3" className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                3. Proyeksi Tren Maturasi, Peringatan Dini Risiko, &amp; Simulasi Masa Depan
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Menjawab: <em>&ldquo;Apa yang diproyeksikan terjadi di masa depan jika dibiarkan vs jika sekolah melakukan intervensi terarah?&rdquo;</em>
              </p>
            </div>

            {/* Model 1: Grafik Proyeksi Traktori 3 Tahun */}
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                      Model Prediksi 1: Traktori Maturasi Karakter 3 Tahun
                    </span>
                    <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                      Grafik Evolusi Kenaikan Karakter &amp; Percaya Diri (Kelas X ➔ XI ➔ XII)
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    Model Regresi Kohort
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Memproyeksikan kenaikan skor Confidency dan pertumbuhan kelompok The Anchored Leader seiring adaptasi berasrama.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={TRAJECTORY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="grade" stroke="#94a3b8" fontSize={11} />
                      <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v}%`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderRadius: "8px",
                          border: "1px solid #334155",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                      <Line type="monotone" dataKey="confidency" name="Skor Kepercayaan Diri (%)" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                      <Line type="monotone" dataKey="ikv" name="Indeks Karakter IKV (%)" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="anchoredLeaderPct" name="Proporsi Anchored Leader (%)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} strokeDasharray="4 4" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 p-3.5 rounded-md bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Insight Prediktif:</strong> Model menunjukkan trajektori pertumbuhan linier positif. Jika pembiasaan 7 KAIH dijaga konsisten, diproyeksikan <strong>4 dari 10 santri lulusan (40,0%)</strong> akan menjadi *The Anchored Leader*, dengan risiko krisis tidur mendekati 0% di akhir masa pendidikan.
                </div>
              </CardContent>
            </Card>

            {/* Model 2 & Model 3: Early Warning & What-If */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Early Warning Forecast */}
              <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                      Model Prediksi 2: Early Warning System
                    </span>
                    <Badge variant="danger" className="text-[10px]">
                      Peringatan Risiko
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                    Prediksi Risiko Penurunan Belajar Akibat Kurang Tidur
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Prakiraan probabilitas burnout berdasarkan ambang batas jam tidur malam (KAIH 6).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">Santri Tidur Tertib (&gt;75%):</span>
                      <span className="font-mono font-bold text-emerald-600">Risiko Burnout &lt; 1,2%</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">Santri Tidur Sedang (60-74%):</span>
                      <span className="font-mono font-bold text-amber-600">Risiko Burnout 8,5%</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-slate-600 dark:text-slate-400">Santri Tidur Rendah (&lt;60%):</span>
                      <span className="font-mono font-bold text-rose-600">Risiko Burnout 42,3%</span>
                    </div>
                  </div>
                  <div className="p-3 rounded bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong>Peringatan Prediktif:</strong> Sebanyak <strong>123 santri</strong> dalam kelompok *The Exhausted Santri* diproyeksikan mengalami penurunan daya ingat hafalan dalam 60 hari ke depan jika jam padam kamar malam tidak diperbaiki.
                  </div>
                </CardContent>
              </Card>

              {/* Mesin Simulasi What-If */}
              <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      Model Prediksi 3: Simulator Regresi What-If
                    </span>
                    <Badge variant="gold" className="text-[10px]">
                      Simulasi Interaktif
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                    Simulasi Pengaruh Kenaikan Atensi Belajar
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Geser pengatur untuk memperkirakan lonjakan percaya diri jika kebisingan kamar berkurang.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Target Kenaikan Konsentrasi (D2):</span>
                      <span className="text-emerald-600 font-mono text-sm">+{simInhibitionBoost}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      step="1"
                      value={simInhibitionBoost}
                      onChange={(e) => setSimInhibitionBoost(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>+1% (Ringan)</span>
                      <span>+8% (Disiplin Kamar)</span>
                      <span>+15% (Transformasi)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center">
                      <span className="text-[10px] text-slate-500">Proyeksi Kenaikan Pede</span>
                      <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
                        +{simulatedImpact.confidenceGain}%
                      </div>
                    </div>
                    <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center">
                      <span className="text-[10px] text-slate-500">Konversi Sangat Pede</span>
                      <div className="text-lg font-bold font-mono text-emerald-600">
                        ~{simulatedImpact.convertedStudents} santri
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* PILAR 4: ANALISIS PRESKRIPTIF (WHAT SHOULD WE DO?)                        */}
        {/* ========================================================================= */}
        {(activePillar === "all" || activePillar === "prescriptive") && (
          <section id="pilar-preskriptif" aria-labelledby="heading-pilar-4" className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-600 text-white font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5">
                Pilar 4
              </Badge>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                Analisis Preskriptif (Prescriptive Analytics)
              </span>
            </div>

            <div className="border-l-2 border-purple-600 pl-3">
              <h2 id="heading-pilar-4" className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                4. Rekomendasi Preskriptif Strategis &amp; Matriks Rencana Aksi Sekolah
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Menjawab: <em>&ldquo;Tindakan konkret apa yang harus dijalankan sekolah untuk mempertahankan yang baik dan memperbaiki yang kurang?&rdquo;</em>
              </p>
            </div>

            {/* Bagian Pertahankan */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span className="h-5 w-5 rounded bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">A</span>
                Praktik Baik yang Wajib Dipertahankan (*Sustain Strengths*)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Kualitas Menu dan Halaqah Al-Qur&#39;an
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p>Skor makan sehat (77,4%) dan ibadah (75,7%) merupakan capaian tertinggi santri yang menjaga ketahanan fisik harian.</p>
                    <p className="font-medium text-emerald-800 dark:text-emerald-300 pt-1">
                      Langkah: Pertahankan variasi menu gizi dapur dan jaga suasana halaqah tetap kondusif tanpa beban hafalan yang menekan.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Ruang Berinteraksi dan Musyawarah
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p>Adab bermasyarakat memiliki korelasi tertinggi dengan keberanian santri (r = 0,771).</p>
                    <p className="font-medium text-emerald-800 dark:text-emerald-300 pt-1">
                      Langkah: Buka ruang diskusi santai antar-kamar asrama untuk membiasakan santri bertukar pikiran secara terbuka.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Pemberdayaan Santri Teladan (742 Orang)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p>Sebanyak 23,5% santri telah mencapai kematangan kepribadian yang siap diberi tanggung jawab lebih luas.</p>
                    <p className="font-medium text-emerald-800 dark:text-emerald-300 pt-1">
                      Langkah: Libatkan santri tersebut sebagai koordinator kegiatan dan pendamping bagi adik kelas.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bagian Intervensi Perbaikan */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span className="h-5 w-5 rounded bg-rose-700 text-white text-xs flex items-center justify-center font-bold">B</span>
                Prioritas yang Wajib Ditingkatkan (*Targeted Interventions*)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                      Jam Tenang untuk Membaca (Skor 72,1%)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p>Membaca mencatatkan skor terendah karena santri kekurangan waktu membaca tanpa gangguan.</p>
                    <p className="font-medium text-rose-800 dark:text-rose-300 pt-1">
                      Langkah: Tetapkan 20 menit membaca hening setiap malam di asrama dan sediakan buku non-pelajaran di kelas.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                      Pengurangan Distraksi Suara di Kamar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p>Ketidakmampuan menyaring kebisingan suara obrolan saat jam belajar malam menjadi hambatan utama konsentrasi.</p>
                    <p className="font-medium text-rose-800 dark:text-rose-300 pt-1">
                      Langkah: Terapkan aturan jam hening di lorong asrama dan fungsikan perpustakaan untuk belajar mandiri malam.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                      Pendampingan Santri Berisiko
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p>Terdapat 24 santri kompeten yang cemas tampil dan 123 santri yang jam tidurnya belum tertib.</p>
                    <p className="font-medium text-rose-800 dark:text-rose-300 pt-1">
                      Langkah: Bimbingan tampil bertahap dalam kelompok kecil serta penertiban jam tidur asrama tepat pukul 22.00.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Matriks 4 Pihak Sekolah */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span className="h-5 w-5 rounded bg-purple-700 text-white text-xs flex items-center justify-center font-bold">C</span>
                Matriks Tindakan Empat Pihak Sekolah (*Stakeholder Action Plan*)
              </h3>

              <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <th className="py-2.5 px-3.5 w-1/4">Pihak Sekolah</th>
                        <th className="py-2.5 px-3.5 w-1/4">Fokus Tugas</th>
                        <th className="py-2.5 px-3.5 w-1/4">Tindakan 30 Hari Pertama</th>
                        <th className="py-2.5 px-3.5 w-1/4">Tolok Ukur Keberhasilan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                        <td className="py-3 px-3.5 font-semibold text-slate-900 dark:text-slate-100">
                          Kepala Sekolah &amp; Manajemen
                        </td>
                        <td className="py-3 px-3.5">Kebijakan jam belajar dan fasilitas buku</td>
                        <td className="py-3 px-3.5">Menerbitkan aturan jam hening dan memperkaya koleksi buku bacaan perpustakaan.</td>
                        <td className="py-3 px-3.5 font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                          Indeks IKV sekolah mencapai ≥ 78%
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                        <td className="py-3 px-3.5 font-semibold text-slate-900 dark:text-slate-100">
                          Dewan Guru Mata Pelajaran
                        </td>
                        <td className="py-3 px-3.5">Metode diskusi di dalam kelas</td>
                        <td className="py-3 px-3.5">Memberikan giliran berbicara 5 menit untuk setiap santri pada sesi tanya jawab.</td>
                        <td className="py-3 px-3.5 font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                          Skor kebiasaan membaca naik ≥ 75%
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                        <td className="py-3 px-3.5 font-semibold text-slate-900 dark:text-slate-100">
                          Wali Asrama / Musyrif
                        </td>
                        <td className="py-3 px-3.5">Ketertiban jam tidur kamar</td>
                        <td className="py-3 px-3.5">Menertibkan pemadaman lampu pukul 22.00 dan melarang aktivitas gaduh setelah doa malam.</td>
                        <td className="py-3 px-3.5 font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                          Atensi selektif santri naik ≥ 76%
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                        <td className="py-3 px-3.5 font-semibold text-slate-900 dark:text-slate-100">
                          Guru Bimbingan Konseling (BK)
                        </td>
                        <td className="py-3 px-3.5">Pendampingan santri minder dan lelah</td>
                        <td className="py-3 px-3.5">Menjadwalkan konseling santai dan latihan bicara berpasangan bagi 24 santri pemalu.</td>
                        <td className="py-3 px-3.5 font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                          Nol santri di kategori bimbingan khusus
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* METODOLOGI & TRANSPARANSI DATA */}
        <section aria-labelledby="heading-metode" className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 id="heading-metode" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Metodologi dan Keterbukaan Data
          </h3>

          <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
            <p>
              <strong>Sampel Responden:</strong> Data dikumpulkan melalui pengisian survei evaluasi berkala semester ganjil tahun ajaran 2026/2027 di lingkungan SMAIT Ihsanul Fikri Mungkid, mencakup 3.152 respon santri yang telah diverifikasi integritas isian datanya.
            </p>
            <p>
              <strong>Instrumen Pengukuran:</strong> Kuesioner memuat 35 butir pertanyaan (7 KAIH dengan 5 butir soal di setiap kebiasaan untuk mengukur tindakan fisik, atensi selektif, atensi terbuka, atensi eksekutif, dan unjuk diri). Seluruh butir menggunakan skala Likert 1-4 yang dinormalisasi ke persentase 0-20% per butir sehingga total per kebiasaan bernilai 100%.
            </p>
            <p>
              <strong>Pengolahan Data:</strong> Analisis mediasi menggunakan prosedur regresi mediasi bertahap untuk memisahkan pengaruh langsung dan pengaruh perantara fokus belajar. Perhitungan indeks komposit (IKV) menggunakan pembobotan berjenjang (bobot 3 untuk membaca dan bermasyarakat; bobot 2 untuk bangun pagi, ibadah, dan olahraga; bobot 1 untuk jam tidur dan makan sehat).
            </p>
          </div>
        </section>

        {/* TAUTAN KEMBALI */}
        <footer className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SMAIT Ihsanul Fikri Mungkid. Hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Halaman Beranda
            </Link>
            <Link href="/survei" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Isi Kuesioner
            </Link>
            <Link href="/super-admin" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Portal Admin
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
