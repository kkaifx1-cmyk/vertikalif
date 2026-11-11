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
  Lock,
} from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    badgeBg: "bg-emerald-50 dark:bg-black text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/60 dark:shadow-[0_0_10px_rgba(16,185,129,0.3)]",
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
    badgeBg: "bg-teal-50 dark:bg-black text-teal-800 dark:text-teal-300 border-teal-200 dark:border-emerald-500/60 dark:shadow-[0_0_10px_rgba(16,185,129,0.3)]",
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
    badgeBg: "bg-emerald-50 dark:bg-black text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/60 dark:shadow-[0_0_10px_rgba(16,185,129,0.3)]",
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
    badgeBg: "bg-purple-50 dark:bg-black text-purple-800 dark:text-purple-300 border-purple-200 dark:border-emerald-500/60 dark:shadow-[0_0_10px_rgba(16,185,129,0.3)]",
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
    badgeBg: "bg-amber-50 dark:bg-black text-amber-800 dark:text-amber-300 border-amber-200 dark:border-emerald-500/60 dark:shadow-[0_0_10px_rgba(16,185,129,0.3)]",
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
    badgeBg: "bg-blue-50 dark:bg-black text-blue-800 dark:text-blue-300 border-blue-200 dark:border-emerald-500/60 dark:shadow-[0_0_10px_rgba(16,185,129,0.3)]",
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
    badgeBg: "bg-green-50 dark:bg-black text-green-800 dark:text-green-300 border-green-200 dark:border-emerald-500/60 dark:shadow-[0_0_10px_rgba(16,185,129,0.3)]",
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

  // Status Kunci Profil Pembuat (Dinonaktifkan sementara)
  const IS_PROFILE_LOCKED = true;

  const [activeTab, setActiveTab] = useState<TabKey>("beranda");

  useEffect(() => {
    if (tabFromQuery === "kaih") {
      setActiveTab("kaih");
    } else if (tabFromQuery === "profil") {
      if (IS_PROFILE_LOCKED) {
        setActiveTab("beranda");
        router.replace("/", { scroll: false });
      } else {
        setActiveTab("profil");
      }
    } else {
      setActiveTab("beranda");
    }
  }, [tabFromQuery, router]);

  useEffect(() => {
    const handleCustomTab = (e: Event) => {
      const customEvent = e as CustomEvent<TabKey>;
      if (customEvent.detail) {
        if (customEvent.detail === "profil" && IS_PROFILE_LOCKED) {
          return;
        }
        setActiveTab(customEvent.detail);
      }
    };
    window.addEventListener("vertikalif_switch_tab", handleCustomTab);
    return () => {
      window.removeEventListener("vertikalif_switch_tab", handleCustomTab);
    };
  }, []);

  const switchTab = (tab: TabKey) => {
    if (tab === "profil" && IS_PROFILE_LOCKED) {
      return;
    }
    setActiveTab(tab);
    router.push(`/?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-slate-900 dark:text-white transition-colors duration-300">
      

      {/* ========================================================================= */}
      {/* TAB 1: BERANDA                                                            */}
      {/* ========================================================================= */}
      {activeTab === "beranda" && (
        <main className="flex-1">
          {/* Hero Section dengan Background Hitam Pekat dan Efek Cahaya Hijau/Emas */}
          <section className="relative overflow-hidden border-b border-slate-200/70 dark:border-emerald-500/30 bg-white/60 dark:bg-black/80 backdrop-blur-xs py-14 sm:py-20 transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                {/* Left Content */}
                <div className="space-y-6 lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-500/60 bg-emerald-100/80 dark:bg-black/90 px-3.5 py-1 text-xs font-semibold text-emerald-900 dark:text-emerald-300 shadow-xs dark:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Inisiatif Proyek Evaluasi Karakter Santri 2026/2027</span>
                  </div>

                  <div className="space-y-3">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
                      Evaluasi 7 Karakter Utama{" "}
                      <span className="text-emerald-700 dark:text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]">
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
                      className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 px-6 py-3.5 text-sm sm:text-base font-extrabold text-white shadow-[0_10px_25px_-3px_rgba(21,128,61,0.45),0_0_16px_2px_rgba(34,197,94,0.3)] dark:shadow-[0_0_30px_rgba(16,185,129,0.6),0_0_12px_rgba(34,197,94,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_-3px_rgba(21,128,61,0.55),0_0_25px_rgba(245,158,11,0.5)] dark:hover:border-amber-400 active:translate-y-0 active:scale-95 border border-emerald-600/60 dark:border-emerald-400/60 group cursor-pointer"
                    >
                      <ClipboardCheck className="h-5 w-5 text-amber-300 transition-transform duration-300 group-hover:scale-110" />
                      <span className="tracking-wide">Mulai Survei Sekarang</span>
                      <ArrowRight className="h-4 w-4 text-amber-300 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => switchTab("kaih")}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300/90 dark:border-emerald-500/60 bg-white/90 dark:bg-black/90 backdrop-blur-xs px-5 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:bg-white dark:hover:bg-black hover:border-emerald-500 dark:hover:border-amber-400 hover:text-emerald-800 dark:hover:text-amber-400 hover:shadow-md dark:hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                      <span>Pelajari 7 Karakter KAIH</span>
                    </button>
                  </div>

                  {/* Quick Stat Pill dengan Border Hijau & Berubah Emas saat Kursor Mendekat */}
                  <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-200/80 dark:border-emerald-500/30 max-w-lg">
                    <div className="group p-2.5 rounded-xl bg-white/60 dark:bg-black/90 backdrop-blur-xs border border-slate-200/60 dark:border-emerald-500/50 dark:shadow-[0_0_15px_rgba(16,185,129,0.18)] hover:dark:border-amber-400 hover:dark:shadow-[0_0_25px_rgba(245,158,11,0.45)] transition-all duration-300 hover:-translate-y-1 cursor-default">
                      <div className="text-xl font-bold text-slate-900 dark:text-white group-hover:dark:text-amber-300 transition-colors">7 KAIH</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Pilar Karakter</div>
                    </div>
                    <div className="group p-2.5 rounded-xl bg-white/60 dark:bg-black/90 backdrop-blur-xs border border-slate-200/60 dark:border-emerald-500/50 dark:shadow-[0_0_15px_rgba(16,185,129,0.18)] hover:dark:border-amber-400 hover:dark:shadow-[0_0_25px_rgba(245,158,11,0.45)] transition-all duration-300 hover:-translate-y-1 cursor-default">
                      <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 group-hover:dark:text-amber-300 transition-colors">35 Butir</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Refleksi Terukur</div>
                    </div>
                    <div className="group p-2.5 rounded-xl bg-white/60 dark:bg-black/90 backdrop-blur-xs border border-slate-200/60 dark:border-emerald-500/50 dark:shadow-[0_0_15px_rgba(16,185,129,0.18)] hover:dark:border-amber-400 hover:dark:shadow-[0_0_25px_rgba(245,158,11,0.45)] transition-all duration-300 hover:-translate-y-1 cursor-default">
                      <div className="text-xl font-bold text-amber-700 dark:text-amber-400 group-hover:dark:text-amber-300 transition-colors">1–4</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Skala Likert</div>
                    </div>
                  </div>
                </div>

                {/* Right Emblem Card: Hitam Pekat, Outline Hijau Default, Berubah Emas saat Kursor Hover */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="group relative w-full max-w-md rounded-2xl border-2 border-emerald-600/30 dark:border-emerald-500/60 bg-white/95 dark:bg-black/95 backdrop-blur-md p-6 shadow-xl shadow-emerald-950/5 dark:shadow-[0_0_30px_rgba(16,185,129,0.25),0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500 dark:hover:border-amber-400 dark:hover:shadow-[0_0_45px_rgba(245,158,11,0.55)]">
                    <div className="absolute -top-3 -right-3 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-bold text-slate-950 shadow-md uppercase tracking-wider">
                      Resmi & Terverifikasi
                    </div>

                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-emerald-600 dark:border-emerald-500 group-hover:dark:border-amber-400 bg-emerald-50 dark:bg-black p-1 shadow-inner dark:shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:dark:shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all duration-300">
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
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:dark:text-amber-300 transition-colors">
                          SMA IT IHSANUL FIKRI
                        </h2>
                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          Kabupaten Magelang, Jawa Tengah
                        </p>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed italic border-t border-b border-slate-100 dark:border-emerald-500/25 py-3">
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
          <section className="py-14 sm:py-16 bg-white/40 dark:bg-black/80 backdrop-blur-xs transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  Petunjuk Pengisian Survei Santri
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Langkah sederhana dalam berpartisipasi mewujudkan pembiasaan karakter unggul di SMAIT Ihsanul Fikri Magelang.
                </p>
              </div>

              {/* 3 Step Cards: Hitam Pekat, Outline Hijau Default, Berubah Emas saat Kursor Hover */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group rounded-2xl border border-slate-200/80 dark:border-emerald-500/60 bg-white/90 dark:bg-black/95 backdrop-blur-xs p-6 space-y-3 shadow-sm dark:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-xl hover:border-emerald-400 dark:hover:border-amber-400 dark:hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:-translate-y-2 transition-all duration-300 cursor-default">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-black text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-500/80 dark:shadow-[0_0_12px_rgba(16,185,129,0.4)] group-hover:dark:border-amber-400 group-hover:dark:text-amber-300 group-hover:dark:shadow-[0_0_15px_rgba(245,158,11,0.6)] font-bold transition-all duration-300">
                    1
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:dark:text-amber-300 transition-colors">
                    Pilih Identitas Santri
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Pilih Tingkat (Kelas XI atau XII), Kelompok (Ikhwan/Akhwat), Rombel, dan Nama resmi sesuai data roster sekolah.
                  </p>
                </div>

                <div className="group rounded-2xl border border-slate-200/80 dark:border-emerald-500/60 bg-white/90 dark:bg-black/95 backdrop-blur-xs p-6 space-y-3 shadow-sm dark:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-xl hover:border-emerald-400 dark:hover:border-amber-400 dark:hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:-translate-y-2 transition-all duration-300 cursor-default">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-black text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-500/80 dark:shadow-[0_0_12px_rgba(16,185,129,0.4)] group-hover:dark:border-amber-400 group-hover:dark:text-amber-300 group-hover:dark:shadow-[0_0_15px_rgba(245,158,11,0.6)] font-bold transition-all duration-300">
                    2
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:dark:text-amber-300 transition-colors">
                    Jawab 35 Butir Refleksi
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Isi setiap pernyataan dari KAIH 1 hingga KAIH 7 dengan jujur sesuai pengalaman keseharian santri menggunakan skala 1 s.d. 4.
                  </p>
                </div>

                <div className="group rounded-2xl border border-slate-200/80 dark:border-emerald-500/60 bg-white/90 dark:bg-black/95 backdrop-blur-xs p-6 space-y-3 shadow-sm dark:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-xl hover:border-emerald-400 dark:hover:border-amber-400 dark:hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:-translate-y-2 transition-all duration-300 cursor-default">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-black text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-500/80 dark:shadow-[0_0_12px_rgba(16,185,129,0.4)] group-hover:dark:border-amber-400 group-hover:dark:text-amber-300 group-hover:dark:shadow-[0_0_15px_rgba(245,158,11,0.6)] font-bold transition-all duration-300">
                    3
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:dark:text-amber-300 transition-colors">
                    Selesai &amp; Terdata Otomatis
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Sistem menghitung indeks rata-rata dan tingkat kepercayaan diri secara real-time untuk keperluan evaluasi mutu santri.
                  </p>
                </div>
              </div>

              {/* Bottom Card CTA: Hitam Pekat, Outline Hijau Default, Berubah Emas saat Kursor Hover */}
              <div className="group mt-10 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-800 to-emerald-950 dark:from-black dark:via-black dark:to-black dark:border-2 dark:border-emerald-500/60 dark:shadow-[0_0_35px_rgba(16,185,129,0.25)] hover:dark:border-amber-400 hover:dark:shadow-[0_0_45px_rgba(245,158,11,0.5)] p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300">
                <div className="space-y-1.5 text-center sm:text-left">
                  <h3 className="text-lg font-bold group-hover:dark:text-amber-300 transition-colors">
                    Siap mengisi refleksi mandiri Anda?
                  </h3>
                  <p className="text-xs text-emerald-100/80 dark:text-slate-300 max-w-xl">
                    Hanya membutuhkan waktu 5-7 menit untuk menyelesaikan seluruh 35 butir evaluasi 7 Karakter Utama Ihsanul Fikri.
                  </p>
                </div>
                <Link
                  href="/survei"
                  className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 px-6 py-3 font-extrabold text-sm transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-95 cursor-pointer border border-amber-300"
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
        <main className="flex-1 py-12 sm:py-16 bg-white/40 dark:bg-black/80 backdrop-blur-xs transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Tab Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-500/60 bg-emerald-100/80 dark:bg-black px-3.5 py-1 text-xs font-semibold text-emerald-900 dark:text-emerald-300 shadow-xs dark:shadow-[0_0_15px_rgba(16,185,129,0.25)]">
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

            {/* Tier & Bobot Overview Cards: Hitam Pekat, Outline Hijau Default, Berubah Emas saat Kursor Hover */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="group rounded-xl border border-emerald-200/80 dark:border-emerald-500/60 bg-white/90 dark:bg-black/95 backdrop-blur-xs p-4 shadow-sm dark:shadow-[0_0_18px_rgba(16,185,129,0.2)] hover:shadow-lg hover:dark:border-amber-400 hover:dark:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:-translate-y-1.5 transition-all duration-300 cursor-default">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-400 group-hover:dark:text-amber-300 uppercase transition-colors">
                    Tier 1: Pilar Inti
                  </span>
                  <Badge variant="outline" className="border-emerald-300 dark:border-emerald-500/60 text-emerald-800 dark:text-emerald-300 dark:bg-black text-[10px] font-bold group-hover:dark:border-amber-400 group-hover:dark:text-amber-300 transition-colors">
                    Bobot ×3
                  </Badge>
                </div>
                <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white group-hover:dark:text-amber-300 transition-colors">
                  KAIH 1 (Literasi &amp; Riset) &amp; KAIH 4 (Al-Qur&apos;an)
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Kontribusi pengaruh tertinggi (38% gabungan) sebagai pilar spiritual &amp; daya nalar utama.
                </p>
              </div>

              <div className="group rounded-xl border border-amber-200/80 dark:border-emerald-500/60 bg-white/90 dark:bg-black/95 backdrop-blur-xs p-4 shadow-sm dark:shadow-[0_0_18px_rgba(16,185,129,0.2)] hover:shadow-lg hover:dark:border-amber-400 hover:dark:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:-translate-y-1.5 transition-all duration-300 cursor-default">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 dark:text-emerald-400 group-hover:dark:text-amber-300 uppercase transition-colors">
                    Tier 2: Pilar Penunjang
                  </span>
                  <Badge variant="outline" className="border-amber-300 dark:border-emerald-500/60 text-amber-800 dark:text-emerald-300 dark:bg-black text-[10px] font-bold group-hover:dark:border-amber-400 group-hover:dark:text-amber-300 transition-colors">
                    Bobot ×2
                  </Badge>
                </div>
                <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white group-hover:dark:text-amber-300 transition-colors">
                  KAIH 3 (Kesiapan Ibadah) &amp; KAIH 5 (Kebugaran Fisik)
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Kontribusi pengaruh 30% gabungan untuk kedisiplinan spiritual harian dan ketahanan jasmani.
                </p>
              </div>

              <div className="group rounded-xl border border-sky-200/80 dark:border-emerald-500/60 bg-white/90 dark:bg-black/95 backdrop-blur-xs p-4 shadow-sm dark:shadow-[0_0_18px_rgba(16,185,129,0.2)] hover:shadow-lg hover:dark:border-amber-400 hover:dark:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:-translate-y-1.5 transition-all duration-300 cursor-default">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900 dark:text-emerald-400 group-hover:dark:text-amber-300 uppercase transition-colors">
                    Tier 3: Pilar Adab &amp; Disiplin
                  </span>
                  <Badge variant="outline" className="border-sky-300 dark:border-emerald-500/60 text-sky-800 dark:text-emerald-300 dark:bg-black text-[10px] font-bold group-hover:dark:border-amber-400 group-hover:dark:text-amber-300 transition-colors">
                    Bobot ×1
                  </Badge>
                </div>
                <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white group-hover:dark:text-amber-300 transition-colors">
                  KAIH 2 (Ukhuwah), KAIH 6 (Istirahat), KAIH 7 (Adab Makan)
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Kontribusi pengaruh 32% gabungan untuk pembentukan akhlak sosial dan manajemen diri asrama.
                </p>
              </div>
            </div>

            {/* Cards Grid KAIH 1 s.d. 7: Hitam Pekat, Outline Hijau Default, Berubah Emas saat Kursor Hover */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {KAIH_SHOWCASE.map((k) => {
                const IconComp = k.icon;
                return (
                  <div
                    key={k.num}
                    className={`group relative rounded-2xl border border-slate-200/90 dark:border-emerald-500/60 bg-white/95 dark:bg-black/95 backdrop-blur-xs p-5 shadow-xs dark:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500 dark:hover:border-amber-400 hover:shadow-[0_16px_32px_-6px_rgba(21,128,61,0.25)] dark:hover:shadow-[0_0_35px_rgba(245,158,11,0.55),0_0_15px_rgba(251,191,36,0.35)] flex flex-col justify-between cursor-default ${
                      k.num === 4 ? "md:col-span-2 lg:col-span-1" : ""
                    }`}
                  >
                    <div className="space-y-3.5">
                      {/* Header: Number & Tier Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-800 dark:bg-black text-[11px] font-black text-amber-300 border border-transparent dark:border-emerald-500/80 group-hover:dark:border-amber-400 group-hover:dark:text-amber-300 shadow-xs dark:shadow-[0_0_10px_rgba(16,185,129,0.3)] group-hover:dark:shadow-[0_0_15px_rgba(245,158,11,0.6)] transition-all duration-300">
                            {k.num}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:dark:text-emerald-400 uppercase tracking-wider transition-colors">
                            KAIH {k.num}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${k.badgeBg} group-hover:dark:border-amber-400 group-hover:dark:text-amber-300 transition-colors`}>
                          {k.impact}
                        </span>
                      </div>

                      {/* Icon & Title */}
                      <div className="flex items-start gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${k.color} text-white shadow-md shadow-emerald-950/10 dark:shadow-[0_0_18px_rgba(16,185,129,0.35)] group-hover:dark:shadow-[0_0_22px_rgba(245,158,11,0.6)] transition-all duration-300 group-hover:scale-105`}>
                          <IconComp className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-800 dark:group-hover:text-amber-300 transition-colors">
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
                      <div className="pt-2 border-t border-slate-100 dark:border-emerald-500/25 space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                          Fokus Indikator Penilaian:
                        </div>
                        <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-300">
                          {k.indicators.map((ind, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 dark:text-emerald-400 group-hover:dark:text-amber-400 font-bold shrink-0 transition-colors">•</span>
                              <span className="line-clamp-2">{ind}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Card Footer: Tier & Indicator info */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-emerald-500/25 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">
                        {k.tier}
                      </span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300 group-hover:dark:text-amber-300 bg-emerald-50 dark:bg-black px-2 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-500/60 group-hover:dark:border-amber-400 transition-all duration-300">
                        5 Butir Refleksi
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Final Highlight Card: Total Akumulasi 35 Butir */}
              <div className="group rounded-2xl border-2 border-dashed border-amber-300 dark:border-emerald-500/70 bg-gradient-to-br from-amber-50/90 via-white to-emerald-50/70 dark:from-black dark:via-black dark:to-black p-5 flex flex-col justify-between shadow-sm dark:shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:shadow-xl hover:dark:border-amber-400 hover:dark:shadow-[0_0_40px_rgba(245,158,11,0.55)] hover:-translate-y-2 transition-all duration-300 cursor-default">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-emerald-400 group-hover:dark:text-amber-300 transition-colors">
                    <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span>Total Instrumen</span>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-950 dark:text-white group-hover:dark:text-amber-300 transition-colors">
                      35 Butir <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">Resmi</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      Setiap santri mengevaluasi seluruh 7 pilar pembiasaan dengan skala Likert 1–4 terstandarisasi.
                    </p>
                  </div>
                </div>

                <Link
                  href="/survei"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer border border-emerald-500/50 hover:border-amber-400"
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
        IS_PROFILE_LOCKED ? (
          <main className="flex-1 py-20 sm:py-28 bg-white/40 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center px-4 transition-colors duration-300">
            <div className="max-w-md w-full rounded-3xl border border-amber-500/40 dark:border-amber-500/30 bg-white/95 dark:bg-zinc-950/95 p-8 text-center shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 mx-auto shadow-inner">
                <Lock className="h-8 w-8 stroke-[2.2]" />
              </div>
              <div className="space-y-2">
                <span className="inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono border border-amber-500/30">
                  Akses Dibatasi
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Profil Ditutup Sementara
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Halaman profil tim pembuat dan guru pembimbing sedang dinonaktifkan sementara oleh pengelola instrumen VERTIKALIF.
                </p>
              </div>
              <button
                type="button"
                onClick={() => switchTab("beranda")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 shadow-md shadow-emerald-900/30 hover:shadow-lg transition-all cursor-pointer"
              >
                <Home className="h-4 w-4" />
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </main>
        ) : (
          <main className="flex-1 py-12 sm:py-16 bg-white/40 dark:bg-black/80 backdrop-blur-xs transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Tab Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-emerald-500/60 bg-white/90 dark:bg-black px-3.5 py-1 text-xs font-semibold text-slate-700 dark:text-emerald-300 shadow-xs dark:shadow-[0_0_15px_rgba(16,185,129,0.25)]">
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

            {/* Members Grid: Hitam Pekat, Outline Hijau Default, Berubah Emas saat Kursor Hover */}
            <div className="flex flex-wrap justify-center gap-6">
              {WHITELIST_MEMBERS.map((member) => (
                <div
                  key={member.nis}
                  className="group w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] max-w-sm rounded-2xl border border-slate-200/90 dark:border-emerald-500/60 bg-white/95 dark:bg-black/95 backdrop-blur-xs flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500 dark:hover:border-amber-400 hover:shadow-[0_16px_32px_-8px_rgba(21,128,61,0.28)] dark:shadow-[0_0_20px_rgba(16,185,129,0.2)] dark:hover:shadow-[0_0_35px_rgba(245,158,11,0.55),0_0_15px_rgba(251,191,36,0.35)] cursor-default"
                >
                  <div className="pt-6 pb-2 text-center flex flex-col items-center">
                    {/* Pas Foto Formal 3x4 dengan Frame Hijau -> Berubah Emas saat Hover (Ukuran Sedang Elegan untuk Semua) */}
                    <div className="relative w-36 h-48 sm:w-40 sm:h-52 shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-600 dark:border-emerald-500 group-hover:dark:border-amber-400 bg-slate-100 dark:bg-black shadow-md dark:shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:dark:shadow-[0_0_28px_rgba(245,158,11,0.65)] mb-4 transition-all duration-300">
                      <Image
                        src={member.avatar}
                        alt={member.nama}
                        fill
                        sizes="(max-width: 640px) 144px, 160px"
                        className={`object-cover ${member.avatarPosition || "object-top"}`}
                      />
                    </div>

                    <div className="space-y-1.5 px-4 w-full">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:dark:text-amber-300 leading-snug transition-colors">
                        {member.nama}
                      </h3>
                      <div>
                        <Badge variant="gold" className="text-[11px] px-3 py-0.5 font-semibold shadow-xs">
                          {member.peran}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                        {member.kelas === "Pembimbing" ? (
                          <>
                            NIP: <span className="font-semibold text-emerald-800 dark:text-emerald-400 group-hover:dark:text-amber-400 transition-colors">{member.nis}</span> • Guru Pembimbing
                          </>
                        ) : (
                          <>
                            NIS: <span className="font-semibold text-emerald-800 dark:text-emerald-400 group-hover:dark:text-amber-400 transition-colors">{member.nis}</span> • Kelas {member.kelas}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 pb-5 px-5 text-xs text-slate-600 dark:text-slate-300 text-center leading-relaxed border-t border-slate-100 dark:border-emerald-500/25 mt-2">
                    {member.bio}
                  </div>
                </div>
              ))}
            </div>

            {/* Latar Belakang & Pernyataan Proyek: Hitam Pekat, Outline Hijau Default, Berubah Emas saat Kursor Hover */}
            <div className="group mt-12 rounded-2xl border border-emerald-200/90 dark:border-2 dark:border-emerald-500/60 bg-emerald-50/80 dark:bg-black/95 backdrop-blur-xs p-6 sm:p-8 shadow-md dark:shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-xl hover:dark:border-amber-400 hover:dark:shadow-[0_0_45px_rgba(245,158,11,0.5)] transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-400 group-hover:dark:text-amber-400 transition-colors">
                    <GraduationCap className="h-4 w-4 text-emerald-700 dark:text-emerald-400 group-hover:dark:text-amber-400 transition-colors" />
                    <span>Tujuan Proyek Instrumen 7 KAIH</span>
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950 dark:text-white group-hover:dark:text-amber-300 transition-colors">
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
        )
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
