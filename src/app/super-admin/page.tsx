"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  Trash2,
  Download,
  Search,
  RefreshCw,
  Sparkles,
  Database,
  Target,
  BrainCircuit,
  AlertTriangle,
  HeartPulse,
  Activity,
  Flame,
  BookOpen,
  Compass,
  ArrowRight,
  ShieldAlert,
  Star,
  Info,
  ShieldCheck,
  Eye,
  X,
  Filter,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AnalyticsSummary,
  ResponseRecord,
  computeStudentCognitiveProfile,
  CognitiveDiagnosticResult,
} from "@/lib/data-store";

const THEME_COLORS = ["#15803d", "#d97706", "#0284c7", "#7c3aed", "#059669", "#ea580c", "#4f46e5"];
const LIKERT_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#15803d"];

function SuperAdminDashboard() {
  const searchParams = useSearchParams();
  const initialTabParam = searchParams.get("tab");
  const initialTab =
    initialTabParam === "tabel"
      ? "tabel"
      : initialTabParam === "pengaruh" || initialTabParam === "kausalitas"
      ? "kausalitas"
      : "indeks_ikv";

  const [activeTab, setActiveTab] = useState<"indeks_ikv" | "kausalitas" | "tabel">(initialTab);

  // Analytics Data State
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Table Data State
  const [responses, setResponses] = useState<ResponseRecord[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(true);

  // Filter States for Tab 3 (Basis Data Santri)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("Semua");
  const [selectedGender, setSelectedGender] = useState("Semua");
  const [selectedPersona, setSelectedPersona] = useState("Semua");

  // Chart View State for Tab 1
  const [kaihChartType, setKaihChartType] = useState<"line" | "bar">("line");

  // Modal Dialog States
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<ResponseRecord | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<{ id: string; nama: string } | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Filter Table Logic
  const filteredResponses = useMemo(() => {
    return responses.filter((r) => {
      const diag = r.diagnostic || computeStudentCognitiveProfile(r.answers || {});
      const matchesSearch =
        r.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.nomorId && r.nomorId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.feedback && r.feedback.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesClass =
        selectedClass === "Semua" || r.kategori.toLowerCase().includes(selectedClass.toLowerCase());

      const matchesGender =
        selectedGender === "Semua" || (r.jenisKelamin || "Ikhwan") === selectedGender;

      const matchesPersona =
        selectedPersona === "Semua" || diag.persona === selectedPersona;

      return matchesSearch && matchesClass && matchesGender && matchesPersona;
    });
  }, [responses, searchQuery, selectedClass, selectedGender, selectedPersona]);

  // Export to CSV Function
  const exportToCSV = () => {
    if (filteredResponses.length === 0) return;

    const headers = [
      "ID",
      "Nama Santri",
      "NIS / Nomor ID",
      "Tingkat Kelas",
      "Jenis Kelamin",
      "Konsistensi Aksi (IK %)",
      "Fokus Belajar & Regulasi (IF %)",
      "Confidency Nyata (IC %)",
      "Indeks Komposit (IKV %)",
      "Status Mutu Karakter",
      "Persona Diagnostik",
      "Rekomendasi Pembinaan Asrama",
      "Waktu Pengisian",
      "Masukan / Saran Santri",
    ];

    const rows = filteredResponses.map((r) => {
      const diag = r.diagnostic || computeStudentCognitiveProfile(r.answers || {});
      let statusMutu = "Kritis";
      if (diag.ikvScore >= 85) statusMutu = "Sangat Unggul & Mandiri";
      else if (diag.ikvScore >= 75) statusMutu = "Kondusif & Berkarakter Baik";
      else if (diag.ikvScore >= 60) statusMutu = "Cukup / Butuh Penguatan";

      return [
        `"${r.id}"`,
        `"${r.nama.replace(/"/g, '""')}"`,
        `"${r.nomorId || "-"}"`,
        `"${r.kategori}"`,
        `"${r.jenisKelamin || "Ikhwan"}"`,
        `"${diag.consistencyScore}%"`,
        `"${diag.focusScore}%"`,
        `"${diag.confidenceScore}%"`,
        `"${diag.ikvScore}%"`,
        `"${statusMutu}"`,
        `"${diag.persona} (${diag.personaLabel})"`,
        `"${diag.recommendation.replace(/"/g, '""')}"`,
        `"${new Date(r.createdAt).toLocaleString("id-ID")}"`,
        `"${(r.feedback || "-").replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `rekap_diagnostik_vertikal_if_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle Deletion Single Response
  const handleDeleteResponse = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/survey?id=${encodeURIComponent(deleteCandidate.id)}&name=${encodeURIComponent(deleteCandidate.nama)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setResponses((prev) => prev.filter((r) => r.id !== deleteCandidate.id));
        fetchAnalytics();
      }
    } catch (e) {
      console.error("Gagal menghapus respon:", e);
    } finally {
      setIsDeleting(false);
      setDeleteCandidate(null);
    }
  };

  // Handle Clear All Responses
  const handleClearAll = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/survey?clear_all=true", { method: "DELETE" });
      if (res.ok) {
        setResponses([]);
        fetchAnalytics();
      }
    } catch (e) {
      console.error("Gagal mengosongkan seluruh respon:", e);
    } finally {
      setIsDeleting(false);
      setShowClearAllModal(false);
    }
  };

  // Options for Dropdowns
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

  const personaFilters = [
    { value: "Semua", label: "Semua Persona Diagnostik" },
    { value: "The Anchored Leader", label: "The Anchored Leader (Pemimpin Berakar Kuat)" },
    { value: "The Quiet Hafidz", label: "The Quiet Hafidz (Permata Terpendam)" },
    { value: "The Fragile Performer", label: "The Fragile Performer (Pede Semu / Ngalong)" },
    { value: "The Mechanical Follower", label: "The Mechanical Follower (Rutinitas Hampa)" },
    { value: "The Exhausted Santri", label: "The Exhausted Santri (Krisis Energi)" },
  ];

  return (
    <AuthGuard
      pageTitle="Pusat Kendali Super Admin"
      pageDescription="Akses basis data hasil survei dan sistem diagnostik kognitif SMAIT Ihsanul Fikri."
    >
      <div className="relative min-h-screen bg-slate-50/60 pb-20 pt-8 sm:pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Dashboard Super Admin */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/90 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>Pusat Kendali Eksekutif Super Admin</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Sistem Diagnostik Kognitif &amp; Indeks Mutu 7 KAIH
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Arsitektur pengukuran terpadu SMAIT Ihsanul Fikri: Model kausalitas mediasi kebiasaan terhadap sistem atensi kognitif dan pembentukan percaya diri santri.
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
                    loadingAnalytics || loadingResponses ? "animate-spin" : ""
                  }`}
                />
                Segarkan Data
              </Button>
            </div>
          </div>

          {/* Navigasi 3 Tab Piramida Terbalik (The Inverted Pyramid) */}
          <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-200/90 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("indeks_ikv")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === "indeks_ikv"
                  ? "bg-emerald-700 text-white shadow-[0_8px_20px_-4px_rgba(21,128,61,0.4),0_0_12px_1px_rgba(34,197,94,0.2)] -translate-y-1 ring-1 ring-emerald-500"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white hover:-translate-y-0.5 hover:shadow-xs"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>1. Indeks Komposit (IKV) &amp; Mutu 7 KAIH</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("kausalitas")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === "kausalitas"
                  ? "bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white shadow-[0_8px_20px_-4px_rgba(245,158,11,0.45),0_0_14px_1px_rgba(251,191,36,0.3)] -translate-y-1 ring-1 ring-amber-400 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white hover:-translate-y-0.5 hover:shadow-xs"
              }`}
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>2. Rantai Kausalitas (Kebiasaan ➔ Fokus ➔ Confidency)</span>
              <Badge variant="gold" className="text-[10px] px-1.5 py-0 font-bold bg-amber-200 text-slate-950">
                The Hook • Model Mediasi
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
              <span>3. Basis Data Santri &amp; Rekapitulasi Diagnostik</span>
              {responses.length > 0 && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    activeTab === "tabel" ? "bg-amber-400 text-slate-950" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {responses.length}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: INDEKS KOMPOSIT (IKV) & MUTU 7 KAIH */}
          {activeTab === "indeks_ikv" && (
            <div className="space-y-6">
              {loadingAnalytics ? (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                    <p className="text-xs text-slate-500 font-medium">Mengalkulasi Indeks Komposit Vertikal (IKV)...</p>
                  </div>
                </div>
              ) : !analytics ? (
                <Card className="p-8 text-center bg-white border-slate-200">
                  <p className="text-sm text-slate-600">Gagal memuat data analitik dari server.</p>
                </Card>
              ) : (
                <>
                  {/* Executive Hero Score Card: IKV Total Sekolah */}
                  <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 p-6 sm:p-8 text-white shadow-[0_16px_36px_-8px_rgba(21,128,61,0.35),0_0_20px_1px_rgba(34,197,94,0.15)]">
                    <div className="absolute right-0 top-0 -mt-8 -mr-8 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-200">
                          <Award className="h-3.5 w-3.5 text-amber-300" />
                          <span>Executive Score Mutu Karakter Sekolah (Versi 2.0)</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                          Indeks Komposit Vertikal (IKV): {analytics.averageIkv}%
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                          Agregasi terbobot multi-tier dari 7 pilar kebiasaan santri: Tier 1 (Literasi &amp; Adab, bobot &times;3), Tier 2 (Ibadah, Al-Qur&apos;an, Olahraga, bobot &times;2), dan Tier 3 (Jam Tidur &amp; Gizi, bobot &times;1). Total bobot pembagi = 14.
                        </p>
                        <div className="pt-1 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">
                            Rumus: (3K₁ + 3K₂ + 2K₃ + 2K₄ + 2K₅ + 1K₆ + 1K₇) / 14
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex md:flex-col items-center justify-center gap-2 rounded-xl border border-emerald-300/30 bg-white/10 backdrop-blur-md px-6 py-5 shadow-inner text-center">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                          Status Mutu Karakter
                        </span>
                        <span className="text-3xl sm:text-4xl font-black text-amber-300">
                          {analytics.averageIkv}%
                        </span>
                        <Badge className="bg-amber-400 text-slate-950 font-bold text-xs px-2.5 py-0.5">
                          {analytics.ikvStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* 4 KPI Makro Cards (Timbul 3D) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* KPI 1: Total Santri */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500 hover:shadow-[0_14px_30px_-6px_rgba(21,128,61,0.25)]">
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
                        <div className="text-3xl font-extrabold text-slate-900">
                          {analytics.totalResponses}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Santri Ikhwan &amp; Akhwat terverifikasi
                        </p>
                      </CardContent>
                    </Card>

                    {/* KPI 2: Rata-Rata IKV */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500 hover:shadow-[0_14px_30px_-6px_rgba(21,128,61,0.25)]">
                      <CardHeader className="p-5 pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Rerata IKV Sekolah
                          </span>
                          <div className="rounded-xl bg-amber-100 p-2.5 text-amber-800 shadow-2xs">
                            <Award className="h-4 w-4" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <div className="text-3xl font-extrabold text-emerald-800">
                          {analytics.averageIkv}%
                        </div>
                        <p className="text-[11px] text-emerald-700 font-medium mt-1">
                          {analytics.ikvStatus}
                        </p>
                      </CardContent>
                    </Card>

                    {/* KPI 3: Dimensi Terunggul */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500 hover:shadow-[0_14px_30px_-6px_rgba(21,128,61,0.25)]">
                      <CardHeader className="p-5 pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Dimensi Terunggul
                          </span>
                          <div className="rounded-xl bg-blue-100 p-2.5 text-blue-800 shadow-2xs">
                            <TrendingUp className="h-4 w-4" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <div className="text-base font-extrabold text-slate-900 truncate">
                          {analytics.highestTheme.title.replace(/^KAIH \d+:\s*/, "")}
                        </div>
                        <p className="text-xs font-bold text-blue-700 mt-1">
                          Skor Rerata: {analytics.highestTheme.score} / 4.0 ({Math.round(((analytics.highestTheme.score - 1) / 3) * 100)}%)
                        </p>
                      </CardContent>
                    </Card>

                    {/* KPI 4: Dimensi Penguatan */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500 hover:shadow-[0_14px_30px_-6px_rgba(21,128,61,0.25)]">
                      <CardHeader className="p-5 pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Penguatan Terarah
                          </span>
                          <div className="rounded-xl bg-rose-100 p-2.5 text-rose-800 shadow-2xs">
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <div className="text-base font-extrabold text-slate-900 truncate">
                          {analytics.lowestTheme.title.replace(/^KAIH \d+:\s*/, "")}
                        </div>
                        <p className="text-xs font-bold text-rose-700 mt-1">
                          Skor Rerata: {analytics.lowestTheme.score} / 4.0 ({Math.round(((analytics.lowestTheme.score - 1) / 3) * 100)}%)
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Diagram Rerata Capaian 7 KAIH (0 - 100%) */}
                  <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_12px_28px_-6px_rgba(21,128,61,0.2)]">
                    <CardHeader className="p-6 pb-4 border-b border-slate-100">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>Profil Mutu 7 Karakter Utama Ihsanul Fikri</span>
                          </div>
                          <CardTitle className="text-lg font-bold text-slate-900">
                            Capaian Rerata 7 KAIH Santri (Skala 0% - 100%)
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-500">
                            Visualisasi capaian pembiasaan harian santri berdasarkan bobot jenjang Tier 1, Tier 2, dan Tier 3.
                          </CardDescription>
                        </div>

                        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
                          <button
                            type="button"
                            onClick={() => setKaihChartType("line")}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              kaihChartType === "line"
                                ? "bg-white text-emerald-800 shadow-2xs font-extrabold"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Diagram Garis
                          </button>
                          <button
                            type="button"
                            onClick={() => setKaihChartType("bar")}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              kaihChartType === "bar"
                                ? "bg-white text-emerald-800 shadow-2xs font-extrabold"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Diagram Batang
                          </button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      {analytics.themeAverages.length === 0 || analytics.totalResponses === 0 ? (
                        <div className="py-12 text-center text-xs text-slate-400">
                          Belum ada respon data santri yang terekam.
                        </div>
                      ) : kaihChartType === "line" ? (
                        /* DIAGRAM GARIS */
                        <div className="space-y-4">
                          <div className="relative h-64 sm:h-72 w-full pt-4 pb-6">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 220" preserveAspectRatio="none">
                              {/* Grid lines */}
                              {[0, 25, 50, 75, 100].map((pct, idx) => {
                                const y = 190 - (pct / 100) * 170;
                                return (
                                  <g key={pct}>
                                    <line x1="30" y1={y} x2="680" y2={y} stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
                                    <text x="5" y={y + 4} fontSize="10" fill="#94a3b8" fontFamily="monospace">
                                      {pct}%
                                    </text>
                                  </g>
                                );
                              })}

                              {/* Polyline Path */}
                              <polyline
                                fill="none"
                                stroke="#15803d"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={analytics.themeAverages
                                  .map((t, i) => {
                                    const x = 50 + (i / 6) * 610;
                                    const pct = Math.max(0, Math.min(100, t.percentage));
                                    const y = 190 - (pct / 100) * 170;
                                    return `${x},${y}`;
                                  })
                                  .join(" ")}
                              />

                              {/* Gradient Area under curve */}
                              <polygon
                                fill="rgba(21, 128, 61, 0.08)"
                                points={`50,190 ${analytics.themeAverages
                                  .map((t, i) => {
                                    const x = 50 + (i / 6) * 610;
                                    const pct = Math.max(0, Math.min(100, t.percentage));
                                    const y = 190 - (pct / 100) * 170;
                                    return `${x},${y}`;
                                  })
                                  .join(" ")} ${50 + 610},190`}
                              />

                              {/* Data Points */}
                              {analytics.themeAverages.map((t, i) => {
                                const x = 50 + (i / 6) * 610;
                                const pct = Math.max(0, Math.min(100, t.percentage));
                                const y = 190 - (pct / 100) * 170;
                                return (
                                  <g key={t.id}>
                                    <circle cx={x} cy={y} r="6" fill="#ca8a04" stroke="#ffffff" strokeWidth="2.5" />
                                    <text
                                      x={x}
                                      y={y - 12}
                                      fontSize="11"
                                      fontWeight="bold"
                                      fill="#0f172a"
                                      textAnchor="middle"
                                      className="font-mono"
                                    >
                                      {pct}%
                                    </text>
                                  </g>
                                );
                              })}
                            </svg>
                          </div>

                          {/* KAIH Labels underneath */}
                          <div className="grid grid-cols-7 gap-1 text-center pt-2 border-t border-slate-100">
                            {analytics.themeAverages.map((t, i) => (
                              <div key={t.id} className="space-y-0.5">
                                <span className="block text-[11px] font-bold text-slate-800">
                                  KAIH {i + 1}
                                </span>
                                <span className="block text-[9px] text-slate-500 truncate">
                                  {t.title.replace(/^KAIH \d+:\s*/, "")}
                                </span>
                                <span className="inline-block text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                                  {t.percentage}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* DIAGRAM BATANG */
                        <div className="space-y-4">
                          <div className="grid grid-cols-7 gap-3 h-64 sm:h-72 items-end pt-4 pb-2 border-b border-slate-100">
                            {analytics.themeAverages.map((t, i) => {
                              const pct = Math.max(0, Math.min(100, t.percentage));
                              return (
                                <div key={t.id} className="flex flex-col items-center h-full justify-end group">
                                  <span className="text-[11px] font-bold font-mono text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">
                                    {pct}%
                                  </span>
                                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-lg overflow-hidden h-[80%] flex items-end">
                                    <div
                                      style={{ height: `${pct}%`, backgroundColor: THEME_COLORS[i % THEME_COLORS.length] }}
                                      className="w-full rounded-t-lg transition-all duration-700 group-hover:brightness-110 shadow-xs"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="grid grid-cols-7 gap-1 text-center pt-1">
                            {analytics.themeAverages.map((t, i) => (
                              <div key={t.id} className="space-y-0.5">
                                <span className="block text-[11px] font-bold text-slate-800">
                                  KAIH {i + 1}
                                </span>
                                <span className="block text-[9px] text-slate-500 truncate">
                                  {t.title.replace(/^KAIH \d+:\s*/, "")}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Rincian Matriks 35 Butir Instrumen */}
                  <Card className="border-slate-200 bg-white shadow-xs rounded-xl">
                    <CardHeader className="p-6 pb-3 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base font-bold text-slate-900">
                            Rerata Capaian per Butir Instrumen (35 Indikator Kognitif)
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-500">
                            Distribusi persentase normalisasi min-max per soal (0% = STS, 33.3% = KS, 66.7% = S, 100% = SS).
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-xs font-mono font-bold text-emerald-800">
                          Total 35 Butir
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto max-h-96 divide-y divide-slate-100">
                        {analytics.questionAverages.map((q, idx) => (
                          <div key={q.questionId} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4">
                            <div className="space-y-0.5 max-w-3xl">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                  Soal #{idx + 1} ({q.questionId})
                                </span>
                                <span className="text-xs text-slate-400 font-medium">{q.themeTitle}</span>
                              </div>
                              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                                {q.questionText}
                              </p>
                            </div>

                            <div className="shrink-0 text-right">
                              <span className="text-base font-bold font-mono text-slate-900">
                                {q.percentage}%
                              </span>
                              <span className="block text-[10px] text-slate-400 font-mono">
                                {q.average} / 4.0
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* TAB 2: RANTAI KAUSALITAS (KEBIASAAN ➔ FOKUS ➔ CONFIDENCY) [THE HOOK] */}
          {activeTab === "kausalitas" && (
            <div className="space-y-6">
              {loadingAnalytics ? (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
                    <p className="text-sm font-medium text-slate-600">
                      Mengalkulasi model kausalitas mediasi dan taksonomi persona...
                    </p>
                  </div>
                </div>
              ) : !analytics ? (
                <Card className="border-slate-200 bg-white p-8 text-center rounded-xl shadow-xs">
                  <p className="text-sm font-semibold text-slate-700">Data analisis belum siap.</p>
                </Card>
              ) : (
                <>
                  {/* Hero Banner: The Hook (Model Mediasi Ilmiah) */}
                  <div className="relative overflow-hidden rounded-2xl border border-amber-300/80 bg-gradient-to-br from-emerald-900 via-emerald-800 to-amber-950 p-6 sm:p-8 text-white shadow-[0_16px_36px_-8px_rgba(21,128,61,0.35),0_0_20px_1px_rgba(245,158,11,0.2)]">
                    <div className="absolute right-0 top-0 -mt-6 -mr-6 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2 max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-200">
                          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                          <span>The Hook • Tesis Utama Riset Diagnostik VERTIKAL IF</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
                          Rantai Kausalitas: 7 KAIH ➔ Fokus Belajar &amp; Atensi Kognitif ➔ Confidency
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                          Kepercayaan diri sejati (*anchored confidence*) bukan bakat lahiriah atau suntikan kata mutiara instan. Confidency adalah luaran fungsional biologis (*behavioral output*) dari kapasitas Prefrontal Cortex (PFC) yang terlatih mengendalikan impuls melalui beban disiplin 7 KAIH harian.
                        </p>
                      </div>

                      <div className="shrink-0 flex md:flex-col items-center justify-center gap-2 rounded-xl border border-amber-300/30 bg-white/10 backdrop-blur-md px-6 py-4 shadow-inner text-center">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                          Mediasi Fokus Belajar
                        </span>
                        <span className="text-3xl sm:text-4xl font-black text-amber-300">
                          {analytics.mediationPercentage}%
                        </span>
                        <Badge className="bg-amber-400 text-slate-950 font-bold text-[10px]">
                          Tesis Terbukti Sahih (&gt; 70%)
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Visualisasi Waterfall Transmisi Kognitif (3 Tahap Utama) */}
                  <Card className="border-slate-200 bg-white shadow-xs rounded-xl p-6">
                    <div className="mb-4">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                        <BrainCircuit className="h-4 w-4" />
                        <span>Pipa Transmisi Kognitif (Cognitive Transmission Pipeline)</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Alur Transmisi: Aksi Pembiasaan ➔ Sistem Atensi &amp; Regulasi ➔ Confidency Nyata
                      </h3>
                      <p className="text-xs text-slate-500">
                        Evaluasi efisiensi konversi transmisi dari kebiasaan fisik ke kapasitas fokus, dan dari fokus ke unjuk diri santri.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center pt-2">
                      {/* Box 1: Konsistensi Aksi (IK) */}
                      <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-5 text-center shadow-xs">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                          Variabel X
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          Konsistensi Aksi (I_K)
                        </h4>
                        <div className="text-2xl sm:text-3xl font-black text-emerald-800 my-2">
                          {analytics.averageConsistency}%
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Akumulasi Butir 1 seluruh 7 KAIH (Kepatuhan fisik harian)
                        </p>
                      </div>

                      {/* Transmisi 1: K -> F */}
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                        <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                          <span>Transmisi K ➔ F</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-sm font-extrabold text-slate-900 mt-1">
                          {analytics.transmissionKtoF}×
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          Latihan Kendali Inhibisi PFC
                        </span>
                      </div>

                      {/* Box 2: Fokus Belajar (IF) */}
                      <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-5 text-center shadow-xs">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                          Variabel Mediator M
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          Fokus Belajar (I_F)
                        </h4>
                        <div className="text-2xl sm:text-3xl font-black text-amber-800 my-2">
                          {analytics.averageFocus}%
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Akumulasi Butir 2, 3, 4 seluruh 7 KAIH (Atensi Selektif, Terbuka, Eksekutif)
                        </p>
                      </div>

                      {/* Transmisi 2: F -> C */}
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                        <div className="flex items-center gap-1 text-amber-700 font-bold text-xs">
                          <span>Transmisi F ➔ C</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-sm font-extrabold text-slate-900 mt-1">
                          {analytics.transmissionFtoC}×
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          Regulasi Logika &amp; Emosi
                        </span>
                      </div>

                      {/* Box 3: Confidency (IC) */}
                      <div className="rounded-xl border border-blue-300 bg-blue-50/70 p-5 text-center shadow-xs">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800">
                          Variabel Luaran Y
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          Confidency Nyata (I_C)
                        </h4>
                        <div className="text-2xl sm:text-3xl font-black text-blue-800 my-2">
                          {analytics.averageConfidence}%
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Akumulasi Butir 5 seluruh 7 KAIH (Keberanian unjuk diri di depan umum)
                        </p>
                      </div>
                    </div>

                    {/* Pembuktian Ilmiah Jalur Mediasi */}
                    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Hasil Uji Analisis Jalur (*Path Mediation Analysis*):
                        </span>
                        <p className="text-xs text-slate-600">
                          Efek tidak langsung jalur mediasi (Indirect Effect a &times; b = {analytics.indirectEffectAB}) menyumbang <strong>{analytics.mediationPercentage}%</strong> dari total pengaruh. Ini membuktikan bahwa pembiasaan 7 KAIH bekerja membentuk rasa percaya diri melalui jembatan penajaman fokus dan regulasi kognitif.
                        </p>
                      </div>
                      <Badge className="bg-emerald-700 text-white font-extrabold text-xs px-3 py-1 shrink-0">
                        Status Tesis: Tervalidasi Sahih
                      </Badge>
                    </div>
                  </Card>

                  {/* Taksonomi 5 Persona Diagnostik Santri */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-800 mb-1">
                          <Compass className="h-4 w-4" />
                          <span>Taksonomi Diagnostik Psikometri</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Distribusi 5 Persona Diagnostik Santri
                        </h3>
                        <p className="text-xs text-slate-500">
                          Klasifikasi berbasis perpotongan fondasi rutinitas (I_K), fokus atensi (I_F), dan unjuk diri (I_C) untuk rekomendasi pembinaan terarah.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {analytics.personaDistribution.map((p) => (
                        <Card
                          key={p.persona}
                          className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                        >
                          <CardHeader className="p-5 pb-2">
                            <div className="flex items-center justify-between">
                              <Badge className={`${p.badgeBg} font-bold text-xs`}>
                                {p.persona}
                              </Badge>
                              <span className="text-lg font-extrabold text-slate-900 font-mono">
                                {p.count} Santri ({p.percentage}%)
                              </span>
                            </div>
                            <CardTitle className="text-sm font-bold text-slate-800 pt-2">
                              {p.label}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-5 pt-1 space-y-2">
                            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                              <span className="font-bold text-slate-800 block mb-0.5">Rekomendasi Pembinaan:</span>
                              {p.recommendation}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Papan Spotlight: Santri Berkarakter Kuat (Role Models) */}
                  <Card className="border-slate-200 bg-white shadow-xs rounded-xl">
                    <CardHeader className="p-6 pb-3 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span>Papan Spotlight Santri Berkarakter Kuat (Role Models)</span>
                          </div>
                          <CardTitle className="text-base font-bold text-slate-900">
                            Santri Teladan Confidency &amp; IKV Tertinggi
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-500">
                            Santri yang menunjukkan kematangan transmisi dari kedisiplinan 7 KAIH hingga keberanian unjuk karya nyata.
                          </CardDescription>
                        </div>
                        <Badge variant="gold" className="text-xs font-bold bg-amber-400 text-slate-950">
                          {analytics.confidenceAnalytics.highConfidenceStudents.length} Santri Terpilih
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-slate-100">
                        {analytics.confidenceAnalytics.highConfidenceStudents.length === 0 ? (
                          <div className="p-8 text-center text-xs text-slate-400">
                            Belum ada santri terdaftar.
                          </div>
                        ) : (
                          analytics.confidenceAnalytics.highConfidenceStudents.map((s, idx) => (
                            <div
                              key={s.id}
                              className="p-4 hover:bg-amber-50/50 transition-colors flex items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-amber-100 text-amber-900 font-extrabold flex items-center justify-center text-sm shrink-0">
                                  #{idx + 1}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900">{s.nama}</h4>
                                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]">
                                      {s.persona || "The Anchored Leader"}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    {s.kategori} &bull; {s.jenisKelamin} {s.nomorId && s.nomorId !== "-" ? `&bull; NIS: ${s.nomorId}` : ""} &bull; Pilar Dominan: {s.topKaihFactor}
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 text-right">
                                <div className="text-sm font-black text-amber-800 font-mono">
                                  Confidency: {s.confidencePercentage}%
                                </div>
                                {s.ikvScore !== undefined && (
                                  <div className="text-xs font-mono text-emerald-700 font-bold">
                                    IKV: {s.ikvScore}%
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* TAB 3: BASIS DATA SANTRI & REKAPITULASI DIAGNOSTIK */}
          {activeTab === "tabel" && (
            <div className="space-y-5">
              {/* Filter and Control Panel */}
              <Card className="border-slate-200 bg-white p-5 shadow-xs rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Filter className="h-4 w-4 text-emerald-600" />
                      Filter &amp; Pencarian Basis Data Santri
                    </h3>
                    <p className="text-xs text-slate-500">
                      Saring data berdasarkan kelas, gender, persona diagnostik, atau kata kunci nama/NIS/masukan.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowClearAllModal(true)}
                      disabled={responses.length === 0}
                      className="gap-1.5 font-bold text-red-700 border-red-200 hover:bg-red-50 hover:text-red-800 transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                      Kosongkan Semua
                    </Button>

                    <Button
                      variant="gold"
                      size="sm"
                      onClick={exportToCSV}
                      disabled={filteredResponses.length === 0}
                      className="gap-1.5 font-bold text-slate-950 shadow-xs shrink-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(202,138,4,0.35)] active:scale-95 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-950" />
                      Ekspor ke Excel / CSV
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  {/* Search Bar */}
                  <div className="md:col-span-4 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari nama santri, NIS, atau kata kunci saran..."
                      className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:border-emerald-500 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>

                  {/* Class Filter */}
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

                  {/* Gender Filter */}
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

                  {/* Persona Filter */}
                  <div className="md:col-span-4">
                    <select
                      value={selectedPersona}
                      onChange={(e) => setSelectedPersona(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-700 transition-all duration-200 hover:border-emerald-500 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 cursor-pointer"
                    >
                      {personaFilters.map((pf) => (
                        <option key={pf.value} value={pf.value}>
                          {pf.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>

              {/* Table Records */}
              <Card className="border-slate-200 bg-white overflow-hidden shadow-xs rounded-xl">
                <CardContent className="p-0">
                  {loadingResponses ? (
                    <div className="flex min-h-[300px] items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                        <p className="text-xs text-slate-500">Memuat tabel data santri...</p>
                      </div>
                    </div>
                  ) : filteredResponses.length === 0 ? (
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
                            <th className="px-4 py-3.5">Santri Responden</th>
                            <th className="px-4 py-3.5">Gender &amp; Kelas</th>
                            <th className="px-3 py-3.5 text-center">Aksi (I_K)</th>
                            <th className="px-3 py-3.5 text-center">Fokus (I_F)</th>
                            <th className="px-3 py-3.5 text-center">Confidency (I_C)</th>
                            <th className="px-3 py-3.5 text-center">IKV (%)</th>
                            <th className="px-4 py-3.5">Persona Diagnostik</th>
                            <th className="px-4 py-3.5">Masukan &amp; Saran</th>
                            <th className="px-3 py-3.5 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {filteredResponses.map((item) => {
                            const isIkhwan = item.jenisKelamin !== "Akhwat";
                            const diag = item.diagnostic || computeStudentCognitiveProfile(item.answers || {});

                            return (
                              <tr key={item.id} className="hover:bg-emerald-50/60 transition-colors">
                                {/* Name and NIS */}
                                <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                        isIkhwan ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                      }`}
                                    >
                                      {item.nama.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <span className="block font-semibold text-slate-900">{item.nama}</span>
                                      {item.nomorId && (
                                        <span className="text-[10px] font-mono text-slate-400">
                                          NIS: {item.nomorId}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Class and Gender */}
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        isIkhwan
                                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                          : "bg-amber-100 text-amber-900 border border-amber-300"
                                      }`}
                                    >
                                      {item.jenisKelamin || "Ikhwan"}
                                    </span>
                                    <Badge variant="outline" className="text-[10px] py-0 font-normal">
                                      {item.kategori}
                                    </Badge>
                                  </div>
                                </td>

                                {/* Consistency IK */}
                                <td className="px-3 py-3 text-center whitespace-nowrap font-mono font-bold text-emerald-800">
                                  {diag.consistencyScore}%
                                </td>

                                {/* Focus IF */}
                                <td className="px-3 py-3 text-center whitespace-nowrap font-mono font-bold text-amber-800">
                                  {diag.focusScore}%
                                </td>

                                {/* Confidence IC */}
                                <td className="px-3 py-3 text-center whitespace-nowrap font-mono font-bold text-blue-800">
                                  {diag.confidenceScore}%
                                </td>

                                {/* IKV */}
                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                  <span className="inline-block px-2 py-0.5 rounded-full font-mono font-extrabold text-xs bg-emerald-100 text-emerald-900 border border-emerald-300">
                                    {diag.ikvScore}%
                                  </span>
                                </td>

                                {/* Persona Badge with view recommendation button */}
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedStudentForModal(item)}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all hover:scale-105 cursor-pointer ${diag.personaBadgeBg}`}
                                    title="Klik untuk melihat rekomendasi pembinaan"
                                  >
                                    <span>{diag.persona}</span>
                                    <Info className="h-3 w-3 opacity-70" />
                                  </button>
                                </td>

                                {/* Feedback */}
                                <td className="px-4 py-3 max-w-xs">
                                  {item.feedback ? (
                                    <p className="text-[11px] text-slate-600 italic truncate" title={item.feedback}>
                                      &ldquo;{item.feedback}&rdquo;
                                    </p>
                                  ) : (
                                    <span className="text-slate-300 italic text-[10px]">&mdash;</span>
                                  )}
                                </td>

                                {/* Actions */}
                                <td className="px-3 py-3 text-center whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => setDeleteCandidate({ id: item.id, nama: item.nama })}
                                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Hapus respon santri ini"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
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

        {/* Modal Detail Rekomendasi Persona Santri */}
        {selectedStudentForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
              {(() => {
                const diag =
                  selectedStudentForModal.diagnostic ||
                  computeStudentCognitiveProfile(selectedStudentForModal.answers || {});
                return (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Profil Diagnostik Santri
                        </span>
                        <h3 className="text-lg font-bold text-slate-900">
                          {selectedStudentForModal.nama}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {selectedStudentForModal.kategori} &bull; {selectedStudentForModal.jenisKelamin || "Ikhwan"} &bull; NIS: {selectedStudentForModal.nomorId || "-"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedStudentForModal(null)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Scores Breakdown */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                        <span className="text-[10px] font-bold text-slate-400 block">Aksi (I_K)</span>
                        <span className="text-sm font-extrabold font-mono text-emerald-800">{diag.consistencyScore}%</span>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                        <span className="text-[10px] font-bold text-slate-400 block">Fokus (I_F)</span>
                        <span className="text-sm font-extrabold font-mono text-amber-800">{diag.focusScore}%</span>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                        <span className="text-[10px] font-bold text-slate-400 block">Confidency</span>
                        <span className="text-sm font-extrabold font-mono text-blue-800">{diag.confidenceScore}%</span>
                      </div>
                      <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-2">
                        <span className="text-[10px] font-bold text-emerald-700 block">Skor IKV</span>
                        <span className="text-sm font-black font-mono text-emerald-900">{diag.ikvScore}%</span>
                      </div>
                    </div>

                    {/* Persona Card */}
                    <div className={`p-4 rounded-xl border ${diag.personaBadgeBg} space-y-1`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black">{diag.persona}</span>
                        <span className="text-[10px] font-medium opacity-80">{diag.personaLabel}</span>
                      </div>
                      <p className="text-xs font-medium leading-relaxed pt-1">
                        <strong>Rekomendasi Pembinaan:</strong> {diag.recommendation}
                      </p>
                    </div>

                    {/* Transmissions */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Transmisi Kebiasaan ➔ Fokus:</span>
                        <span className="font-mono font-bold text-slate-800">{diag.transmissionKtoF}× konversi</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Transmisi Fokus ➔ Confidency:</span>
                        <span className="font-mono font-bold text-slate-800">{diag.transmissionFtoC}× konversi</span>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setSelectedStudentForModal(null)}
                        className="cursor-pointer font-bold"
                      >
                        Tutup
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Hapus Respon Individu */}
        {deleteCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-red-600">
                <div className="p-2 bg-red-100 rounded-xl">
                  <Trash2 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus Respon</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus data respon santri <strong>&ldquo;{deleteCandidate.nama}&rdquo;</strong>? Tindakan ini akan menghapus data dari database Supabase dan mengatur ulang kuota pengisian santri ini.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteCandidate(null)}
                  disabled={isDeleting}
                  className="cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteResponse}
                  disabled={isDeleting}
                  className="cursor-pointer font-bold"
                >
                  {isDeleting ? "Menghapus..." : "Ya, Hapus Respon"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Kosongkan Seluruh Respon */}
        {showClearAllModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-red-600">
                <div className="p-2 bg-red-100 rounded-xl">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Reset &amp; Kosongkan Seluruh Data</h3>
                  <p className="text-[11px] text-red-600 font-semibold">Tindakan ini tidak dapat dibatalkan</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Anda akan mengosongkan <strong>seluruh {responses.length} respon santri</strong> dari database Supabase. Seluruh grafik, indeks komposit IKV, dan diagram akan langsung teriset bersih ke 0.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClearAllModal(false)}
                  disabled={isDeleting}
                  className="cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={isDeleting}
                  className="cursor-pointer font-bold bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? "Mengosongkan..." : "Ya, Kosongkan Seluruh Data"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

export default function SuperAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            <p className="text-xs text-slate-500 font-medium">Memuat Pusat Kendali Super Admin...</p>
          </div>
        </div>
      }
    >
      <SuperAdminDashboard />
    </Suspense>
  );
}
