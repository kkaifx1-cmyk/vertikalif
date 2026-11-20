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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
import { AnalyticsSummary, ResponseRecord, computeAnalyticsFromResponses } from "@/lib/data-store";
import {
  EVALUATION_SESSIONS,
  filterResponsesBySession,
  computeSessionMetrics,
  extractWibDate,
  OFFICIAL_SESSION_DATES,
  EvaluationSession,
  SessionMetricsSummary,
  getSessionIdForResponse,
} from "@/lib/session-helper";
import { CalendarDays, Calendar, Clock, Check } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { BentoKpiGrid } from "@/components/super-admin/bento-kpi-grid";
import { RadarKaihChart } from "@/components/super-admin/radar-kaih-chart";
import { CohortCorrelationMatrix } from "@/components/super-admin/cohort-correlation-matrix";
import { LiveActivityFeed } from "@/components/super-admin/live-activity-feed";
import { MediationTriangle } from "@/components/super-admin/mediation-triangle";
import { PathDonuts } from "@/components/super-admin/path-donuts";
import { VariableDetailsBreakdown } from "@/components/super-admin/variable-details-breakdown";
import { RoleModelsSpotlight, ExtendedStudentData } from "@/components/super-admin/role-models-spotlight";
import { StudentDetailModal } from "@/components/super-admin/student-detail-modal";
import { NumberTicker } from "@/components/super-admin/number-ticker";
import { MultiSessionTrendChart } from "@/components/super-admin/multi-session-trend-chart";
import { GenderKaihComparisonChart } from "@/components/super-admin/gender-kaih-comparison-chart";
import { KaihLeverageRankingChart } from "@/components/super-admin/kaih-leverage-ranking-chart";
import { PersonaDistributionDonut } from "@/components/super-admin/persona-distribution-donut";

const THEME_COLORS = ["#15803d", "#d97706", "#0284c7", "#7c3aed", "#059669", "#ea580c", "#4f46e5"];
const LIKERT_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#15803d"];
const CONFIDENCE_BAR_COLORS = ["#15803d", "#d97706", "#0284c7", "#7c3aed", "#059669", "#ea580c", "#0891b2"];

function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return "-";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s} dtk`;
  if (s === 0) return `${m} mnt`;
  return `${m} mnt ${s} dtk`;
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
  const [inspectedStudentModal, setInspectedStudentModal] = useState<ExtendedStudentData | null>(null);

  // Tanggal WIB hari ini (di-set via useEffect agar aman dari evaluasi prerender Next.js)
  const [todayDateStr, setTodayDateStr] = useState<string>("");

  // Filter Sesi Evaluasi 4 Hari & Rekapan Gabungan (Default otomatis ke Sesi Hari Ini jika sedang berlangsung)
  const [selectedSessionId, setSelectedSessionId] = useState<string>("all");

  useEffect(() => {
    const today = extractWibDate(new Date());
    setTodayDateStr(today);
    const sesiParam = searchParams.get("sesi");
    if (sesiParam) {
      setSelectedSessionId(sesiParam);
    } else {
      const targetSessionId = getSessionIdForResponse(today);
      const todaySession = EVALUATION_SESSIONS.find((s) => s.id === targetSessionId);
      if (todaySession) {
        setSelectedSessionId(todaySession.id);
      }
    }
  }, [searchParams]);

  const activeResponses = useMemo(
    () => filterResponsesBySession(responses, selectedSessionId),
    [responses, selectedSessionId]
  );

  const activeAnalytics = useMemo(
    () => computeAnalyticsFromResponses(activeResponses),
    [activeResponses]
  );

  const sessionSummaries = useMemo(
    () => EVALUATION_SESSIONS.map((sess) => computeSessionMetrics(sess, responses)),
    [responses]
  );

  const otherResponsesCount = useMemo(() => {
    // Seluruh respon di luar 4 sesi resmi dialokasikan dan direkap langsung ke Hari Rabu (Sesi 3)
    return 0;
  }, []);

  const activeSession = useMemo(
    () => EVALUATION_SESSIONS.find((s) => s.id === selectedSessionId) || EVALUATION_SESSIONS[0],
    [selectedSessionId]
  );

  const activeSessionSummary = useMemo(() => {
    return sessionSummaries.find((s) => s.session.id === selectedSessionId) || sessionSummaries[0];
  }, [sessionSummaries, selectedSessionId]);

  const anomaliesCount = useMemo(() => {
    return activeResponses.filter((r) => {
      const isTooFast = typeof r.durationSeconds === "number" && r.durationSeconds > 0 && r.durationSeconds < 45;
      const answers = Object.values(r.answers || {});
      const isFlatline = answers.length >= 10 && answers.every((val) => val === answers[0]);
      return isTooFast || isFlatline;
    }).length;
  }, [activeResponses]);

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

    // Auto-poll setiap 20 detik agar data respon santri hari ini otomatis terupdate live
    const interval = setInterval(() => {
      fetchResponses();
      fetchAnalytics();
    }, 20000);

    return () => clearInterval(interval);
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

    if (!activeResponses || activeResponses.length === 0) {
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
        rConsistencyConfidence: 0,
        r2ConsistencyFocus: 0,
        r2FocusConfidence: 0,
        avgRawConfidence: 0,
        rawConfidencePct: 0,
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

    const total = activeResponses.length;
    const kList: number[] = [];
    const fList: number[] = [];
    const cList: number[] = [];
    const rawCList: number[] = [];

    let sumSelective = 0, countSelective = 0;
    let sumOpen = 0, countOpen = 0;
    let sumExecutive = 0, countExecutive = 0;

    const itemConsSum = [0, 0, 0, 0, 0, 0, 0];
    const itemConsCnt = [0, 0, 0, 0, 0, 0, 0];
    const itemConfSum = [0, 0, 0, 0, 0, 0, 0];
    const itemConfCnt = [0, 0, 0, 0, 0, 0, 0];

    activeResponses.forEach((r) => {
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
      // METODE 2: Confidency Sejati santri dikalibrasi adil (50% Fokus + 50% Butir 5 Unjuk Diri)
      const rawC = cCnt > 0 ? cSum / cCnt : 3.0;
      rawCList.push(rawC);
      const studentF = fCnt > 0 ? fSum / fCnt : 3.0;
      const synthC = r.confidenceScore !== undefined ? r.confidenceScore : Number((0.5 * studentF + 0.5 * rawC).toFixed(2));
      cList.push(synthC);
    });

    const avgK = kList.length > 0 ? kList.reduce((a, b) => a + b, 0) / kList.length : 0;
    const avgF = fList.length > 0 ? fList.reduce((a, b) => a + b, 0) / fList.length : 0;
    const avgC = cList.length > 0 ? cList.reduce((a, b) => a + b, 0) / cList.length : 0;
    const avgRawC = rawCList.length > 0 ? rawCList.reduce((a, b) => a + b, 0) / rawCList.length : 0;

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
    const rKC = total >= 2 ? calcPearson(kList, cList, avgK, avgC) : 0;

    const rConsistencyFocus = Number(rKF.toFixed(3));
    const rFocusConfidence = Number(rFC.toFixed(3));
    const rConsistencyConfidence = Number(rKC.toFixed(3));

    return {
      total,
      avgConsistency: Number(avgK.toFixed(2)),
      consistencyPct: avgK > 0 ? Math.round(((Math.max(1, avgK) - 1) / 3) * 100) : 0,
      avgFocus: Number(avgF.toFixed(2)),
      focusPct: avgF > 0 ? Math.round(((Math.max(1, avgF) - 1) / 3) * 100) : 0,
      avgConfidence: Number(avgC.toFixed(2)),
      confidencePct: avgC > 0 ? Math.round(((Math.max(1, avgC) - 1) / 3) * 100) : 0,
      avgRawConfidence: Number(avgRawC.toFixed(2)),
      rawConfidencePct: avgRawC > 0 ? Math.round(((Math.max(1, avgRawC) - 1) / 3) * 100) : 0,
      rConsistencyFocus,
      rFocusConfidence,
      rConsistencyConfidence,
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
  }, [activeResponses]);

  // Ekstensi Data Santri (IK, IF, IC, Tier 3 Sleep, dan Status Persona) & IKV Komposit
  const { ikvData, extendedStudents, personaCounts } = useMemo(() => {
    if (!activeResponses || activeResponses.length === 0) {
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

    const students: ExtendedStudentData[] = activeResponses.map((r) => {
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
      let personaLabel = "Berkembang";
      let personaBadgeClass = "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700";

      if ((ifPct >= 70 || quranPct >= 75) && icPct < 65) {
        persona = "quiet_hafidz";
        personaLabel = "Quiet Hafidz";
        personaBadgeClass = "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-medium";
      } else if (icPct >= 70 && sleepPct < 55) {
        persona = "fragile_performer";
        personaLabel = "Fragile Performer";
        personaBadgeClass = "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 font-medium";
      } else if (ikPct >= 70 && ifPct >= 70 && icPct >= 70) {
        persona = "anchored_leader";
        personaLabel = "Anchored Leader";
        personaBadgeClass = "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-medium";
      }

      const targetSessionId = getSessionIdForResponse(r.createdAt);
      const matchedSess = EVALUATION_SESSIONS.find((s) => s.id === targetSessionId) || EVALUATION_SESSIONS[3];
      const sessionName = matchedSess.name;
      const sessionBadge = matchedSess.badge;

      return {
        id: r.id,
        nama: r.nama,
        kategori: r.kategori,
        jenisKelamin: r.jenisKelamin || "Ikhwan",
        nomorId: r.nomorId || "-",
        totalScore: r.totalScore,
        durationSeconds: r.durationSeconds || 0,
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
        sessionBadge,
        sessionName,
        answers: (r.answers || {}) as Record<string, number>,
      };
    });

    // Perhitungan Multi-Tier IKV Sekolah (Tier 1: x3, Tier 2: x2, Tier 3: x1)
    const avgThemeScores: Record<number, number> = {};
    for (let k = 1; k <= 7; k++) {
      let sum = 0, count = 0;
      activeResponses.forEach((r) => {
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
  }, [activeResponses, cognitivePipelineData]);

  // Kekuatan Jalur Mediasi Kognitif untuk Tab 2 (Waterfall & The Hook)
  const { pathStrength, mediationPct, directEffect } = useMemo(() => {
    if (!activeResponses || activeResponses.length < 2) {
      return { pathStrength: "0.000", mediationPct: "0.0", directEffect: "0.0" };
    }
    const rKF = cognitivePipelineData.rConsistencyFocus;
    const rFC = cognitivePipelineData.rFocusConfidence;
    const rKC = cognitivePipelineData.rConsistencyConfidence ?? 0;
    const mult = rKF * rFC;
    const medPct = mult * 100;

    // Hayes PROCESS Direct Effect (c')
    // c' = (rKC - rKF * rFC) / (1 - rKF^2)
    const denom = 1 - rKF * rKF;
    const cPrime = denom > 0.001 ? (rKC - mult) / denom : 0;
    const direct = Math.max(0, cPrime * 100);

    return {
      pathStrength: mult.toFixed(3),
      mediationPct: medPct.toFixed(1),
      directEffect: direct.toFixed(1),
    };
  }, [activeResponses, cognitivePipelineData]);

  // Rata-rata durasi pengerjaan sesi aktif
  const avgSessionDuration = useMemo(() => {
    const valid = activeResponses.filter((r) => r.durationSeconds && r.durationSeconds > 0);
    if (valid.length === 0) return 0;
    const sum = valid.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
    return Math.round(sum / valid.length);
  }, [activeResponses]);

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

  // Pagination State (20 Santri per Halaman)
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset ke halaman 1 saat filter, pencarian, atau sesi berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedClass, selectedGender, selectedConfidenceCategory, selectedSessionId]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedStudents = useMemo(() => {
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredStudents, safePage]);

  const startItem = filteredStudents.length > 0 ? (safePage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endItem = Math.min(safePage * ITEMS_PER_PAGE, filteredStudents.length);

  // Export to CSV Function
  const exportToCSV = () => {
    if (filteredStudents.length === 0) return;

    const headers = [
      "ID",
      "Nama Santri",
      "Tingkat Kelas",
      "Jenis Kelamin",
      "NIS / Nomor ID",
      "Durasi Pengerjaan",
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
      `"${formatDuration(r.durationSeconds)}"`,
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
    { value: "persona_anchored_leader", label: "Persona: Anchored Leader" },
    { value: "persona_quiet_hafidz", label: "Persona: The Quiet Hafidz" },
    { value: "persona_fragile_performer", label: "Persona: The Fragile Performer" },
    { value: "persona_developing", label: "Persona: Berkembang" },
    { value: "Sangat Percaya Diri", label: "Sangat Percaya Diri (≥ 3.25)" },
    { value: "Percaya Diri", label: "Percaya Diri (2.75 - 3.24)" },
    { value: "Cukup Percaya Diri", label: "Cukup Percaya Diri (2.00 - 2.74)" },
    { value: "Perlu Bimbingan", label: "Perlu Bimbingan (< 2.00)" },
  ];

  return (
    <AuthGuard
      pageTitle="Portal Super Admin"
      pageDescription="Pusat Kendali Data & Analisis Hasil Survei Santri"
    >
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-16 transition-colors duration-200">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          {/* Header Dashboard */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-slate-700 dark:text-zinc-300 mb-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Dashboard Super Admin VERTIKAL IF • SMAIT Ihsanul Fikri</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
                Pusat Kendali Data &amp; Arsitektur Kognitif Santri
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Visualisasi Indeks Komposit Vertikal (IKV), Mediasi Kognitif 7 KAIH, dan Basis Data Terverifikasi.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-medium text-slate-700 dark:text-zinc-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Live Sync (20 dtk)</span>
              </div>
              <ThemeToggle variant="dropdown" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  fetchAnalytics();
                  fetchResponses();
                }}
                disabled={loadingAnalytics || loadingResponses}
                className="gap-1.5 shadow-2xs font-medium cursor-pointer"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    loadingAnalytics || loadingResponses ? "animate-spin text-slate-500" : "text-slate-600"
                  }`}
                />
                Segarkan Data
              </Button>
            </div>
          </div>

          
          {/* ========================================================================= */}
          {/* GRID UTAMA: KOLOM KIRI (NAVIGASI SESI 4 HARI) & KOLOM KANAN (KONTEN TAB) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* ======================================================================= */}
            {/* KOLOM KIRI: PANEL REKAPAN 4 SESI & TIMELINE PENGISIAN                   */}
            {/* ======================================================================= */}
            <aside className="lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-4 z-10">
              {/* Card Navigasi Sesi */}
              <Card className="border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs rounded-2xl overflow-hidden">
                <CardHeader className="p-4 pb-3.5 bg-slate-900 dark:bg-zinc-900 border-b border-slate-800 text-white">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-300">
                      <CalendarDays className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Timeline Evaluasi</span>
                    </span>
                    <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[11px] font-mono">
                      4 Sesi Resmi
                    </Badge>
                  </div>
                  <CardTitle className="text-sm sm:text-base font-semibold text-white mt-1.5">
                    Rekapan Harian 4 Sesi
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400 leading-snug">
                    Pilih sesi pengisian untuk memfilter seluruh data atau pantau rekapan gabungan.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-3 space-y-2.5">
                  {/* Banner Sesi Aktif Hari Ini */}
                  {(() => {
                    const targetSessionId = todayDateStr ? getSessionIdForResponse(todayDateStr) : "sesi_3";
                    const todaySession =
                      EVALUATION_SESSIONS.find((s) => s.id === targetSessionId) ||
                      EVALUATION_SESSIONS[3];
                    const isTodaySelected = selectedSessionId === todaySession.id;

                    return (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white block text-xs leading-tight">
                              Sesi Aktif: {todaySession.dayName}, {todaySession.formattedDate}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                              {todaySession.badge} • Pengambilan Data Siswa
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedSessionId(todaySession.id)}
                          className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            isTodaySelected
                              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                              : "bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50"
                          }`}
                        >
                          {isTodaySelected ? "Dibuka" : `Buka ${todaySession.badge}`}
                        </button>
                      </div>
                    );
                  })()}

                  {/* 1. KARTU REKAPAN GABUNGAN 4 SESI */}
                  {(() => {
                    const consolidatedSummary = sessionSummaries.find((s) => s.session.id === "all");
                    const isSelected = selectedSessionId === "all";
                    return (
                      <div
                        onClick={() => setSelectedSessionId("all")}
                        className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-slate-900 dark:bg-zinc-800 text-white border-slate-700 shadow-xs"
                            : "bg-slate-50/60 dark:bg-zinc-900/60 hover:bg-slate-100/70 dark:hover:bg-zinc-800/50 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                              isSelected ? "bg-slate-800 text-slate-200" : "bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                            }`}
                          >
                            Rekapan Gabungan
                          </span>
                          <span
                            className={`text-xs font-mono font-semibold ${
                              isSelected ? "text-emerald-400" : "text-slate-700 dark:text-zinc-300"
                            }`}
                          >
                            {consolidatedSummary?.totalCount || 0} Santri
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between">
                          <div>
                            <h4
                              className={`text-xs font-semibold ${
                                isSelected ? "text-white" : "text-slate-900 dark:text-white"
                              }`}
                            >
                              Konsolidasi 4 Hari
                            </h4>
                            <p className={`text-[11px] ${isSelected ? "text-slate-400" : "text-slate-500 dark:text-zinc-400"}`}>
                              {consolidatedSummary?.session.formattedDate || "02 - 14 Nov 2026"}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`text-sm font-semibold font-mono ${
                                isSelected ? "text-white" : "text-slate-900 dark:text-white"
                              }`}
                            >
                              {consolidatedSummary?.participationPct || 0}%
                            </span>
                            <span className={`block text-[10px] ${isSelected ? "text-slate-400" : "text-slate-500 dark:text-zinc-400"}`}>
                              IKV: {consolidatedSummary?.avgIkv || 0} / 4.0
                            </span>
                          </div>
                        </div>

                        {/* Trio Metrik Mini Pill */}
                        <div
                          className={`mt-2.5 pt-2 border-t grid grid-cols-3 gap-1 text-[11px] text-center font-mono ${
                            isSelected ? "border-slate-800 text-slate-300" : "border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400"
                          }`}
                        >
                          <div className="truncate">
                            <span className="block text-[10px] opacity-75">Ik</span>
                            <strong>{consolidatedSummary?.avgIk || 0}%</strong>
                          </div>
                          <div className="truncate border-x border-current/20">
                            <span className="block text-[10px] opacity-75">If</span>
                            <strong>{consolidatedSummary?.avgIf || 0}%</strong>
                          </div>
                          <div className="truncate">
                            <span className="block text-[10px] opacity-75">Ic</span>
                            <strong>{consolidatedSummary?.avgIc || 0}%</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="pt-1 pb-0.5 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-zinc-400 px-1">
                    <span>Sesi Harian Terjadwal</span>
                    <span className="text-[11px] font-normal text-slate-400">Pilih untuk filter</span>
                  </div>

                  {/* 2. DAFTAR 4 KARTU SESI (Senin 2 Nov, Kamis 5 Nov, Rabu 11 Nov, Sabtu 14 Nov) */}
                  <div className="space-y-2">
                    {sessionSummaries
                      .filter((s) => s.session.id !== "all")
                      .map((item) => {
                        const isSelected = selectedSessionId === item.session.id;
                        return (
                          <div
                            key={item.session.id}
                            onClick={() => setSelectedSessionId(item.session.id)}
                            className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-slate-900 dark:bg-zinc-800 text-white border-slate-700 shadow-xs"
                                : "bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800/60 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-slate-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                                    isSelected ? "bg-slate-800 text-white" : "bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200"
                                  }`}
                                >
                                  {item.session.badge}
                                </span>
                                <span className={`text-xs font-semibold ${isSelected ? "text-white" : "text-slate-900 dark:text-white"}`}>
                                  {item.session.dayName}, {item.session.formattedDate}
                                </span>
                                {(item.session.dateKey === todayDateStr || item.status === "Aktif Hari Ini") && (
                                  <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                    <span>Hari Ini</span>
                                  </span>
                                )}
                              </div>
                              <span
                                className={`text-[11px] font-mono font-medium px-1.5 py-0.5 rounded ${
                                  item.totalCount > 0
                                    ? isSelected
                                      ? "bg-slate-800 text-emerald-400"
                                      : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                                    : "text-slate-400"
                                }`}
                              >
                                {item.totalCount} Santri
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs mt-1.5">
                              <span className={`text-[11px] ${isSelected ? "text-slate-400" : "text-slate-500 dark:text-zinc-400"}`}>
                                {item.session.phase}
                              </span>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs font-mono font-semibold ${
                                    item.totalCount > 0
                                      ? isSelected
                                        ? "text-emerald-400"
                                        : "text-slate-900 dark:text-white"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {item.totalCount > 0 ? `${item.participationPct}%` : "0%"}
                                </span>
                                <span className={`text-[11px] font-mono ${isSelected ? "text-slate-400" : "text-slate-500 dark:text-zinc-400"}`}>
                                  ({item.totalCount > 0 ? item.avgIkv : "0.00"})
                                </span>
                              </div>
                            </div>

                            {/* Progress Bar per Sesi */}
                            <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1 mt-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  item.totalCount > 0 ? "bg-emerald-600" : "bg-slate-200 dark:bg-zinc-700"
                                }`}
                                style={{ width: `${item.totalCount > 0 ? item.participationPct : 0}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* 3. OPTIONAL OTHER / TEST DATA CARD */}
                  {otherResponsesCount > 0 && (
                    <div
                      onClick={() => setSelectedSessionId("other")}
                      className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        selectedSessionId === "other"
                          ? "bg-amber-950 text-amber-100 border-amber-500 ring-2 ring-amber-500/30"
                          : "bg-amber-50/60 border-amber-200/80 text-amber-900 hover:bg-amber-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5 text-[11px]">
                          <span>📌 Sesi Uji Coba / Tanggal Lain</span>
                        </span>
                        <Badge variant="outline" className="text-[10px] bg-white border-amber-300 font-mono text-amber-950">
                          {otherResponsesCount} Data
                        </Badge>
                      </div>
                      <p className="text-[10px] text-amber-800/80 mt-1 leading-snug">
                        Respon di luar 4 tanggal resmi (tetap terekam tanpa ada data yang hilang).
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 4. TABEL MATRIKS KOMPARASI 4 SESI (MINI MATRIX) */}
              <Card className="border-slate-200 bg-white shadow-xs rounded-2xl overflow-hidden">
                <CardHeader className="p-3.5 pb-2 border-b border-slate-100 dark:border-emerald-500/40 bg-slate-50/70 dark:bg-black/80">
                  <CardTitle className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Matriks Komparasi 4 Hari</span>
                  </CardTitle>
                  <CardDescription className="text-[10px] text-slate-500">
                    Perbandingan langsung capaian antar-sesi pengisian.
                  </CardDescription>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left">
                    <thead className="bg-slate-100/70 dark:bg-black/80 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[9px] border-b border-slate-200/80 dark:border-emerald-500/40">
                      <tr>
                        <th className="py-1.5 px-2.5">Sesi</th>
                        <th className="py-1.5 px-2 text-center">N</th>
                        <th className="py-1.5 px-2 text-center">% Santri</th>
                        <th className="py-1.5 px-2.5 text-right">Ik • If • Ic</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sessionSummaries.map((s) => {
                        const isConsolidated = s.session.id === "all";
                        const isSelected = selectedSessionId === s.session.id;
                        return (
                          <tr
                            key={s.session.id}
                            onClick={() => setSelectedSessionId(s.session.id)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-emerald-50/80 font-bold text-emerald-950"
                                : isConsolidated
                                ? "bg-slate-50/50 font-semibold text-slate-900"
                                : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <td className="py-1.5 px-2.5">
                              <div className="flex items-center gap-1">
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                                <span>{isConsolidated ? "Gabungan" : s.session.badge}</span>
                              </div>
                              <span className="text-[8px] text-slate-400 block">{s.session.formattedDate}</span>
                            </td>
                            <td className="py-1.5 px-2 text-center font-mono font-bold">
                              {s.totalCount}
                            </td>
                            <td className="py-1.5 px-2 text-center font-mono">
                              <span className={s.totalCount > 0 ? "text-emerald-700 font-bold" : "text-slate-400"}>
                                {s.totalCount > 0 ? `${s.participationPct}%` : "0%"}
                              </span>
                            </td>
                            <td className="py-1.5 px-2.5 text-right font-mono text-[9px] text-slate-600">
                              {s.totalCount > 0 ? `${s.avgIk} • ${s.avgIf} • ${s.avgIc}` : "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </aside>

            {/* ======================================================================= */}
            {/* KOLOM KANAN: DASHBOARD UTAMA (TAB 1, TAB 2, TAB 3)                      */}
            {/* ======================================================================= */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6 min-w-0">
              {/* Banner Status Sesi Aktif */}
              <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-semibold text-sm shrink-0 ${activeSession.badgeColor}`}>
                    {activeSession.badge}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                        {activeSession.id === "all" ? "Kompilasi Agregat 4 Sesi" : "Filter Sesi Harian"}
                      </span>
                      <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                        {activeSession.name}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {activeSession.description} • Terverifikasi: <strong className="text-slate-900 dark:text-white font-mono"><NumberTicker value={activeResponses.length} /> santri</strong>
                    </p>
                  </div>
                </div>

                {selectedSessionId !== "all" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSessionId("all")}
                    className="shrink-0 gap-1.5 text-xs font-medium cursor-pointer"
                  >
                    <span>Kembali ke Rekapan Gabungan</span>
                  </Button>
                )}
              </div>

              {/* Super Admin 3 Tab Navigation */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("analisis")}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl transition-colors cursor-pointer ${
                    activeTab === "analisis"
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>1. Indeks IKV &amp; Mutu 7 KAIH</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("pengaruh_pede")}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl transition-colors cursor-pointer ${
                    activeTab === "pengaruh_pede"
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <BrainCircuit className="h-4 w-4" />
                  <span>2. Rantai Kausalitas &amp; Pengaruh Confidency</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("tabel")}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl transition-colors cursor-pointer ${
                    activeTab === "tabel"
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Database className="h-4 w-4" />
                  <span>3. Basis Data Santri &amp; Rekapitulasi Nilai</span>
                  {activeResponses.length > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        activeTab === "tabel" ? "bg-slate-800 text-white dark:bg-zinc-200 dark:text-slate-900 font-semibold" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      <NumberTicker value={activeResponses.length} />
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
                  {/* 1. DYNAMIC BENTO KPI GRID (Command Center Executive Bento) */}
                  <BentoKpiGrid
                    isLoading={loadingAnalytics}
                    totalResponses={activeAnalytics.totalResponses}
                    participationPct={activeSessionSummary.participationPct}
                    ikvScore={ikvData.ikvScore}
                    avgWeightedScore={ikvData.avgWeightedScore}
                    ikvStatus={ikvData.ikvStatus}
                    consistencyPct={cognitivePipelineData.consistencyPct}
                    focusPct={cognitivePipelineData.focusPct}
                    confidencePct={cognitivePipelineData.confidencePct}
                    highestTheme={activeAnalytics.highestTheme}
                    lowestTheme={activeAnalytics.lowestTheme}
                    anomaliesCount={anomaliesCount}
                  />

                  {/* 2. REAL-TIME RESPONSE FEED & ANOMALY SENTINEL (<45s & Flatline Alert) */}
                  <LiveActivityFeed
                    responses={activeResponses}
                    onInspectResponse={(res) => {
                      setSearchQuery(res.nama);
                      setActiveTab("tabel");
                    }}
                  />

                  {/* 3. MULTI-SESSION LONGITUDINAL TREND CHART (Sesi 1 s.d. Sesi 4) */}
                  <MultiSessionTrendChart
                    sessionSummaries={sessionSummaries}
                    currentSessionId={selectedSessionId}
                  />

                  {/* Demographics: Ikhwan vs Akhwat & Tingkat Kelas (Timbul 3D) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Gender Breakdown (Ikhwan vs Akhwat) */}
                    <Card className="border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 backdrop-blur-md shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <UserCheck2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          Komposisi Santri (Ikhwan vs Akhwat)
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-zinc-400">
                          Distribusi demografi responden berdasarkan asrama
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {activeAnalytics.genderBreakdown.map((item) => {
                          const isIkhwan = item.gender.toLowerCase().includes("ikhwan");
                          return (
                            <div key={item.gender} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                                  <span
                                    className={`h-2.5 w-2.5 rounded-full ${
                                      isIkhwan ? "bg-emerald-500" : "bg-amber-500"
                                    }`}
                                  />
                                  {item.gender}
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white font-mono">
                                  {item.count} Santri ({item.percentage}%)
                                </span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isIkhwan ? "bg-emerald-500" : "bg-amber-500"
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
                    <Card className="border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 backdrop-blur-md shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          Tingkat Kelas (Jenjang Pendidikan)
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-zinc-400">
                          Sebaran partisipasi dari Kelas X, XI, dan XII
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {activeAnalytics.categoryBreakdown.map((item, idx) => {
                          const colors = ["bg-emerald-500", "bg-amber-500", "bg-blue-500"];
                          const barColor = colors[idx % colors.length];
                          return (
                            <div key={item.kategori} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">{item.kategori}</span>
                                <span className="font-bold text-slate-900 dark:text-white font-mono">
                                  {item.count} Santri ({item.percentage}%)
                                </span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
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

                  {/* 4. KOMPARASI GENDER 7 KAIH (IKHWAN VS AKHWAT) */}
                  <GenderKaihComparisonChart responses={activeResponses} />

                  {/* 5. RADAR / SPIDER CHART 7 KAIH (Multi-Layer Comparison: Aktual vs Target vs Baseline) */}
                  <RadarKaihChart
                    themeAverages={activeAnalytics.themeAverages}
                    schoolTarget={3.5}
                    baselineScore={2.85}
                  />

                  {/* 4. CROSS-FILTER COHORT CORRELATION MATRIX & SCATTER PLOT */}
                  <CohortCorrelationMatrix
                    responses={activeResponses}
                  />

                  {/* TABEL RINCIAN EVALUASI 35 BUTIR PERTANYAAN */}
                  <Card className="border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs rounded-xl">
                    <CardHeader className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 p-5">
                      <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                        Rekapitulasi Rata-Rata Skor per Butir Pertanyaan (35 Butir)
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Rincian capaian setiap butir soal instrumen 7 KAIH untuk evaluasi mendalam asatidz &amp; BK
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto max-h-[420px]">
                        <table className="w-full text-left text-xs">
                          <thead className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 sticky top-0 z-10">
                            <tr>
                              <th className="px-5 py-3">No</th>
                              <th className="px-5 py-3">Pilar KAIH</th>
                              <th className="px-5 py-3">Teks Indikator Pertanyaan</th>
                              <th className="px-5 py-3 text-center">Rata-Rata Skor</th>
                              <th className="px-5 py-3 text-center">Tingkat Capaian</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-slate-700 dark:text-zinc-300">
                            {activeAnalytics.questionAverages.map((q, idx) => {
                              const pct = Math.round(((Math.max(1, q.average) - 1) / 3) * 100);
                              return (
                                <tr key={q.questionId} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                                  <td className="px-5 py-3 font-mono font-medium text-slate-400">{idx + 1}</td>
                                  <td className="px-5 py-3 font-semibold text-emerald-900 dark:text-emerald-400 whitespace-nowrap">
                                    {q.themeTitle}
                                  </td>
                                  <td className="px-5 py-3 max-w-md text-slate-700 dark:text-zinc-300">{q.questionText}</td>
                                  <td className="px-5 py-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                                    {q.average} <span className="text-[10px] text-slate-400">/ 4.0</span>
                                  </td>
                                  <td className="px-5 py-3 text-center">
                                    <span
                                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        pct >= 75
                                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                                          : pct >= 50
                                          ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                                          : "bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300"
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
                  {/* 1. HERO BANNER: SKEMA PENGARUH & MEDIASI KOGNITIF */}
                  <div className="rounded-2xl border border-slate-800 dark:border-zinc-800 bg-slate-900 dark:bg-zinc-900 p-6 sm:p-8 text-white shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200">
                          <BrainCircuit className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Skema Pengaruh &amp; Mediasi Kognitif</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                          <NumberTicker value={mediationPct} suffix="%" /> Kepercayaan Diri Santri Dimediasi Oleh Fokus
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                          Disiplin fisik harian (7 Butir Konsistensi) tidak langsung loncat menjadi keberanian tampil, melainkan ditempa terlebih dahulu melalui <strong>ketahanan fokus &amp; inhibisi distraksi</strong> di kelas.
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2 bg-slate-800/80 rounded-xl p-4 border border-slate-700">
                        <div className="text-center px-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Kekuatan Jalur</span>
                          <div className="text-2xl font-bold text-white font-mono">
                            a × b = <NumberTicker value={pathStrength} decimalPlaces={3} />
                          </div>
                          <Badge className="bg-emerald-600 text-white font-semibold text-[10px] mt-1 shadow-none">
                            Mediasi Signifikan
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* 4 Metrik Penopang Alur */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
                      <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/60">
                        <span className="text-slate-400 block text-[11px]">Indeks Fokus Belajar (IF)</span>
                        <span className="text-base sm:text-lg font-bold text-white font-mono">
                          <NumberTicker value={cognitivePipelineData.focusPct} suffix="%" />{" "}
                          <span className="text-xs font-normal text-slate-400">
                            (r = <NumberTicker value={Math.round(cognitivePipelineData.rConsistencyFocus * 100)} suffix="%" />)
                          </span>
                        </span>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/60">
                        <span className="text-slate-400 block text-[11px]">Indeks Confidency (IC)</span>
                        <span className="text-base sm:text-lg font-bold text-white font-mono">
                          <NumberTicker value={cognitivePipelineData.confidencePct} suffix="%" />{" "}
                          <span className="text-xs font-normal text-slate-400">
                            (r = <NumberTicker value={Math.round(cognitivePipelineData.rFocusConfidence * 100)} suffix="%" />)
                          </span>
                        </span>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/60">
                        <span className="text-slate-400 block text-[11px]">Kekuatan Mediasi (a × b)</span>
                        <span className="text-base sm:text-lg font-bold text-white font-mono">
                          <NumberTicker value={mediationPct} suffix="%" /> <span className="text-xs font-normal text-slate-400">Konversi</span>
                        </span>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/60">
                        <span className="text-slate-400 block text-[11px]">Santri Role Model</span>
                        <span className="text-base sm:text-lg font-bold text-white font-mono">
                          <NumberTicker value={personaCounts.anchoredLeader} /> Santri <span className="text-xs font-normal text-emerald-400">Anchored</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. ARSITEKTUR SEGITIGA MEDIASI HAYES PROCESS (X -> M -> Y) */}
                  <MediationTriangle
                    consistencyPct={cognitivePipelineData.consistencyPct}
                    avgConsistency={cognitivePipelineData.avgConsistency}
                    focusPct={cognitivePipelineData.focusPct}
                    avgFocus={cognitivePipelineData.avgFocus}
                    confidencePct={cognitivePipelineData.confidencePct}
                    avgConfidence={cognitivePipelineData.avgConfidence}
                    rConsistencyFocus={cognitivePipelineData.rConsistencyFocus}
                    rFocusConfidence={cognitivePipelineData.rFocusConfidence}
                    directEffect={directEffect}
                    mediationPct={mediationPct}
                    pathStrength={pathStrength}
                  />

                  {/* 3. DUA DIAGRAM DONAT ANALISIS JALUR (PATH A & PATH B) */}
                  <PathDonuts
                    rConsistencyFocus={cognitivePipelineData.rConsistencyFocus}
                    r2ConsistencyFocus={cognitivePipelineData.r2ConsistencyFocus}
                    rFocusConfidence={cognitivePipelineData.rFocusConfidence}
                    r2FocusConfidence={cognitivePipelineData.r2FocusConfidence}
                    totalResponses={activeAnalytics.totalResponses}
                  />

                  {/* 4. DIAGRAM RINCIAN CAPAIAN DENGAN FITUR SORTING TOGGLE TITIK LEMAH */}
                  <VariableDetailsBreakdown
                    consistencyItems={cognitivePipelineData.consistencyItems}
                    consistencySummary={{
                      pct: cognitivePipelineData.consistencyPct,
                      avg: cognitivePipelineData.avgConsistency,
                    }}
                    focusDimensions={cognitivePipelineData.focusDimensions}
                    focusSummary={{
                      pct: cognitivePipelineData.focusPct,
                      avg: cognitivePipelineData.avgFocus,
                    }}
                    confidenceItems={cognitivePipelineData.confidenceItems}
                    confidenceSummary={{
                      pct: cognitivePipelineData.rawConfidencePct ?? cognitivePipelineData.confidencePct,
                      avg: cognitivePipelineData.avgRawConfidence ?? cognitivePipelineData.avgConfidence,
                    }}
                  />

                  {/* 5. DUA VISUALISASI ADVANCED: RANKING DAYA UNGKIT & SEBARAN 5 PERSONA */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <KaihLeverageRankingChart
                      impactScheme={activeAnalytics.confidenceAnalytics.kaihImpactScheme}
                    />
                    <PersonaDistributionDonut
                      personaCounts={personaCounts}
                      totalResponses={activeAnalytics.totalResponses}
                      onSelectPersona={(key) => {
                        setSelectedConfidenceCategory(`persona_${key}`);
                        setActiveTab("tabel");
                      }}
                    />
                  </div>

                  {/* 6. EARLY WARNING BK & MUSYRIF: 2 KARTU DETEKSI PERSONA SANTRI KRITIS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Kartu 1: The Quiet Hafidz */}
                    <Card className="border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-2xl shadow-xs">
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 shrink-0">
                          <UserCheck2 className="h-5 w-5" />
                        </div>
                        <div className="space-y-2.5 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                The Quiet Hafidz
                              </h4>
                              <span className="text-[11px] font-medium text-blue-700 dark:text-blue-400 block">Potensi Akademik/Tahfidz Tinggi • Perlu Penguatan Keberanian</span>
                            </div>
                            <Badge variant="outline" className="text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 text-xs px-2.5 py-0.5 font-semibold shrink-0">
                              {personaCounts.quietHafidz} Santri Terdeteksi
                            </Badge>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                            Santri memiliki hafalan Al-Qur&apos;an dan atensi belajar sangat tinggi (≥ 70%), namun skor Confidency rendah (&lt; 65%). Mengalami kecemasan unjuk diri (<em>social performance anxiety</em>).
                          </p>

                          {/* Daftar Nama Santri Quiet Hafidz yang Terdeteksi */}
                          {extendedStudents.filter((s) => s.persona === "quiet_hafidz").length > 0 ? (
                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                  Daftar Santri Teridentifikasi:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedConfidenceCategory("persona_quiet_hafidz");
                                    setActiveTab("tabel");
                                  }}
                                  className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                                >
                                  Buka di Tabel ➔
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {extendedStudents
                                  .filter((s) => s.persona === "quiet_hafidz")
                                  .map((s) => (
                                    <button
                                      key={s.id}
                                      type="button"
                                      onClick={() => setInspectedStudentModal(s)}
                                      title={`Klik untuk melihat radar ${s.nama}`}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-xs font-medium text-slate-800 dark:text-zinc-200 shadow-2xs cursor-pointer transition-colors"
                                    >
                                      <span>{s.nama}</span>
                                      <span className="text-[10px] text-blue-700 dark:text-blue-400 font-mono font-medium">({s.kategori})</span>
                                      <Compass className="h-3 w-3 text-slate-400 ml-0.5" />
                                    </button>
                                  ))}
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs text-slate-500 italic">
                              {responses.length === 0
                                ? "Belum ada respon santri yang terekam."
                                : "Belum ada santri terdeteksi pada profil ini (Tingkat confidency seimbang dengan fokus)."}
                            </div>
                          )}

                          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px] font-medium text-slate-700 dark:text-zinc-300 flex items-start gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <span><strong>Rekomendasi Musyrif &amp; BK:</strong> Latih panggung bertahap mulai dari halaqah kecil, kultum kamar, hingga forum angkatan tanpa paksaan.</span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Kartu 2: The Fragile Performer */}
                    <Card className="border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-2xl shadow-xs">
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 shrink-0">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div className="space-y-2.5 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                The Fragile Performer
                              </h4>
                              <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 block">Pede Tinggi • Jam Tidur Kritis • Perlu Pemulihan Fisik</span>
                            </div>
                            <Badge variant="outline" className="text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 text-xs px-2.5 py-0.5 font-semibold shrink-0">
                              {personaCounts.fragilePerformer} Santri Terdeteksi
                            </Badge>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                            Percaya diri tinggi dan suka tampil (≥ 70%), namun skor Tier 3 (Jam Tidur K6 &amp; Pemulihan) anjlok di bawah 55%. Gejala kelelahan istirahat asrama yang memicu kelelahan kortikal.
                          </p>

                          {/* Daftar Nama Santri Fragile Performer yang Terdeteksi */}
                          {extendedStudents.filter((s) => s.persona === "fragile_performer").length > 0 ? (
                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                  Daftar Santri Teridentifikasi:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedConfidenceCategory("persona_fragile_performer");
                                    setActiveTab("tabel");
                                  }}
                                  className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                                >
                                  Buka di Tabel ➔
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {extendedStudents
                                  .filter((s) => s.persona === "fragile_performer")
                                  .map((s) => (
                                    <button
                                      key={s.id}
                                      type="button"
                                      onClick={() => setInspectedStudentModal(s)}
                                      title={`Klik untuk melihat radar ${s.nama}`}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-xs font-medium text-slate-800 dark:text-zinc-200 shadow-2xs cursor-pointer transition-colors"
                                    >
                                      <span>{s.nama}</span>
                                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono font-medium">({s.kategori})</span>
                                      <Compass className="h-3 w-3 text-slate-400 ml-0.5" />
                                    </button>
                                  ))}
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs text-slate-500 italic">
                              {responses.length === 0
                                ? "Belum ada respon santri yang terekam."
                                : "Belum ada santri terdeteksi pada profil ini (Seluruh santri menjaga kecukupan jam tidur)."}
                            </div>
                          )}

                          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px] font-medium text-slate-700 dark:text-zinc-300 flex items-start gap-1.5">
                            <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <span><strong>Rekomendasi Musyrif &amp; BK:</strong> Restrukturisasi jam tidur malam wajib ditegakkan sebelum santri diberi beban hafalan tambahan.</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* 6. PAPAN SPOTLIGHT: SANTRI BERKARAKTER KUAT (PODIUM TOP 3 & RADAR DRILL-DOWN) */}
                  <RoleModelsSpotlight
                    students={extendedStudents}
                    onDeleteStudent={handleDeleteResponse}
                    onRefresh={() => {
                      fetchAnalytics();
                      fetchResponses();
                    }}
                  />

                  {/* 7. PANEL TRANSPARANSI: CARA MENDAPATKAN DATA KORELASI */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 backdrop-blur-md p-6 shadow-xs space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 shrink-0">
                        <Info className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Transparansi Metodologi: Cara Mendapatkan Data Korelasi &amp; Mediasi
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                          Sistem VERTIKAL IF menggunakan instrumen 35 butir terstruktur untuk memverifikasi hipotesis bahwa ketahanan atensi (Fokus) bertindak sebagai mediator penuh (<em>Full Mediator</em>) yang mengonversi kedisiplinan fisik harian menjadi kemantapan rasa percaya diri santri.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                      <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/60 space-y-1.5">
                        <span className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          1. Pemetaan 35 Butir
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                          Butir #1 memetakan <strong>Konsistensi Aksi</strong> (IK), Butir #2, #3, #4 memetakan <strong>Fokus Belajar</strong> (IF), dan Butir #5 memetakan <strong>Unjuk Diri</strong>. Skor Confidency Akhir dikalibrasi adil (50% Fokus + 50% Unjuk Diri).
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/60 space-y-1.5">
                        <span className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-amber-600" />
                          2. Rumus Korelasi Pearson (r)
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                          Kovarians dihitung antara vektor skor santri dibagi akar perkalian varians untuk mengukur kekuatan linier murni (skala -1.00 hingga +1.00).
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/60 space-y-1.5">
                        <span className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          3. Jalur Mediasi (a × b)
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
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
              {/* Filter & Search Bar Card */}
              <Card className="border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Filter className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
                      Filter &amp; Pencarian Data Santri
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Menampilkan {startItem}–{endItem} dari total {filteredStudents.length} data santri ({activeSession.name}) • Halaman {safePage} dari {totalPages}
                      {avgSessionDuration > 0 && (
                        <span className="ml-2 font-medium text-emerald-700 dark:text-emerald-400">
                          • Rerata Pengerjaan: {formatDuration(avgSessionDuration)}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportToCSV}
                      disabled={filteredStudents.length === 0}
                      className="gap-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-2xs cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Ekspor CSV
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleClearAll}
                      disabled={activeResponses.length === 0}
                      className="gap-1.5 text-xs font-semibold shadow-2xs cursor-pointer hover:bg-red-700"
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
                      className="w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    />
                  </div>

                  {/* Class Dropdown */}
                  <div className="md:col-span-2">
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs sm:text-sm text-slate-700 dark:text-zinc-200 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
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
                      className="w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs sm:text-sm text-slate-700 dark:text-zinc-200 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
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
                      className="w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs sm:text-sm text-slate-700 dark:text-zinc-200 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
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

              {/* Responses Table */}
              <Card className="border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs rounded-xl">
                <CardContent className="p-0">
                  {loadingResponses ? (
                    <div className="flex min-h-[300px] items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                        <p className="text-xs text-slate-500">Memuat tabel basis data santri...</p>
                      </div>
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 mb-1">
                        <Clock className="h-6 w-6 text-slate-500 dark:text-zinc-400" />
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">
                        {activeSession.dateKey === todayDateStr
                          ? `Belum ada respon yang masuk untuk ${activeSession.name}.`
                          : `Tidak ada data respon santri yang sesuai filter untuk ${activeSession.name}.`}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        {activeSession.dateKey === todayDateStr
                          ? "Pengambilan data siswa hari ini sedang berlangsung. Respon santri yang mengisi kuesioner akan otomatis terekam dan muncul di sini secara terstruktur dan real-time saat disubmit."
                          : "Coba sesuaikan kata kunci pencarian atau buka Rekapan Gabungan."}
                      </p>
                      {selectedSessionId !== "all" && (
                        <button
                          type="button"
                          onClick={() => setSelectedSessionId("all")}
                          className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                        >
                          Lihat Rekapan Gabungan Semua Sesi
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 font-semibold text-slate-600 dark:text-zinc-400">
                          <tr>
                            <th className="px-5 py-3.5">Santri Responden</th>
                            <th className="px-4 py-3.5">Kelas &amp; NIS</th>
                            <th className="px-3.5 py-3.5 text-center whitespace-nowrap">Durasi Pengerjaan</th>
                            <th className="px-4 py-3.5 text-center">Konsistensi (IK)</th>
                            <th className="px-4 py-3.5 text-center">Fokus (IF)</th>
                            <th className="px-4 py-3.5 text-center">Confidency (IC)</th>
                            <th className="px-4 py-3.5 text-center">Status Persona</th>
                            <th className="px-4 py-3.5">Waktu &amp; Masukan</th>
                            <th className="px-4 py-3.5 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-slate-700 dark:text-zinc-300">
                          {paginatedStudents.map((item) => {
                            const isIkhwan = item.jenisKelamin !== "Akhwat";

                            return (
                              <tr
                                key={item.id}
                                onClick={() => setInspectedStudentModal(item)}
                                className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                              >
                                {/* 1. Nama Santri & Gender Avatar */}
                                <td className="px-5 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${
                                        isIkhwan
                                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
                                          : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
                                      }`}
                                    >
                                      {item.nama.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                        <span className="block font-bold text-slate-900 dark:text-white">{item.nama}</span>
                                        <Compass className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>
                                      <span className="text-[10px] text-slate-400 font-medium">
                                        {item.jenisKelamin} • {item.kategori}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                {/* 2. Kelas & NIS */}
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  <div className="flex flex-col gap-0.5">
                                    <Badge variant="outline" className="text-[10px] py-0 font-semibold self-start border-slate-200 dark:border-zinc-800">
                                      {item.kategori}
                                    </Badge>
                                    <span className="text-[10px] font-mono text-slate-400">
                                      NIS: {item.nomorId}
                                    </span>
                                  </div>
                                </td>

                                {/* 2b. Durasi Pengerjaan (Timer 7 KAIH) */}
                                <td className="px-3.5 py-3.5 text-center whitespace-nowrap">
                                  {item.durationSeconds && item.durationSeconds > 0 ? (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-mono font-medium text-xs">
                                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                      <span>{formatDuration(item.durationSeconds)}</span>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 font-mono text-xs">-</span>
                                  )}
                                </td>

                                {/* 3. Konsistensi (IK) Progress */}
                                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                  <div className="inline-flex flex-col items-center gap-1 w-20">
                                    <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200 text-xs">
                                      {item.ikPct}%
                                    </span>
                                    <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
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
                                    <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200 text-xs">
                                      {item.ifPct}%
                                    </span>
                                    <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
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
                                    <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200 text-xs">
                                      {item.icPct}%
                                    </span>
                                    <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className="bg-teal-600 h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${item.icPct}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>

                                {/* 6. Status Persona */}
                                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                  <Badge className={`text-[10px] py-0.5 px-2.5 shadow-none ${item.personaBadgeClass}`}>
                                    {item.personaLabel}
                                  </Badge>
                                </td>

                                {/* 7. Waktu & Masukan */}
                                <td className="px-4 py-3.5 max-w-[200px]">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                                      {item.sessionBadge || "Sesi 1"}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short",
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 truncate mt-0.5" title={item.feedback || "-"}>
                                    {item.feedback || "-"}
                                  </p>
                                </td>

                                {/* 8. Aksi Kendali */}
                                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setInspectedStudentModal(item);
                                      }}
                                      title={`Lihat Grafik Radar 7 KAIH ${item.nama}`}
                                      className="px-2 py-1 text-[10px] font-semibold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <Compass className="h-3 w-3 text-slate-500 dark:text-zinc-400" />
                                      <span>Radar</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteResponse(item.id, item.nama);
                                      }}
                                      title={`Hapus respon ${item.nama}`}
                                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                    {/* Pagination Controls Bar (20 Santri per Halaman) */}
                    <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      {/* Left: Info */}
                      <div className="text-slate-600 dark:text-slate-400 font-medium text-center sm:text-left">
                        Menampilkan <strong className="text-slate-900 dark:text-white font-mono">{startItem}–{endItem}</strong> dari total{" "}
                        <strong className="text-slate-900 dark:text-white font-mono">{filteredStudents.length}</strong> santri
                        <span className="text-slate-400 dark:text-slate-500 ml-1.5">(20 data per halaman)</span>
                      </div>

                      {/* Right: Page Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setCurrentPage(1)}
                          disabled={safePage <= 1}
                          title="Halaman Pertama"
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <ChevronsLeft className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={safePage <= 1}
                          title="Halaman Sebelumnya"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer font-medium"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Sebelumnya</span>
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                          {(() => {
                            const pages: (number | string)[] = [];
                            if (totalPages <= 7) {
                              for (let i = 1; i <= totalPages; i++) pages.push(i);
                            } else {
                              pages.push(1);
                              if (safePage > 3) pages.push("...");
                              const start = Math.max(2, safePage - 1);
                              const end = Math.min(totalPages - 1, safePage + 1);
                              for (let i = start; i <= end; i++) {
                                if (!pages.includes(i)) pages.push(i);
                              }
                              if (safePage < totalPages - 2) pages.push("...");
                              pages.push(totalPages);
                            }

                            return pages.map((p, idx) => {
                              if (p === "...") {
                                return (
                                  <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-400 font-mono">
                                    …
                                  </span>
                                );
                              }
                              const pageNum = p as number;
                              const isActive = pageNum === safePage;
                              return (
                                <button
                                  key={pageNum}
                                  type="button"
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`h-8 w-8 rounded-lg font-mono text-xs font-semibold transition-colors cursor-pointer ${
                                    isActive
                                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                                      : "border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700 hover:text-slate-900 dark:hover:text-white"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            });
                          })()}
                        </div>

                        <button
                          type="button"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={safePage >= totalPages}
                          title="Halaman Berikutnya"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer font-medium"
                        >
                          <span className="hidden sm:inline">Berikutnya</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={safePage >= totalPages}
                          title="Halaman Terakhir"
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <ChevronsRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                </CardContent>
              </Card>
            </div>
          )}
            </div>
          </div>
        </div>

        {/* Modal Detail Santri (Drill-down Radar 7 Pilar KAIH) */}
        <StudentDetailModal
          student={inspectedStudentModal}
          onClose={() => setInspectedStudentModal(null)}
        />
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
