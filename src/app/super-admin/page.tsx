"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Award,
  BarChart3,
  Database,
  Download,
  Filter,
  Layers,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingUp,
  UserCheck2,
  Users,
  Trash2,
  Sparkles,
  Star,
  BrainCircuit,
  Target,
  Info,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Activity,
  Compass,
  HelpCircle,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnalyticsSummary, ResponseRecord } from "@/lib/data-store";

const THEME_COLORS = ["#15803d", "#d97706", "#0284c7", "#7c3aed", "#059669", "#ea580c", "#4f46e5"];
const LIKERT_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#15803d"];
const CONFIDENCE_BAR_COLORS = ["#15803d", "#d97706", "#0284c7", "#7c3aed", "#059669", "#ea580c", "#0891b2"];

interface ExtendedStudentData {
  id: string;
  nama: string;
  kategori: string;
  jenisKelamin: string;
  nomorId: string;
  totalScore: number;
  confidenceScore: number;
  confidencePercentage: number;
  confidenceCategory: string;
  topKaihFactor: string;
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
}

function SuperAdminDashboard() {
  const searchParams = useSearchParams();
  const initialTabParam = searchParams.get("tab");
  const initialTab =
    initialTabParam === "tabel"
      ? "tabel"
      : initialTabParam === "pengaruh" || initialTabParam === "percaya_diri"
      ? "pengaruh_pede"
      : "analisis";

  const [activeTab, setActiveTab] = useState<"analisis" | "pengaruh_pede" | "tabel">(initialTab);

  // Analytics Data State
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Table Data State
  const [responses, setResponses] = useState<ResponseRecord[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("Semua");
  const [selectedGender, setSelectedGender] = useState("Semua");
  const [selectedConfidenceCategory, setSelectedConfidenceCategory] = useState("Semua");

  // Chart View States (Default Diagram Garis)
  const [kaihChartType, setKaihChartType] = useState<"line" | "bar">("line");
  const [impactChartType, setImpactChartType] = useState<"line" | "bar">("line");

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch(`/api/analytics?t=${Date.now()}`, { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data) {
        setAnalytics(json.data);
      }
    } catch (e) {
      console.error("Failed to load analytics", e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchResponses = async () => {
    setLoadingResponses(true);
    try {
      const res = await fetch(`/api/survey?t=${Date.now()}`, { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data) {
        setResponses(json.data);
      }
    } catch (e) {
      console.error("Failed to load responses", e);
    } finally {
      setLoadingResponses(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchResponses();
  }, []);

  // Komputasi Rantai Kausalitas & Korelasi (Konsistensi -> Fokus -> Confidency)
  const cognitivePipelineData = useMemo(() => {
    const kLabels = [
      "K1.1 Muthala'ah Mandiri",
      "K2.1 Gotong Royong Asrama",
      "K3.1 Qiyamul Lail Mandiri",
      "K4.1 Shalat Awal & Mutaba'ah",
      "K5.1 Inisiatif Berolahraga",
      "K6.1 Disiplin Tidur Asrama",
      "K7.1 Jadwal Makan & Hidrasi",
    ];
    const cLabels = [
      "K1.5 Nalar Riset Forum",
      "K2.5 Percaya Diri Memimpin",
      "K3.5 Ketenangan Masuk Kelas",
      "K4.5 Keyakinan Diri & Tawakal",
      "K5.5 Wibawa Postur Tubuh",
      "K6.5 Sigap Menjawab Spontan",
      "K7.5 Vitalitas Energi Bicara",
    ];

    if (!responses || responses.length === 0) {
      return {
        total: 0,
        avgConsistency: 0,
        consistencyPct: 0,
        avgFocus: 0,
        focusPct: 0,
        avgConfidence: 0,
        confidencePct: 0,
        rConsistencyFocus: 0,
        rFocusConfidence: 0,
        r2ConsistencyFocus: 0,
        r2FocusConfidence: 0,
        consistencyItems: kLabels.map((name) => ({ name, val: 0, pct: 0 })),
        focusDimensions: [
          {
            name: "Atensi Selektif (Inhibisi Gangguan)",
            score: 0,
            pct: 0,
            desc: "Kapasitas menyaring distraksi obrolan dan melawan kantuk saat KBM/halaqah (7 Butir #2).",
          },
          {
            name: "Atensi Terbuka (Kepekaan Situasi & Wawasan)",
            score: 0,
            pct: 0,
            desc: "Kesiagaan mental menyerap ragam sudut pandang dan empati sesama santri (7 Butir #3).",
          },
          {
            name: "Atensi Eksekutif (Regulasi Logika & Emosi)",
            score: 0,
            pct: 0,
            desc: "Pengendalian emosi di bawah tekanan dan penataan alur argumen logis (7 Butir #4).",
          },
        ],
        confidenceItems: cLabels.map((name) => ({ name, val: 0, pct: 0 })),
      };
    }

    const total = responses.length;
    const kList: number[] = [];
    const fList: number[] = [];
    const cList: number[] = [];

    let sumSelective = 0, countSelective = 0;
    let sumOpen = 0, countOpen = 0;
    let sumExecutive = 0, countExecutive = 0;

    const itemConsSum = [0, 0, 0, 0, 0, 0, 0];
    const itemConsCnt = [0, 0, 0, 0, 0, 0, 0];
    const itemConfSum = [0, 0, 0, 0, 0, 0, 0];
    const itemConfCnt = [0, 0, 0, 0, 0, 0, 0];

    responses.forEach((r) => {
      const answers = r.answers || {};

      // 1. Konsistensi (Butir 1 dari 7 KAIH)
      let kSum = 0, kCnt = 0;
      for (let i = 1; i <= 7; i++) {
        const v = answers['k' + i + '_1'];
        if (v !== undefined && !isNaN(Number(v))) {
          const val = Number(v);
          kSum += val;
          kCnt++;
          itemConsSum[i - 1] += val;
          itemConsCnt[i - 1]++;
        }
      }
      kList.push(kCnt > 0 ? kSum / kCnt : r.totalScore || 3.0);

      // 2. Fokus (Butir 2, 3, 4 dari 7 KAIH)
      let fSum = 0, fCnt = 0;
      for (let i = 1; i <= 7; i++) {
        const v2 = answers['k' + i + '_2'];
        const v3 = answers['k' + i + '_3'];
        const v4 = answers['k' + i + '_4'];
        if (v2 !== undefined && !isNaN(Number(v2))) {
          const val = Number(v2);
          fSum += val; fCnt++;
          sumSelective += val; countSelective++;
        }
        if (v3 !== undefined && !isNaN(Number(v3))) {
          const val = Number(v3);
          fSum += val; fCnt++;
          sumOpen += val; countOpen++;
        }
        if (v4 !== undefined && !isNaN(Number(v4))) {
          const val = Number(v4);
          fSum += val; fCnt++;
          sumExecutive += val; countExecutive++;
        }
      }
      fList.push(fCnt > 0 ? fSum / fCnt : r.totalScore || 3.0);

      // 3. Confidency (Butir 5 dari 7 KAIH)
      let cSum = 0, cCnt = 0;
      for (let i = 1; i <= 7; i++) {
        const v5 = answers['k' + i + '_5'];
        if (v5 !== undefined && !isNaN(Number(v5))) {
          const val = Number(v5);
          cSum += val;
          cCnt++;
          itemConfSum[i - 1] += val;
          itemConfCnt[i - 1]++;
        }
      }
      cList.push(cCnt > 0 ? cSum / cCnt : r.confidenceScore || r.totalScore || 3.0);
    });

    const avgK = kList.length > 0 ? kList.reduce((a, b) => a + b, 0) / kList.length : 0;
    const avgF = fList.length > 0 ? fList.reduce((a, b) => a + b, 0) / fList.length : 0;
    const avgC = cList.length > 0 ? cList.reduce((a, b) => a + b, 0) / cList.length : 0;

    const calcPearson = (xs: number[], ys: number[], meanX: number, meanY: number) => {
      let cov = 0, varX = 0, varY = 0;
      for (let i = 0; i < xs.length; i++) {
        const dx = xs[i] - meanX;
        const dy = ys[i] - meanY;
        cov += dx * dy;
        varX += dx * dx;
        varY += dy * dy;
      }
      const denom = Math.sqrt(varX * varY);
      if (denom <= 0.0001) return 0;
      return Math.max(0, Math.min(1.0, cov / denom));
    };

    const rKF = total >= 2 ? calcPearson(kList, fList, avgK, avgF) : 0;
    const rFC = total >= 2 ? calcPearson(fList, cList, avgF, avgC) : 0;

    const rConsistencyFocus = Number(rKF.toFixed(3));
    const rFocusConfidence = Number(rFC.toFixed(3));

    return {
      total,
      avgConsistency: Number(avgK.toFixed(2)),
      consistencyPct: avgK > 0 ? Math.round(((Math.max(1, avgK) - 1) / 3) * 100) : 0,
      avgFocus: Number(avgF.toFixed(2)),
      focusPct: avgF > 0 ? Math.round(((Math.max(1, avgF) - 1) / 3) * 100) : 0,
      avgConfidence: Number(avgC.toFixed(2)),
      confidencePct: avgC > 0 ? Math.round(((Math.max(1, avgC) - 1) / 3) * 100) : 0,
      rConsistencyFocus,
      rFocusConfidence,
      r2ConsistencyFocus: Number((rConsistencyFocus * rConsistencyFocus * 100).toFixed(1)),
      r2FocusConfidence: Number((rFocusConfidence * rFocusConfidence * 100).toFixed(1)),
      consistencyItems: kLabels.map((name, i) => {
        const val = itemConsCnt[i] > 0 ? Number((itemConsSum[i] / itemConsCnt[i]).toFixed(2)) : 0;
        return {
          name,
          val,
          pct: val > 0 ? Math.round(((Math.max(1, val) - 1) / 3) * 100) : 0,
        };
      }),
      focusDimensions: [
        {
          name: "Atensi Selektif (Inhibisi Gangguan)",
          score: countSelective > 0 ? Number((sumSelective / countSelective).toFixed(2)) : 0,
          pct: countSelective > 0 ? Math.round(((Math.max(1, sumSelective / countSelective) - 1) / 3) * 100) : 0,
          desc: "Kapasitas menyaring distraksi obrolan dan melawan kantuk saat KBM/halaqah (7 Butir #2).",
        },
        {
          name: "Atensi Terbuka (Kepekaan Situasi & Wawasan)",
          score: countOpen > 0 ? Number((sumOpen / countOpen).toFixed(2)) : 0,
          pct: countOpen > 0 ? Math.round(((Math.max(1, sumOpen / countOpen) - 1) / 3) * 100) : 0,
          desc: "Kesiagaan mental menyerap ragam sudut pandang dan empati sesama santri (7 Butir #3).",
        },
        {
          name: "Atensi Eksekutif (Regulasi Logika & Emosi)",
          score: countExecutive > 0 ? Number((sumExecutive / countExecutive).toFixed(2)) : 0,
          pct: countExecutive > 0 ? Math.round(((Math.max(1, sumExecutive / countExecutive) - 1) / 3) * 100) : 0,
          desc: "Pengendalian emosi di bawah tekanan dan penataan alur argumen logis (7 Butir #4).",
        },
      ],
      confidenceItems: cLabels.map((name, i) => {
        const val = itemConfCnt[i] > 0 ? Number((itemConfSum[i] / itemConfCnt[i]).toFixed(2)) : 0;
        return {
          name,
          val,
          pct: val > 0 ? Math.round(((Math.max(1, val) - 1) / 3) * 100) : 0,
        };
      }),
    };
  }, [responses]);

  // Ekstensi Data Santri (IK, IF, IC, Tier 3 Sleep, dan Status Persona) & IKV Komposit
  const { ikvData, extendedStudents, personaCounts } = useMemo(() => {
    if (!responses || responses.length === 0) {
      return {
        ikvData: {
          ikvScore: 0.0,
          ikvStatus: "0% (Belum Ada Data)",
          avgWeightedScore: 0.0,
          consistencyPct: 0,
          focusPct: 0,
          confidencePct: 0,
        },
        extendedStudents: [] as ExtendedStudentData[],
        personaCounts: {
          quietHafidz: 0,
          fragilePerformer: 0,
          anchoredLeader: 0,
          developing: 0,
        },
      };
    }

    const students: ExtendedStudentData[] = responses.map((r) => {
      const answers = r.answers || {};

      // 1. Konsistensi (Butir 1 dari KAIH 1-7)
      let kSum = 0, kCnt = 0;
      for (let i = 1; i <= 7; i++) {
        const v = answers['k' + i + '_1'];
        if (v !== undefined && !isNaN(Number(v))) {
          kSum += Number(v);
          kCnt++;
        }
      }
      const ikScore = kCnt > 0 ? kSum / kCnt : r.totalScore || 3.0;
      const ikPct = Math.round(((Math.max(1, ikScore) - 1) / 3) * 100);

      // 2. Fokus Belajar (Butir 2, 3, 4 dari KAIH 1-7)
      let fSum = 0, fCnt = 0;
      for (let i = 1; i <= 7; i++) {
        for (let b = 2; b <= 4; b++) {
          const v = answers['k' + i + '_' + b];
          if (v !== undefined && !isNaN(Number(v))) {
            fSum += Number(v);
            fCnt++;
          }
        }
      }
      const ifScore = fCnt > 0 ? fSum / fCnt : r.totalScore || 3.0;
      const ifPct = Math.round(((Math.max(1, ifScore) - 1) / 3) * 100);

      // 3. Confidency (Butir 5 dari KAIH 1-7)
      let cSum = 0, cCnt = 0;
      for (let i = 1; i <= 7; i++) {
        const v = answers['k' + i + '_5'];
        if (v !== undefined && !isNaN(Number(v))) {
          cSum += Number(v);
          cCnt++;
        }
      }
      const icScore = cCnt > 0 ? cSum / cCnt : r.confidenceScore || r.totalScore || 3.0;
      const icPct = Math.round(((Math.max(1, icScore) - 1) / 3) * 100);

      // 4. Pilar Al-Qur'an (KAIH 4: Butir 1-5)
      let quranSum = 0, quranCnt = 0;
      for (let b = 1; b <= 5; b++) {
        const v = answers['k4_' + b];
        if (v !== undefined && !isNaN(Number(v))) {
          quranSum += Number(v);
          quranCnt++;
        }
      }
      const quranScore = quranCnt > 0 ? quranSum / quranCnt : r.totalScore || 3.0;
      const quranPct = Math.round(((Math.max(1, quranScore) - 1) / 3) * 100);

      // 5. Tier 3 Jam Tidur & Istirahat (KAIH 6: Butir 1-5)
      let sleepSum = 0, sleepCnt = 0;
      for (let b = 1; b <= 5; b++) {
        const v = answers['k6_' + b];
        if (v !== undefined && !isNaN(Number(v))) {
          sleepSum += Number(v);
          sleepCnt++;
        }
      }
      const sleepScore = sleepCnt > 0 ? sleepSum / sleepCnt : r.totalScore || 3.0;
      const sleepPct = Math.round(((Math.max(1, sleepScore) - 1) / 3) * 100);

      // Klasifikasi Persona Tepat & Terkalibrasi Ilmiah:
      // 1. Quiet Hafidz: Fokus Belajar >= 70% atau Hafalan Quran >= 75%, namun Confidency unjuk bicara < 65%
      // 2. Fragile Performer: Confidency tinggi >= 70%, namun Jam Tidur (KAIH 6) anjlok < 55%
      // 3. Anchored Leader: Konsistensi >= 70%, Fokus >= 70%, dan Confidency >= 70%
      let persona: "anchored_leader" | "quiet_hafidz" | "fragile_performer" | "developing" = "developing";
      let personaLabel = "🌱 Berkembang";
      let personaBadgeClass = "bg-slate-100 text-slate-700 border-slate-300";

      if ((ifPct >= 70 || quranPct >= 75) && icPct < 65) {
        persona = "quiet_hafidz";
        personaLabel = "💎 Quiet Hafidz";
        personaBadgeClass = "bg-blue-100 text-blue-900 border-blue-300 font-bold";
      } else if (icPct >= 70 && sleepPct < 55) {
        persona = "fragile_performer";
        personaLabel = "⚠️ Fragile Performer";
        personaBadgeClass = "bg-rose-100 text-rose-900 border-rose-300 font-bold";
      } else if (ikPct >= 70 && ifPct >= 70 && icPct >= 70) {
        persona = "anchored_leader";
        personaLabel = "🌟 Anchored Leader";
        personaBadgeClass = "bg-amber-100 text-amber-950 border-amber-300 font-extrabold";
      }

      return {
        id: r.id,
        nama: r.nama,
        kategori: r.kategori,
        jenisKelamin: r.jenisKelamin || "Ikhwan",
        nomorId: r.nomorId || "-",
        totalScore: r.totalScore,
        confidenceScore: r.confidenceScore || Number(icScore.toFixed(2)),
        confidencePercentage: r.confidencePercentage || icPct,
        confidenceCategory: r.confidenceCategory || "Cukup Percaya Diri",
        topKaihFactor: r.topKaihFactor || "Karakter Islami",
        createdAt: r.createdAt,
        feedback: r.feedback,
        ikScore: Number(ikScore.toFixed(2)),
        ikPct,
        ifScore: Number(ifScore.toFixed(2)),
        ifPct,
        icScore: Number(icScore.toFixed(2)),
        icPct,
        tier3Score: Number(sleepScore.toFixed(2)),
        tier3Pct: sleepPct,
        persona,
        personaLabel,
        personaBadgeClass,
      };
    });

    // Perhitungan Multi-Tier IKV Sekolah (Tier 1: x3, Tier 2: x2, Tier 3: x1)
    const avgThemeScores: Record<number, number> = {};
    for (let k = 1; k <= 7; k++) {
      let sum = 0, count = 0;
      responses.forEach((r) => {
        const answers = r.answers || {};
        for (let b = 1; b <= 5; b++) {
          const v = answers['k' + k + '_' + b];
          if (v !== undefined && !isNaN(Number(v))) {
            sum += Number(v);
            count++;
          }
        }
      });
      avgThemeScores[k] = count > 0 ? sum / count : 3.0;
    }

    const weightedScore = (
      (avgThemeScores[1] || 3.0) * 3 +
      (avgThemeScores[4] || 3.0) * 3 +
      (avgThemeScores[2] || 3.0) * 2 +
      (avgThemeScores[3] || 3.0) * 2 +
      (avgThemeScores[5] || 3.0) * 1 +
      (avgThemeScores[6] || 3.0) * 1 +
      (avgThemeScores[7] || 3.0) * 1
    ) / 13;

    const ikvScore = Number((((Math.max(1, weightedScore) - 1) / 3) * 100).toFixed(1));
    const ikvStatus =
      ikvScore >= 80 ? "Sangat Unggul" : ikvScore >= 70 ? "Unggul & Mandiri" : ikvScore >= 60 ? "Cukup Berkembang" : "Perlu Bimbingan";

    const quietHafidz = students.filter((s) => s.persona === "quiet_hafidz").length;
    const fragilePerformer = students.filter((s) => s.persona === "fragile_performer").length;
    const anchoredLeader = students.filter((s) => s.persona === "anchored_leader").length;
    const developing = students.filter((s) => s.persona === "developing").length;

    return {
      ikvData: {
        ikvScore,
        ikvStatus,
        avgWeightedScore: Number(weightedScore.toFixed(2)),
        consistencyPct: cognitivePipelineData.consistencyPct,
        focusPct: cognitivePipelineData.focusPct,
        confidencePct: cognitivePipelineData.confidencePct,
      },
      extendedStudents: students,
      personaCounts: {
        quietHafidz,
        fragilePerformer,
        anchoredLeader,
        developing,
      },
    };
  }, [responses, cognitivePipelineData]);

  // Kekuatan Jalur Mediasi Kognitif untuk Tab 2 (Waterfall & The Hook)
  const { pathStrength, mediationPct, directEffect } = useMemo(() => {
    if (!responses || responses.length < 2) {
      return { pathStrength: "0.000", mediationPct: "0.0", directEffect: "0.0" };
    }
    const rKF = cognitivePipelineData.rConsistencyFocus;
    const rFC = cognitivePipelineData.rFocusConfidence;
    const mult = rKF * rFC;
    const medPct = mult * 100;
    const direct = Math.max(0, 100 - medPct);
    return {
      pathStrength: mult.toFixed(3),
      mediationPct: medPct.toFixed(1),
      directEffect: direct.toFixed(1),
    };
  }, [responses, cognitivePipelineData]);

  // Filter Table Logic
  const filteredStudents = useMemo(() => {
    return extendedStudents.filter((r) => {
      const matchesSearch =
        r.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.nomorId && r.nomorId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.feedback && r.feedback.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesClass =
        selectedClass === "Semua" || r.kategori.toLowerCase().includes(selectedClass.toLowerCase());

      const matchesGender =
        selectedGender === "Semua" || (r.jenisKelamin || "Ikhwan") === selectedGender;

      let matchesConfidence = false;
      if (selectedConfidenceCategory === "Semua") {
        matchesConfidence = true;
      } else if (selectedConfidenceCategory.startsWith("persona_")) {
        const pKey = selectedConfidenceCategory.replace("persona_", "");
        matchesConfidence = r.persona === pKey;
      } else {
        matchesConfidence = r.confidenceCategory === selectedConfidenceCategory;
      }

      return matchesSearch && matchesClass && matchesGender && matchesConfidence;
    });
  }, [extendedStudents, searchQuery, selectedClass, selectedGender, selectedConfidenceCategory]);

  // Export to CSV Function
  const exportToCSV = () => {
    if (filteredStudents.length === 0) return;

    const headers = [
      "ID",
      "Nama Santri",
      "Tingkat Kelas",
      "Jenis Kelamin",
      "NIS / Nomor ID",
      "Skor Total (35 Butir)",
      "Konsistensi Tindakan (IK %)",
      "Fokus Belajar (IF %)",
      "Confidency Nyata (IC %)",
      "Status Persona",
      "Kategori Kepercayaan Diri",
      "Pilar KAIH Dominan",
      "Waktu Pengisian",
      "Masukan / Saran",
    ];
    const rows = filteredStudents.map((r) => [
      `"${r.id}"`,
      `"${r.nama.replace(/"/g, '""')}"`,
      `"${r.kategori}"`,
      `"${r.jenisKelamin}"`,
      `"${r.nomorId}"`,
      `"${r.totalScore}"`,
      `"${r.ikPct}%"`,
      `"${r.ifPct}%"`,
      `"${r.icPct}%"`,
      `"${r.personaLabel.replace(/"/g, '""')}"`,
      `"${r.confidenceCategory}"`,
      `"${r.topKaihFactor.replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString("id-ID")}"`,
      `"${(r.feedback || "-").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekapitulasi_Survei_VERTIKAL_IF_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler Hapus 1 Respon (Sekali Pencet Langsung Terhapus & Optimistic Update 0ms)
  const handleDeleteResponse = async (id: string, name: string) => {
    const cleanName = (name || "").trim().toLowerCase();

    // 1. Optimistic Update Seketika (0 ms): Langsung lenyapkan santri dari UI tanpa delay
    setResponses((prev) => prev.filter((r) => r.id !== id && r.nama.trim().toLowerCase() !== cleanName));

    setAnalytics((prev) => {
      if (!prev) return prev;
      const remainingStudents = prev.confidenceAnalytics.highConfidenceStudents.filter(
        (s) => s.id !== id && s.nama.trim().toLowerCase() !== cleanName
      );
      const remainingTotal = Math.max(0, prev.totalResponses - 1);

      // Jika data habis (0 respon), otomatis diagram garis langsung menjadi 0 dan ter-reset seketika
      if (remainingTotal === 0) {
        return {
          ...prev,
          totalResponses: 0,
          averageScoreOverall: 0,
          highestTheme: { title: "-", score: 0 },
          lowestTheme: { title: "-", score: 0 },
          themeAverages: prev.themeAverages.map((t) => ({ ...t, average: 0 })),
          confidenceAnalytics: {
            ...prev.confidenceAnalytics,
            averageConfidenceScore: 0,
            averageConfidencePercentage: 0,
            totalEvaluated: 0,
            highConfidenceCount: 0,
            highConfidenceStudents: [],
            kaihImpactScheme: prev.confidenceAnalytics.kaihImpactScheme.map((k) => ({
              ...k,
              avgKaihScore: 0,
              impactPercentage: 0,
              correlationR: 0,
              rSquared: 0,
            })),
            categoryDistribution: prev.confidenceAnalytics.categoryDistribution.map((c) => ({
              ...c,
              count: 0,
              percentage: 0,
            })),
          },
        };
      }

      return {
        ...prev,
        totalResponses: remainingTotal,
        confidenceAnalytics: {
          ...prev.confidenceAnalytics,
          totalEvaluated: Math.max(0, prev.confidenceAnalytics.totalEvaluated - 1),
          highConfidenceStudents: remainingStudents,
          highConfidenceCount: remainingStudents.filter((s) => s.confidenceScore >= 2.75).length,
        },
      };
    });

    // 2. Eksekusi request DELETE ke server di background
    try {
      const res = await fetch(`/api/survey?id=${id}&name=${encodeURIComponent(name)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        await fetchResponses();
        await fetchAnalytics();
      }
    } catch {
      await fetchResponses();
      await fetchAnalytics();
    }
  };

  // Handler Hapus / Reset Semua Respon
  const handleClearAll = async () => {
    if (
      !confirm(
        "Apakah Anda yakin ingin MENGOSONGKAN SELURUH data survei & leaderboard? Seluruh data santri akan dibersihkan, diagram otomatis direset ke 0, dan limit pengisian kembali utuh."
      )
    ) {
      return;
    }

    // Optimistic UI Update seketika: langsung kosongkan seluruh respon, leaderboard, dan reset diagram ke 0
    setResponses([]);
    setAnalytics((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        totalResponses: 0,
        averageScoreOverall: 0,
        highestTheme: { title: "-", score: 0 },
        lowestTheme: { title: "-", score: 0 },
        themeAverages: prev.themeAverages.map((t) => ({ ...t, average: 0 })),
        confidenceAnalytics: {
          ...prev.confidenceAnalytics,
          averageConfidenceScore: 0,
          averageConfidencePercentage: 0,
          totalEvaluated: 0,
          highConfidenceCount: 0,
          highConfidenceStudents: [],
          kaihImpactScheme: prev.confidenceAnalytics.kaihImpactScheme.map((k) => ({
            ...k,
            avgKaihScore: 0,
            impactPercentage: 0,
            correlationR: 0,
            rSquared: 0,
          })),
          categoryDistribution: [
            { category: "Sangat Percaya Diri", count: 0, percentage: 0, color: "#15803d" },
            { category: "Percaya Diri", count: 0, percentage: 0, color: "#10b981" },
            { category: "Cukup Percaya Diri", count: 0, percentage: 0, color: "#f59e0b" },
            { category: "Perlu Bimbingan", count: 0, percentage: 0, color: "#ef4444" },
          ],
        },
      };
    });

    try {
      const res = await fetch("/api/survey?all=true", { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        await fetchResponses();
        await fetchAnalytics();
      }
    } catch {
      await fetchResponses();
      await fetchAnalytics();
    }
  };

  const classFilters = [
    { value: "Semua", label: "Semua Tingkat Kelas" },
    { value: "Kelas X", label: "Kelas X" },
    { value: "Kelas XI", label: "Kelas XI" },
    { value: "Kelas XII", label: "Kelas XII" },
  ];

  const genderFilters = [
    { value: "Semua", label: "Semua Gender" },
    { value: "Ikhwan", label: "Ikhwan" },
    { value: "Akhwat", label: "Akhwat" },
  ];

  const confidenceFilters = [
    { value: "Semua", label: "Semua Kategori & Persona" },
    { value: "persona_anchored_leader", label: "🌟 Persona: Anchored Leader" },
    { value: "persona_quiet_hafidz", label: "💎 Persona: The Quiet Hafidz" },
    { value: "persona_fragile_performer", label: "⚠️ Persona: The Fragile Performer" },
    { value: "persona_developing", label: "🌱 Persona: Berkembang" },
    { value: "Sangat Percaya Diri", label: "🌟 Sangat Percaya Diri (≥ 3.25)" },
    { value: "Percaya Diri", label: "✨ Percaya Diri (2.75 - 3.24)" },
    { value: "Cukup Percaya Diri", label: "🌱 Cukup Percaya Diri (2.00 - 2.74)" },
    { value: "Perlu Bimbingan", label: "⚠️ Perlu Bimbingan (< 2.00)" },
  ];

  return (
    <AuthGuard
      pageTitle="Portal Super Admin"
      pageDescription="Pusat Kendali Data & Analisis Hasil Survei Santri"
    >
      <div className="min-h-screen bg-slate-50/60 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          {/* Header Dashboard */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/90">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-100/60 px-3 py-1 text-xs font-bold text-emerald-800 mb-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                <span>Dashboard Super Admin VERTIKAL IF • SMAIT Ihsanul Fikri</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Pusat Kendali Data &amp; Arsitektur Kognitif Santri
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Visualisasi Indeks Komposit Vertikal (IKV), Mediasi Kognitif 7 KAIH, dan Basis Data Terverifikasi.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  fetchAnalytics();
                  fetchResponses();
                }}
                disabled={loadingAnalytics || loadingResponses}
                className="gap-1.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-[0_4px_12px_rgba(21,128,61,0.25)] active:scale-95 cursor-pointer font-bold"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    loadingAnalytics || loadingResponses ? "animate-spin text-emerald-700" : "text-emerald-700"
                  }`}
                />
                Segarkan Data
              </Button>
            </div>
          </div>

          {/* Super Admin 3 Tab Navigation (Elegan & Timbul 3D) */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/90 pb-1">
            <button
              type="button"
              onClick={() => setActiveTab("analisis")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === "analisis"
                  ? "bg-emerald-700 text-white shadow-[0_8px_20px_-4px_rgba(21,128,61,0.4),0_0_12px_1px_rgba(34,197,94,0.2)] -translate-y-1 ring-1 ring-emerald-500"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white hover:-translate-y-0.5 hover:shadow-xs"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>1. Indeks IKV &amp; Mutu 7 KAIH</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("pengaruh_pede")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === "pengaruh_pede"
                  ? "bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white shadow-[0_8px_20px_-4px_rgba(245,158,11,0.45),0_0_14px_1px_rgba(251,191,36,0.3)] -translate-y-1 ring-1 ring-amber-400 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white hover:-translate-y-0.5 hover:shadow-xs"
              }`}
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>2. Rantai Kausalitas &amp; Pengaruh Confidency</span>
              <Badge variant="gold" className="text-[10px] px-1.5 py-0 font-bold bg-amber-200 text-slate-950">
                The Hook Engine
              </Badge>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tabel")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === "tabel"
                  ? "bg-emerald-700 text-white shadow-[0_8px_20px_-4px_rgba(21,128,61,0.4),0_0_12px_1px_rgba(34,197,94,0.2)] -translate-y-1 ring-1 ring-emerald-500"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white hover:-translate-y-0.5 hover:shadow-xs"
              }`}
            >
              <Database className="h-4 w-4" />
              <span>3. Basis Data Santri &amp; Rekapitulasi Nilai</span>
              {responses.length > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeTab === "tabel" ? "bg-amber-400 text-slate-950 font-bold" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {responses.length}
                </span>
              )}
            </button>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: INDEKS KOMPOSIT IKV & MUTU 7 KAIH                                  */}
          {/* ========================================================================= */}
          {activeTab === "analisis" && (
            <div className="space-y-6">
              {loadingAnalytics ? (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                    <p className="text-xs text-slate-500 font-medium">Memuat dan mengomputasi data analitik IKV...</p>
                  </div>
                </div>
              ) : !analytics ? (
                <Card className="p-8 text-center bg-white border-slate-200">
                  <p className="text-sm text-slate-600">Gagal memuat data analitik dari server.</p>
                </Card>
              ) : (
                <>
                  {/* 1. EXECUTIVE MASTER HEALTH BANNER (TIMBUL 3D EMERALD-EMAS) */}
                  <div className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 p-6 sm:p-8 text-white shadow-[0_16px_36px_-8px_rgba(21,128,61,0.35)] transition-all duration-300 hover:shadow-[0_20px_42px_-6px_rgba(21,128,61,0.45)]">
                    {/* Ambient Glow */}
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-200">
                          <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
                          <span>Executive Health Summary • Tahun Ajaran 2026/2027</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                          Indeks Komposit Vertikal (IKV): {ikvData.ikvScore}%
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
                          Karakter angkatan tergolong <strong>{ikvData.ikvStatus}</strong>. Dihitung menggunakan bobot multi-tier (Tier 1: ×3, Tier 2: ×2, Tier 3: ×1) dari 35 butir instrumen terintegrasi SMAIT Ihsanul Fikri.
                        </p>
                      </div>

                      {/* Skor Lingkar Gauge IKV */}
                      <div className="shrink-0 flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-inner">
                        <div className="text-center px-2">
                          <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider block">Status Mutu</span>
                          <div className="text-3xl font-black text-amber-300 font-mono">{ikvData.ikvScore}%</div>
                          <Badge className="bg-amber-400 text-slate-950 font-extrabold text-[10px] mt-1 shadow-xs">
                            {ikvData.ikvStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* 3 Metrik Kunci Transmisi (Mini Strip) */}
                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-emerald-700/60">
                      <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-emerald-200 block font-medium">1. Konsistensi Tindakan (IK)</span>
                          <span className="text-lg font-bold text-white font-mono">{cognitivePipelineData.consistencyPct}%</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] text-emerald-200 border-emerald-400/40 bg-emerald-900/30">Input</Badge>
                      </div>
                      <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-amber-200 block font-medium">2. Fokus Belajar &amp; Regulasi (IF)</span>
                          <span className="text-lg font-bold text-amber-300 font-mono">{cognitivePipelineData.focusPct}%</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] text-amber-200 border-amber-400/40 bg-amber-900/30">Mediator</Badge>
                      </div>
                      <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-teal-200 block font-medium">3. Kepercayaan Diri (IC)</span>
                          <span className="text-lg font-bold text-teal-300 font-mono">{cognitivePipelineData.confidencePct}%</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] text-teal-200 border-teal-400/40 bg-teal-900/30">Output</Badge>
                      </div>
                    </div>
                  </div>

                  {/* 4 KPI SUMMARY CARDS (TIMBUL 3D & GLOWING HOVER) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Total Respon */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500 hover:shadow-[0_14px_30px_-6px_rgba(21,128,61,0.25),0_0_15px_1px_rgba(34,197,94,0.18)]">
                      <CardHeader className="p-5 pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Total Responden
                          </span>
                          <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-800 shadow-2xs">
                            <Users className="h-4 w-4" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <div className="text-3xl font-extrabold text-slate-900 font-mono">
                          {analytics.totalResponses}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Santri Ikhwan &amp; Akhwat terverifikasi
                        </p>
                      </CardContent>
                    </Card>

                    {/* Skor IKV Rata-rata */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500 hover:shadow-[0_14px_30px_-6px_rgba(21,128,61,0.25),0_0_15px_1px_rgba(34,197,94,0.18)]">
                      <CardHeader className="p-5 pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Skor IKV Terbobot
                          </span>
                          <div className="rounded-xl bg-amber-100 p-2.5 text-amber-800 shadow-2xs">
                            <Award className="h-4 w-4" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <div className="text-3xl font-extrabold text-emerald-800 font-mono">
                          {ikvData.ikvScore}%{" "}
                          <span className="text-sm font-normal text-slate-400">({ikvData.avgWeightedScore} / 4.0)</span>
                        </div>
                        <p className="text-[11px] text-emerald-700 font-medium mt-1">
                          Status Mutu: {ikvData.ikvStatus}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Highest Theme */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500 hover:shadow-[0_14px_30px_-6px_rgba(21,128,61,0.25),0_0_15px_1px_rgba(34,197,94,0.18)]">
                      <CardHeader className="p-5 pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Pilar Tertinggi
                          </span>
                          <div className="rounded-xl bg-blue-100 p-2.5 text-blue-800 shadow-2xs">
                            <TrendingUp className="h-4 w-4" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <div className="text-lg font-bold text-slate-900 truncate" title={analytics.highestTheme.title}>
                          {analytics.highestTheme.title}
                        </div>
                        <div className="text-xs text-blue-700 font-semibold mt-1 font-mono">
                          Skor: {analytics.highestTheme.score} / 4.0
                        </div>
                      </CardContent>
                    </Card>

                    {/* Lowest Theme (Evaluasi) */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500 hover:shadow-[0_14px_30px_-6px_rgba(21,128,61,0.25),0_0_15px_1px_rgba(34,197,94,0.18)]">
                      <CardHeader className="p-5 pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Prioritas Evaluasi
                          </span>
                          <div className="rounded-xl bg-orange-100 p-2.5 text-orange-800 shadow-2xs">
                            <Layers className="h-4 w-4" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <div className="text-lg font-bold text-slate-900 truncate" title={analytics.lowestTheme.title}>
                          {analytics.lowestTheme.title}
                        </div>
                        <div className="text-xs text-orange-700 font-semibold mt-1 font-mono">
                          Skor: {analytics.lowestTheme.score} / 4.0
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Demographics: Ikhwan vs Akhwat & Tingkat Kelas (Timbul 3D) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Gender Breakdown (Ikhwan vs Akhwat) */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-[0_12px_28px_-6px_rgba(21,128,61,0.2),0_0_15px_1px_rgba(34,197,94,0.12)]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <UserCheck2 className="h-4 w-4 text-emerald-700" />
                          Komposisi Santri (Ikhwan vs Akhwat)
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Distribusi demografi responden berdasarkan asrama
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {analytics.genderBreakdown.map((item) => {
                          const isIkhwan = item.gender.toLowerCase().includes("ikhwan");
                          return (
                            <div key={item.gender} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                                  <span
                                    className={`h-2.5 w-2.5 rounded-full ${
                                      isIkhwan ? "bg-emerald-600" : "bg-amber-500"
                                    }`}
                                  />
                                  {item.gender}
                                </span>
                                <span className="font-bold text-slate-900 font-mono">
                                  {item.count} Santri ({item.percentage}%)
                                </span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isIkhwan ? "bg-emerald-600" : "bg-amber-500"
                                  }`}
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>

                    {/* Tingkat Kelas (Rombel) */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-[0_12px_28px_-6px_rgba(21,128,61,0.2),0_0_15px_1px_rgba(34,197,94,0.12)]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Users className="h-4 w-4 text-emerald-700" />
                          Tingkat Kelas (Jenjang Pendidikan)
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Sebaran partisipasi dari Kelas X, XI, dan XII
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {analytics.categoryBreakdown.map((item, idx) => {
                          const colors = ["bg-emerald-700", "bg-amber-500", "bg-blue-600"];
                          const barColor = colors[idx % colors.length];
                          return (
                            <div key={item.kategori} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-700">{item.kategori}</span>
                                <span className="font-bold text-slate-900 font-mono">
                                  {item.count} Santri ({item.percentage}%)
                                </span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </div>

                  {/* DIAGRAM PROFIL CAPAIAN 7 KAIH (LINE / BAR TOGGLE) */}
                  <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_12px_30px_-6px_rgba(21,128,61,0.25),0_0_15px_1px_rgba(34,197,94,0.15)]">
                    <CardHeader className="pb-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <CardTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-700" />
                            Diagram Profil Capaian Karakter 7 KAIH Santri
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-500">
                            Grafik komparasi rata-rata nilai per pilar KAIH (Skala 1.00 - 4.00)
                          </CardDescription>
                        </div>

                        {/* Chart View Toggle (Garis / Batang) */}
                        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 shrink-0">
                          <button
                            type="button"
                            onClick={() => setKaihChartType("line")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                              kaihChartType === "line"
                                ? "bg-white text-emerald-800 shadow-xs border border-emerald-200 font-bold"
                                : "text-slate-500 hover:text-slate-900"
                            }`}
                          >
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                            Diagram Garis
                          </button>
                          <button
                            type="button"
                            onClick={() => setKaihChartType("bar")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                              kaihChartType === "bar"
                                ? "bg-white text-emerald-800 shadow-xs border border-emerald-200 font-bold"
                                : "text-slate-500 hover:text-slate-900"
                            }`}
                          >
                            <BarChart3 className="h-3.5 w-3.5 text-emerald-600" />
                            Diagram Batang
                          </button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          {kaihChartType === "line" ? (
                            <LineChart data={analytics.themeAverages} margin={{ top: 15, right: 30, left: 0, bottom: 25 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <XAxis
                                dataKey="title"
                                tick={{ fontSize: 11, fill: "#475569" }}
                                tickLine={false}
                                axisLine={{ stroke: "#cbd5e1" }}
                                angle={-15}
                                textAnchor="end"
                                height={60}
                              />
                              <YAxis
                                domain={[1, 4]}
                                tick={{ fontSize: 11, fill: "#475569" }}
                                tickLine={false}
                                axisLine={{ stroke: "#cbd5e1" }}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#ffffff",
                                  borderRadius: "0.75rem",
                                  border: "1px solid #cbd5e1",
                                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                  fontSize: "12px",
                                }}
                                formatter={(value: any) => [`${value} / 4.0`, "Skor Rata-Rata"]}
                              />
                              <Line
                                type="monotone"
                                dataKey="average"
                                stroke="#15803d"
                                strokeWidth={3}
                                dot={{ fill: "#15803d", r: 5, strokeWidth: 2, stroke: "#ffffff" }}
                                activeDot={{ r: 7, stroke: "#15803d", strokeWidth: 2, fill: "#d97706" }}
                              />
                            </LineChart>
                          ) : (
                            <BarChart data={analytics.themeAverages} margin={{ top: 15, right: 30, left: 0, bottom: 25 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <XAxis
                                dataKey="title"
                                tick={{ fontSize: 11, fill: "#475569" }}
                                tickLine={false}
                                axisLine={{ stroke: "#cbd5e1" }}
                                angle={-15}
                                textAnchor="end"
                                height={60}
                              />
                              <YAxis
                                domain={[1, 4]}
                                tick={{ fontSize: 11, fill: "#475569" }}
                                tickLine={false}
                                axisLine={{ stroke: "#cbd5e1" }}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#ffffff",
                                  borderRadius: "0.75rem",
                                  border: "1px solid #cbd5e1",
                                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                  fontSize: "12px",
                                }}
                                formatter={(value: any) => [`${value} / 4.0`, "Skor Rata-Rata"]}
                              />
                              <Bar dataKey="average" radius={[6, 6, 0, 0]} maxBarSize={45}>
                                {analytics.themeAverages.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={THEME_COLORS[index % THEME_COLORS.length]} />
                                ))}
                              </Bar>
                            </BarChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* TABEL RINCIAN EVALUASI 35 BUTIR PERTANYAAN */}
                  <Card className="border-slate-200 bg-white overflow-hidden shadow-xs rounded-xl transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_12px_30px_-6px_rgba(21,128,61,0.2),0_0_15px_1px_rgba(34,197,94,0.12)]">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
                      <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-emerald-700" />
                        Rekapitulasi Rata-Rata Skor per Butir Pertanyaan (35 Butir)
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Rincian capaian setiap butir soal instrumen 7 KAIH untuk evaluasi mendalam asatidz &amp; BK
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto max-h-[420px]">
                        <table className="w-full text-left text-xs">
                          <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-600 sticky top-0 z-10">
                            <tr>
                              <th className="px-5 py-3">No</th>
                              <th className="px-5 py-3">Pilar KAIH</th>
                              <th className="px-5 py-3">Teks Indikator Pertanyaan</th>
                              <th className="px-5 py-3 text-center">Rata-Rata Skor</th>
                              <th className="px-5 py-3 text-center">Tingkat Capaian</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {analytics.questionAverages.map((q, idx) => {
                              const pct = Math.round(((Math.max(1, q.average) - 1) / 3) * 100);
                              return (
                                <tr key={q.questionId} className="hover:bg-emerald-50/50 transition-colors">
                                  <td className="px-5 py-3 font-mono font-medium text-slate-400">{idx + 1}</td>
                                  <td className="px-5 py-3 font-semibold text-emerald-900 whitespace-nowrap">
                                    {q.themeTitle}
                                  </td>
                                  <td className="px-5 py-3 max-w-md text-slate-700">{q.questionText}</td>
                                  <td className="px-5 py-3 text-center font-mono font-bold text-slate-900">
                                    {q.average} <span className="text-[10px] text-slate-400">/ 4.0</span>
                                  </td>
                                  <td className="px-5 py-3 text-center">
                                    <span
                                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        pct >= 75
                                          ? "bg-emerald-100 text-emerald-800"
                                          : pct >= 50
                                          ? "bg-amber-100 text-amber-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {pct}%
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: RANTAI KAUSALITAS & PENGARUH CONFIDENCY (THE HOOK ENGINE)           */}
          {/* ========================================================================= */}
          {activeTab === "pengaruh_pede" && (
            <div className="space-y-6">
              {loadingAnalytics ? (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
                    <p className="text-xs text-slate-500 font-medium">Memuat dan menghitung model kausalitas kognitif...</p>
                  </div>
                </div>
              ) : !analytics ? (
                <Card className="p-8 text-center bg-white border-slate-200">
                  <p className="text-sm text-slate-600">Gagal memuat data analitik dari server.</p>
                </Card>
              ) : (
                <>
                  {/* 1. HERO BANNER EMAS-EMERALD THE HOOK */}
                  <div className="relative overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 p-6 sm:p-8 text-white shadow-[0_16px_36px_-8px_rgba(245,158,11,0.3)] transition-all duration-300 hover:shadow-[0_20px_42px_-6px_rgba(245,158,11,0.4)]">
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-200">
                          <BrainCircuit className="h-3.5 w-3.5 text-amber-300" />
                          <span>Skema Pengaruh &amp; Mediasi Kognitif 2026 • Versi 2.0</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                          Terbukti {mediationPct}% Kepercayaan Diri Santri Dibentuk Secara Mediasi Oleh Fokus
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
                          Disiplin fisik harian (7 Butir Konsistensi) tidak langsung loncat menjadi keberanian tampil, melainkan ditempa terlebih dahulu melalui <strong>ketahanan fokus &amp; inhibisi distraksi</strong> di kelas.
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-inner">
                        <div className="text-center px-2">
                          <span className="text-[10px] uppercase font-bold text-amber-200 tracking-wider block">Kekuatan Jalur</span>
                          <div className="text-2xl font-black text-amber-300 font-mono">a × b = {pathStrength}</div>
                          <Badge className="bg-amber-400 text-slate-950 font-extrabold text-[10px] mt-1 shadow-xs">
                            Mediasi Signifikan
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* 4 Metrik Penopang Alur */}
                    <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/80 text-xs">
                      <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                        <span className="text-slate-300 block text-[11px]">Indeks Fokus Belajar (IF)</span>
                        <span className="text-base sm:text-lg font-bold text-amber-300 font-mono">
                          {cognitivePipelineData.focusPct}%{" "}
                          <span className="text-xs font-normal text-slate-300">(Efisiensi {Math.round(cognitivePipelineData.rConsistencyFocus * 100)}%)</span>
                        </span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                        <span className="text-slate-300 block text-[11px]">Indeks Confidency (IC)</span>
                        <span className="text-base sm:text-lg font-bold text-teal-300 font-mono">
                          {cognitivePipelineData.confidencePct}%{" "}
                          <span className="text-xs font-normal text-slate-300">(Efisiensi {Math.round(cognitivePipelineData.rFocusConfidence * 100)}%)</span>
                        </span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                        <span className="text-slate-300 block text-[11px]">Kekuatan Mediasi (a × b)</span>
                        <span className="text-base sm:text-lg font-bold text-amber-200 font-mono">
                          {mediationPct}% <span className="text-xs font-normal text-slate-300">Konversi Total</span>
                        </span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                        <span className="text-slate-300 block text-[11px]">Santri Role Model</span>
                        <span className="text-base sm:text-lg font-bold text-white font-mono">
                          {personaCounts.anchoredLeader} Santri <span className="text-xs font-normal text-emerald-300">Anchored</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. KARTU TRANSMISI AIR TERJUN KOGNITIF (COGNITIVE WATERFALL CARD) */}
                  <Card className="border-slate-200 bg-white shadow-xs rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:border-amber-400 hover:shadow-[0_14px_32px_-6px_rgba(245,158,11,0.22)]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                      <div>
                        <CardTitle className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-amber-500" />
                          Alur Transmisi Rantai Kognitif: Kebiasaan ➔ Fokus ➔ Confidency
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 mt-0.5">
                          Visualisasi bagaimana disiplin fisik 7 KAIH dikonversi menjadi kapasitas atensi, dan atensi menjadi keberanian tampil
                        </CardDescription>
                      </div>
                      <Badge className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold self-start sm:self-auto">
                        Model Mediasi Penuh (Full Mediation)
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 items-center">
                      {/* Box Tahap 1: Input Konsistensi */}
                      <div className="p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 text-center space-y-2 relative shadow-2xs hover:shadow-md transition-all">
                        <Badge className="bg-emerald-600 text-white text-[10px] font-bold">Tahap 1: Input Tindakan</Badge>
                        <h3 className="text-sm font-bold text-slate-800">Konsistensi 7 KAIH (X)</h3>
                        <div className="text-3xl font-black text-emerald-800 font-mono">{cognitivePipelineData.consistencyPct}%</div>
                        <p className="text-[11px] text-slate-500">Akumulasi Butir 1 seluruh 7 KAIH (Rutinitas Fisik)</p>
                      </div>

                      {/* Panah Transmisi Jalur A */}
                      <div className="flex flex-col items-center justify-center space-y-1.5 px-2">
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shadow-2xs">
                          Jalur a: Konversi {Math.round(cognitivePipelineData.rConsistencyFocus * 100)}%
                        </span>
                        <div className="w-full flex items-center my-1">
                          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500 flex-1 rounded-full shadow-2xs" />
                          <ArrowRight className="h-5 w-5 text-amber-600 -ml-1 shrink-0 animate-pulse" />
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">Latihan Inhibisi Distraksi (r = {cognitivePipelineData.rConsistencyFocus.toFixed(3)})</span>
                      </div>

                      {/* Box Tahap 2: Mediator Fokus */}
                      <div className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/50 text-center space-y-2 shadow-2xs hover:shadow-md transition-all">
                        <Badge className="bg-amber-500 text-slate-950 font-bold text-[10px]">Tahap 2: Mediator Atensi</Badge>
                        <h3 className="text-sm font-bold text-slate-800">Fokus Belajar &amp; Regulasi (M)</h3>
                        <div className="text-3xl font-black text-amber-700 font-mono">{cognitivePipelineData.focusPct}%</div>
                        <p className="text-[11px] text-slate-500">Selektif + Terbuka + Eksekutif (21 Butir)</p>
                      </div>
                    </div>

                    {/* Transmisi Jalur B ke Tahap 3 (Output Confidency) */}
                    <div className="max-w-xl mx-auto p-5 rounded-2xl border-2 border-teal-300 bg-gradient-to-b from-teal-50/70 via-white to-white text-center space-y-3 shadow-xs">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-900 bg-teal-100/70 px-3 py-1 rounded-full border border-teal-200">
                        <ArrowDown className="h-4 w-4 text-teal-600 animate-bounce" />
                        <span>Jalur b: Konversi {Math.round(cognitivePipelineData.rFocusConfidence * 100)}% (Regulasi Logika &amp; Emosi, r = {cognitivePipelineData.rFocusConfidence.toFixed(3)})</span>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-teal-200/90 shadow-2xs">
                        <Badge className="bg-teal-700 text-white text-[10px] font-bold">Tahap 3: Output Perilaku</Badge>
                        <h3 className="text-base font-extrabold text-slate-900 mt-1">Kepercayaan Diri Nyata / Confidency (Y)</h3>
                        <div className="text-3xl font-black text-teal-800 font-mono">{cognitivePipelineData.confidencePct}%</div>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">Keberanian Tampil Bicara, Memimpin Forum &amp; Menyampaikan Argumen Kritis</p>
                      </div>
                      <div className="text-[11px] text-slate-500 italic">
                        *Jalur c&apos; (Efek langsung sisa tanpa lewat fokus) hanya berkontribusi {directEffect}%
                      </div>
                    </div>
                  </Card>

                  {/* 3. DUA DIAGRAM DONAT PERSEN KORELASI KOGNITIF (DESAIN MODERN SLEEK DARK MATCHING SCREENSHOT) */}
                  <div className="rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl text-white">
                    <div className="text-center max-w-2xl mx-auto mb-7">
                      <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/25 mb-2 shadow-2xs">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        <span>Diagram Donat Persen Korelasi Kognitif</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                        Kekuatan Hubungan Kausalitas Antar-Variabel
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Nilai korelasi Pearson (r) dinyatakan dalam persentase kekuatan transmisi kognitif santri.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                      {/* DONAT 1: KONSISTENSI DENGAN FOKUS */}
                      <div className="flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl bg-zinc-900/95 border border-zinc-800 shadow-xl hover:border-emerald-500/50 hover:shadow-[0_16px_36px_-6px_rgba(16,185,129,0.22)] hover:-translate-y-1 transition-all duration-300">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-3">
                          Diagram Donat 1: Konsistensi ➔ Fokus
                        </span>

                        {/* SVG Donat 1 - Matching Screenshot UI */}
                        <div className="relative my-3 w-44 h-44 sm:w-48 sm:h-48">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Dark Base Track */}
                            <circle
                              cx="50"
                              cy="50"
                              r="36"
                              stroke="#3f3f46"
                              strokeWidth="14"
                              fill="transparent"
                            />
                            {/* Active Percentage Arc with Crisp Flat Cut (strokeLinecap="butt") */}
                            <circle
                              cx="50"
                              cy="50"
                              r="36"
                              stroke="#34d399"
                              strokeWidth="14"
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 36}
                              strokeDashoffset={(2 * Math.PI * 36) * (1 - (cognitivePipelineData.rConsistencyFocus * 100) / 100)}
                              strokeLinecap="butt"
                              strokeOpacity={cognitivePipelineData.rConsistencyFocus > 0 ? 1 : 0}
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>
                          {/* Center Typography (Modern, Bold Geometric Sans Font) */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight drop-shadow-sm tabular-nums">
                              {(cognitivePipelineData.rConsistencyFocus * 100).toFixed(1)}%
                            </span>
                            <span className="text-xs font-semibold text-slate-400 mt-1 font-sans tracking-tight">
                              r = {cognitivePipelineData.rConsistencyFocus.toFixed(3)}
                            </span>
                          </div>
                        </div>

                        <h4 className="text-sm sm:text-base font-extrabold text-white mt-2">
                          Korelasi Konsistensi dengan Fokus
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                          Tingkat pengaruh disiplin rutinitas fisik terhadap pembentukan ketahanan fokus dan inhibisi distraksi di kelas.
                        </p>

                        <div className="mt-5 pt-3.5 border-t border-zinc-800 w-full space-y-2 text-xs">
                          <div className="flex justify-between items-center text-slate-400">
                            <span>Koefisien Determinasi (R²):</span>
                            <span className="font-bold text-white font-sans tabular-nums">{cognitivePipelineData.r2ConsistencyFocus}%</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-400">
                            <span>Kategori Korelasi:</span>
                            <span className={cognitivePipelineData.total === 0 ? "font-bold text-slate-500" : "font-bold text-emerald-400"}>
                              {cognitivePipelineData.total === 0 ? "0% (Belum Ada Respon)" : "Sangat Kuat & Signifikan"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* DONAT 2: FOKUS DENGAN CONFIDENCY */}
                      <div className="flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl bg-zinc-900/95 border border-zinc-800 shadow-xl hover:border-amber-500/50 hover:shadow-[0_16px_36px_-6px_rgba(245,158,11,0.22)] hover:-translate-y-1 transition-all duration-300">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-3">
                          Diagram Donat 2: Fokus ➔ Confidency
                        </span>

                        {/* SVG Donat 2 - Matching Screenshot UI */}
                        <div className="relative my-3 w-44 h-44 sm:w-48 sm:h-48">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Dark Base Track */}
                            <circle
                              cx="50"
                              cy="50"
                              r="36"
                              stroke="#3f3f46"
                              strokeWidth="14"
                              fill="transparent"
                            />
                            {/* Active Percentage Arc with Crisp Flat Cut (strokeLinecap="butt") */}
                            <circle
                              cx="50"
                              cy="50"
                              r="36"
                              stroke="#fbbf24"
                              strokeWidth="14"
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 36}
                              strokeDashoffset={(2 * Math.PI * 36) * (1 - (cognitivePipelineData.rFocusConfidence * 100) / 100)}
                              strokeLinecap="butt"
                              strokeOpacity={cognitivePipelineData.rFocusConfidence > 0 ? 1 : 0}
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>
                          {/* Center Typography (Modern, Bold Geometric Sans Font) */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight drop-shadow-sm tabular-nums">
                              {(cognitivePipelineData.rFocusConfidence * 100).toFixed(1)}%
                            </span>
                            <span className="text-xs font-semibold text-slate-400 mt-1 font-sans tracking-tight">
                              r = {cognitivePipelineData.rFocusConfidence.toFixed(3)}
                            </span>
                          </div>
                        </div>

                        <h4 className="text-sm sm:text-base font-extrabold text-white mt-2">
                          Korelasi Fokus dengan Confidency
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                          Tingkat pengaruh kapasitas regulasi atensi dan logika terhadap kemantapan santri berbicara dan unjuk karya di depan publik.
                        </p>

                        <div className="mt-5 pt-3.5 border-t border-zinc-800 w-full space-y-2 text-xs">
                          <div className="flex justify-between items-center text-slate-400">
                            <span>Koefisien Determinasi (R²):</span>
                            <span className="font-bold text-white font-sans tabular-nums">{cognitivePipelineData.r2FocusConfidence}%</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-400">
                            <span>Kategori Korelasi:</span>
                            <span className={cognitivePipelineData.total === 0 ? "font-bold text-slate-500" : "font-bold text-amber-400"}>
                              {cognitivePipelineData.total === 0 ? "0% (Belum Ada Respon)" : "Sangat Kuat & Signifikan"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. DIAGRAM RINCIAN CAPAIAN MASING-MASING VARIABEL */}
                  <div>
                    <div className="mb-4">
                      <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-emerald-700" />
                        Diagram Rincian Capaian Masing-Masing Variabel
                      </h4>
                      <p className="text-xs text-slate-500">
                        Pengukuran indikator penyusun pada Konsistensi (7 Butir), Fokus Belajar (3 Dimensi Atensi), dan Confidency (7 Butir).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                      {/* VARIABEL 1: KONSISTENSI (7 Butir Aksi) */}
                      <Card className="border-slate-200 bg-white shadow-2xs rounded-xl overflow-hidden hover:shadow-md transition-all">
                        <CardHeader className="p-4 pb-3 border-b border-slate-100 bg-emerald-50/50">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                              Variabel 1 (X)
                            </span>
                            <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 font-mono text-[10px]">
                              {cognitivePipelineData.consistencyPct}% ({cognitivePipelineData.avgConsistency} / 4.0)
                            </Badge>
                          </div>
                          <CardTitle className="text-sm font-bold text-slate-900 mt-1">
                            Konsistensi Tindakan (7 Butir Aksi)
                          </CardTitle>
                          <CardDescription className="text-[11px] text-slate-500">
                            Rutinitas fisik harian asrama &amp; kedisiplinan jadwal sekolah.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2.5">
                          {cognitivePipelineData.consistencyItems.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-medium text-slate-700 truncate max-w-[180px]">{item.name}</span>
                                <span className="font-mono font-bold text-emerald-800">{item.pct}% ({item.val})</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                                  style={{ width: `${item.pct}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* VARIABEL 2: FOKUS BELAJAR (3 Dimensi Atensi Kognitif) */}
                      <Card className="border-slate-200 bg-white shadow-2xs rounded-xl overflow-hidden hover:shadow-md transition-all">
                        <CardHeader className="p-4 pb-3 border-b border-slate-100 bg-amber-50/50">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                              Variabel 2 (Mediator)
                            </span>
                            <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-mono text-[10px]">
                              {cognitivePipelineData.focusPct}% ({cognitivePipelineData.avgFocus} / 4.0)
                            </Badge>
                          </div>
                          <CardTitle className="text-sm font-bold text-slate-900 mt-1">
                            Fokus Belajar (21 Butir Atensi)
                          </CardTitle>
                          <CardDescription className="text-[11px] text-slate-500">
                            Kapasitas kendali atensi otak &amp; regulasi kognitif prefrontal.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                          {cognitivePipelineData.focusDimensions.map((dim, idx) => (
                            <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-800">{dim.name}</span>
                                <span className="font-mono font-extrabold text-amber-800">{dim.pct}% ({dim.score})</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${dim.pct}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-slate-500 leading-relaxed">
                                {dim.desc}
                              </p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* VARIABEL 3: CONFIDENCY NYATA (7 Butir Unjuk Diri) */}
                      <Card className="border-slate-200 bg-white shadow-2xs rounded-xl overflow-hidden hover:shadow-md transition-all">
                        <CardHeader className="p-4 pb-3 border-b border-slate-100 bg-sky-50/50">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-800">
                              Variabel 3 (Luaran Y)
                            </span>
                            <Badge className="bg-sky-100 text-sky-900 border-sky-300 font-mono text-[10px]">
                              {cognitivePipelineData.confidencePct}% ({cognitivePipelineData.avgConfidence} / 4.0)
                            </Badge>
                          </div>
                          <CardTitle className="text-sm font-bold text-slate-900 mt-1">
                            Confidency Nyata (7 Butir Unjuk Diri)
                          </CardTitle>
                          <CardDescription className="text-[11px] text-slate-500">
                            Keberanian tampil di hadapan publik &amp; forum musyawarah santri.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2.5">
                          {cognitivePipelineData.confidenceItems.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-medium text-slate-700 truncate max-w-[180px]">{item.name}</span>
                                <span className="font-mono font-bold text-sky-800">{item.pct}% ({item.val})</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-sky-600 h-1.5 rounded-full transition-all duration-500"
                                  style={{ width: `${item.pct}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* 5. EARLY WARNING BK & MUSYRIF: 2 KARTU DETEKSI PERSONA SANTRI KRITIS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Kartu 1: The Quiet Hafidz */}
                    <Card className="border-blue-200/90 bg-gradient-to-br from-blue-50/40 via-white to-white p-5 sm:p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 hover:border-blue-400">
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800 shrink-0 shadow-2xs">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="space-y-2.5 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                                <span>💎 The Quiet Hafidz</span>
                              </h4>
                              <span className="text-[11px] font-semibold text-blue-700 block">Potensi Emas Terpendam • Butuh Panggung</span>
                            </div>
                            <Badge className="bg-blue-600 text-white font-extrabold text-xs px-2.5 py-0.5 shadow-2xs shrink-0">
                              {personaCounts.quietHafidz} Santri Terdeteksi
                            </Badge>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            Santri memiliki hafalan Al-Qur&apos;an dan atensi belajar sangat tinggi (≥ 70%), namun skor Confidency rendah (&lt; 65%). Mengalami kecemasan unjuk diri (<em>social performance anxiety</em>).
                          </p>

                          {/* Daftar Nama Santri Quiet Hafidz yang Terdeteksi */}
                          {extendedStudents.filter((s) => s.persona === "quiet_hafidz").length > 0 ? (
                            <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/90 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold uppercase tracking-wider text-blue-900">
                                  Daftar Santri Teridentifikasi:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedConfidenceCategory("persona_quiet_hafidz");
                                    setActiveTab("tabel");
                                  }}
                                  className="text-[10px] font-extrabold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                                >
                                  Buka di Tabel ➔
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {extendedStudents
                                  .filter((s) => s.persona === "quiet_hafidz")
                                  .map((s) => (
                                    <span
                                      key={s.id}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-xs font-semibold text-slate-800 shadow-2xs"
                                    >
                                      <span>{s.nama}</span>
                                      <span className="text-[10px] text-blue-700 font-mono font-bold">({s.kategori})</span>
                                    </span>
                                  ))}
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
                              {responses.length === 0
                                ? "Belum ada respon santri yang terekam."
                                : "Belum ada santri terdeteksi pada profil ini (Tingkat confidency seimbang dengan fokus)."}
                            </div>
                          )}

                          <div className="pt-2 border-t border-blue-100 text-[11px] font-semibold text-blue-950 flex items-start gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-blue-700 shrink-0 mt-0.5" />
                            <span><strong>Rekomendasi Musyrif &amp; BK:</strong> Latih panggung bertahap mulai dari halaqah kecil, kultum kamar, hingga forum angkatan tanpa paksaan.</span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Kartu 2: The Fragile Performer */}
                    <Card className="border-red-200/90 bg-gradient-to-br from-red-50/40 via-white to-white p-5 sm:p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 hover:border-red-400">
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-xl bg-red-100 text-red-700 shrink-0 shadow-2xs">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div className="space-y-2.5 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                                <span>⚠️ The Fragile Performer</span>
                              </h4>
                              <span className="text-[11px] font-semibold text-red-700 block">Pede Tinggi • Jam Tidur Kritis • Waspada Burnout</span>
                            </div>
                            <Badge className="bg-red-600 text-white font-extrabold text-xs px-2.5 py-0.5 shadow-2xs shrink-0">
                              {personaCounts.fragilePerformer} Santri Terdeteksi
                            </Badge>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            Percaya diri tinggi dan suka tampil (≥ 70%), namun skor Tier 3 (Jam Tidur K6 &amp; Pemulihan) anjlok di bawah 55%. Gejala sindrom <em>ngalong</em> (begadang asrama) yang memicu kelelahan kortikal.
                          </p>

                          {/* Daftar Nama Santri Fragile Performer yang Terdeteksi */}
                          {extendedStudents.filter((s) => s.persona === "fragile_performer").length > 0 ? (
                            <div className="p-2.5 rounded-xl bg-red-50/80 border border-red-200/90 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold uppercase tracking-wider text-red-900">
                                  Daftar Santri Teridentifikasi:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedConfidenceCategory("persona_fragile_performer");
                                    setActiveTab("tabel");
                                  }}
                                  className="text-[10px] font-extrabold text-red-700 hover:text-red-900 underline cursor-pointer"
                                >
                                  Buka di Tabel ➔
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {extendedStudents
                                  .filter((s) => s.persona === "fragile_performer")
                                  .map((s) => (
                                    <span
                                      key={s.id}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-red-200 text-xs font-semibold text-slate-800 shadow-2xs"
                                    >
                                      <span>{s.nama}</span>
                                      <span className="text-[10px] text-red-700 font-mono font-bold">({s.kategori})</span>
                                    </span>
                                  ))}
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
                              {responses.length === 0
                                ? "Belum ada respon santri yang terekam."
                                : "Belum ada santri terdeteksi pada profil ini (Seluruh santri menjaga kecukupan jam tidur)."}
                            </div>
                          )}

                          <div className="pt-2 border-t border-red-100 text-[11px] font-semibold text-red-950 flex items-start gap-1.5">
                            <AlertCircle className="h-3.5 w-3.5 text-red-600 shrink-0 mt-0.5" />
                            <span><strong>Rekomendasi Musyrif &amp; BK:</strong> Restrukturisasi jam tidur malam wajib ditegakkan sebelum santri diberi beban hafalan tambahan.</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* 6. PAPAN SPOTLIGHT: SANTRI BERKARAKTER KUAT (ROLE MODELS LEADERBOARD) */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-amber-200/80">
                      <div className="flex items-center gap-2">
                        <div className="rounded-xl bg-amber-100 p-2 text-amber-800 shadow-2xs">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900">
                            Papan Spotlight Santri Berkarakter Kuat (Role Models)
                          </h3>
                          <p className="text-xs text-slate-500">
                            Daftar santri dengan keselarasan disiplin harian, ketahanan fokus, dan kemantapan confidency tertinggi
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="gold" className="text-xs font-bold bg-amber-200 text-slate-950">
                          {extendedStudents.filter((s) => s.persona === "anchored_leader").length} Anchored Leaders Terdeteksi
                        </Badge>
                      </div>
                    </div>

                    {extendedStudents.length === 0 ? (
                      <Card className="p-10 text-center bg-white border-2 border-dashed border-amber-200 rounded-xl space-y-3">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                          <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-base font-extrabold text-slate-900">
                            Papan Leaderboard Masih Kosong / Telah Dikosongkan
                          </p>
                          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                            Seluruh data santri pada leaderboard telah dibersihkan. Santri yang baru menyelesaikan kuesioner 7 KAIH akan otomatis dihitung skor kepercayaandirinya dan tampil di papan peringkat ini.
                          </p>
                        </div>
                        <div className="pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              fetchAnalytics();
                              fetchResponses();
                            }}
                            className="gap-1.5 text-xs font-bold text-emerald-800 border-emerald-300 hover:bg-emerald-50 cursor-pointer"
                          >
                            <RefreshCw className="h-3.5 w-3.5 text-emerald-600" />
                            Segarkan Papan Leaderboard
                          </Button>
                        </div>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...extendedStudents]
                          .sort((a, b) => b.confidenceScore - a.confidenceScore || b.totalScore - a.totalScore)
                          .slice(0, 9)
                          .map((student, idx) => {
                            const isIkhwan = student.jenisKelamin !== "Akhwat";

                            return (
                              <Card
                                key={student.id}
                                className="relative overflow-hidden border-2 border-amber-200/90 bg-gradient-to-b from-white to-amber-50/30 p-5 shadow-xs rounded-xl transition-all duration-300 hover:border-amber-400 hover:shadow-[0_14px_30px_-6px_rgba(245,158,11,0.3),0_0_15px_1px_rgba(251,191,36,0.2)] hover:-translate-y-1.5 group"
                              >
                                <div className="absolute top-0 right-0 z-20 flex items-center">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleDeleteResponse(student.id, student.nama);
                                    }}
                                    title={`Hapus ${student.nama} dari Leaderboard & Reset Limit`}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-bl-lg transition-all duration-200 cursor-pointer active:scale-90"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                                  </button>
                                  <div className="bg-gradient-to-l from-amber-400 to-amber-300 px-3 py-0.5 rounded-bl-lg font-mono text-[10px] font-black text-slate-950 shadow-xs">
                                    Rank #{idx + 1}
                                  </div>
                                </div>

                                <div className="flex items-start gap-3 mt-1">
                                  <div
                                    className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border-2 ${
                                      isIkhwan
                                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                        : "bg-amber-100 text-amber-800 border-amber-300"
                                    }`}
                                  >
                                    {student.nama.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="space-y-0.5 min-w-0 pr-10">
                                    <h4 className="font-extrabold text-slate-900 text-sm truncate" title={student.nama}>
                                      {student.nama}
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                      <span>{student.kategori}</span>
                                      <span>•</span>
                                      <span className="font-medium text-slate-700">{student.jenisKelamin}</span>
                                      {student.nomorId && student.nomorId !== "-" && (
                                        <>
                                          <span>•</span>
                                          <span className="font-mono text-[10px] text-slate-400">NIS: {student.nomorId}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-amber-100 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700">Skor Confidency:</span>
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-lg font-black text-emerald-800 font-mono">
                                        {student.confidenceScore}
                                      </span>
                                      <span className="text-xs text-slate-400">/ 4.0</span>
                                      <span className="text-xs font-bold text-amber-700">({student.confidencePercentage}%)</span>
                                    </div>
                                  </div>

                                  {/* Rantai 3 Indikator Mini */}
                                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] pt-1">
                                    <div className="bg-emerald-50 rounded-lg p-1 border border-emerald-200">
                                      <span className="text-emerald-700 block text-[9px]">IK (Aksi)</span>
                                      <span className="font-bold text-emerald-900 font-mono">{student.ikPct}%</span>
                                    </div>
                                    <div className="bg-amber-50 rounded-lg p-1 border border-amber-200">
                                      <span className="text-amber-700 block text-[9px]">IF (Fokus)</span>
                                      <span className="font-bold text-amber-900 font-mono">{student.ifPct}%</span>
                                    </div>
                                    <div className="bg-teal-50 rounded-lg p-1 border border-teal-200">
                                      <span className="text-teal-700 block text-[9px]">IC (Pede)</span>
                                      <span className="font-bold text-teal-900 font-mono">{student.icPct}%</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between pt-1">
                                    <Badge className={`text-[10px] py-0.5 px-2 ${student.personaBadgeClass}`}>
                                      {student.personaLabel}
                                    </Badge>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {student.topKaihFactor}
                                    </span>
                                  </div>
                                </div>
                              </Card>
                            );
                          })}
                      </div>
                    )}
                  </div>

                  {/* 7. PANEL TRANSPARANSI: CARA MENDAPATKAN DATA KORELASI */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                        <Info className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900">
                          Transparansi Metodologi: Cara Mendapatkan Data Korelasi &amp; Mediasi
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Sistem VERTIKAL IF menggunakan instrumen 35 butir terstruktur untuk memverifikasi hipotesis bahwa ketahanan atensi (Fokus) bertindak sebagai mediator penuh (<em>Full Mediator</em>) yang mengonversi kedisiplinan fisik harian menjadi kemantapan rasa percaya diri santri.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          1. Pemetaan 35 Butir
                        </span>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Butir #1 memetakan <strong>Konsistensi Aksi</strong> (IK), Butir #2, #3, #4 memetakan <strong>Fokus Belajar</strong> (IF), dan Butir #5 memetakan <strong>Confidency</strong> (IC).
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-amber-600" />
                          2. Rumus Korelasi Pearson (r)
                        </span>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Kovarians dihitung antara vektor skor santri dibagi akar perkalian varians untuk mengukur kekuatan linier murni (skala -1.00 hingga +1.00).
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          3. Jalur Mediasi (a × b)
                        </span>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Perkalian koefisien jalur a dan b menghasilkan rasio transmisi transmisi kognitif, membuktikan bahwa fokus belajar adalah prasyarat utama lahirnya confidency sejati.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: BASIS DATA SANTRI & REKAPITULASI NILAI                               */}
          {/* ========================================================================= */}
          {activeTab === "tabel" && (
            <div className="space-y-6">
              {/* Filter & Search Bar Card (Timbul 3D) */}
              <Card className="border-slate-200 bg-white p-5 shadow-xs rounded-xl transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_12px_28px_-6px_rgba(21,128,61,0.2),0_0_15px_1px_rgba(34,197,94,0.12)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Filter className="h-4 w-4 text-emerald-700" />
                      Filter &amp; Pencarian Data Santri
                    </h3>
                    <p className="text-xs text-slate-500">
                      Menampilkan {filteredStudents.length} dari total {responses.length} data santri terverifikasi
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportToCSV}
                      disabled={filteredStudents.length === 0}
                      className="gap-1.5 text-xs font-bold text-emerald-800 border-emerald-300 hover:bg-emerald-50 shadow-2xs cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Ekspor CSV
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleClearAll}
                      disabled={responses.length === 0}
                      className="gap-1.5 text-xs font-bold shadow-2xs cursor-pointer hover:bg-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Kosongkan Semua
                    </Button>
                  </div>
                </div>

                {/* Filter Controls Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4">
                  {/* Search Input */}
                  <div className="md:col-span-4 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari nama, NIS, atau saran santri..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-emerald-500 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>

                  {/* Class Dropdown */}
                  <div className="md:col-span-2">
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-700 transition-all duration-200 hover:border-emerald-500 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 cursor-pointer"
                    >
                      {classFilters.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Gender Dropdown */}
                  <div className="md:col-span-2">
                    <select
                      value={selectedGender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-700 transition-all duration-200 hover:border-emerald-500 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 cursor-pointer"
                    >
                      {genderFilters.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Confidence & Persona Category Dropdown */}
                  <div className="md:col-span-4">
                    <select
                      value={selectedConfidenceCategory}
                      onChange={(e) => setSelectedConfidenceCategory(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-700 transition-all duration-200 hover:border-emerald-500 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 cursor-pointer"
                    >
                      {confidenceFilters.map((cf) => (
                        <option key={cf.value} value={cf.value}>
                          {cf.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>

              {/* Responses Table (Timbul 3D & Kolom Lengkap IK, IF, IC, Persona) */}
              <Card className="border-slate-200 bg-white overflow-hidden shadow-xs rounded-xl transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_12px_30px_-6px_rgba(21,128,61,0.2),0_0_15px_1px_rgba(34,197,94,0.12)]">
                <CardContent className="p-0">
                  {loadingResponses ? (
                    <div className="flex min-h-[300px] items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                        <p className="text-xs text-slate-500">Memuat tabel basis data santri...</p>
                      </div>
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="p-12 text-center space-y-2">
                      <p className="text-sm font-semibold text-slate-700">Tidak ada data respon santri yang sesuai.</p>
                      <p className="text-xs text-slate-400">
                        Coba sesuaikan kata kunci pencarian atau bersihkan filter dropdown Anda.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-600">
                          <tr>
                            <th className="px-5 py-3.5">Santri Responden</th>
                            <th className="px-4 py-3.5">Kelas &amp; NIS</th>
                            <th className="px-4 py-3.5 text-center">Konsistensi (IK)</th>
                            <th className="px-4 py-3.5 text-center">Fokus (IF)</th>
                            <th className="px-4 py-3.5 text-center">Confidency (IC)</th>
                            <th className="px-4 py-3.5 text-center">Status Persona</th>
                            <th className="px-4 py-3.5">Waktu &amp; Masukan</th>
                            <th className="px-4 py-3.5 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {filteredStudents.map((item) => {
                            const isIkhwan = item.jenisKelamin !== "Akhwat";

                            return (
                              <tr key={item.id} className="hover:bg-emerald-50/70 transition-colors">
                                {/* 1. Nama Santri & Gender Avatar */}
                                <td className="px-5 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${
                                        isIkhwan
                                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                          : "bg-amber-100 text-amber-800 border-amber-300"
                                      }`}
                                    >
                                      {item.nama.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <span className="block font-bold text-slate-900">{item.nama}</span>
                                      <span className="text-[10px] text-slate-400 font-medium">
                                        {item.jenisKelamin} • {item.kategori}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                {/* 2. Kelas & NIS */}
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  <div className="flex flex-col gap-0.5">
                                    <Badge variant="outline" className="text-[10px] py-0 font-semibold self-start">
                                      {item.kategori}
                                    </Badge>
                                    <span className="text-[10px] font-mono text-slate-400">
                                      NIS: {item.nomorId}
                                    </span>
                                  </div>
                                </td>

                                {/* 3. Konsistensi (IK) Progress */}
                                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                  <div className="inline-flex flex-col items-center gap-1 w-20">
                                    <span className="font-mono font-bold text-emerald-800 text-xs">
                                      {item.ikPct}%
                                    </span>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${item.ikPct}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>

                                {/* 4. Fokus (IF) Progress */}
                                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                  <div className="inline-flex flex-col items-center gap-1 w-20">
                                    <span className="font-mono font-bold text-amber-800 text-xs">
                                      {item.ifPct}%
                                    </span>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${item.ifPct}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>

                                {/* 5. Confidency (IC) Progress */}
                                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                  <div className="inline-flex flex-col items-center gap-1 w-20">
                                    <span className="font-mono font-bold text-teal-800 text-xs">
                                      {item.icPct}%
                                    </span>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className="bg-teal-600 h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${item.icPct}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>

                                {/* 6. Status Persona */}
                                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                  <Badge className={`text-[10px] py-0.5 px-2.5 shadow-2xs ${item.personaBadgeClass}`}>
                                    {item.personaLabel}
                                  </Badge>
                                </td>

                                {/* 7. Waktu & Masukan */}
                                <td className="px-4 py-3.5 max-w-[200px]">
                                  <span className="block text-[10px] font-mono text-slate-400">
                                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                  <p className="text-[11px] text-slate-600 truncate mt-0.5" title={item.feedback || "-"}>
                                    {item.feedback || "-"}
                                  </p>
                                </td>

                                {/* 8. Aksi Kendali */}
                                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteResponse(item.id, item.nama)}
                                    title={`Hapus respon ${item.nama}`}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer active:scale-90"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

export default function SuperAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            <p className="text-xs text-slate-500 font-medium">Memuat portal Super Admin VERTIKAL IF...</p>
          </div>
        </div>
      }
    >
      <SuperAdminDashboard />
    </Suspense>
  );
}
