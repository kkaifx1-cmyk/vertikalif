"use client";

import React, { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Sparkles,
  Users2,
  BookOpen,
  Users,
  Compass,
  BookMarked,
  HeartPulse,
  Moon,
  Apple,
  Award,
  ChevronRight,
  Home,
} from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { WHITELIST_MEMBERS } from "@/lib/survey-data";

type TabKey = "beranda" | "kaih" | "profil";

const KAIH_SHOWCASE = [
  {
    num: 1,
    title: "Gemar Membaca & Literasi Riset",
    focus: "Membangun tradisi membaca mendalam, literasi digital beretika, penulisan karya ilmiah, dan daya argumentasi kritis berbasis data.",
    category: "Literasi & Akademik",
    tier: "Tier 1 (Bobot ×3)",
    impact: "18% Bobot Pengaruh",
    color: "from-emerald-600 to-teal-700",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80",
    icon: BookOpen,
    indicators: [
      "Membaca buku non-pelajaran secara rutin setiap pekan",
      "Kritis dalam memverifikasi informasi dan rujukan data",
      "Pemanfaatan perpustakaan dan sudut baca asrama",
      "Kemampuan merumuskan ide dalam bentuk tulisan/karya ilmiah",
      "Etika riset dan penghargaan terhadap hak cipta/sitasi",
    ],
  },
  {
    num: 2,
    title: "Aktif Membantu & Ukhuwah Sosial",
    focus: "Menanamkan empati sosial, gotong royong di asrama/sekolah, kepedulian terhadap sesama santri, dan kepekaan menolong sesama.",
    category: "Sosial & Kemasyarakatan",
    tier: "Tier 3 (Bobot ×1)",
    impact: "11% Bobot Pengaruh",
    color: "from-teal-600 to-cyan-700",
    badgeBg: "bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800/80",
    icon: Users,
    indicators: [
      "Inisiatif menolong teman asrama yang tertimpa kesulitan",
      "Kerjasama piket harian dan kebersihan lingkungan",
      "Sikap ramah, lapang dada, dan menjauhi perilaku perundungan",
      "Menghargai keberagaman latar belakang sesama santri",
      "Kontribusi aktif dalam kegiatan sosial sekolah",
    ],
  },
  {
    num: 3,
    title: "Kesiapan Menjalankan Ibadah Shalat",
    focus: "Kedisiplinan shalat fardhu berjamaah di masjid tepat waktu, pelaksanaan shalat sunnah rawatib, dan ketertiban shalat malam.",
    category: "Spiritual & Disiplin Ibadah",
    tier: "Tier 2 (Bobot ×2)",
    impact: "15% Bobot Pengaruh",
    color: "from-emerald-700 to-green-800",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80",
    icon: Compass,
    indicators: [
      "Hadir di masjid sebelum adzan atau saat adzan berkumandang",
      "Konsistensi melaksanakan shalat sunnah rawatib qabliyah/ba'diyah",
      "Khusyuk dan tertib dalam barisan shaf shalat berjamaah",
      "Pembiasaan dzikir ba'da shalat dan doa dengan tenang",
      "Kedisiplinan bangun qiyamullail (shalat tahajud) terjadwal",
    ],
  },
  {
    num: 4,
    title: "Interaksi & Kedekatan dengan Al-Qur'an",
    focus: "Membaca Al-Qur'an tartil sesuai kaidah tajwid, target ziyadah setoran tahfidz, muraja'ah hafalan harian, dan tadabbur ayat.",
    category: "Qur'ani & Tahfidz",
    tier: "Tier 1 (Bobot ×3)",
    impact: "20% Bobot Pengaruh",
    color: "from-purple-600 to-indigo-800",
    badgeBg: "bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/80",
    icon: BookMarked,
    indicators: [
      "Tilawah harian memenuhi target one day one juz (ODOJ)",
      "Kualitas bacaan tajwid tartil dan fashahah",
      "Kedisiplinan jadwal halaqah tahfidz shubuh dan petang",
      "Konsistensi muraja'ah hafalan lama agar tetap mutqin",
      "Upaya memahami terjemahan makna ayat (tadabbur)",
    ],
  },
  {
    num: 5,
    title: "Kebugaran Fisik & Olahraga Teratur",
    focus: "Melatih ketahanan fisik, kesehatan jasmani melalui olahraga teratur, imunitas tubuh, dan postur fisik yang prima.",
    category: "Jasmani & Kebugaran",
    tier: "Tier 2 (Bobot ×2)",
    impact: "15% Bobot Pengaruh",
    color: "from-amber-600 to-orange-700",
    badgeBg: "bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80",
    icon: HeartPulse,
    indicators: [
      "Mengikuti senam pagi dan program kebugaran sekolah",
      "Rutin berolahraga mandiri minimal 2 kali sepekan",
      "Ketahanan fisik dan stamina dalam aktivitas harian",
      "Menjaga hidrasi tubuh dengan minum air putih cukup",
      "Responsif terhadap instruksi pembina kebugaran fisik",
    ],
  },
  {
    num: 6,
    title: "Kualitas & Waktu Istirahat (Tidur)",
    focus: "Kepatuhan terhadap jam malam asrama, tidur tepat waktu, adab tidur sunnah Rasulullah SAW, dan tidur siang (qailulah).",
    category: "Manajemen Diri & Adab Asrama",
    tier: "Tier 3 (Bobot ×1)",
    impact: "11% Bobot Pengaruh",
    color: "from-blue-600 to-indigo-700",
    badgeBg: "bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/80",
    icon: Moon,
    indicators: [
      "Tidur malam tepat waktu sebelum pukul 22.00 WIB",
      "Mematikan lampu dan gadget sesuai aturan asrama",
      "Mengamalkan doa dan adab sebelum tidur sesuai sunnah",
      "Pemanfaatan waktu istirahat siang (qailulah) optimal",
      "Bangun pagi dalam kondisi segar sebelum adzan shubuh",
    ],
  },
  {
    num: 7,
    title: "Kemandirian & Adab Makan-Minum Sehat",
    focus: "Pola makan bergizi seimbang, adab makan sunnah (duduk, tangan kanan, basmalah), tidak mubadzir, dan mencuci piring mandiri.",
    category: "Adab Sunnah & Kebersihan",
    tier: "Tier 3 (Bobot ×1)",
    impact: "10% Bobot Pengaruh",
    color: "from-green-600 to-emerald-700",
    badgeBg: "bg-green-50 dark:bg-green-950/70 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/80",
    icon: Apple,
    indicators: [
      "Adab makan sunnah: duduk, tangan kanan, basmalah & hamdalah",
      "Menghabiskan makanan tanpa menyisakan sisa (tidak mubadzir)",
      "Konsumsi makanan bergizi seimbang dan membatasi junk food",
      "Kemandirian mencuci peralatan makan sendiri setelah selesai",
      "Menjaga kebersihan meja makan dan ruang makan asrama",
    ],
  },
];

function HomeInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabFromQuery = searchParams.get("tab") as TabKey | null;

  const [activeTab, setActiveTab] = useState<TabKey>("beranda");

  useEffect(() => {
    if (tabFromQuery === "kaih") {
      setActiveTab("kaih");
    } else if (tabFromQuery === "profil") {
      setActiveTab("profil");
    } else {
      setActiveTab("beranda");
    }
  }, [tabFromQuery]);

  const switchTab = (tab: TabKey) => {
    setActiveTab(tab);
    router.push(`/?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* ========================================================================= */}
      {/* TAB NAVIGATION SWITCHER BAR WITH INTEGRATED THEME TOGGLE (LUMINOUS 3D)    */}
      {/* ========================================================================= */}
      <div className="sticky top-16 z-40 border-b border-emerald-500/30 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-[0_10px_30px_-5px_rgba(16,185,129,0.18),0_4px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.7),0_0_20px_rgba(16,185,129,0.12)] transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Segmented Control Nav Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-emerald-400/40 dark:border-emerald-500/30 w-full md:w-auto overflow-x-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_4px_20px_rgba(16,185,129,0.15)] dark:shadow-[inset_0_2px_6px_rgba(0,0,0,0.6),0_0_20px_rgba(16,185,129,0.18)]">
              <button
                type="button"
                onClick={() => switchTab("beranda")}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer whitespace-nowrap active:translate-y-0 active:scale-95 ${
                  activeTab === "beranda"
                    ? "bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 text-white shadow-[0_8px_25px_rgba(16,185,129,0.55),0_0_14px_rgba(34,197,94,0.4)] dark:shadow-[0_0_25px_rgba(16,185,129,0.65),0_0_12px_rgba(34,197,94,0.5)] ring-2 ring-emerald-400 -translate-y-1 scale-102"
                    : "text-slate-700 dark:text-slate-300 hover:text-emerald-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 hover:shadow-[0_8px_22px_rgba(16,185,129,0.3),0_0_12px_rgba(250,204,21,0.25)] dark:hover:shadow-[0_0_18px_rgba(16,185,129,0.3)] hover:ring-1 hover:ring-emerald-400/60 hover:-translate-y-1"
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Beranda</span>
              </button>

              <button
                type="button"
                onClick={() => switchTab("kaih")}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer whitespace-nowrap active:translate-y-0 active:scale-95 ${
                  activeTab === "kaih"
                    ? "bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 text-white shadow-[0_8px_25px_rgba(16,185,129,0.55),0_0_14px_rgba(34,197,94,0.4)] dark:shadow-[0_0_25px_rgba(16,185,129,0.65),0_0_12px_rgba(34,197,94,0.5)] ring-2 ring-emerald-400 -translate-y-1 scale-102"
                    : "text-slate-700 dark:text-slate-300 hover:text-emerald-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 hover:shadow-[0_8px_22px_rgba(16,185,129,0.3),0_0_12px_rgba(250,204,21,0.25)] dark:hover:shadow-[0_0_18px_rgba(16,185,129,0.3)] hover:ring-1 hover:ring-emerald-400/60 hover:-translate-y-1"
                }`}
              >
                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                <span>7 Karakter KAIH</span>
                <span className="hidden sm:inline-flex text-[10px] bg-emerald-800/60 dark:bg-emerald-950/90 text-amber-300 px-2 py-0.5 rounded-full font-black border border-amber-300/40">
                  35 Butir
                </span>
              </button>

              <button
                type="button"
                onClick={() => switchTab("profil")}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer whitespace-nowrap active:translate-y-0 active:scale-95 ${
                  activeTab === "profil"
                    ? "bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 text-white shadow-[0_8px_25px_rgba(16,185,129,0.55),0_0_14px_rgba(34,197,94,0.4)] dark:shadow-[0_0_25px_rgba(16,185,129,0.65),0_0_12px_rgba(34,197,94,0.5)] ring-2 ring-emerald-400 -translate-y-1 scale-102"
                    : "text-slate-700 dark:text-slate-300 hover:text-emerald-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 hover:shadow-[0_8px_22px_rgba(16,185,129,0.3),0_0_12px_rgba(250,204,21,0.25)] dark:hover:shadow-[0_0_18px_rgba(16,185,129,0.3)] hover:ring-1 hover:ring-emerald-400/60 hover:-translate-y-1"
                }`}
              >
                <Users2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                <span>Profil Pembuat</span>
              </button>
            </div>

            {/* Home Theme Toggle Pill (Tampil di Beranda agar Pengguna Bisa Langsung Ganti Tema) */}
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hidden lg:inline-flex items-center gap-1">
                <span>Tema:</span>
              </span>
              <ThemeToggle variant="pill" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BERANDA                                                            */}
      {/* ========================================================================= */}
      {activeTab === "beranda" && (
        <main className="flex-1">
          {/* Hero Section dengan Background Semi-Transparan dan Efek Cahaya Mode Gelap */}
          <section className="relative overflow-hidden border-b border-slate-200/70 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xs py-14 sm:py-20 transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                {/* Left Content */}
                <div className="space-y-6 lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-500/40 bg-emerald-100/80 dark:bg-emerald-950/70 px-3.5 py-1 text-xs font-semibold text-emerald-900 dark:text-emerald-300 shadow-xs dark:shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Inisiatif Proyek Evaluasi Karakter Santri 2026/2027</span>
                  </div>

                  <div className="space-y-3">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
                      Evaluasi 7 Karakter Utama{" "}
                      <span className="text-emerald-700 dark:text-emerald-400 drop-shadow-[0_2px_10px_rgba(16,185,129,0.3)]">
                        SMAIT Ihsanul Fikri
                      </span>{" "}
                      (7 KAIH)
                    </h1>
                    <p className="text-base text-slate-600 dark:text-slate-300 sm:text-lg leading-relaxed max-w-2xl">
                      Platform instrumen refleksi mandiri santri untuk mengukur pembiasaan ibadah, literasi riset, adab ukhuwah bermasyarakat, dan kedisiplinan asrama dengan metode penilaian persentase dan skala Likert murni yang transparan dan akuntabel.
                    </p>
                  </div>

                  {/* Action Buttons dengan Efek Timbul & Pendaran Cahaya */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href="/survei"
                      aria-label="Mulai Survei Sekarang - Kuesioner Evaluasi 7 KAIH Santri"
                      title="Mulai Survei Sekarang"
                      className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 px-6 py-3.5 text-sm sm:text-base font-extrabold text-white shadow-[0_10px_25px_-3px_rgba(21,128,61,0.45),0_0_16px_2px_rgba(34,197,94,0.3)] dark:shadow-[0_0_30px_rgba(16,185,129,0.5),0_0_12px_rgba(34,197,94,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_-3px_rgba(21,128,61,0.55),0_0_22px_3px_rgba(34,197,94,0.4)] active:translate-y-0 active:scale-95 border border-emerald-600/60 dark:border-emerald-400/50 group cursor-pointer"
                    >
                      <ClipboardCheck className="h-5 w-5 text-amber-300 transition-transform duration-300 group-hover:scale-110" />
                      <span className="tracking-wide">Mulai Survei Sekarang</span>
                      <ArrowRight className="h-4 w-4 text-amber-300 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => switchTab("kaih")}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300/90 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-5 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-500 dark:hover:border-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                      <span>Pelajari 7 Karakter KAIH</span>
                    </button>
                  </div>

                  {/* Quick Stat Pill dengan Tampilan Timbul 3D */}
                  <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-200/80 dark:border-slate-800 max-w-lg">
                    <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200/60 dark:border-slate-800 dark:shadow-[0_0_15px_rgba(16,185,129,0.12)] transition-all duration-300 hover:-translate-y-0.5">
                      <div className="text-xl font-bold text-slate-900 dark:text-white">7 KAIH</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Pilar Karakter</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200/60 dark:border-slate-800 dark:shadow-[0_0_15px_rgba(16,185,129,0.12)] transition-all duration-300 hover:-translate-y-0.5">
                      <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400">35 Butir</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Refleksi Terukur</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200/60 dark:border-slate-800 dark:shadow-[0_0_15px_rgba(16,185,129,0.12)] transition-all duration-300 hover:-translate-y-0.5">
                      <div className="text-xl font-bold text-amber-700 dark:text-amber-400">1–4</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Skala Likert</div>
                    </div>
                  </div>
                </div>

                {/* Right Emblem Card dengan Luminous Halo di Mode Gelap */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-full max-w-md rounded-2xl border-2 border-emerald-600/30 dark:border-emerald-500/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 shadow-xl shadow-emerald-950/5 dark:shadow-[0_0_35px_rgba(16,185,129,0.22),0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-emerald-500 dark:hover:border-emerald-400 dark:hover:shadow-[0_0_45px_rgba(16,185,129,0.38)]">
                    <div className="absolute -top-3 -right-3 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-bold text-slate-950 shadow-md uppercase tracking-wider">
                      Resmi & Terverifikasi
                    </div>

                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-slate-800 p-1 shadow-inner dark:shadow-[0_0_20px_rgba(16,185,129,0.35)]">
                        <Image
                          src="/logo-ihsanul-fikri.png"
                          alt="Logo SMA IT Ihsanul Fikri"
                          fill
                          sizes="112px"
                          className="object-contain"
                          priority
                        />
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">SMA IT IHSANUL FIKRI</h2>
                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Kabupaten Magelang, Jawa Tengah</p>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed italic border-t border-b border-slate-100 dark:border-slate-800 py-3">
                        &ldquo;Menjadi Sekolah Berkarakter Qur&apos;ani, Prestatif, Kontributif, dan Berdaya Saing Global&rdquo;
                      </p>

                      <div className="w-full space-y-2 text-left text-xs">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>Metodologi Kuesioner Terstandar Likert 4 Tingkat</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>Kalkulasi Persentase Capaian Murni (0% – 100%)</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>Hak Privasi & Kerahasiaan Data Santri Terjamin</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Panduan Pengisian Survei Santri */}
          <section className="py-14 sm:py-16 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xs transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  Petunjuk Pengisian Survei Santri
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Langkah sederhana dalam berpartisipasi mewujudkan pembiasaan karakter unggul di SMAIT Ihsanul Fikri Magelang.
                </p>
              </div>

              {/* 3 Step Cards dengan Timbul & Pendaran Halus */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-xl hover:border-emerald-400 hover:dark:border-emerald-400 hover:dark:shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:-translate-y-1.5 transition-all duration-300">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 dark:border dark:border-emerald-500/40 dark:shadow-[0_0_12px_rgba(16,185,129,0.35)] font-bold shadow-xs">
                      1
                    </div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                      Pilih Identitas Santri
                    </CardTitle>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Pilih Tingkat (Kelas XI atau XII), Kelompok (Ikhwan/Akhwat), Rombel, dan Nama resmi sesuai data roster sekolah.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-xl hover:border-emerald-400 hover:dark:border-emerald-400 hover:dark:shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:-translate-y-1.5 transition-all duration-300">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 dark:border dark:border-emerald-500/40 dark:shadow-[0_0_12px_rgba(16,185,129,0.35)] font-bold shadow-xs">
                      2
                    </div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                      Jawab 35 Butir Refleksi
                    </CardTitle>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Isi setiap pernyataan dari KAIH 1 hingga KAIH 7 dengan jujur sesuai pengalaman keseharian santri menggunakan skala 1 s.d. 4.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-xl hover:border-emerald-400 hover:dark:border-emerald-400 hover:dark:shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:-translate-y-1.5 transition-all duration-300">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 dark:border dark:border-emerald-500/40 dark:shadow-[0_0_12px_rgba(16,185,129,0.35)] font-bold shadow-xs">
                      3
                    </div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                      Selesai &amp; Terdata Otomatis
                    </CardTitle>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Sistem menghitung indeks rata-rata dan tingkat kepercayaan diri secara real-time untuk keperluan evaluasi mutu santri.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Card CTA dengan Efek Timbul & Pendaran Cahaya */}
              <div className="mt-10 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-800 to-emerald-950 dark:from-emerald-950 dark:via-slate-900 dark:to-slate-950 dark:border dark:border-emerald-500/40 dark:shadow-[0_0_35px_rgba(16,185,129,0.25)] p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1.5 text-center sm:text-left">
                  <h3 className="text-lg font-bold">Siap mengisi refleksi mandiri Anda?</h3>
                  <p className="text-xs text-emerald-100/80 dark:text-slate-300 max-w-xl">
                    Hanya membutuhkan waktu 5-7 menit untuk menyelesaikan seluruh 35 butir evaluasi 7 Karakter Utama Ihsanul Fikri.
                  </p>
                </div>
                <Link
                  href="/survei"
                  className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 px-6 py-3 font-extrabold text-sm transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-95 cursor-pointer"
                >
                  <ClipboardCheck className="h-4 w-4 text-slate-950" />
                  <span>Buka Lembar Survei</span>
                </Link>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 7 KARAKTER KAIH                                                    */}
      {/* ========================================================================= */}
      {activeTab === "kaih" && (
        <main className="flex-1 py-12 sm:py-16 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xs transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Tab Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-500/40 bg-emerald-100/80 dark:bg-emerald-950/70 px-3.5 py-1 text-xs font-semibold text-emerald-900 dark:text-emerald-300 shadow-xs dark:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>Instrumen Resmi KAIH SMAIT Ihsanul Fikri</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                7 Karakter Utama Ihsanul Fikri (7 KAIH)
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Tujuh pilar pembiasaan komprehensif yang dirancang untuk mengokohkan marwah Qur&apos;ani, nalar riset, adab ukhuwah, kebugaran jasmani, dan rasa percaya diri santri berbasis 35 butir instrumen terstandar.
              </p>
            </div>

            {/* Tier & Bobot Overview Cards dengan Efek Timbul & Pendaran Sesuai Tier */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-500/40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-4 shadow-sm dark:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-lg hover:dark:shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase">Tier 1: Pilar Inti</span>
                  <Badge variant="outline" className="border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 dark:bg-emerald-950/60 text-[10px] font-bold">
                    Bobot ×3
                  </Badge>
                </div>
                <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  KAIH 1 (Literasi &amp; Riset) &amp; KAIH 4 (Al-Qur&apos;an)
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Kontribusi pengaruh tertinggi (38% gabungan) sebagai pilar spiritual &amp; daya nalar utama.
                </p>
              </div>

              <div className="rounded-xl border border-amber-200/80 dark:border-amber-500/40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-4 shadow-sm dark:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-lg hover:dark:shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-400 uppercase">Tier 2: Pilar Penunjang</span>
                  <Badge variant="outline" className="border-amber-300 dark:border-amber-500/50 text-amber-800 dark:text-amber-300 dark:bg-amber-950/60 text-[10px] font-bold">
                    Bobot ×2
                  </Badge>
                </div>
                <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  KAIH 3 (Kesiapan Ibadah) &amp; KAIH 5 (Kebugaran Fisik)
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Kontribusi pengaruh 30% gabungan untuk kedisiplinan spiritual harian dan ketahanan jasmani.
                </p>
              </div>

              <div className="rounded-xl border border-sky-200/80 dark:border-sky-500/40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-4 shadow-sm dark:shadow-[0_0_20px_rgba(14,165,233,0.15)] hover:shadow-lg hover:dark:shadow-[0_0_25px_rgba(14,165,233,0.3)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900 dark:text-sky-400 uppercase">Tier 3: Pilar Adab &amp; Disiplin</span>
                  <Badge variant="outline" className="border-sky-300 dark:border-sky-500/50 text-sky-800 dark:text-sky-300 dark:bg-sky-950/60 text-[10px] font-bold">
                    Bobot ×1
                  </Badge>
                </div>
                <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  KAIH 2 (Ukhuwah), KAIH 6 (Istirahat), KAIH 7 (Adab Makan)
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Kontribusi pengaruh 32% gabungan untuk pembentukan akhlak sosial dan manajemen diri asrama.
                </p>
              </div>
            </div>

            {/* Cards Grid KAIH 1 s.d. 7 dengan Efek Timbul & Pendaran Cahaya */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {KAIH_SHOWCASE.map((k) => {
                const IconComp = k.icon;
                return (
                  <div
                    key={k.num}
                    className={`group relative rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-5 shadow-xs dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500 hover:dark:border-emerald-400 hover:shadow-[0_16px_32px_-6px_rgba(21,128,61,0.25),0_0_15px_1px_rgba(34,197,94,0.12)] hover:dark:shadow-[0_0_30px_rgba(16,185,129,0.35)] flex flex-col justify-between ${
                      k.num === 4 ? "md:col-span-2 lg:col-span-1 ring-1 ring-purple-300/60 dark:ring-purple-500/40 bg-gradient-to-b from-purple-50/30 via-white to-white dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900" : ""
                    }`}
                  >
                    <div className="space-y-3.5">
                      {/* Header: Number & Tier Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-800 dark:bg-emerald-700 text-[11px] font-black text-amber-300 shadow-xs dark:shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                            {k.num}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            KAIH {k.num}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${k.badgeBg}`}>
                          {k.impact}
                        </span>
                      </div>

                      {/* Icon & Title */}
                      <div className="flex items-start gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${k.color} text-white shadow-md shadow-emerald-950/10 dark:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-transform duration-300 group-hover:scale-105`}>
                          <IconComp className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                            {k.title}
                          </h3>
                          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400">
                            {k.category}
                          </span>
                        </div>
                      </div>

                      {/* Focus Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {k.focus}
                      </p>

                      {/* 5 Indikator Butir */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                          Fokus Indikator Penilaian:
                        </div>
                        <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-300">
                          {k.indicators.map((ind, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">•</span>
                              <span className="line-clamp-2">{ind}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Card Footer: Tier & Indicator info */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">
                        {k.tier}
                      </span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-800/80">
                        5 Butir Refleksi
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Final Highlight Card: Total Akumulasi & CTA dengan Efek Timbul */}
              <div className="rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-400/60 bg-gradient-to-br from-amber-50/90 via-white to-emerald-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/60 p-5 flex flex-col justify-between shadow-sm dark:shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:shadow-xl hover:dark:shadow-[0_0_35px_rgba(245,158,11,0.35)] hover:-translate-y-2 transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span>Total Instrumen</span>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-950 dark:text-white">
                      35 Butir <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">Resmi</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      Setiap santri mengevaluasi seluruh 7 pilar pembiasaan dengan skala Likert 1–4 terstandarisasi.
                    </p>
                  </div>
                </div>

                <Link
                  href="/survei"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  <span>Mulai Isi KAIH 1</span>
                  <ChevronRight className="h-3.5 w-3.5 text-amber-300" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PROFIL PEMBUAT                                                     */}
      {/* ========================================================================= */}
      {activeTab === "profil" && (
        <main className="flex-1 py-12 sm:py-16 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xs transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Tab Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-3.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs dark:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Users2 className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Tim Pengembang &amp; Pembimbing VERTIKALIF</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Profil Tim Pembuat &amp; Guru Pembimbing
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Inisiatif karya mandiri santri SMAIT Ihsanul Fikri Magelang di bawah bimbingan guru pembimbing dalam mengimplementasikan integrasi teknologi web modern untuk kemaslahatan evaluasi pendidikan sekolah.
              </p>
            </div>

            {/* Members Grid (Susunan Terpusat & Pas Foto 3x4 Formal dengan Efek Timbul & Pendaran Halo) */}
            <div className="flex flex-wrap justify-center gap-6">
              {WHITELIST_MEMBERS.map((member) => (
                <Card
                  key={member.nis}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-sm border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500 hover:dark:border-emerald-400 hover:shadow-[0_16px_32px_-8px_rgba(21,128,61,0.28),0_0_15px_1px_rgba(34,197,94,0.18)] hover:dark:shadow-[0_0_30px_rgba(16,185,129,0.35)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
                >
                  <div className="pt-6 pb-2 text-center flex flex-col items-center">
                    {/* Pas Foto Formal 3x4 / 4x3 dengan Glowing Frame */}
                    <div className="relative w-24 h-32 shrink-0 overflow-hidden rounded-xl border-2 border-emerald-600 dark:border-emerald-400 bg-slate-100 dark:bg-slate-800 shadow-md dark:shadow-[0_0_18px_rgba(16,185,129,0.4)] mb-3.5">
                      <Image
                        src={member.avatar}
                        alt={member.nama}
                        fill
                        sizes="(max-width: 640px) 96px, 128px"
                        className={`object-cover ${member.avatarPosition || "object-top"}`}
                      />
                    </div>

                    <div className="space-y-1.5 px-4 w-full">
                      <CardTitle className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {member.nama}
                      </CardTitle>
                      <div>
                        <Badge variant="gold" className="text-[10px] px-2.5 py-0.5 font-semibold shadow-xs">
                          {member.peran}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                        {member.kelas === "Pembimbing" ? (
                          <>
                            NIP: <span className="font-semibold text-emerald-800 dark:text-emerald-400">{member.nis}</span> • Guru Pembimbing
                          </>
                        ) : (
                          <>
                            NIS: <span className="font-semibold text-emerald-800 dark:text-emerald-400">{member.nis}</span> • Kelas {member.kelas}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <CardContent className="pt-2 pb-5 px-5 text-xs text-slate-600 dark:text-slate-300 text-center leading-relaxed border-t border-slate-100 dark:border-slate-800 mt-2">
                    {member.bio}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Latar Belakang & Pernyataan Proyek dengan Efek Timbul & Pendaran Halo */}
            <div className="mt-12 rounded-2xl border border-emerald-200/90 dark:border-emerald-500/40 bg-emerald-50/80 dark:bg-slate-900/95 backdrop-blur-xs p-6 sm:p-8 shadow-md dark:shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-xl hover:dark:shadow-[0_0_40px_rgba(16,185,129,0.35)] transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                    <GraduationCap className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                    <span>Tujuan Proyek Instrumen 7 KAIH</span>
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950 dark:text-white">
                    Pemetaan Objektif 7 Karakter Utama Ihsanul Fikri
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-900/80 dark:text-slate-300 leading-relaxed">
                    Instrumen kuesioner ini dirancang secara mandiri untuk menghimpun data refleksi pembiasaan ibadah, literasi &amp; riset, kebersihan lingkungan, adab ukhuwah, kedisiplinan, hingga kebugaran jasmani santri. Hasil asesmen diolah secara terpadu di portal analitik untuk pembinaan berkelanjutan.
                  </p>
                </div>
                <div className="lg:col-span-4 flex justify-end">
                  <Link
                    href="/survei"
                    aria-label="Mulai Survei Sekarang - Kuesioner Evaluasi 7 KAIH Santri"
                    title="Mulai Survei Sekarang"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 px-7 py-3.5 text-sm sm:text-base font-extrabold text-slate-950 shadow-[0_10px_24px_-4px_rgba(245,158,11,0.5),0_0_16px_2px_rgba(251,191,36,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_-4px_rgba(245,158,11,0.6),0_0_22px_3px_rgba(251,191,36,0.45)] active:translate-y-0 active:scale-95 border border-amber-300/80 group cursor-pointer"
                  >
                    <ClipboardCheck className="h-5 w-5 text-slate-950" />
                    <span>Mulai Survei Sekarang</span>
                    <ArrowRight className="h-4 w-4 text-slate-950 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-transparent">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
            <span className="text-xs font-semibold text-slate-500">Memuat Platform VERTIKALIF...</span>
          </div>
        </div>
      }
    >
      <HomeInner />
    </Suspense>
  );
}
