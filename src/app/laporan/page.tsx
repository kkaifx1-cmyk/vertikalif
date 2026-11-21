"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
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
  Area,
  ComposedChart,
  PieChart,
  Pie,
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
  Rocket,
  ChevronDown,
  ChevronUp,
  Printer,
  Info,
  PieChart as PieIcon,
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
  {
    id: 1,
    name: "Gemar Membaca & Riset",
    short: "Membaca",
    tier: "Tier 1 (Bobot 3)",
    color: "#2563eb",
    gradId: "grad-membaca",
    icon: BookOpen,
    accent: "text-blue-600 dark:text-blue-400",
    impact: "Membekali santri dengan keluasan kosakata, wawasan literasi, dan nalar berpikir logis saat berargumen.",
  },
  {
    id: 2,
    name: "Bermasyarakat & Adab",
    short: "Bermasyarakat",
    tier: "Tier 1 (Bobot 3)",
    color: "#059669",
    gradId: "grad-bermasyarakat",
    icon: Users,
    accent: "text-emerald-600 dark:text-emerald-400",
    impact: "Melatih kepekaan empati komunal, tata krama sosial, dan meniadakan kecemasan berbicara di forum umum.",
  },
  {
    id: 3,
    name: "Bangun Pagi & Qiyam",
    short: "Bangun Pagi",
    tier: "Tier 2 (Bobot 2)",
    color: "#d97706",
    gradId: "grad-bangunpagi",
    icon: Clock,
    accent: "text-amber-600 dark:text-amber-400",
    impact: "Membangun kedisiplinan fajar, kesiapan mental menyambut hari, dan ketepatan hadir di halaqah subuh.",
  },
  {
    id: 4,
    name: "Ibadah & Al-Qur'an",
    short: "Ibadah",
    tier: "Tier 2 (Bobot 2)",
    color: "#0891b2",
    gradId: "grad-ibadah",
    icon: Sparkles,
    accent: "text-cyan-600 dark:text-cyan-400",
    impact: "Menciptakan rasa aman batin (*spiritual safety*), stabilitas emosional, dan keteguhan akhlak santri.",
  },
  {
    id: 5,
    name: "Olahraga & Kebugaran",
    short: "Olahraga",
    tier: "Tier 2 (Bobot 2)",
    color: "#ea580c",
    gradId: "grad-olahraga",
    icon: HeartPulse,
    accent: "text-orange-600 dark:text-orange-400",
    impact: "Memicu hormon endorfin, meningkatkan daya tahan fisik, dan membangun postur tubuh yang tegap tangguh.",
  },
  {
    id: 6,
    name: "Istirahat & Jam Tidur",
    short: "Jam Tidur",
    tier: "Tier 3 (Bobot 1)",
    color: "#7c3aed",
    gradId: "grad-jamtidur",
    icon: Moon,
    accent: "text-purple-600 dark:text-purple-400",
    impact: "Menjaga ritme biologis sirkadian otak, mencegah kelelahan kronis (*brain fog*), dan memulihkan energi.",
  },
  {
    id: 7,
    name: "Makan Sehat & Gizi",
    short: "Makan Sehat",
    tier: "Tier 3 (Bobot 1)",
    color: "#e11d48",
    gradId: "grad-makansehat",
    icon: Flame,
    accent: "text-rose-600 dark:text-rose-400",
    impact: "Menjaga kestabilan glukosa darah dan stamina metabolik untuk aktivitas belajar dan ibadah padat harian.",
  },
];

// Helper format angka desimal bahasa Indonesia
const formatNum = (val: number, decimals: number = 1): string => {
  return val.toFixed(decimals).replace(".", ",");
};

interface DescriptiveRow {
  code: string;
  name: string;
  mean: string;
  sd: string;
  median: string;
  range: string;
  status: string;
  statusType: "success" | "neutral" | "warning" | "danger";
  analyticalRole: string;
}

// 7 Variabel Independen diurutkan berdasarkan Mean tertinggi ke terendah
const DESCRIPTIVE_INDEPENDENT: DescriptiveRow[] = [
  {
    code: "KAIH 7",
    name: "Makan Sehat & Gizi",
    mean: "77,35%",
    sd: "14,95%",
    median: "73,33%",
    range: "6,7% – 100,0%",
    status: "Sangat Baik",
    statusType: "success",
    analyticalRole: "Homeostasis & Stamina (Tertinggi)",
  },
  {
    code: "KAIH 4",
    name: "Ibadah & Al-Qur'an",
    mean: "75,73%",
    sd: "14,39%",
    median: "73,33%",
    range: "26,7% – 100,0%",
    status: "Sangat Baik",
    statusType: "success",
    analyticalRole: "Jangkar Spiritual (Stabil)",
  },
  {
    code: "KAIH 3",
    name: "Bangun Pagi & Qiyam",
    mean: "75,13%",
    sd: "14,74%",
    median: "73,33%",
    range: "6,7% – 100,0%",
    status: "Sangat Baik",
    statusType: "success",
    analyticalRole: "Kedisiplinan Fajar",
  },
  {
    code: "KAIH 5",
    name: "Olahraga & Kebugaran",
    mean: "74,86%",
    sd: "15,58%",
    median: "73,33%",
    range: "6,7% – 100,0%",
    status: "Baik",
    statusType: "neutral",
    analyticalRole: "Kebugaran Fisik",
  },
  {
    code: "KAIH 2",
    name: "Bermasyarakat & Adab",
    mean: "74,58%",
    sd: "15,12%",
    median: "73,33%",
    range: "13,3% – 100,0%",
    status: "Baik",
    statusType: "neutral",
    analyticalRole: "Pengungkit Utama (Top Leverage)",
  },
  {
    code: "KAIH 6",
    name: "Istirahat & Jam Tidur",
    mean: "73,89%",
    sd: "14,97%",
    median: "73,33%",
    range: "26,7% – 100,0%",
    status: "Cukup",
    statusType: "warning",
    analyticalRole: "Fondasi Ritme Sirkadian",
  },
  {
    code: "KAIH 1",
    name: "Gemar Membaca & Riset",
    mean: "72,12%",
    sd: "15,48%",
    median: "66,67%",
    range: "26,7% – 100,0%",
    status: "Perlu Ditingkatkan",
    statusType: "danger",
    analyticalRole: "Literasi & Nalar Kognitif",
  },
];

// Variabel Dependen (Target Output)
const DESCRIPTIVE_DEPENDENT: DescriptiveRow = {
  code: "Variabel Y",
  name: "Kepercayaan Diri (Confidence)",
  mean: "74,14%",
  sd: "14,90%",
  median: "71,43%",
  range: "19,0% – 100,0%",
  status: "91,3% Positif",
  statusType: "success",
  analyticalRole: "Variabel Dependen (Target Output)",
};

const TRAJECTORY_DATA = [
  {
    grade: "Kelas X",
    fullName: "Kelas X (Santri Baru)",
    phase: "Fase 1: Adaptasi Awal",
    sampleSize: "N = 1.018 santri",
    confidency: 72.3,
    ikv: 73.0,
    anchoredLeaderPct: 19.0,
    exhaustedPct: 5.5,
    focus: 71.8,
    status: "Survival & Adaptasi",
    milestone: "Adaptasi aturan kamar dan pembiasaan qiyamullail awal.",
  },
  {
    grade: "Kelas XI",
    fullName: "Kelas XI (Fase Transisi)",
    phase: "Fase 2: Konsolidasi & Stabilisasi",
    sampleSize: "N = 2.134 santri",
    confidency: 75.0,
    ikv: 75.2,
    anchoredLeaderPct: 25.7,
    exhaustedPct: 3.9,
    focus: 74.6,
    status: "Konsolidasi Peran",
    milestone: "Mulai memegang tanggung jawab pengurus dan kepanitiaan pondok.",
  },
  {
    grade: "Kelas XII",
    fullName: "Kelas XII (Senior/Maturasi)",
    phase: "Fase 3: Puncak Maturasi & Kepemimpinan",
    sampleSize: "N = 970 santri",
    confidency: 80.4,
    ikv: 80.7,
    anchoredLeaderPct: 40.0,
    exhaustedPct: 0.0,
    focus: 80.1,
    status: "Kesiapan Pemimpin",
    milestone: "Mandiri total, percaya diri berpidato/kultum, dan ritme tidur tertata sempurna.",
  },
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

/**
 * Hook untuk mendeteksi saat diagram memasuki viewport agar animasi interaktif
 * (donut berputar, bar/line naik) terpicu seketika saat halaman dimuat atau di-scroll.
 */
function useChartInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

export default function PublicResearchReportPage() {
  const [selectedCohort, setSelectedCohort] = useState<string>("all");
  // Default tampilan Progressive Disclosure: Ringkasan Eksekutif + Pilar 1
  const [activePillar, setActivePillar] = useState<PillarTab>("descriptive");
  // State 3-Mode Switcher untuk Grafik Maturasi Kohort 3 Tahun
  const [trajectoryChartMode, setTrajectoryChartMode] = useState<"combined" | "confidence" | "leader">("combined");
  const [simInhibitionBoost, setSimInhibitionBoost] = useState<number>(5);
  const [categoryChartLayout, setCategoryChartLayout] = useState<"horizontal" | "vertical">("vertical");
  // State accordion / collapsible untuk menyederhanakan halaman panjang
  const [showStatsTable, setShowStatsTable] = useState<boolean>(false);
  const [showPolicyImplication1, setShowPolicyImplication1] = useState<boolean>(false);
  const [showDiagnosticImplication, setShowDiagnosticImplication] = useState<boolean>(false);
  const [showPredictiveImplication, setShowPredictiveImplication] = useState<boolean>(false);
  const [activePersonaIndex, setActivePersonaIndex] = useState<number | null>(null);

  // In-view hooks untuk memicu animasi saat diagram memasuki viewport
  const chart1View = useChartInView(0.1);
  const chartLeverageView = useChartInView(0.1);
  const chartMediationGaugeView = useChartInView(0.1);
  const chartPersonaDonutView = useChartInView(0.1);
  const chartTrajectoryView = useChartInView(0.1);

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
      gradId: k.gradId,
      accent: k.accent,
      impact: k.impact,
      icon: k.icon,
    })).sort((a, b) => b.r - a.r);
  }, [cohort]);

  const dimensionChartData = useMemo(() => {
    const dimLabels = [
      { name: "D1: Tindakan Fisik", key: "Tindakan Fisik", desc: "Konsistensi menjalankan rutinitas harian di asrama." },
      { name: "D2: Atensi Selektif", key: "Atensi Selektif", desc: "Kemampuan menahan distraksi suara dan obrolan saat belajar." },
      { name: "D3: Atensi Terbuka", key: "Atensi Terbuka", desc: "Kepekaan terhadap lingkungan sekitar dan dinamika sosial." },
      { name: "D4: Atensi Eksekutif", key: "Atensi Eksekutif", desc: "Kemampuan mengelola emosi dan menyusun jalan keluar masalah." },
      { name: "D5: Kepercayaan Diri (Confidence)", key: "Unjuk Diri", desc: "Keberanian berbicara, memimpin, dan menyampaikan pendapat." },
    ];
    return dimLabels.map((d, i) => ({
      ...d,
      score: cohort.dimScores[i],
    }));
  }, [cohort]);

  const personaChartData = useMemo(() => {
    const p = cohort.personas;
    const total = cohort.count;
    return [
      {
        name: "The Anchored Leader",
        count: p.anchoredLeader,
        pct: Number(((p.anchoredLeader / total) * 100).toFixed(1)),
        color: "#059669",
        bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
        borderLight: "border-emerald-200 dark:border-emerald-800",
        textColor: "text-emerald-700 dark:text-emerald-400",
        desc: "Disiplin tinggi, fokus terjaga, dan berani tampil memimpin forum.",
        action: "Diberikan amanah sebagai ketua komisi musyawarah santri, tutor sebaya (peer mentor), dan juru bicara acara pesantren.",
      },
      {
        name: "Progressing / Balanced",
        count: p.progressing,
        pct: Number(((p.progressing / total) * 100).toFixed(1)),
        color: "#0284c7",
        bgLight: "bg-sky-50 dark:bg-sky-950/30",
        borderLight: "border-sky-200 dark:border-sky-800",
        textColor: "text-sky-700 dark:text-sky-400",
        desc: "Perkembangan karakter berjalan stabil mengikuti arahan pembina.",
        action: "Dijaga stabilitas rutinitasnya dan diberikan ruang rotasi peran berkala agar terus naik ke level kepemimpinan mandiri.",
      },
      {
        name: "The Quiet Hafidz",
        count: p.quietHafidz,
        pct: Number(((p.quietHafidz / total) * 100).toFixed(1)),
        color: "#d97706",
        bgLight: "bg-amber-50 dark:bg-amber-950/30",
        borderLight: "border-amber-200 dark:border-amber-800",
        textColor: "text-amber-700 dark:text-amber-400",
        desc: "Hafalan dan fokus belajar kuat, namun enggan tampil di panggung.",
        action: "Pendekatan micro-coaching: mulai berbicara di lingkaran kecil halaqah, lalu kultum kamar, sebelum panggung besar.",
      },
      {
        name: "The Exhausted Santri",
        count: p.exhaustedSantri,
        pct: Number(((p.exhaustedSantri / total) * 100).toFixed(1)),
        color: "#e11d48",
        bgLight: "bg-rose-50 dark:bg-rose-950/30",
        borderLight: "border-rose-200 dark:border-rose-800",
        textColor: "text-rose-700 dark:text-rose-400",
        desc: "Kelelahan akibat jam tidur yang belum tertib di kamar.",
        action: "Pemberlakuan jam hening malam tanpa kompromi (21.30 WIB) dan eliminasi beban tugas kamar larut malam.",
      },
      {
        name: "The Mechanical Follower",
        count: p.mechanicalFollower,
        pct: Number(((p.mechanicalFollower / total) * 100).toFixed(1)),
        color: "#64748b",
        bgLight: "bg-slate-100 dark:bg-slate-800/60",
        borderLight: "border-slate-300 dark:border-slate-700",
        textColor: "text-slate-700 dark:text-slate-300",
        desc: "Hadir secara fisik di setiap agenda, namun kurang menyimak materi.",
        action: "Metode active recall dan tanya jawab interaktif saat tahsin/kajian agar santri terlibat aktif, bukan sekadar hadir raga.",
      },
      {
        name: "The Fragile Performer",
        count: p.fragilePerformer,
        pct: Number(((p.fragilePerformer / total) * 100).toFixed(1)),
        color: "#9333ea",
        bgLight: "bg-purple-50 dark:bg-purple-950/30",
        borderLight: "border-purple-200 dark:border-purple-800",
        textColor: "text-purple-700 dark:text-purple-400",
        desc: "Antusias tampil, namun mudah cemas saat argumennya diuji.",
        action: "Pelatihan resiliensi emosi dan pembiasaan menerima umpan balik kritis (growth mindset coaching) dari konselor BK.",
      },
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
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-full overflow-hidden">
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
      {/* ========================================================================= */}
      {/* 2. TAB SWITCHER 4 PILAR DATA SCIENCE (INTERAKTIF & STICKY)                */}
      {/* ========================================================================= */}
      <section className="bg-emerald-950 text-white border-b border-emerald-800/80 py-3 sm:py-3.5 px-3 sm:px-6 sticky top-16 z-40 shadow-xs max-w-full overflow-hidden">
        <div className="mx-auto max-w-5xl space-y-2 sm:space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
            <div className="flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                Pilih Tampilan Pilar Analisis Data Science:
              </span>
            </div>
            <span className="text-[11px] text-slate-300">
              Menampilkan {activePillar === "all" ? "Seluruh 4 Pilar (Mode Cetak)" : `Pilar ${activePillar === "descriptive" ? "1: Deskriptif" : activePillar === "diagnostic" ? "2: Diagnostik" : activePillar === "predictive" ? "3: Prediktif" : "4: Preskriptif"}`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:flex-wrap">
            <button
              type="button"
              onClick={() => setActivePillar("descriptive")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 sm:shrink focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                activePillar === "descriptive"
                  ? "bg-white text-emerald-950 shadow-xs"
                  : "bg-emerald-900/70 hover:bg-emerald-850 text-emerald-100 border border-emerald-700/60"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>1. Analisis Deskriptif</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePillar("diagnostic")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 sm:shrink focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                activePillar === "diagnostic"
                  ? "bg-white text-emerald-950 shadow-xs"
                  : "bg-emerald-900/70 hover:bg-emerald-850 text-emerald-100 border border-emerald-700/60"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              <span>2. Analisis Diagnostik</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePillar("predictive")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 sm:shrink focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                activePillar === "predictive"
                  ? "bg-white text-emerald-950 shadow-xs"
                  : "bg-emerald-900/70 hover:bg-emerald-850 text-emerald-100 border border-emerald-700/60"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>3. Analisis Prediktif</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePillar("prescriptive")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 sm:shrink focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                activePillar === "prescriptive"
                  ? "bg-white text-emerald-950 shadow-xs"
                  : "bg-emerald-900/70 hover:bg-emerald-850 text-emerald-100 border border-emerald-700/60"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              <span>4. Analisis Preskriptif</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePillar("all")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 sm:shrink focus-visible:outline-2 focus-visible:outline-emerald-400 sm:ml-auto ${
                activePillar === "all"
                  ? "bg-white text-emerald-950 shadow-xs"
                  : "bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60"
              }`}
              title="Tampilkan seluruh 4 pilar sekaligus untuk kebutuhan baca menyeluruh atau ekspor cetak PDF"
            >
              <Printer className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Mode Cetak (Semua Pilar)</span>
            </button>
          </div>
        </div>
      </section>

      {/* FILTER PILIHAN RESPONDEN (COHORT) */}
      <nav aria-label="Pemilihan kelompok responden" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 py-2 sm:py-2.5 px-3 sm:px-6 max-w-full overflow-hidden">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <Sliders className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Filter Kelompok Responden:
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:flex-wrap">
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
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer shrink-0 sm:shrink ${
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

      <main className="mx-auto max-w-5xl px-3 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12 sm:space-y-16 max-w-full overflow-x-hidden">
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* RINGKASAN POIN UTAMA (KEY TAKEAWAYS / EXECUTIVE SUMMARY)                  */}
        {/* ========================================================================= */}
        <section aria-labelledby="heading-ringkasan" className="space-y-4">
          <h2 id="heading-ringkasan" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Ringkasan Eksekutif (Executive Summary)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* KPI 1: Efek Mediasi Kausalitas */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Kunci Percaya Diri
                </span>
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Efek Mediasi Kausalitas
              </div>
              <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
                {formatNum(cohort.mediation.mediationPct, 1)}%
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                Sebagian besar rasa percaya diri santri terbentuk saat mereka mampu fokus belajar dan mengendalikan diri.
              </p>
            </div>

            {/* KPI 2: Korelasi Pearson (r) */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  Pengungkit Tertinggi
                </span>
                <TrendingUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Korelasi Pearson (r)
              </div>
              <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100 flex items-baseline gap-2">
                <span>r = 0,771</span>
                <span className="text-[10px] font-sans font-semibold text-blue-600 dark:text-blue-400">R² = 59,5%</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                Santri yang gemar membaca buku dan ramah bergaul terbukti paling berani tampil dan berbicara di forum umum.
              </p>
            </div>

            {/* KPI 3: Skor Dimensi Terendah */}
            <div className="p-4 rounded-xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  Hambatan Utama
                </span>
                <AlertCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="text-[10px] font-semibold text-rose-600/80 dark:text-rose-400/80 uppercase tracking-wider">
                Skor Dimensi Terendah
              </div>
              <div className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
                {formatNum(cohort.dimScores[1], 2)}%
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                Santri paling sering kesulitan menahan godaan mengobrol dan suara bising saat belajar malam di asrama.
              </p>
            </div>

            {/* KPI 4: Rata-Rata 7 KAIH */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Indeks Karakter IKV
                </span>
                <ShieldCheck className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Rata-Rata 7 KAIH
              </div>
              <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100 flex items-baseline gap-2">
                <span>{formatNum(cohort.ikv, 2)}%</span>
                <span className="text-[10px] font-sans font-semibold text-emerald-600 dark:text-emerald-400">Kategori Baik</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                Secara umum, kedisiplinan dan kebiasaan harian santri sudah berjalan tertib, sehat, dan konsisten.
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
            {/* SUB-BAB 1.1: DIAGRAM BATANG SEBARAN KATEGORI & 4 KARTU LANDSCAPE DI BAWAH */}
            {/* ========================================================================= */}
            <Card className="w-full border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Sub-Bab 1.1: Sebaran Kategori Tingkat Kepercayaan Diri
                      </span>
                    </div>
                    <CardTitle className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <span>Diagram Batang Sebaran Kategori Kepercayaan Diri ({cohort.name})</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Distribusi santri berdasarkan 4 tingkatan unjuk diri dan profil karakteristiknya.
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Badge variant="outline" className="font-mono text-xs px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700">
                      {formatNum(positivePercentage, 1)}% Kategori Positif
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-8 space-y-6">
                {/* 1. DIAGRAM BATANG SEBARAN KATEGORI (FULL-WIDTH) */}
                <div
                  ref={chart1View.ref}
                  className={`h-[320px] sm:h-[360px] w-full pt-2 transition-all duration-700 ${
                    chart1View.isInView ? "animate-chart-rise opacity-100" : "opacity-0 translate-y-6"
                  }`}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      key={`cat-chart-${selectedCohort}-${chart1View.isInView ? "in" : "out"}`}
                      data={confidenceCategoryData}
                      layout="horizontal"
                      margin={{ top: 35, right: 20, left: 10, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} stroke="#cbd5e1" />
                      <XAxis
                        type="category"
                        dataKey="shortLabel"
                        stroke="#94a3b8"
                        fontSize={12}
                        fontWeight={600}
                        axisLine={false}
                        tickLine={false}
                        dy={8}
                      />
                      <YAxis
                        type="number"
                        domain={[0, 1650]}
                        stroke="#94a3b8"
                        fontSize={11}
                        fontWeight={500}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v.toLocaleString("id-ID")}`}
                        dx={-5}
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
                                    {data.count.toLocaleString("id-ID")} santri ({formatNum(data.pct, 1)}%)
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
                        radius={[10, 10, 0, 0]}
                        maxBarSize={64}
                        isAnimationActive={true}
                        animationDuration={1400}
                        animationEasing="ease-out"
                      >
                        {confidenceCategoryData.map((entry) => (
                          <Cell key={entry.key} fill={entry.color} />
                        ))}
                        <LabelList
                          dataKey="count"
                          position="top"
                          content={(props: any) => {
                            const { x, y, width, value } = props;
                            if (x === undefined || y === undefined || width === undefined || value === undefined) return null;
                            const item = confidenceCategoryData.find((c) => c.count === value);
                            if (!item) return null;
                            const pillW = 104;
                            const pillH = 24;
                            const formatted = `${item.count.toLocaleString("id-ID")} (${formatNum(item.pct, 1)}%)`;
                            return (
                              <g transform={`translate(${Number(x) + Number(width) / 2 - pillW / 2}, ${Number(y) - pillH - 4})`}>
                                <rect
                                  x={0}
                                  y={0}
                                  width={pillW}
                                  height={pillH}
                                  rx={12}
                                  className="fill-white dark:fill-slate-900"
                                  stroke={item.color}
                                  strokeWidth={1.2}
                                  style={{ filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08))" }}
                                />
                                <text
                                  x={pillW / 2}
                                  y={16}
                                  textAnchor="middle"
                                  fill={item.color}
                                  style={{
                                    fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif",
                                    fontSize: 10.5,
                                    fontWeight: 700,
                                  }}
                                >
                                  {formatted}
                                </text>
                              </g>
                            );
                          }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* 2. 4 KARTU KARAKTERISTIK LANDSCAPE DI BAWAH GRAFIK (SESUAI PERMINTAAN USER) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {confidenceCategoryData.map((item) => (
                    <div
                      key={item.key}
                      className={`p-4 rounded-xl border-2 ${item.borderLight} ${item.bgLight} transition-all space-y-2.5 shadow-xs flex flex-col justify-between`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                              {item.category}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shrink-0 font-semibold text-slate-600 dark:text-slate-300">
                            {item.range}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2 pt-0.5">
                          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                            {item.count.toLocaleString("id-ID")}
                          </span>
                          <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${item.textColor} bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60`}>
                            {formatNum(item.pct, 1)}%
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Key Takeaway Ringkas di Bawah Bento Card (Maksimal 2 Kalimat) */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Key Takeaway:</strong> Sebanyak <strong>{formatNum(positivePercentage, 1)}% santri</strong> berada pada kategori percaya diri hingga sangat percaya diri (skor &gt; 70%), dengan hanya <strong>{cohort.categories.perluBimbingan} santri ({formatNum((cohort.categories.perluBimbingan / cohort.count) * 100, 1)}%)</strong> yang membutuhkan pendampingan khusus. Pembiasaan komunal pesantren terbukti memberikan rasa aman dasar (<em>basic psychological safety</em>) yang meminimalkan kecemasan sosial santri.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* ========================================================================= */}
            {/* SUB-BAB 1.2: KOMPARASI DEMOGRAFI & DINAMIKA MATURASI SANTRI               */}
            {/* ========================================================================= */}
            <Card className="w-full border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        Sub-Bab 1.2: Dinamika Demografi &amp; Maturasi
                      </span>
                    </div>
                    <CardTitle className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span>Komparasi Demografi &amp; Dinamika Maturasi Santri</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Temuan kunci bagaimana masa tinggal di asrama (Kelas X &rarr; XI &rarr; XII) dan faktor gender membentuk kematangan rasa percaya diri.
                    </CardDescription>
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

              <CardContent className="p-5 sm:p-8">
                {/* 3 BLOK HERO LANDSCAPE BERDAMPINGAN */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                  {/* KARTU 1: MATURASI 3 TAHUN KELAS XII */}
                  <div className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-200/80 dark:border-emerald-900/60 bg-gradient-to-b from-emerald-50/40 to-white dark:from-emerald-950/20 dark:to-slate-900 flex flex-col justify-between space-y-4 shadow-xs">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between gap-1.5 pb-0.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 whitespace-nowrap">
                          <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                          Maturasi 3 Tahun
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-900/60">
                          X &rarr; XII
                        </span>
                      </div>

                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
                            +8,2%
                          </span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            (72,3% &rarr; 80,4%)
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-1 leading-snug">
                          Lonjakan Kepercayaan Diri di Kelas XII
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          Skor rata-rata naik konsisten dari 72,3% (Kelas X) menjadi 80,4% (Kelas XII).
                        </p>
                      </div>

                      {/* Visual Progress Bar Komparasi Antar Tingkat */}
                      <div className="space-y-2.5 pt-2.5 border-t border-emerald-100 dark:border-emerald-900/40">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Trajektori Progres per Angkatan:
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-slate-600 dark:text-slate-400">Kelas X (Adaptasi)</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300 tabular-nums">72,3%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-slate-400 dark:bg-slate-500 rounded-full" style={{ width: "72.3%" }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-slate-600 dark:text-slate-400">Kelas XI (Konsolidasi)</span>
                            <span className="font-bold text-teal-700 dark:text-teal-400 tabular-nums">74,1%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-teal-500 rounded-full" style={{ width: "74.1%" }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold">Kelas XII (Puncak Maturasi)</span>
                            <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">80,4%</span>
                          </div>
                          <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-emerald-600 rounded-full shadow-xs" style={{ width: "80.4%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1 mt-3">
                      <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span>Lonjakan Pemimpin Mandiri (2,1x Lipat):</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        Proporsi santri teladan (<em>The Anchored Leader</em>) melompat dari <strong>19,0%</strong> di kelas X menjadi <strong>40,0%</strong> di kelas XII.
                      </p>
                    </div>
                  </div>

                  {/* KARTU 2: DINAMIKA GENDER (AKHWAT VS IKHWAN) */}
                  <div className="p-4 sm:p-5 rounded-2xl border-2 border-teal-200/80 dark:border-teal-900/60 bg-gradient-to-b from-teal-50/40 to-white dark:from-teal-950/20 dark:to-slate-900 flex flex-col justify-between space-y-4 shadow-xs">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between gap-1.5 pb-0.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 whitespace-nowrap">
                          <Award className="h-3.5 w-3.5 shrink-0" />
                          Dinamika Gender
                        </span>
                        <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 whitespace-nowrap bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200/60 dark:border-teal-900/60">
                          Akhwat vs Ikhwan
                        </span>
                      </div>

                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-teal-600 dark:text-teal-400 tabular-nums">
                            75,7%
                          </span>
                          <span className="text-xs font-semibold text-slate-400">vs</span>
                          <span className="text-xl sm:text-2xl font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                            73,3%
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-1 leading-snug">
                          Keteraturan Habituasi Santriwati Akhwat
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          Santriwati mencatatkan konsistensi jadwal dan kerapian adab komunal lebih tertib.
                        </p>
                      </div>

                      {/* Visual Progress Bar Komparasi Gender */}
                      <div className="space-y-2.5 pt-2.5 border-t border-teal-100 dark:border-teal-900/40">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Perbandingan Dimensi Kunci:
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-teal-700 dark:text-teal-400 font-bold">Akhwat: Ibadah &amp; Adab Kamar</span>
                            <span className="font-bold text-teal-700 dark:text-teal-400 tabular-nums">76,8%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-teal-600 rounded-full" style={{ width: "76.8%" }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-slate-600 dark:text-slate-400">Ikhwan: Ibadah &amp; Adab Kamar</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300 tabular-nums">74,7%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-slate-400 dark:bg-slate-500 rounded-full" style={{ width: "74.7%" }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">Ikhwan: Aksi Fisik &amp; Panggung</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400 tabular-nums">74,6%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: "74.6%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1 mt-3">
                      <div className="font-bold text-teal-900 dark:text-teal-300 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal-600" />
                        <span>Karakteristik Unik Dua Kelompok:</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        Santriwati unggul pada ketelitian catatan &amp; adab kamar. Santriwan lebih berani dalam unjuk suara spontan &amp; aktivitas fisik.
                      </p>
                    </div>
                  </div>

                  {/* KARTU 3: PENURUNAN MASALAH KURANG TIDUR */}
                  <div className="p-4 sm:p-5 rounded-2xl border-2 border-amber-200/80 dark:border-amber-900/60 bg-gradient-to-b from-amber-50/40 to-white dark:from-amber-950/20 dark:to-slate-900 flex flex-col justify-between space-y-4 shadow-xs">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between gap-1.5 pb-0.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 whitespace-nowrap">
                          <Moon className="h-3.5 w-3.5 shrink-0" />
                          Ritme Sirkadian
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-900/60">
                          0% Kasus di XII
                        </span>
                      </div>

                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400 tabular-nums">
                            3,9%
                          </span>
                          <span className="text-sm font-bold text-slate-400">&rarr;</span>
                          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
                            0,0%
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                            Nihil
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-1 leading-snug">
                          Penyusutan Masalah Kurang Tidur
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          Santri yang mengalami kelelahan kronis tereliminasi total seiring bertambahnya usia tinggal.
                        </p>
                      </div>

                      {/* Visual Progress Bar Penyusutan Santri Lelah */}
                      <div className="space-y-2.5 pt-2.5 border-t border-amber-100 dark:border-amber-900/40">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Prevalensi Santri Lelah Kronis:
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-medium gap-2">
                            <span className="text-slate-600 dark:text-slate-400 truncate">Kelas X (Adaptasi)</span>
                            <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums whitespace-nowrap">5,5%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-rose-500 rounded-full" style={{ width: "55%" }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-medium gap-2">
                            <span className="text-slate-600 dark:text-slate-400 truncate">Kelas XI (Penyesuaian)</span>
                            <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums whitespace-nowrap">3,9%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: "39%" }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-medium gap-2">
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold truncate">Kelas XII (Tereliminasi)</span>
                            <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums whitespace-nowrap">0,0% (Nol)</span>
                          </div>
                          <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "0%" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1 mt-3">
                      <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                        <span>Bukti Kematangan Jam Biologis:</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        Santri senior kelas XII berhasil membangun ritme tidur sirkadian mandiri tanpa begadang, menjaga kesiapan prima menjelang kelulusan.
                      </p>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* ========================================================================= */}
            {/* SUB-BAB 1.3: TABEL STATISTIK DESKRIPTIF LENGKAP (COLLAPSIBLE / ACCORDION)  */}
            {/* ========================================================================= */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Sub-Bab 1.3: Parameter Statistik Deskriptif
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    Tabel Parameter Statistik Deskriptif (N = 3.152)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data mentah rincian Nilai Tengah (Mean), Standar Deviasi, Median, Rentang, Status, dan Peran Analitis.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStatsTable(!showStatsTable)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-2 cursor-pointer shrink-0 shadow-xs"
                >
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <span>{showStatsTable ? "Tutup Tabel Rincian" : "Lihat Rincian Statistik (8 Parameter)"}</span>
                  {showStatsTable ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>

              {showStatsTable && (
                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-all">
                  <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <CardTitle className="text-xs sm:text-sm font-bold flex items-center justify-between">
                      <span>Rincian Distribusi Statistik: 7 Variabel Independen (X) &amp; 1 Variabel Dependen (Y)</span>
                      <span className="text-[11px] font-mono text-slate-500">Skala Dinormalisasi 0 - 100%</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Baris diurutkan berdasarkan nilai rata-rata (Mean) tertinggi ke terendah untuk memperjelas kontras performa pembiasaan.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                            <th className="py-2.5 px-3">Variabel &amp; Parameter</th>
                            <th className="py-2.5 px-3">Rata-rata (Mean)</th>
                            <th className="py-2.5 px-3">Standar Deviasi</th>
                            <th className="py-2.5 px-3">Median</th>
                            <th className="py-2.5 px-3">Rentang (Min – Max)</th>
                            <th className="py-2.5 px-3">Status Karakter</th>
                            <th className="py-2.5 px-3">Peran Analitis</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                          {DESCRIPTIVE_INDEPENDENT.map((row) => (
                            <tr key={row.code} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                              <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold mr-1.5">{row.code}</span>
                                <span>{row.name}</span>
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                                {row.mean}
                              </td>
                              <td className="py-2.5 px-3 font-mono">{row.sd}</td>
                              <td className="py-2.5 px-3 font-mono">{row.median}</td>
                              <td className="py-2.5 px-3 font-mono text-slate-500">{row.range}</td>
                              <td className="py-2.5 px-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                    row.statusType === "success"
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                      : row.statusType === "warning"
                                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                      : row.statusType === "danger"
                                      ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                                      : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                                  }`}
                                >
                                  {row.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                {row.analyticalRole}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        {/* FOOTER KHUSUS VARIABEL DEPENDEN (TARGET OUTPUT) */}
                        <tfoot>
                          <tr className="bg-emerald-50/70 dark:bg-emerald-950/40 border-t-2 border-emerald-500/80 font-bold text-slate-900 dark:text-slate-100">
                            <td className="py-3 px-3">
                              <span className="font-mono text-blue-600 dark:text-blue-400 mr-1.5">{DESCRIPTIVE_DEPENDENT.code}:</span>
                              <span>{DESCRIPTIVE_DEPENDENT.name}</span>
                            </td>
                            <td className="py-3 px-3 font-mono text-emerald-700 dark:text-emerald-300 text-sm">
                              {DESCRIPTIVE_DEPENDENT.mean}
                            </td>
                            <td className="py-3 px-3 font-mono">{DESCRIPTIVE_DEPENDENT.sd}</td>
                            <td className="py-3 px-3 font-mono">{DESCRIPTIVE_DEPENDENT.median}</td>
                            <td className="py-3 px-3 font-mono text-slate-500">{DESCRIPTIVE_DEPENDENT.range}</td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200/80 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                                {DESCRIPTIVE_DEPENDENT.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                              {DESCRIPTIVE_DEPENDENT.analyticalRole}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* BLOK IMPLIKASI KEBIJAKAN PILAR 1 (DI AKHIR PILAR 1) */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-blue-950/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                      Implikasi Kebijakan Pilar 1
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      Sistem Pembiasaan Asrama sebagai Inkubator Karakter Berkelanjutan
                    </h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPolicyImplication1(!showPolicyImplication1)}
                  className="px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white/90 dark:bg-slate-900/90 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                >
                  <span>{showPolicyImplication1 ? "Tutup Catatan" : "Buka Catatan Kebijakan"}</span>
                  {showPolicyImplication1 ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
              </div>

              {showPolicyImplication1 && (
                <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 shadow-xs transition-all">
                  <p>
                    Data empiris membuktikan bahwa <strong>sistem pembiasaan asrama (boarding school) bukan sekadar mendisiplinkan fisik</strong>, melainkan secara empiris berfungsi sebagai inkubator pematangan karakter. Transisi 3 tahun berhasil melipatgandakan figur pemimpin berani (+8,2% rasa percaya diri) dan menuntaskan masalah kelelahan santri (0,0% di kelas XII).
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    <strong>Rekomendasi Manajemen:</strong> Pertahankan sistem halaqah adab kamar dan perkuat pendampingan santri baru kelas X pada 90 hari pertama adaptasi guna mempercepat transisi ritme biologis sirkadian.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

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

            {/* Sub-Bab 2A: Daya Hubung Korelasi Pearson (Warna Bervariasi & Font Elegan) */}
            <Card className="w-full border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Sub-Bab 2.1: Analisis Korelasional &amp; Daya Pengaruh
                      </span>
                    </div>
                    <CardTitle className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
                      <Compass className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <span>Diagnostik Daya Ungkit (Korelasi Pearson r &amp; Kontribusi R²)</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Peringkat kekuatan 7 Kebiasaan Harian (7 KAIH) sebagai motor pengungkit rasa percaya diri santri.
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2 self-start lg:self-auto px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Nilai r &ge; 0,70 = Korelasi Sangat Kuat</span>
                  </div>
                </div>

                {/* 3 TOP LEVERAGE DRIVERS HIGHLIGHT CHIPS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-1">
                  {leverageChartData.slice(0, 3).map((item, rank) => {
                    return (
                      <div
                        key={item.name}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-850/90 shadow-xs"
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center font-extrabold text-xs text-white shrink-0 shadow-sm"
                          style={{ backgroundColor: item.color }}
                        >
                          #{rank + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                              {item.fullName}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span
                              className="font-mono text-xs font-extrabold"
                              style={{ color: item.color }}
                            >
                              r = {item.r.toFixed(3)}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              (R²: {item.r2}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-7 space-y-6">
                {/* GRAFIK BAR HORIZONTAL DENGAN WARNA BERVARIASI & FONT ELEGAN */}
                <div
                  ref={chartLeverageView.ref}
                  className={`h-96 sm:h-[430px] w-full transition-all duration-700 ${
                    chartLeverageView.isInView ? "animate-chart-fade opacity-100" : "opacity-0 translate-y-4"
                  }`}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      key={`leverage-chart-${selectedCohort}-${chartLeverageView.isInView ? "in" : "out"}`}
                      data={leverageChartData}
                      layout="vertical"
                      margin={{ top: 10, right: 130, left: 95, bottom: 10 }}
                      barCategoryGap="22%"
                    >
                      <defs>
                        {/* Gradasi Tiap Pilar (Vibrant & Elegan) */}
                        <linearGradient id="grad-bermasyarakat" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <linearGradient id="grad-membaca" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>
                        <linearGradient id="grad-olahraga" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                        <linearGradient id="grad-jamtidur" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#6d28d9" />
                        </linearGradient>
                        <linearGradient id="grad-ibadah" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#0891b2" />
                        </linearGradient>
                        <linearGradient id="grad-makansehat" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#f43f5e" />
                          <stop offset="100%" stopColor="#be123c" />
                        </linearGradient>
                        <linearGradient id="grad-bangunpagi" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#eab308" />
                          <stop offset="100%" stopColor="#ca8a04" />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" opacity={0.12} horizontal={false} />

                      <XAxis
                        type="number"
                        domain={[0, 1]}
                        ticks={[0, 0.25, 0.5, 0.75, 1.0]}
                        tickFormatter={(v) => `r = ${v.toFixed(2)}`}
                        stroke="#94a3b8"
                        fontSize={12}
                        fontWeight={600}
                        tickLine={false}
                      />

                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#94a3b8"
                        tick={(props: any) => {
                          const { x, y, payload } = props;
                          return (
                            <g transform={`translate(${x},${y})`}>
                              <text
                                x={-10}
                                y={4}
                                textAnchor="end"
                                className="fill-slate-800 dark:fill-slate-200 text-xs font-semibold"
                                style={{ fontSize: 12.5, fontWeight: 600 }}
                              >
                                {payload.value}
                              </text>
                            </g>
                          );
                        }}
                        tickLine={false}
                        axisLine={{ stroke: "#cbd5e1", strokeWidth: 1.5 }}
                        width={95}
                      />

                      <Tooltip
                        cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-slate-950/95 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border border-slate-800 text-xs max-w-sm space-y-2.5">
                                <div className="border-b border-slate-800 pb-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-sm text-slate-100">{d.fullName}</span>
                                    <span
                                      className="font-mono text-[10px] px-2 py-0.5 rounded-full font-semibold"
                                      style={{ backgroundColor: `${d.color}25`, color: d.color }}
                                    >
                                      {d.tier}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-medium">
                                    Peringkat Daya Ungkit: #{leverageChartData.findIndex((x) => x.name === d.name) + 1} dari 7
                                  </span>
                                </div>

                                <div className="space-y-1.5 font-mono text-xs">
                                  <div className="flex justify-between items-center">
                                    <span className="text-slate-400 font-sans">Korelasi Pearson (r):</span>
                                    <span className="font-bold text-sm" style={{ color: d.color }}>
                                      r = {d.r.toFixed(4)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center text-amber-400">
                                    <span className="text-slate-400 font-sans">Daya Sumbang (R²):</span>
                                    <span className="font-bold">{d.r2}% varians</span>
                                  </div>
                                  <div className="flex justify-between items-center text-emerald-400">
                                    <span className="text-slate-400 font-sans">Skor Rata-rata Santri:</span>
                                    <span className="font-bold">{d.score}%</span>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 leading-relaxed italic">
                                  &ldquo;{d.impact}&rdquo;
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      <Bar
                        dataKey="r"
                        radius={[0, 6, 6, 0]}
                        barSize={24}
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-out"
                      >
                        {leverageChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`url(#${entry.gradId || "grad-bermasyarakat"})`}
                          />
                        ))}
                        <LabelList
                          dataKey="r"
                          position="right"
                          offset={12}
                          content={(props: any) => {
                            const { x, y, width, height, index } = props;
                            if (x === undefined || y === undefined || index === undefined) return null;
                            const item = leverageChartData[index];
                            if (!item) return null;
                            return (
                              <text
                                x={Number(x) + Number(width) + 10}
                                y={Number(y) + Number(height) / 2 + 4}
                                fill={item.color}
                                className="tracking-tight"
                                style={{
                                  fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif",
                                  fontSize: 11,
                                  fontWeight: 600,
                                }}
                              >
                                {`r = ${item.r.toFixed(3)} (${item.r2.toFixed(1).replace(".", ",")}%)`}
                              </text>
                            );
                          }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* CALLOUT BOX DIAGNOSA DAYA UNGKIT */}
                <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-blue-50/50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-blue-950/30 border border-emerald-200/80 dark:border-emerald-800/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                  <div className="font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <span>Diagnosa Ilmiah Daya Ungkit (Top Leverage Drivers):</span>
                  </div>
                  <p>
                    Data empiris membuktikan bahwa <strong>Bermasyarakat &amp; Adab (r = 0,771 • R² = 59,5%)</strong> serta <strong>Gemar Membaca &amp; Riset (r = 0,744 • R² = 55,3%)</strong> merupakan dua pilar dengan korelasi terkuat terhadap rasa percaya diri santri.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    <strong>Mekanisme Kognitif:</strong> Membaca memperkaya struktur argumen dan keluasan perbendaharaan kata, sedangkan pembiasaan adab bermasyarakat meniadakan kecemasan sosial ketika berhadapan dengan forum publik. Kombinasi keduanya menjadi katalis utama transformasi santri menjadi <em>The Anchored Leader</em>.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sub-Bab 2B: Titik Bocor Transmisi Kognitif */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-600" />
                Sub-Bab 2.2: Diagnostik Pipa Transmisi Kognitif (Titik Hambatan Atensi Selektif D2)
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

            {/* Sub-Bab 2C: Pembuktian Jalur Mediasi Barron & Kenny (Dua Donut Gauge Analisis Jalur A & B) */}
            <Card className="w-full border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        Sub-Bab 2.3: Pembuktian Jalur Mediasi Kausalitas
                      </span>
                    </div>
                    <CardTitle className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
                      <BrainCircuit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span>Analisis Jalur Mediasi Kausalitas (Konsistensi ➔ Fokus ➔ Percaya Diri)</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Membuktikan secara empiris apakah pembiasaan fisik langsung memicu rasa percaya diri atau wajib melewati gerbang fokus belajar.
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Badge variant="outline" className="font-mono text-xs px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-bold">
                      Efek Mediasi: {formatNum(cohort.mediation.mediationPct, 1)}% (Dominan)
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-8 space-y-7">
                {/* 1. DUA KARTU DONUT GAUGE ANALISIS JALUR (PERSIS GAMBAR REFERENSI USER) */}
                <div ref={chartMediationGaugeView.ref} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* KARTU 1: JALUR A (KONSISTENSI -> FOKUS BELAJAR) */}
                  <div className="p-6 sm:p-7 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/50 bg-gradient-to-b from-emerald-50/40 via-white to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 shadow-sm flex flex-col items-center text-center space-y-4 hover:border-emerald-200 transition-all">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/90 dark:border-emerald-800 text-[11px] font-bold tracking-wider uppercase shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Analisis Jalur (Jalur A)
                    </span>

                    {/* Donut Gauge Visual: Emerald 74,9% (r = +0,749) */}
                    <div className="relative w-44 h-44 flex items-center justify-center my-1">
                      <svg
                        className={`w-full h-full transform transition-all duration-1000 ease-out ${
                          chartMediationGaugeView.isInView ? "animate-gauge-spin opacity-100" : "-rotate-180 scale-75 opacity-0"
                        }`}
                        viewBox="0 0 100 100"
                      >
                        {/* Lingkaran Jalur Abu-abu Latar */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          className="stroke-slate-100 dark:stroke-slate-800"
                          strokeWidth="11"
                          fill="transparent"
                        />
                        {/* Busur Progres Donat Hijau */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke="#10b981"
                          strokeWidth="11"
                          strokeDasharray={2 * Math.PI * 38}
                          strokeDashoffset={
                            chartMediationGaugeView.isInView
                              ? 2 * Math.PI * 38 * (1 - (selectedCohort === "all" ? 0.749 : cohort.mediation.pathA))
                              : 2 * Math.PI * 38
                          }
                          strokeLinecap="round"
                          fill="transparent"
                          style={{
                            transition: "stroke-dashoffset 1.6s cubic-bezier(0.16, 1, 0.3, 1)",
                            filter: "drop-shadow(0 2px 4px rgba(16, 185, 129, 0.25))",
                          }}
                        />
                      </svg>
                      {/* Teks Angka di Tengah Donat */}
                      <div
                        className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 ${
                          chartMediationGaugeView.isInView ? "opacity-100 scale-100 delay-300" : "opacity-0 scale-75"
                        }`}
                      >
                        <span className="text-3xl sm:text-4xl font-black font-sans text-slate-900 dark:text-white tracking-tight tabular-nums drop-shadow-xs">
                          {selectedCohort === "all" ? "74,9%" : `${formatNum(cohort.mediation.pathA * 100, 1)}%`}
                        </span>
                        <span className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-sans tracking-wide bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 tabular-nums">
                          r = +{selectedCohort === "all" ? "0,749" : formatNum(cohort.mediation.pathA, 3)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1 text-center">
                      <h4 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2">
                        <span className="text-slate-900 dark:text-white">Konsistensi</span>
                        <ArrowRight className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                        <span className="text-emerald-700 dark:text-emerald-400 font-black">Fokus Belajar</span>
                      </h4>
                      <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs sm:max-w-sm mx-auto font-normal">
                        Pengaruh pembiasaan fisik harian terhadap ketahanan konsentrasi dan kemampuan menyaring distraksi.
                      </p>
                    </div>

                    {/* Footer Stats Table */}
                    <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-[13px] space-y-2 text-left font-sans">
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span className="font-medium">Koefisien Determinasi (R²):</span>
                        <span className="font-bold text-slate-900 dark:text-white tabular-nums text-sm">
                          {selectedCohort === "all" ? "56%" : `${Math.round(cohort.mediation.pathA ** 2 * 100)}%`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-600 dark:text-slate-400">Signifikansi Hubungan:</span>
                        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Sangat Kuat (p &lt; .001)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* KARTU 2: JALUR B (FOKUS BELAJAR -> CONFIDENCY) */}
                  <div className="p-6 sm:p-7 rounded-2xl border-2 border-amber-100 dark:border-amber-900/50 bg-gradient-to-b from-amber-50/40 via-white to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 shadow-sm flex flex-col items-center text-center space-y-4 hover:border-amber-200 transition-all">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200/90 dark:border-amber-800 text-[11px] font-bold tracking-wider uppercase shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Analisis Jalur (Jalur B)
                    </span>

                    {/* Donut Gauge Visual: Amber 91,8% (r = +0,918) */}
                    <div className="relative w-44 h-44 flex items-center justify-center my-1">
                      <svg
                        className={`w-full h-full transform transition-all duration-1000 ease-out ${
                          chartMediationGaugeView.isInView ? "animate-gauge-spin opacity-100" : "-rotate-180 scale-75 opacity-0"
                        }`}
                        viewBox="0 0 100 100"
                      >
                        {/* Lingkaran Jalur Abu-abu Latar */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          className="stroke-slate-100 dark:stroke-slate-800"
                          strokeWidth="11"
                          fill="transparent"
                        />
                        {/* Busur Progres Donat Emas */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke="#f59e0b"
                          strokeWidth="11"
                          strokeDasharray={2 * Math.PI * 38}
                          strokeDashoffset={
                            chartMediationGaugeView.isInView
                              ? 2 * Math.PI * 38 * (1 - (selectedCohort === "all" ? 0.918 : cohort.mediation.pathB))
                              : 2 * Math.PI * 38
                          }
                          strokeLinecap="round"
                          fill="transparent"
                          style={{
                            transition: "stroke-dashoffset 1.6s cubic-bezier(0.16, 1, 0.3, 1)",
                            filter: "drop-shadow(0 2px 4px rgba(245, 158, 11, 0.25))",
                          }}
                        />
                      </svg>
                      {/* Teks Angka di Tengah Donat */}
                      <div
                        className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 ${
                          chartMediationGaugeView.isInView ? "opacity-100 scale-100 delay-300" : "opacity-0 scale-75"
                        }`}
                      >
                        <span className="text-3xl sm:text-4xl font-black font-sans text-slate-900 dark:text-white tracking-tight tabular-nums drop-shadow-xs">
                          {selectedCohort === "all" ? "91,8%" : `${formatNum(cohort.mediation.pathB * 100, 1)}%`}
                        </span>
                        <span className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-sans tracking-wide bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800 tabular-nums">
                          r = +{selectedCohort === "all" ? "0,918" : formatNum(cohort.mediation.pathB, 3)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1 text-center">
                      <h4 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2">
                        <span className="text-slate-900 dark:text-white">Fokus Belajar</span>
                        <ArrowRight className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0 stroke-[2.5]" />
                        <span className="text-amber-700 dark:text-amber-400 font-black">Confidency</span>
                      </h4>
                      <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs sm:max-w-sm mx-auto font-normal">
                        Pengaruh regulasi logika dan kestabilan atensi terhadap kemantapan santri berbicara dan memimpin di muka umum.
                      </p>
                    </div>

                    {/* Footer Stats Table */}
                    <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-[13px] space-y-2 text-left font-sans">
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span className="font-medium">Koefisien Determinasi (R²):</span>
                        <span className="font-bold text-slate-900 dark:text-white tabular-nums text-sm">
                          {selectedCohort === "all" ? "84%" : `${Math.round(cohort.mediation.pathB ** 2 * 100)}%`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-600 dark:text-slate-400">Signifikansi Hubungan:</span>
                        <span className="inline-flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Sangat Kuat (p &lt; .001)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. DIAGRAM SKEMATIK JALUR MEDIASI (X ➔ M ➔ Y) */}
                <div className="p-5 sm:p-6 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-inner">
                  <div className="text-[11px] font-mono uppercase font-bold text-slate-400 mb-3 tracking-wider text-center sm:text-left">
                    Rantai Kausalitas Barron &amp; Kenny (Tiga Variabel Utama):
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center">
                    <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/80 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider">Variabel X (Independen)</span>
                      <h4 className="text-sm font-bold text-white">Rutinitas Fisik 7 KAIH</h4>
                      <p className="text-xs text-slate-400">Tindakan Disiplin Asrama</p>
                      <div className="text-xs font-mono font-bold text-emerald-300 pt-1 border-t border-slate-700/60 mt-1">
                        Rata-rata: {cohort.avgAction}%
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-950/50 space-y-1 shadow-lg ring-1 ring-emerald-500/30">
                      <span className="text-[10px] font-mono uppercase text-amber-300 font-bold tracking-wider">Variabel Mediator (M)</span>
                      <h4 className="text-sm font-bold text-white">Fokus Belajar &amp; Regulasi Diri</h4>
                      <p className="text-xs text-slate-300">Konsentrasi &amp; Pengendalian Emosi</p>
                      <div className="text-xs font-mono font-bold text-amber-300 pt-1 border-t border-emerald-800/60 mt-1">
                        Rata-rata: {cohort.avgFocus}%
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/80 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-sky-400 font-bold tracking-wider">Variabel Y (Dependen)</span>
                      <h4 className="text-sm font-bold text-white">Kepercayaan Diri (Confidence)</h4>
                      <p className="text-xs text-slate-400">Keberanian Tampil &amp; Bicara</p>
                      <div className="text-xs font-mono font-bold text-sky-300 pt-1 border-t border-slate-700/60 mt-1">
                        Rata-rata: {cohort.avgConfidence}%
                      </div>
                    </div>
                  </div>

                  {/* Koefisien Jalur Regresi */}
                  <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-center">
                    <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                      <span className="text-slate-400 text-[11px]">Jalur a (Rutinitas → Fokus):</span>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">β = {cohort.mediation.pathA}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                      <span className="text-slate-400 text-[11px]">Jalur b (Fokus → Percaya Diri):</span>
                      <div className="text-base font-bold text-amber-400 mt-0.5">β = {cohort.mediation.pathB}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                      <span className="text-slate-400 text-[11px]">Jalur c&#39; (Pengaruh Langsung Tanpa M):</span>
                      <div className="text-base font-bold text-slate-300 mt-0.5">β = {cohort.mediation.pathCPrime}</div>
                    </div>
                  </div>
                </div>

                {/* 3. DEKOMPOSISI PROPORSI EFEK TRANSMISI (PROGRESS SPLIT) */}
                <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-emerald-600" />
                      <span>Dekomposisi Penyaluran Pengaruh ke Percaya Diri:</span>
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-600">
                      Total Effect: r = {cohort.mediation.totalEffect}
                    </span>
                  </div>

                  {/* Split Bar */}
                  <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800 shadow-inner">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-700 flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ width: `${cohort.mediation.mediationPct}%` }}
                      title={`Efek Mediasi: ${formatNum(cohort.mediation.mediationPct, 1)}%`}
                    >
                      {formatNum(cohort.mediation.mediationPct, 1)}%
                    </div>
                    <div
                      className="h-full bg-slate-400 dark:bg-slate-600 transition-all duration-700 flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ width: `${100 - cohort.mediation.mediationPct}%` }}
                      title={`Pengaruh Langsung: ${formatNum(100 - cohort.mediation.mediationPct, 1)}%`}
                    >
                      {formatNum(100 - cohort.mediation.mediationPct, 1)}%
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">
                        <strong>Jalur Mediasi (80,4%):</strong> Rutinitas merangsang fokus &amp; ketenangan berpikir, lalu memicu percaya diri.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">
                        <strong>Jalur Langsung (19,6%):</strong> Pembiasaan fisik mekanis tanpa kehadiran fokus mental (efek kecil).
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. TEMUAN KUNCI ANALISIS JALUR */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-blue-50/50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-blue-950/30 border border-emerald-200/80 dark:border-emerald-800/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-1.5">
                  <div className="font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Kesimpulan Ilmiah Analisis Jalur:</span>
                  </div>
                  <p>
                    Data membuktikan secara kuat bahwa santri <strong>tidak dapat dipaksa percaya diri secara instan</strong> hanya dengan diinstruksikan unjuk diri di panggung. Kunci utama keberanian santri bersumber dari <strong>Jalur B (Fokus Belajar ➔ Confidency: r = +0,918, R² = 84%)</strong>. Ketika santri memahami materi dengan konsentrasi tinggi dan memiliki ketenangan emosi, rasa percaya diri akan muncul secara organik dan kokoh.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* ========================================================================= */}
            {/* SUB-BAB 2.4: DIAGNOSTIK ENAM PERSONA KARAKTER (DIAGRAM DONAT & 6 KARTU)  */}
            {/* ========================================================================= */}
            <Card className="w-full border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        Sub-Bab 2.4: Tipologi &amp; Distribusi Persona Santri
                      </span>
                    </div>
                    <CardTitle className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
                      <PieIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span>Diagram Donat Proporsi Enam Persona Karakter ({cohort.name})</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Distribusi proporsi santri ke dalam 6 kelompok tipologi karakter berdasarkan kematangan disiplin dan keberanian unjuk diri.
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Badge variant="outline" className="font-mono text-xs px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700">
                      N = {cohort.count.toLocaleString("id-ID")} Santri (100%)
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-8 space-y-6">
                {/* BENTO GRID: DIAGRAM DONAT (KIRI) + BREAKDOWN PERINGKAT PERSONA (KANAN) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Kolom Kiri: Diagram Donat Interaktif */}
                  <div
                    ref={chartPersonaDonutView.ref}
                    className={`lg:col-span-5 h-[320px] sm:h-[350px] w-full relative flex items-center justify-center transition-all duration-700 ${
                      chartPersonaDonutView.isInView
                        ? "animate-donut-spin opacity-100"
                        : "opacity-0 scale-75 rotate-[-120deg]"
                    }`}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart key={`donut-pie-${selectedCohort}-${chartPersonaDonutView.isInView ? "in" : "out"}`}>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              return (
                                <div className="bg-slate-950/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-2xl border border-slate-800 text-xs max-w-xs space-y-2">
                                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                                    <span className="font-bold text-sm text-slate-100">{d.name}</span>
                                    <span
                                      className="font-mono text-[10px] px-2 py-0.5 rounded-full font-bold"
                                      style={{ backgroundColor: `${d.color}25`, color: d.color }}
                                    >
                                      {formatNum(d.pct, 1)}%
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between font-mono pt-1">
                                    <span className="text-slate-400">Populasi Santri:</span>
                                    <span className="font-bold text-sm" style={{ color: d.color }}>
                                      {d.count.toLocaleString("id-ID")} santri
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-300 leading-relaxed italic bg-slate-900/60 p-2 rounded border border-slate-800/80">
                                    &ldquo;{d.desc}&rdquo;
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Pie
                          data={personaChartData}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={72}
                          outerRadius={112}
                          paddingAngle={3}
                          cornerRadius={6}
                          isAnimationActive={true}
                          animationDuration={1500}
                          animationEasing="ease-out"
                          animationBegin={200}
                          onMouseEnter={(_, index) => setActivePersonaIndex(index)}
                          onMouseLeave={() => setActivePersonaIndex(null)}
                        >
                          {personaChartData.map((entry, index) => (
                            <Cell
                              key={`cell-donut-${index}`}
                              fill={entry.color}
                              stroke={activePersonaIndex === index ? "#ffffff" : "transparent"}
                              strokeWidth={activePersonaIndex === index ? 3 : 1}
                              className="cursor-pointer transition-all duration-200"
                              style={{
                                filter:
                                  activePersonaIndex === index
                                    ? `drop-shadow(0 4px 8px ${entry.color}80)`
                                    : "none",
                              }}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                    {/* OVERLAY DI TENGAH DONUT HOLE */}
                    <div
                      className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4 transition-all duration-700 ${
                        chartPersonaDonutView.isInView ? "opacity-100 scale-100 delay-300" : "opacity-0 scale-75"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                        {activePersonaIndex !== null ? "Proporsi Persona" : "Total Populasi"}
                      </span>
                      <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                        {activePersonaIndex !== null
                          ? `${formatNum(personaChartData[activePersonaIndex]?.pct ?? 0, 1)}%`
                          : cohort.count.toLocaleString("id-ID")}
                      </span>
                      <span
                        className="text-[11px] font-semibold mt-0.5 px-2.5 py-0.5 rounded-full truncate max-w-[170px]"
                        style={{
                          color:
                            activePersonaIndex !== null
                              ? personaChartData[activePersonaIndex]?.color
                              : undefined,
                          backgroundColor:
                            activePersonaIndex !== null
                              ? `${personaChartData[activePersonaIndex]?.color}18`
                              : undefined,
                        }}
                      >
                        {activePersonaIndex !== null
                          ? personaChartData[activePersonaIndex]?.name
                          : "Santri (100%)"}
                      </span>
                    </div>
                  </div>

                  {/* Kolom Kanan: Daftar Peringkat & Proporsi 6 Persona */}
                  <div className="lg:col-span-7 space-y-2.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center justify-between">
                      <span>Peringkat &amp; Proporsi Persona Karakter:</span>
                      <span className="font-mono text-[10px] lowercase text-slate-400">
                        sorot untuk sorotan donat
                      </span>
                    </div>
                    {personaChartData.map((item, idx) => {
                      const isHovered = activePersonaIndex === idx;
                      return (
                        <div
                          key={item.name}
                          onMouseEnter={() => setActivePersonaIndex(idx)}
                          onMouseLeave={() => setActivePersonaIndex(null)}
                          className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer ${
                            isHovered
                              ? `border-slate-400 dark:border-slate-600 bg-slate-100/90 dark:bg-slate-800/90 shadow-xs ring-1 ring-slate-300 dark:ring-slate-700`
                              : `border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-850/60 hover:bg-slate-50 dark:hover:bg-slate-800/50`
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                                #{idx + 1} {item.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 font-mono shrink-0">
                              <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                                {item.count.toLocaleString("id-ID")}
                              </span>
                              <span
                                className="text-[11px] font-extrabold px-1.5 py-0.5 rounded"
                                style={{
                                  backgroundColor: `${item.color}15`,
                                  color: item.color,
                                }}
                              >
                                {formatNum(item.pct, 1)}%
                              </span>
                            </div>
                          </div>

                          {/* Mini Progress Bar */}
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${item.pct}%`,
                                backgroundColor: item.color,
                              }}
                            />
                          </div>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-1 truncate">
                            {item.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 6 KARTU RINCIAN KARAKTERISTIK & REKOMENDASI (LANDSCAPE GRID) */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                    Profil Mendalam &amp; Rekomendasi Intervensi Tiap Persona:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {personaChartData.map((p) => (
                      <div
                        key={p.name}
                        className={`p-4 rounded-xl border-2 ${p.borderLight} ${p.bgLight} transition-all space-y-2.5 shadow-xs flex flex-col justify-between`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: p.color }}
                              />
                              <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                                {p.name}
                              </span>
                            </div>
                            <span
                              className="font-mono text-[11px] font-extrabold px-2 py-0.5 rounded-full shrink-0"
                              style={{
                                backgroundColor: `${p.color}20`,
                                color: p.color,
                              }}
                            >
                              {formatNum(p.pct, 1)}%
                            </span>
                          </div>

                          <div className="flex items-baseline gap-2 pt-0.5">
                            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                              {p.count.toLocaleString("id-ID")}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              santri terpetakan
                            </span>
                          </div>

                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            {p.desc}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                          <strong className="text-slate-800 dark:text-slate-200 block text-[10px] uppercase font-bold tracking-wider">
                            Rekomendasi Intervensi:
                          </strong>
                          <p className="leading-relaxed italic">
                            &ldquo;{p.action}&rdquo;
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CALLOUT DIAGNOSA KUNCI TIPOLOGI PERSONA */}
                <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-1.5">
                  <div className="font-bold text-blue-950 dark:text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span>Diagnosa Kunci Sebaran Tipologi Persona:</span>
                  </div>
                  <p>
                    Mayoritas santri (<strong>68,0%</strong>) berada pada spektrum kematangan positif (gabungan <em>The Anchored Leader</em> 40,0% dan <em>Progressing</em> 28,0%). Titik perhatian utama pendampingan asrama tertuju pada dua kelompok: <strong>The Quiet Hafidz (16,0%)</strong> yang memerlukan ruang latihan tampil bertahap tanpa intimidasi, serta <strong>The Exhausted Santri (8,0%)</strong> yang membutuhkan restorasi ritme sirkadian tidur malam.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* BLOK IMPLIKASI KEBIJAKAN PILAR 2 (DI AKHIR PILAR 2) */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-blue-200 dark:border-blue-800/80 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 dark:from-blue-950/30 dark:via-sky-950/30 dark:to-indigo-950/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shrink-0">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400">
                      Implikasi Kebijakan Pilar 2
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      Mengatasi Bottleneck Kendala Konsistensi 7 KAIH &amp; Penguatan Minat Baca
                    </h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDiagnosticImplication(!showDiagnosticImplication)}
                  className="px-3 py-1.5 rounded-lg border border-blue-300 dark:border-blue-700 bg-white/90 dark:bg-slate-900/90 text-xs font-semibold text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                >
                  <span>{showDiagnosticImplication ? "Tutup Catatan" : "Buka Catatan Kebijakan"}</span>
                  {showDiagnosticImplication ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
              </div>

              {showDiagnosticImplication && (
                <div className="p-5 rounded-xl border border-blue-200 dark:border-blue-800/80 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 shadow-xs transition-all">
                  <p>
                    Temuan diagnostik membuktikan rasa percaya diri santri mengalir melalui jalur perantara fokus belajar (efek mediasi 80,4%). Memaksa santri langsung tampil berpidato tanpa mengatasi kendala konsistensi 7 KAIH (D2: 73,03%) hanya menimbulkan kecemasan berbicara.
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    <strong>Rekomendasi Intervensi:</strong> Terapkan 20 menit membaca hening setiap malam di lorong asrama dan fungsikan ruang baca perpustakaan untuk belajar mandiri malam hari agar konsentrasi santri terjaga.
                  </p>
                </div>
              )}
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

            {/* Sub-Bab 3.1: Model Regresi Kohort 3 Tahun (Gaya Gambar 2: Diagram Garis Minimalis & 3 Deskripsi Landscape di Bawah) */}
            <Card className="w-full border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        Sub-Bab 3.1: Model Regresi Kohort 3 Tahun
                      </span>
                    </div>
                    <CardTitle className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <span>Evolusi Kenaikan Karakter &amp; Percaya Diri (Kelas X ➔ XI ➔ XII)</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Visualisasi trajektori maturasi kohort santri: Kurva Kepercayaan Diri dan Pertumbuhan Pemimpin Mandiri.
                    </CardDescription>
                  </div>

                  {/* 3-MODE SWITCHER (SEGMENTED CONTROL) */}
                  <div className="flex items-center p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700 text-xs self-start lg:self-auto shrink-0 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setTrajectoryChartMode("combined")}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        trajectoryChartMode === "combined"
                          ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <Layers className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Gabungan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrajectoryChartMode("confidence")}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        trajectoryChartMode === "confidence"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span>Kepercayaan Diri</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrajectoryChartMode("leader")}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        trajectoryChartMode === "leader"
                          ? "bg-amber-600 text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-400"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      <span>Pemimpin</span>
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-7 space-y-6">
                {/* 1. HEADER METRIK SPARKLINE ALA MODERN SAAS DASHBOARD (GAMBAR 2) */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Rata-Rata Kepercayaan Diri</span>
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded">
                          +8,1%
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                        80,4%
                        <span className="text-xs font-sans font-normal text-slate-400 ml-2">dari 72,3% (Kelas X)</span>
                      </div>
                    </div>

                    <div className="hidden sm:block h-10 w-[1px] bg-slate-200 dark:bg-slate-800" />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">The Anchored Leader</span>
                        <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5 rounded">
                          2,1x Lipat
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                        40,0%
                        <span className="text-xs font-sans font-normal text-slate-400 ml-2">dari 19,0% (Kelas X)</span>
                      </div>
                    </div>
                  </div>

                  {/* Legend Chips Modern */}
                  <div className="flex items-center gap-3 text-xs">
                    {(trajectoryChartMode === "combined" || trajectoryChartMode === "confidence") && (
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-2xs" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Kepercayaan Diri (%)</span>
                      </div>
                    )}
                    {(trajectoryChartMode === "combined" || trajectoryChartMode === "leader") && (
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-2xs" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">The Anchored Leader (%)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. DIAGRAM GARIS BERSIH, LEBAR (FULL-WIDTH) & MINIMALIS (PERSIS GAYA GAMBAR 2) */}
                <div
                  ref={chartTrajectoryView.ref}
                  className={`h-80 sm:h-[340px] w-full pt-2 transition-all duration-700 ${
                    chartTrajectoryView.isInView ? "animate-chart-rise opacity-100" : "opacity-0 translate-y-6"
                  }`}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      key={`traj-chart-${trajectoryChartMode}-${chartTrajectoryView.isInView ? "in" : "out"}`}
                      data={TRAJECTORY_DATA}
                      margin={{ top: 25, right: 25, left: 0, bottom: 20 }}
                    >
                      <defs>
                        {/* Gradient Halus Bercahaya untuk Area Kepercayaan Diri */}
                        <linearGradient id="glowConfidency" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.22} />
                          <stop offset="65%" stopColor="#10b981" stopOpacity={0.04} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>

                        {/* Gradient Amber Halus untuk Area Anchored Leader */}
                        <linearGradient id="glowLeader" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.20} />
                          <stop offset="65%" stopColor="#f59e0b" stopOpacity={0.03} />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>

                      {/* Hanya Garis Horizontal Lembut Putus-putus (Bebas Garis Vertikal Clunky Seperti Gambar 2) */}
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} stroke="#cbd5e1" vertical={false} />

                      {/* Sumbu X Minimalis Tanpa Border Garis Tebal */}
                      <XAxis
                        dataKey="grade"
                        stroke="#94a3b8"
                        axisLine={false}
                        tickLine={false}
                        tick={(props: any) => {
                          const { x, y, payload } = props;
                          const subtitles: Record<string, string> = {
                            "Kelas X": "Fase Adaptasi",
                            "Kelas XI": "Fase Konsolidasi",
                            "Kelas XII": "Puncak Maturasi",
                          };
                          const sub = subtitles[payload.value] || "";
                          return (
                            <g transform={`translate(${x},${y})`}>
                              <text
                                x={0}
                                y={14}
                                textAnchor="middle"
                                className="fill-slate-800 dark:fill-slate-100 font-bold"
                                style={{ fontSize: 13, fontWeight: 700 }}
                              >
                                {payload.value}
                              </text>
                              <text
                                x={0}
                                y={28}
                                textAnchor="middle"
                                className="fill-slate-400 dark:fill-slate-500 font-medium"
                                style={{ fontSize: 10.5, fontWeight: 500 }}
                              >
                                {sub}
                              </text>
                            </g>
                          );
                        }}
                        height={46}
                      />

                      {/* Sumbu Y Minimalis Tanpa Border Garis Vertikal */}
                      <YAxis
                        domain={
                          trajectoryChartMode === "leader"
                            ? [0, 50]
                            : trajectoryChartMode === "confidence"
                            ? [50, 100]
                            : [0, 100]
                        }
                        ticks={
                          trajectoryChartMode === "leader"
                            ? [0, 10, 20, 30, 40, 50]
                            : trajectoryChartMode === "confidence"
                            ? [50, 60, 70, 80, 90, 100]
                            : [0, 25, 50, 75, 100]
                        }
                        stroke="#94a3b8"
                        axisLine={false}
                        tickLine={false}
                        fontSize={11}
                        fontWeight={500}
                        tickFormatter={(v) => `${v}%`}
                        width={42}
                      />

                      {/* Tooltip Interaktif Modern */}
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-slate-950/95 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border border-slate-800 text-xs max-w-xs space-y-2.5">
                                <div className="border-b border-slate-800 pb-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-sm text-slate-100">{d.fullName}</span>
                                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-semibold">
                                      {d.sampleSize}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-emerald-400 font-semibold">{d.phase}</span>
                                </div>

                                <div className="space-y-1.5 font-mono text-xs">
                                  {(trajectoryChartMode === "combined" || trajectoryChartMode === "confidence") && (
                                    <div className="flex justify-between items-center text-emerald-400">
                                      <span className="text-slate-400 font-sans">Skor Percaya Diri:</span>
                                      <span className="font-bold text-sm">{formatNum(d.confidency, 1)}%</span>
                                    </div>
                                  )}
                                  {(trajectoryChartMode === "combined" || trajectoryChartMode === "leader") && (
                                    <div className="flex justify-between items-center text-amber-400">
                                      <span className="text-slate-400 font-sans">The Anchored Leader:</span>
                                      <span className="font-bold text-sm">{formatNum(d.anchoredLeaderPct, 1)}%</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between items-center text-sky-400">
                                    <span className="text-slate-400 font-sans">Indeks Karakter (IKV):</span>
                                    <span className="font-bold">{formatNum(d.ikv, 1)}%</span>
                                  </div>
                                  <div className="flex justify-between items-center text-rose-400">
                                    <span className="text-slate-400 font-sans">Kasus Lelah Kronis:</span>
                                    <span className="font-bold">{formatNum(d.exhaustedPct, 1)}%</span>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 italic leading-relaxed">
                                  &ldquo;{d.milestone}&rdquo;
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      {/* KURVA GARIS 1: KEPERCAYAAN DIRI (HIJAU EMERALD - PERSIS SEPERTI GAMBAR 2) */}
                      {(trajectoryChartMode === "combined" || trajectoryChartMode === "confidence") && (
                        <Area
                          type="monotone"
                          dataKey="confidency"
                          name="Skor Kepercayaan Diri (%)"
                          stroke="#10b981"
                          strokeWidth={3}
                          fill="url(#glowConfidency)"
                          dot={{ r: 5, fill: "#ffffff", stroke: "#10b981", strokeWidth: 2.5 }}
                          activeDot={{ r: 7, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                          isAnimationActive={true}
                          animationDuration={1800}
                          animationEasing="ease-out"
                          animationBegin={200}
                        >
                          <LabelList
                            dataKey="confidency"
                            content={(props: any) => {
                              const { x, y, value } = props;
                              if (x === undefined || y === undefined || value === undefined) return null;
                              const pillW = 54;
                              const pillH = 22;
                              const formatted = formatNum(Number(value), 1) + "%";
                              return (
                                <g transform={`translate(${Number(x) - pillW / 2}, ${Number(y) - 30})`}>
                                  <rect
                                    x={0}
                                    y={0}
                                    width={pillW}
                                    height={pillH}
                                    rx={11}
                                    className="fill-white dark:fill-slate-900"
                                    stroke="#059669"
                                    strokeWidth={1.2}
                                    style={{ filter: "drop-shadow(0 2px 4px rgba(5, 150, 105, 0.15))" }}
                                  />
                                  <polygon
                                    points={`${pillW / 2 - 3},${pillH} ${pillW / 2 + 3},${pillH} ${pillW / 2},${pillH + 3}`}
                                    className="fill-white dark:fill-slate-900"
                                    stroke="#059669"
                                    strokeWidth={1}
                                  />
                                  <text
                                    x={pillW / 2}
                                    y={15}
                                    textAnchor="middle"
                                    className="fill-emerald-800 dark:fill-emerald-300 font-bold"
                                    style={{
                                      fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif",
                                      fontSize: 10.5,
                                      fontWeight: 700,
                                    }}
                                  >
                                    {formatted}
                                  </text>
                                </g>
                              );
                            }}
                          />
                        </Area>
                      )}

                      {/* KURVA GARIS 2: THE ANCHORED LEADER (EMAS AMBER - SEPERTI GARIS PEMBANDING DI GAMBAR 2) */}
                      {(trajectoryChartMode === "combined" || trajectoryChartMode === "leader") && (
                        <Area
                          type="monotone"
                          dataKey="anchoredLeaderPct"
                          name="The Anchored Leader (%)"
                          stroke="#f59e0b"
                          strokeWidth={3}
                          fill="url(#glowLeader)"
                          dot={{ r: 5, fill: "#ffffff", stroke: "#f59e0b", strokeWidth: 2.5 }}
                          activeDot={{ r: 7, fill: "#f59e0b", stroke: "#ffffff", strokeWidth: 2 }}
                          isAnimationActive={true}
                          animationDuration={1800}
                          animationEasing="ease-out"
                          animationBegin={400}
                        >
                          <LabelList
                            dataKey="anchoredLeaderPct"
                            content={(props: any) => {
                              const { x, y, value } = props;
                              if (x === undefined || y === undefined || value === undefined) return null;
                              const pillW = 50;
                              const pillH = 22;
                              const formatted = formatNum(Number(value), 1) + "%";
                              return (
                                <g transform={`translate(${Number(x) - pillW / 2}, ${Number(y) - 30})`}>
                                  <rect
                                    x={0}
                                    y={0}
                                    width={pillW}
                                    height={pillH}
                                    rx={11}
                                    className="fill-white dark:fill-slate-900"
                                    stroke="#d97706"
                                    strokeWidth={1.2}
                                    style={{ filter: "drop-shadow(0 2px 4px rgba(217, 119, 6, 0.15))" }}
                                  />
                                  <polygon
                                    points={`${pillW / 2 - 3},${pillH} ${pillW / 2 + 3},${pillH} ${pillW / 2},${pillH + 3}`}
                                    className="fill-white dark:fill-slate-900"
                                    stroke="#d97706"
                                    strokeWidth={1}
                                  />
                                  <text
                                    x={pillW / 2}
                                    y={15}
                                    textAnchor="middle"
                                    fill="#d97706"
                                    className="font-bold"
                                    style={{
                                      fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif",
                                      fontSize: 10.5,
                                      fontWeight: 700,
                                    }}
                                  >
                                    {formatted}
                                  </text>
                                </g>
                              );
                            }}
                          />
                        </Area>
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* 3. TIGA DESKRIPSI DILETAKKAN DI BAWAH GRAFIK DIBUAT LANDSCAPE (SESUAI PERMINTAAN USER) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {/* KPI 1 (Hijau): Lonjakan Kepercayaan Diri */}
                  <div className="p-4 rounded-xl border border-emerald-200/90 dark:border-emerald-800/80 bg-gradient-to-br from-emerald-50/70 to-white dark:from-emerald-950/30 dark:to-slate-900 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <Rocket className="h-3.5 w-3.5 text-emerald-600" />
                        Kepercayaan Diri
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                        Maturasi 3 Tahun
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                        +8,1%
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        (72,3% &rarr; 80,4%)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Kenaikan konsisten dari adaptasi awal Kelas X (72,3%) hingga mencapai puncak kematangan di Kelas XII (80,4%).
                    </p>
                  </div>

                  {/* KPI 2 (Oranye): Lonjakan Pemimpin Mandiri */}
                  <div className="p-4 rounded-xl border border-amber-200/90 dark:border-amber-800/80 bg-gradient-to-br from-amber-50/70 to-white dark:from-amber-950/30 dark:to-slate-900 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5 text-amber-600" />
                        Pemimpin Mandiri
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
                        The Anchored Leader
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
                        2,1x Lipat
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        (19,0% &rarr; 40,0%)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Proporsi santri yang siap memimpin kultum dan berpendapat di forum umum melompat lebih dari dua kali lipat.
                    </p>
                  </div>

                  {/* KPI 3 / Insight: Dinamika Adaptasi & Kemandirian */}
                  <div className="p-4 rounded-xl border border-blue-200/90 dark:border-blue-800/80 bg-gradient-to-br from-blue-50/70 to-white dark:from-blue-950/30 dark:to-slate-900 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                        Dinamika Adaptasi
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                        0% Kasus di XII
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                        0,0%
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        (Kasus Lelah Kronis)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Transisi 3 tahun menuntaskan masalah ritme tidur sirkadian dan mematangkan mental santri tanpa begadang sia-sia.
                    </p>
                  </div>
                </div>

                {/* 4. TIGA PANEL MILESTONE PER ANGKATAN */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/70 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100">Fase 1: Kelas X</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">Adaptasi Awal</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">72,3%</span>
                      <span className="text-xs text-slate-500">Percaya Diri</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Fase penyesuaian dari rumah ke asrama. Santri fokus mengikuti ritme jadwal kamar, qiyamullail, dan menghafal adab komunal.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/40 dark:bg-teal-950/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100">Fase 2: Kelas XI</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-semibold">Stabilisasi</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold font-mono text-teal-600 dark:text-teal-400">75,0%</span>
                      <span className="text-xs text-slate-500">Percaya Diri</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Karakter santri mulai terkonsolidasi. Tanggung jawab kepengurusan organisasi mulai diemban; rasa percaya diri di forum kelompok menguat.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100">Fase 3: Kelas XII</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold">Puncak Maturasi</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">80,4%</span>
                      <span className="text-xs text-slate-500">Percaya Diri</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Puncak kematangan unjuk diri (*The Anchored Leader* mencapai 40,0%). Santri siap memimpin kultum, berpidato, dan bebas dari kelelahan kronis.
                    </p>
                  </div>
                </div>

                {/* CALLOUT INSIGHT PREDIKTIF */}
                <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
                  <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    <span>Temuan Kunci Model Prediktif Maturasi 3 Tahun:</span>
                  </div>
                  <p>
                    Data empiris membuktikan trajektori pertumbuhan linier positif. Jika pembiasaan 7 KAIH dijaga konsisten, diproyeksikan <strong>4 dari 10 santri lulusan (40,0%)</strong> akan menjadi figur <em>The Anchored Leader</em> (pemimpin berkarakter tangguh), sementara risiko krisis jam tidur menyusut hingga <strong>0,0%</strong> saat santri menuntaskan pendidikannya di SMAIT Ihsanul Fikri.
                  </p>
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
                      Sub-Bab 3.2: Early Warning System (Prediksi Risiko Penurunan Belajar Akibat Kurang Tidur)
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
                      Sub-Bab 3.3: Simulator Regresi What-If (Simulasi Pengaruh Kenaikan Atensi Belajar)
                    </span>
                    <Badge variant="gold" className="text-[10px]">
                      Simulasi Interaktif
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                    Simulasi Pengaruh Kenaikan Atensi Belajar
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Geser pengatur untuk memperkirakan lonjakan percaya diri jika kendala konsistensi 7 KAIH berkurang.
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
                      <span>+8% (Konsistensi 7 KAIH)</span>
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

            {/* BLOK IMPLIKASI KEBIJAKAN PILAR 3 (DI AKHIR PILAR 3) */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-yellow-950/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 shrink-0">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                      Implikasi Kebijakan Pilar 3
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      Pengawalan Trajektori Kohort Menuju Kelulusan Tanpa Burnout
                    </h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPredictiveImplication(!showPredictiveImplication)}
                  className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-white/90 dark:bg-slate-900/90 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                >
                  <span>{showPredictiveImplication ? "Tutup Catatan" : "Buka Catatan Kebijakan"}</span>
                  {showPredictiveImplication ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
              </div>

              {showPredictiveImplication && (
                <div className="p-5 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 shadow-xs transition-all">
                  <p>
                    Model prediktif kohort membuktikan bahwa dengan menjaga kesinambungan qiyamullail dan waktu tidur, proporsi santri berprofil <em>The Anchored Leader</em> melompat hingga 40,0% di kelas XII. Early warning system mendeteksi 123 santri yang membutuhkan penertiban jam tidur untuk mencegah burnout hafalan.
                  </p>
                </div>
              )}
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
                Sub-Bab 4.1: Praktik Baik yang Wajib Dipertahankan (Sustain Strengths)
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
                Sub-Bab 4.2: Prioritas Intervensi yang Wajib Ditingkatkan (Targeted Interventions)
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
                      Penanganan Kendala Konsistensi 7 KAIH di Asrama
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p>Ketidakmampuan menjaga fokus saat konsistensi 7 KAIH berkurang menjadi hambatan utama ketahanan atensi santri.</p>
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
                Sub-Bab 4.3: Matriks Tindakan Empat Pihak Sekolah (Stakeholder Action Plan)
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
