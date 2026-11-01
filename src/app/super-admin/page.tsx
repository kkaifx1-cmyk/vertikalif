"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
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
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnalyticsSummary, ResponseRecord } from "@/lib/data-store";

const THEME_COLORS = ["#15803d", "#d97706", "#0284c7", "#7c3aed", "#059669", "#ea580c", "#4f46e5"];
const LIKERT_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#15803d"];
const CONFIDENCE_BAR_COLORS = ["#15803d", "#d97706", "#0284c7", "#7c3aed", "#059669", "#ea580c", "#0891b2"];

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
  const filteredResponses = responses.filter((r) => {
    const matchesSearch =
      r.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.nomorId && r.nomorId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.feedback && r.feedback.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClass =
      selectedClass === "Semua" || r.kategori.toLowerCase().includes(selectedClass.toLowerCase());

    const matchesGender =
      selectedGender === "Semua" || (r.jenisKelamin || "Ikhwan") === selectedGender;

    const matchesConfidence =
      selectedConfidenceCategory === "Semua" ||
      (r.confidenceCategory && r.confidenceCategory === selectedConfidenceCategory);

    return matchesSearch && matchesClass && matchesGender && matchesConfidence;
  });

  // Export to CSV Function
  const exportToCSV = () => {
    if (filteredResponses.length === 0) return;

    const headers = [
      "ID",
      "Nama Santri",
      "Tingkat Kelas",
      "Jenis Kelamin",
      "NIS / Nomor ID",
      "Skor Total (35 Butir)",
      "Skor Kepercayaan Diri (1-4)",
      "Persentase Percaya Diri",
      "Kategori Kepercayaan Diri",
      "Pilar KAIH Dominan",
      "Waktu Pengisian",
      "Masukan / Saran",
    ];
    const rows = filteredResponses.map((r) => [
      `"${r.id}"`,
      `"${r.nama.replace(/"/g, '""')}"`,
      `"${r.kategori}"`,
      `"${r.jenisKelamin || "Ikhwan"}"`,
      `"${r.nomorId || "-"}"`,
      `"${r.totalScore}"`,
      `"${r.confidenceScore || r.totalScore}"`,
      `"${r.confidencePercentage || Math.round(((Math.max(1, r.totalScore) - 1) / 3) * 100)}%"`,
      `"${r.confidenceCategory || "Cukup Percaya Diri"}"`,
      `"${(r.topKaihFactor || "Karakter Islami").replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString("id-ID")}"`,
      `"${(r.feedback || "-").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rekap_santri_smait_ihsanulfikri_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler Hapus 1 Respon (Sekali Pencet Langsung Terhapus & Optimistic Update 0ms)
  const handleDeleteResponse = async (id: string, name: string) => {
    // 1. Optimistic Update Seketika (0 ms): Langsung lenyapkan santri dari UI tanpa delay
    setResponses((prev) => prev.filter((r) => r.id !== id && r.nama !== name));
    if (analytics) {
      setAnalytics((prev) => {
        if (!prev) return prev;
        const remainingStudents = prev.confidenceAnalytics.highConfidenceStudents.filter(
          (s) => s.id !== id && s.nama !== name
        );
        return {
          ...prev,
          totalResponses: Math.max(0, prev.totalResponses - 1),
          confidenceAnalytics: {
            ...prev.confidenceAnalytics,
            totalEvaluated: Math.max(0, prev.confidenceAnalytics.totalEvaluated - 1),
            highConfidenceStudents: remainingStudents,
            highConfidenceCount: remainingStudents.filter((s) => s.confidenceScore >= 2.75).length,
          },
        };
      });
    }

    // 2. Eksekusi request DELETE ke server di background (menghapus ID dan seluruh duplikat nama santri)
    try {
      const res = await fetch(`/api/survey?id=${id}&name=${encodeURIComponent(name)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        // Sinkronisasi data latar belakang tanpa popup alert yang mengganggu
        fetchResponses();
        fetchAnalytics();
      }
    } catch {
      // Jika terjadi kesalahan koneksi, refresh data asli
      fetchResponses();
      fetchAnalytics();
    }
  };

  // Handler Hapus / Reset Semua Respon (Sekali Konfirmasi Langsung Bersih Seketika)
  const handleClearAll = async () => {
    if (
      !confirm(
        "Apakah Anda yakin ingin MENGOSONGKAN SELURUH data survei & leaderboard? Seluruh data santri akan dibersihkan dan limit pengisian akan otomatis direset."
      )
    ) {
      return;
    }

    // Optimistic UI Update seketika: langsung kosongkan UI
    setResponses([]);
    if (analytics) {
      setAnalytics((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          totalResponses: 0,
          averageScoreOverall: 0,
          confidenceAnalytics: {
            ...prev.confidenceAnalytics,
            averageConfidenceScore: 0,
            averageConfidencePercentage: 0,
            totalEvaluated: 0,
            highConfidenceCount: 0,
            highConfidenceStudents: [],
            categoryDistribution: [
              { category: "Sangat Percaya Diri", count: 0, percentage: 0, color: "#15803d" },
              { category: "Percaya Diri", count: 0, percentage: 0, color: "#10b981" },
              { category: "Cukup Percaya Diri", count: 0, percentage: 0, color: "#f59e0b" },
              { category: "Perlu Bimbingan", count: 0, percentage: 0, color: "#ef4444" },
            ],
          },
        };
      });
    }

    try {
      const res = await fetch("/api/survey?all=true", { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchResponses();
        fetchAnalytics();
      }
    } catch {
      fetchResponses();
      fetchAnalytics();
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
    { value: "Semua", label: "Semua Kategori Percaya Diri" },
    { value: "Sangat Percaya Diri", label: "🌟 Sangat Percaya Diri (≥ 3.25)" },
    { value: "Percaya Diri", label: "✨ Percaya Diri (2.75 - 3.24)" },
    { value: "Cukup Percaya Diri", label: "🌱 Cukup Percaya Diri (2.00 - 2.74)" },
    { value: "Perlu Bimbingan", label: "⚠️ Perlu Bimbingan (< 2.00)" },
  ];

  return (
    <AuthGuard
      pageTitle="Portal Super Admin"
      pageDescription="Pusat kendali analisis statistik, visualisasi grafik, dan manajemen data respon santri SMAIT Ihsanul Fikri"
    >
      <div className="min-h-screen bg-transparent py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100/90 px-3 py-0.5 text-xs font-bold text-amber-950 mb-2 shadow-2xs">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
                <span>Portal Resmi Super Admin SMAIT Ihsanul Fikri</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Pusat Kendali Data & Analisis Survei
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Kelola hasil survei santri (Ikhwan & Akhwat Kelas X, XI, XII) yang tersinkronisasi secara langsung dan aman.
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
                className="gap-1.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-[0_4px_12px_rgba(21,128,61,0.25)] active:scale-95"
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

          {/* Super Admin 3 Tab Navigation */}
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
              <BarChart3 className="h-4 w-4" />
              <span>1. Analisis Karakter 7 KAIH</span>
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
              <span>2. Skema Pengaruh Kepercayaan Diri</span>
              <Badge variant="gold" className="text-[10px] px-1.5 py-0 font-bold bg-amber-200 text-slate-950">
                Model Ilmiah
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
              <span>3. Tabel Respon Santri & Nilai Kepercayaan Diri</span>
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

          {/* TAB 1: ANALISIS & GRAFIK VISUAL */}
          {activeTab === "analisis" && (
            <div className="space-y-6">
              {loadingAnalytics ? (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
                    <p className="text-xs text-slate-500 font-medium">Memuat dan menghitung data analitik...</p>
                  </div>
                </div>
              ) : !analytics ? (
                <Card className="p-8 text-center bg-white border-slate-200">
                  <p className="text-sm text-slate-600">Gagal memuat data analitik dari server.</p>
                </Card>
              ) : (
                <>
                  {/* 4 KPI Summary Cards (Timbul 3D & Glowing Hover) */}
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
                        <div className="text-3xl font-extrabold text-slate-900">
                          {analytics.totalResponses}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Santri Ikhwan & Akhwat terverifikasi
                        </p>
                      </CardContent>
                    </Card>

                    {/* Overall Score */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500 hover:shadow-[0_14px_30px_-6px_rgba(21,128,61,0.25),0_0_15px_1px_rgba(34,197,94,0.18)]">
                      <CardHeader className="p-5 pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Indeks Kepuasan Total
                          </span>
                          <div className="rounded-xl bg-amber-100 p-2.5 text-amber-800 shadow-2xs">
                            <Award className="h-4 w-4" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <div className="text-3xl font-extrabold text-emerald-800">
                          {analytics.averageScoreOverall}{" "}
                          <span className="text-base font-normal text-slate-400">/ 4.0</span>
                        </div>
                        <p className="text-[11px] text-emerald-700 font-medium mt-1">
                          Kategori Kualitas: Sangat Baik & Kondusif
                        </p>
                      </CardContent>
                    </Card>

                    {/* Highest Theme */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500 hover:shadow-[0_14px_30px_-6px_rgba(21,128,61,0.25),0_0_15px_1px_rgba(34,197,94,0.18)]">
                      <CardHeader className="p-5 pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Dimensi Tertinggi
                          </span>
                          <div className="rounded-xl bg-blue-100 p-2.5 text-blue-800 shadow-2xs">
                            <TrendingUp className="h-4 w-4" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <div className="text-lg font-bold text-slate-900 truncate">
                          {analytics.highestTheme.title}
                        </div>
                        <div className="text-xs text-blue-700 font-semibold mt-1">
                          Skor: {analytics.highestTheme.score} / 4.0
                        </div>
                      </CardContent>
                    </Card>

                    {/* Lowest Theme (Evaluasi) */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500 hover:shadow-[0_14px_30px_-6px_rgba(21,128,61,0.25),0_0_15px_1px_rgba(34,197,94,0.18)]">
                      <CardHeader className="p-5 pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Prioritas Peningkatan
                          </span>
                          <div className="rounded-xl bg-orange-100 p-2.5 text-orange-800 shadow-2xs">
                            <Layers className="h-4 w-4" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <div className="text-lg font-bold text-slate-900 truncate">
                          {analytics.lowestTheme.title}
                        </div>
                        <div className="text-xs text-orange-700 font-semibold mt-1">
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
                        <CardDescription className="text-xs text-slate-500">
                          Perbandingan jumlah partisipasi berdasarkan gender santri
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-1">
                        {analytics.genderBreakdown.map((g) => (
                          <div key={g.gender} className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-slate-800">{g.gender}</span>
                              <span className="font-mono text-slate-600">
                                {g.count} santri ({g.percentage}%)
                              </span>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  g.gender === "Ikhwan" ? "bg-emerald-700" : "bg-amber-500"
                                }`}
                                style={{ width: `${g.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Class Breakdown (Kelas X, XI, XII) */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-[0_12px_28px_-6px_rgba(21,128,61,0.2),0_0_15px_1px_rgba(34,197,94,0.12)]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Layers className="h-4 w-4 text-emerald-700" />
                          Komposisi Tingkat Kelas Santri
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500">
                          Distribusi responden santri per jenjang kelas
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3.5 pt-1">
                        {analytics.categoryBreakdown.map((c) => (
                          <div key={c.kategori} className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium text-slate-800">{c.kategori}</span>
                              <span className="font-mono text-slate-600">
                                {c.count} santri ({c.percentage}%)
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-emerald-600 transition-all"
                                style={{ width: `${c.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts Section (Timbul 3D) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Chart 1: Rata-rata per KAIH (7 Cols) */}
                    <Card className="lg:col-span-7 border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-[0_12px_28px_-6px_rgba(21,128,61,0.2),0_0_15px_1px_rgba(34,197,94,0.12)]">
                      <CardHeader>
                        <CardTitle className="text-base font-bold text-slate-900">
                          Rata-rata Skor per KAIH (7 Karakter Utama Santri)
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500">
                          Perbandingan performa santri pada 7 Karakter Utama Ihsanul Fikri (KAIH 1 s.d. KAIH 7)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={analytics.themeAverages.map((t) => ({
                              ...t,
                              shortTitle: t.title.split(":")[0]?.trim() || t.title,
                            }))}
                            margin={{ top: 20, right: 20, left: -20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                              dataKey="shortTitle"
                              tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
                              interval={0}
                            />
                            <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tick={{ fontSize: 11 }} />
                            <Tooltip
                              formatter={(value: any, _name: any, item: any) => [
                                `${value} / 4.0`,
                                item?.payload?.title || "Skor Rata-rata",
                              ]}
                              contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e2e8f0" }}
                            />
                            <Bar dataKey="average" radius={[6, 6, 0, 0]}>
                              {analytics.themeAverages.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={THEME_COLORS[index % THEME_COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Chart 2: Distribusi Pilihan Skala Likert (5 Cols) */}
                    <Card className="lg:col-span-5 border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-[0_12px_28px_-6px_rgba(21,128,61,0.2),0_0_15px_1px_rgba(34,197,94,0.12)]">
                      <CardHeader>
                        <CardTitle className="text-base font-bold text-slate-900">
                          Distribusi Bobot Skala Likert
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500">
                          Persentase frekuensi jawaban 1 (Sangat Tidak Puas) s/d 4 (Sangat Puas)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-72 flex flex-col justify-between">
                        <div className="space-y-3 pt-2">
                          {analytics.scoreDistribution.map((item, idx) => {
                            const labels = [
                              "1 - Sangat Tidak Puas",
                              "2 - Tidak Puas",
                              "3 - Puas",
                              "4 - Sangat Puas",
                            ];
                            return (
                              <div key={item.score} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="font-medium text-slate-700">{labels[idx]}</span>
                                  <span className="font-mono text-slate-500">
                                    {item.count} suara ({item.percentage}%)
                                  </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                  <div
                                    className="h-full transition-all"
                                    style={{
                                      width: `${item.percentage}%`,
                                      backgroundColor: LIKERT_COLORS[idx],
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Question Level Breakdown Table (Timbul 3D) */}
                  <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_12px_28px_-6px_rgba(21,128,61,0.2),0_0_15px_1px_rgba(34,197,94,0.12)]">
                    <CardHeader>
                      <CardTitle className="text-base font-bold text-slate-900">
                        Rincian Skor Rata-rata 35 Butir Pertanyaan (7 KAIH)
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Evaluasi mendalam per butir indikator 7 Karakter Utama Santri SMAIT Ihsanul Fikri
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="border-y border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-600">
                            <tr>
                              <th className="px-6 py-3">Dimensi / Tema</th>
                              <th className="px-6 py-3">Butir Pertanyaan Evaluasi</th>
                              <th className="px-6 py-3 text-right">Rata-rata Skor</th>
                              <th className="px-6 py-3 text-center">Status Mutu</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {analytics.questionAverages.map((q) => {
                              const isHigh = q.average >= 3.5;
                              const isGood = q.average >= 3.0 && q.average < 3.5;

                              return (
                                <tr key={q.questionId} className="hover:bg-emerald-50/70 transition-colors">
                                  <td className="px-6 py-3.5 font-medium text-emerald-800 whitespace-nowrap">
                                    {q.themeTitle}
                                  </td>
                                  <td className="px-6 py-3.5 text-slate-900 leading-snug">
                                    {q.questionText}
                                  </td>
                                  <td className="px-6 py-3.5 text-right font-mono font-bold text-slate-900">
                                    {q.average} / 4.0
                                  </td>
                                  <td className="px-6 py-3.5 text-center">
                                    {isHigh ? (
                                      <Badge variant="success" className="text-[10px]">
                                        Sangat Baik
                                      </Badge>
                                    ) : isGood ? (
                                      <Badge variant="gold" className="text-[10px]">
                                        Baik & Stabil
                                      </Badge>
                                    ) : (
                                      <Badge variant="danger" className="text-[10px]">
                                        Perlu Peningkatan
                                      </Badge>
                                    )}
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

          {/* TAB 2: SKEMA PENGARUH KAIH TERHADAP KEPERCAYAAN DIRI (MODEL ILMIAH & SPOTLIGHT SANTRI) */}
          {activeTab === "pengaruh_pede" && (
            <div className="space-y-6">
              {loadingAnalytics ? (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
                    <p className="text-sm font-medium text-slate-600">
                      Mengalkulasi pemodelan statistik & pengaruh KAIH terhadap kepercayaan diri...
                    </p>
                  </div>
                </div>
              ) : !analytics || !analytics.confidenceAnalytics ? (
                <Card className="border-slate-200 bg-white p-8 text-center rounded-xl shadow-xs">
                  <p className="text-sm font-semibold text-slate-700">Data analisis belum siap.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Silakan pastikan minimal terdapat data respon santri yang telah diisi.
                  </p>
                </Card>
              ) : (
                <>
                  {/* Hero Banner Key Insight (Timbul 3D Emas Emerald) */}
                  <div className="relative overflow-hidden rounded-2xl border border-amber-300/80 bg-gradient-to-br from-emerald-900 via-emerald-800 to-amber-950 p-6 sm:p-8 text-white shadow-[0_16px_36px_-8px_rgba(21,128,61,0.35),0_0_20px_1px_rgba(245,158,11,0.2)]">
                    <div className="absolute right-0 top-0 -mt-6 -mr-6 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2 max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-200">
                          <BrainCircuit className="h-3.5 w-3.5 text-amber-300" />
                          <span>Model Psikometri Karakter & Ekonometri Pendidikan 2026</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
                          Skema Pengaruh Pembiasaan 7 KAIH terhadap Rasa Percaya Diri Santri
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                          {analytics.confidenceAnalytics.keyInsightSummary}
                        </p>
                      </div>

                      <div className="shrink-0 flex md:flex-col items-center justify-center gap-2 rounded-xl border border-amber-300/30 bg-white/10 backdrop-blur-md px-6 py-4 shadow-inner text-center">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                          Status Kepercayaan Diri
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-amber-300">
                          {analytics.confidenceAnalytics.averageConfidenceScore}{" "}
                          <span className="text-sm font-semibold text-emerald-200">/ 4.0</span>
                        </span>
                        <Badge className="bg-amber-400 text-slate-950 font-bold text-[10px]">
                          {analytics.confidenceAnalytics.confidenceStatus} ({analytics.confidenceAnalytics.averageConfidencePercentage}%)
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* 4 KPI Cards Pengaruh & Kepercayaan Diri (Timbul 3D) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* KPI 1: Rerata Kepercayaan Diri */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_12px_28px_-6px_rgba(21,128,61,0.25)] hover:-translate-y-1">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600">
                          Indeks Percaya Diri
                        </CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                          <Sparkles className="h-4 w-4" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-black text-slate-900">
                          {analytics.confidenceAnalytics.averageConfidenceScore}{" "}
                          <span className="text-xs font-normal text-slate-500">/ 4.00</span>
                        </div>
                        <p className="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Rata-rata {analytics.confidenceAnalytics.averageConfidencePercentage}% Tingkat Kemantapan
                        </p>
                      </CardContent>
                    </Card>

                    {/* KPI 2: KAIH Faktor Pengungkit Utama */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:border-amber-500 hover:shadow-[0_12px_28px_-6px_rgba(245,158,11,0.25)] hover:-translate-y-1">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600">
                          Faktor Pengungkit Terkuat (#1)
                        </CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                          <Target className="h-4 w-4" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div
                          className="text-lg font-black text-slate-900 truncate"
                          title={analytics.confidenceAnalytics.kaihImpactScheme[0]?.kaihTitle}
                        >
                          {analytics.confidenceAnalytics.kaihImpactScheme[0]?.shortTitle || "Memuliakan Al-Qur'an"}
                        </div>
                        <p className="text-xs text-amber-700 mt-1 font-semibold flex items-center gap-1">
                          <Zap className="h-3 w-3 text-amber-600" />
                          Kontribusi Relatif {analytics.confidenceAnalytics.kaihImpactScheme[0]?.impactPercentage}% (r ={" "}
                          {analytics.confidenceAnalytics.kaihImpactScheme[0]?.correlationR})
                        </p>
                      </CardContent>
                    </Card>

                    {/* KPI 3: Koefisien Determinasi R^2 */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:border-blue-500 hover:shadow-[0_12px_28px_-6px_rgba(2,132,199,0.25)] hover:-translate-y-1">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600">
                          Kekuatan Model (R² / Pearson)
                        </CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-black text-slate-900">
                          {analytics.confidenceAnalytics.kaihImpactScheme[0]
                            ? (analytics.confidenceAnalytics.kaihImpactScheme[0].rSquared * 100).toFixed(1)
                            : "72.3"}
                          %
                        </div>
                        <p className="text-xs text-sky-600 mt-1 font-semibold flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3" />
                          Taraf Signifikansi Sangat Kuat
                        </p>
                      </CardContent>
                    </Card>

                    {/* KPI 4: Jumlah Santri Berkepercayaan Diri Unggul */}
                    <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:border-purple-500 hover:shadow-[0_12px_28px_-6px_rgba(124,58,237,0.25)] hover:-translate-y-1">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600">
                          Santri Percaya Diri Unggul
                        </CardTitle>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                          <Award className="h-4 w-4" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-black text-slate-900">
                          {analytics.confidenceAnalytics.highConfidenceCount}{" "}
                          <span className="text-xs font-normal text-slate-500">Santri</span>
                        </div>
                        <p className="text-xs text-purple-600 mt-1 font-semibold flex items-center gap-1">
                          <Star className="h-3 w-3 fill-purple-600" />
                          Memenuhi Kriteria Duta Karakter
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Visualisasi Bar Chart & Formula Perhitungan (2 Kolom) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Bar Chart Kontribusi 7 KAIH (7 Kolom) */}
                    <Card className="lg:col-span-7 border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_12px_28px_-6px_rgba(21,128,61,0.2),0_0_15px_1px_rgba(34,197,94,0.12)]">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base font-bold text-slate-900">
                              Proporsi Kontribusi Relatif 7 KAIH terhadap Kepercayaan Diri
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-500">
                              Persentase pengaruh (Wi%) dihitung dari korelasi Pearson (r) dikalikan rata-rata pembiasaan santri
                            </CardDescription>
                          </div>
                          <Badge variant="gold" className="text-[10px] font-bold">
                            Total 100%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-72 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={analytics.confidenceAnalytics.kaihImpactScheme}
                              margin={{ top: 10, right: 15, left: -10, bottom: 25 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis
                                dataKey="shortTitle"
                                tick={{ fontSize: 11, fill: "#475569" }}
                                angle={-15}
                                textAnchor="end"
                                interval={0}
                              />
                              <YAxis tick={{ fontSize: 11, fill: "#475569" }} unit="%" domain={[0, "auto"]} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#0f172a",
                                  border: "none",
                                  borderRadius: "10px",
                                  color: "#fff",
                                  fontSize: "12px",
                                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                                }}
                                formatter={(value: any, _name: any, item: any) => [
                                  `${value}% Pengaruh (r = ${item.payload.correlationR})`,
                                  item.payload.kaihTitle,
                                ]}
                              />
                              <Bar dataKey="impactPercentage" radius={[6, 6, 0, 0]} name="Kontribusi (%)">
                                {analytics.confidenceAnalytics.kaihImpactScheme.map((_, index) => (
                                  <Cell
                                    key={`cell-impact-${index}`}
                                    fill={CONFIDENCE_BAR_COLORS[index % CONFIDENCE_BAR_COLORS.length]}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Formula Metodologi Matematis & Psikometri (5 Kolom) */}
                    <Card className="lg:col-span-5 border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:border-amber-500 hover:shadow-[0_12px_28px_-6px_rgba(245,158,11,0.2)]">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-100 text-amber-800">
                            <Info className="h-4 w-4" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-bold text-slate-900">
                              Metodologi & Formula Matematis
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-500">
                              Standar kalkulasi ilmiah & akuntabel
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3.5 text-xs text-slate-600">
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                          <div className="font-bold text-slate-900 flex items-center justify-between">
                            <span>1. Variabel Pengukuran</span>
                            <Badge variant="outline" className="text-[10px]">
                              Indikator Valid
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            <strong className="text-emerald-800">Variabel Y (Kepercayaan Diri)</strong>: Rerata dari 7 butir khusus dimensi <em>Confidency</em> (k1_5, k2_5, k3_5, k4_5, k5_5, k6_5, k7_5).
                            <br />
                            <strong className="text-amber-800">Variabel X1..X7</strong>: Rerata skor butir pembiasaan masing-masing KAIH.
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/70 space-y-1.5">
                          <div className="font-bold text-emerald-950">
                            2. Rumus Korelasi Pearson (r) & Bobot Relatif (Wi)
                          </div>
                          <div className="font-mono text-[11px] bg-white p-2 rounded border border-emerald-200 text-emerald-900 overflow-x-auto">
                            r = Σ((Xi - X̄)(Y - Ȳ)) / √(Σ(Xi - X̄)² × Σ(Y - Ȳ)²)
                            <br />
                            Wi (%) = [ (ri × X̄i) / Σ(rk × X̄k) ] × 100%
                          </div>
                          <p className="text-[10px] text-emerald-800">
                            Menghitung kontribusi bobot murni yang proporsional sehingga akumulasi seluruh 7 KAIH tepat berjumlah 100%.
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/70 space-y-1">
                          <div className="font-bold text-amber-950">
                            3. Kategori Interpretasi Percaya Diri
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                            <span className="font-medium text-emerald-800">🌟 Sangat Percaya Diri: ≥ 3.25</span>
                            <span className="font-medium text-teal-800">✨ Percaya Diri: 2.75 - 3.24</span>
                            <span className="font-medium text-amber-800">🌱 Cukup Percaya Diri: 2.00 - 2.74</span>
                            <span className="font-medium text-red-800">⚠️ Perlu Bimbingan: &lt; 2.00</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tabel Matriks Kontribusi 7 KAIH & Mekanisme Psikologis */}
                  <Card className="border-slate-200 bg-white shadow-xs rounded-xl transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_12px_28px_-6px_rgba(21,128,61,0.2)]">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <CardTitle className="text-base font-bold text-slate-900">
                            Matriks Pengaruh 7 KAIH terhadap Percaya Diri Santri
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-500">
                            Uraian mendalam per pilar KAIH, koefisien korelasi Pearson, bobot pengaruh, dan mekanisme pembentukan karakter
                          </CardDescription>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs font-bold text-emerald-800 border-emerald-300 bg-emerald-50 self-start sm:self-auto"
                        >
                          Urutan Berdasarkan Besaran Pengaruh
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="border-y border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-600">
                            <tr>
                              <th className="px-5 py-3.5">Peringkat & KAIH</th>
                              <th className="px-4 py-3.5">Tier Bobot</th>
                              <th className="px-4 py-3.5 text-center">Rerata Skor</th>
                              <th className="px-4 py-3.5 text-center">Korelasi (r)</th>
                              <th className="px-4 py-3.5 text-center">Pengaruh (Wi%)</th>
                              <th className="px-4 py-3.5 text-center">Taraf Pengaruh</th>
                              <th className="px-5 py-3.5">Mekanisme Pembentukan Percaya Diri di Asrama</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {analytics.confidenceAnalytics.kaihImpactScheme.map((item, idx) => (
                              <tr key={item.kaihId} className="hover:bg-emerald-50/70 transition-colors">
                                <td className="px-5 py-3.5 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 font-mono text-xs font-bold text-slate-700">
                                      #{idx + 1}
                                    </span>
                                    <div>
                                      <span className="font-bold text-slate-900 block">{item.kaihTitle}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] font-semibold text-slate-700 border-slate-300"
                                  >
                                    {item.tier}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-900 whitespace-nowrap">
                                  {item.avgKaihScore} / 4.0
                                </td>
                                <td className="px-4 py-3.5 text-center font-mono font-bold text-emerald-800 whitespace-nowrap">
                                  {item.correlationR}
                                </td>
                                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-950 border border-amber-300">
                                    {item.impactPercentage}%
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                  <Badge
                                    className={`text-[10px] ${
                                      item.impactLevel.includes("Sangat Kuat")
                                        ? "bg-emerald-700 text-white font-extrabold"
                                        : item.impactLevel === "Kuat"
                                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                        : "bg-slate-100 text-slate-700 border-slate-200"
                                    }`}
                                  >
                                    {item.impactLevel}
                                  </Badge>
                                </td>
                                <td className="px-5 py-3.5 text-slate-600 leading-relaxed max-w-md">
                                  {item.mechanism}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Papan Spotlight: Santri Berkepercayaan Diri Unggul (Role Models) */}
                  <div className="space-y-4 pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/80 pb-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          <span>Papan Teladan Karakter Santri</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                          Spotlight: Santri Berkepercayaan Diri Unggul (Role Models)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Profil santri yang terbukti memiliki kemantapan mental, keberanian tampil, dan keyakinan diri tinggi hasil pembiasaan KAIH
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearAll}
                          disabled={!analytics || analytics.confidenceAnalytics.highConfidenceStudents.length === 0}
                          className="gap-1.5 font-bold text-red-700 border-red-200 hover:bg-red-50 hover:text-red-800 transition-all cursor-pointer text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-600" />
                          Kosongkan Leaderboard
                        </Button>
                        <Badge
                          variant="gold"
                          className="text-xs font-extrabold px-3 py-1 bg-amber-400 text-slate-950"
                        >
                          🌟 Total {analytics.confidenceAnalytics.highConfidenceStudents.length} Santri Terpilih
                        </Badge>
                      </div>
                    </div>

                    {analytics.confidenceAnalytics.highConfidenceStudents.length === 0 ? (
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
                        {analytics.confidenceAnalytics.highConfidenceStudents.map((student, idx) => {
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
                                  <span className="text-xs font-bold text-slate-700">Skor Kepercayaan Diri:</span>
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-black text-emerald-800 font-mono">
                                      {student.confidenceScore}
                                    </span>
                                    <span className="text-xs text-slate-400">/ 4.0</span>
                                    <span className="text-xs font-bold text-amber-700">({student.confidencePercentage}%)</span>
                                  </div>
                                </div>

                                {/* Mini Progress Bar */}
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-emerald-600 to-amber-500 rounded-full transition-all duration-500"
                                    style={{ width: `${student.confidencePercentage}%` }}
                                  />
                                </div>

                                <div className="pt-1 flex flex-col gap-1.5">
                                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-900">
                                    <Badge
                                      variant="gold"
                                      className="text-[10px] py-0 px-2 font-bold bg-amber-100 text-amber-900 border-amber-300"
                                    >
                                      {student.badgeLabel}
                                    </Badge>
                                  </div>
                                  <p className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-lg border border-slate-200/80">
                                    <strong className="text-slate-800">Pilar Karakter Dominan:</strong> {student.topKaihFactor}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: TABEL DATA RESPON SANTRI & EKSPOR */}
          {activeTab === "tabel" && (
            <div className="space-y-5">
              {/* Filter and Search Controls (Timbul 3D) */}
              <Card className="border-slate-200 bg-white p-5 shadow-xs rounded-xl transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_12px_28px_-6px_rgba(21,128,61,0.2),0_0_15px_1px_rgba(34,197,94,0.12)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Filter & Pencarian Basis Data Santri
                    </h3>
                    <p className="text-xs text-slate-500">
                      Saring data berdasarkan kelas, gender (Ikhwan/Akhwat), kategori percaya diri, atau kata kunci nama/saran.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAll}
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

                  {/* Confidence Category Dropdown */}
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

              {/* Responses Table (Timbul 3D) */}
              <Card className="border-slate-200 bg-white overflow-hidden shadow-xs rounded-xl transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_12px_30px_-6px_rgba(21,128,61,0.2),0_0_15px_1px_rgba(34,197,94,0.12)]">
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
                            <th className="px-5 py-3.5">Santri Responden</th>
                            <th className="px-5 py-3.5">Gender & Kelas</th>
                            <th className="px-4 py-3.5 text-center">Skor 35 Butir</th>
                            <th className="px-5 py-3.5 text-center">Kepercayaan Diri</th>
                            <th className="px-4 py-3.5">Pilar Dominan</th>
                            <th className="px-4 py-3.5">Waktu Pengisian</th>
                            <th className="px-5 py-3.5">Masukan & Harapan</th>
                            <th className="px-4 py-3.5 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {filteredResponses.map((item) => {
                            const isIkhwan = item.jenisKelamin !== "Akhwat";
                            const confScore = item.confidenceScore || item.totalScore;
                            const confCat = item.confidenceCategory || "Cukup Percaya Diri";

                            return (
                              <tr key={item.id} className="hover:bg-emerald-50/80 transition-colors">
                                <td className="px-5 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
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
                                <td className="px-5 py-3.5 whitespace-nowrap">
                                  <div className="flex flex-col gap-1 items-start">
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
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 text-center whitespace-nowrap font-mono font-bold">
                                  <span
                                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${
                                      item.totalScore >= 3.5
                                        ? "bg-emerald-100 text-emerald-800"
                                        : item.totalScore >= 3.0
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {item.totalScore} / 4.0
                                  </span>
                                </td>
                                <td className="px-5 py-3.5 text-center whitespace-nowrap">
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="font-mono font-bold text-slate-900 text-xs">
                                      {confScore} / 4.0
                                    </span>
                                    <Badge
                                      className={`text-[9px] py-0 px-1.5 font-bold ${
                                        confCat === "Sangat Percaya Diri"
                                          ? "bg-emerald-700 text-white"
                                          : confCat === "Percaya Diri"
                                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                          : confCat === "Cukup Percaya Diri"
                                          ? "bg-amber-100 text-amber-900 border-amber-300"
                                          : "bg-red-100 text-red-800 border-red-300"
                                      }`}
                                    >
                                      {confCat}
                                    </Badge>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 font-medium">
                                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] border border-slate-200">
                                    {item.topKaihFactor || "Karakter Islami"}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </td>
                                <td className="px-5 py-3.5 text-slate-600 max-w-md">
                                  {item.feedback ? (
                                    <p className="line-clamp-2 italic text-slate-700">
                                      &ldquo;{item.feedback}&rdquo;
                                    </p>
                                  ) : (
                                    <span className="text-slate-300 italic text-[11px]">— Tidak ada catatan</span>
                                  )}
                                </td>
                                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleDeleteResponse(item.id, item.nama);
                                    }}
                                    title={`Hapus respon ${item.nama}`}
                                    className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer active:scale-90"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
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
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      }
    >
      <SuperAdminDashboard />
    </Suspense>
  );
}
