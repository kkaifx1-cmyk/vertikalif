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
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnalyticsSummary, ResponseRecord } from "@/lib/data-store";

const THEME_COLORS = ["#15803d", "#d97706", "#0284c7", "#7c3aed", "#059669", "#ea580c", "#4f46e5"];
const LIKERT_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#15803d"];

function SuperAdminDashboard() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "tabel" ? "tabel" : "analisis";

  const [activeTab, setActiveTab] = useState<"analisis" | "tabel">(initialTab);

  // Analytics Data State
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Table Data State
  const [responses, setResponses] = useState<ResponseRecord[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("Semua");
  const [selectedGender, setSelectedGender] = useState("Semua");

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch("/api/analytics");
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
      const res = await fetch("/api/survey");
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

    return matchesSearch && matchesClass && matchesGender;
  });

  // Export to CSV Function
  const exportToCSV = () => {
    if (filteredResponses.length === 0) return;

    const headers = ["ID", "Nama Santri", "Tingkat Kelas", "Jenis Kelamin", "NIS / Nomor ID", "Skor Rata-Rata", "Waktu Pengisian", "Masukan / Saran"];
    const rows = filteredResponses.map((r) => [
      `"${r.id}"`,
      `"${r.nama.replace(/"/g, '""')}"`,
      `"${r.kategori}"`,
      `"${r.jenisKelamin || "Ikhwan"}"`,
      `"${r.nomorId || "-"}"`,
      `"${r.totalScore}"`,
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

  // Handler Hapus 1 Respon
  const handleDeleteResponse = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus respon survei dari "${name}"?`)) return;
    try {
      const res = await fetch(`/api/survey?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchResponses();
        fetchAnalytics();
      } else {
        alert(json.message || "Gagal menghapus data");
      }
    } catch {
      alert("Gagal menghubungi server untuk menghapus data");
    }
  };

  // Handler Hapus / Reset Semua Respon
  const handleClearAll = async () => {
    if (
      !confirm(
        "PERINGATAN: Apakah Anda yakin ingin MENGHAPUS SEMUA data respon survei? Seluruh grafik dan tabel akan dikosongkan."
      )
    ) {
      return;
    }
    try {
      const res = await fetch("/api/survey?all=true", { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchResponses();
        fetchAnalytics();
      } else {
        alert(json.message || "Gagal membersihkan data");
      }
    } catch {
      alert("Gagal menghubungi server");
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

          {/* Super Admin Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200/90 pb-1">
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
              <span>1. Analisis & Grafik Visual</span>
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
              <span>2. Tabel Respon Santri & Ekspor</span>
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

          {/* TAB 2: TABEL DATA RESPON SANTRI & EKSPOR */}
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
                      Saring data berdasarkan kelas, gender (Ikhwan/Akhwat), atau kata kunci nama/saran.
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
                  <div className="md:col-span-6 relative">
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
                  <div className="md:col-span-3">
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
                  <div className="md:col-span-3">
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
                            <th className="px-5 py-3.5 text-center">Skor Rata-Rata</th>
                            <th className="px-5 py-3.5">Waktu Pengisian</th>
                            <th className="px-5 py-3.5">Masukan & Harapan</th>
                            <th className="px-4 py-3.5 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {filteredResponses.map((item) => {
                            const isIkhwan = item.jenisKelamin !== "Akhwat";

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
                                <td className="px-5 py-3.5 text-center whitespace-nowrap font-mono font-bold">
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
                                <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
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
                                    onClick={() => handleDeleteResponse(item.id, item.nama)}
                                    title={`Hapus respon ${item.nama}`}
                                    className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="h-4 w-4" />
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
