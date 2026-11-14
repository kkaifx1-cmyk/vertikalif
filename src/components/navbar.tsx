"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ClipboardCheck, Home, Sparkles, Users2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isHome = pathname === "/";
  const currentTab = isHome ? (searchParams.get("tab") || "beranda") : null;

  // Status Kunci Profil Pembuat:
  // DIKUNCI SEMENTARA HINGGA USER MENGATAKAN KATA KUNCI "kunci1".
  // JANGAN DIUBAH MENJADI false SEBELUM USER MENGIRIMKAN KATA KUNCI "kunci1"!
  const IS_PROFILE_LOCKED = true;
  const [lockedNotice, setLockedNotice] = useState(false);

  const handleSwitchTab = (tab: "beranda" | "kaih" | "profil") => {
    if (tab === "profil" && IS_PROFILE_LOCKED) {
      setLockedNotice(true);
      setTimeout(() => setLockedNotice(false), 3000);
      return;
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("vertikalif_switch_tab", { detail: tab }));
    }
    if (isHome) {
      router.push(`/?tab=${tab}`, { scroll: false });
    } else {
      router.push(`/?tab=${tab}`);
    }
  };

  return (
    <div className="sticky top-2 sm:top-4 z-50 px-2 sm:px-6 w-full pointer-events-none">
      <header className="pointer-events-auto mx-auto max-w-7xl rounded-2xl border border-white/70 dark:border-slate-800/90 bg-white/85 dark:bg-slate-900/85 px-2.5 sm:px-5 py-2 sm:py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_35px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 flex items-center justify-between gap-2 sm:gap-4">
        {/* ========================================================================= */}
        {/* SISI KIRI: LOGO + BRAND + BADGE SIKLUS TA                                */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-full border-2 border-emerald-500/80 bg-white dark:bg-slate-950 p-0.5 shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo-ihsanul-fikri.png"
                alt="Logo SMAIT Ihsanul Fikri Magelang"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight">
                SMAIT IHSANUL FIKRI
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 hidden lg:inline">
                Kabupaten Magelang
              </span>
            </div>
          </Link>

          {/* Badge Mini Monospaced Siklus TA */}
          <span className="hidden xl:inline-flex items-center text-[10px] font-mono tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50/90 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-300/80 dark:border-emerald-500/50 font-bold shadow-xs">
            SIKLUS TA 2026/2027
          </span>
        </div>

        {/* ========================================================================= */}
        {/* TIGA TOMBOL DOCK TERINTEGRASI DI DALAM FLOAT TRANSPARAN (DI TENGAH)      */}
        {/* DENGAN EFEK 3D TIMBUL & EFEK CAHAYA TULISAN MENYALA                      */}
        {/* ========================================================================= */}
        <nav
          aria-label="Navigasi Menu Utama"
          className="relative inline-flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-slate-200/90 dark:bg-black/90 backdrop-blur-md border-2 border-emerald-500/40 dark:border-emerald-500/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08),0_4px_16px_rgba(16,185,129,0.18)] dark:shadow-[inset_0_2px_6px_rgba(0,0,0,0.9),0_0_25px_rgba(16,185,129,0.35)] transition-all duration-300"
        >
          {/* Ambient Glowing Halo di Balik Dock */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600 opacity-20 dark:opacity-40 blur-md pointer-events-none -z-10" />

          {/* 1. Tombol Beranda (Hanya Ikon - Teks Muncul Saat Kursor Mendekat) */}
          <button
            type="button"
            onClick={() => handleSwitchTab("beranda")}
            aria-label="Beranda & Visi Sekolah"
            className={cn(
              "group/btn relative inline-flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-xl transition-all duration-200 cursor-pointer active:scale-95",
              currentTab === "beranda"
                ? "bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-900 text-white font-black border-t-2 border-t-emerald-300/80 border-x border-emerald-600 border-b-[3.5px] border-b-emerald-950 -translate-y-0.5 shadow-[0_4px_0_0_#064e3b,0_8px_20px_rgba(16,185,129,0.5),0_0_18px_rgba(52,211,153,0.4)] active:translate-y-0.5 active:border-b-2 active:shadow-[0_2px_0_0_#064e3b]"
                : "bg-gradient-to-b from-white via-slate-50 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 text-slate-800 dark:text-slate-200 font-bold border-t border-t-white/90 dark:border-t-slate-700 border-x border-slate-300 dark:border-slate-800 border-b-[3px] border-b-slate-400 dark:border-b-slate-950 shadow-[0_3px_0_0_rgba(148,163,184,0.6)] dark:shadow-[0_3px_0_0_#020617] hover:-translate-y-0.5 hover:border-b-[3.5px] hover:border-b-emerald-700 dark:hover:border-b-emerald-500 hover:text-emerald-950 dark:hover:text-emerald-300 hover:shadow-[0_4px_0_0_#047857,0_6px_16px_rgba(16,185,129,0.35)] dark:hover:shadow-[0_4px_0_0_#064e3b,0_0_18px_rgba(16,185,129,0.4)] active:translate-y-0.5 active:border-b-2"
            )}
          >
            <Home
              className={cn(
                "h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0 transition-transform duration-200 group-hover/btn:scale-115",
                currentTab === "beranda"
                  ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                  : "text-emerald-700 dark:text-emerald-400"
              )}
            />

            {/* Tooltip Mengambang - Muncul Saat Kursor Mendekat */}
            <div className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 scale-90 -translate-y-1 group-hover/btn:opacity-100 group-hover/btn:scale-100 group-hover/btn:translate-y-0 group-focus-visible/btn:opacity-100 group-focus-visible/btn:scale-100 group-focus-visible/btn:translate-y-0 transition-all duration-200 ease-out z-50 whitespace-nowrap">
              <div className="relative rounded-xl border border-emerald-500/50 dark:border-emerald-400/60 bg-slate-950/95 dark:bg-black/95 text-white px-3 py-1.5 text-xs font-bold shadow-xl shadow-emerald-950/40 backdrop-blur-md flex items-center gap-1.5">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 dark:bg-black border-t border-l border-emerald-500/50 dark:border-emerald-400/60 rotate-45" />
                <span className="text-emerald-300 [text-shadow:_0_0_8px_rgba(52,211,153,0.8)]">
                  Beranda
                </span>
              </div>
            </div>
          </button>

          {/* 2. Tombol 7 Karakter KAIH (Hanya Ikon - Teks Muncul Saat Kursor Mendekat) */}
          <button
            type="button"
            onClick={() => handleSwitchTab("kaih")}
            aria-label="7 Karakter KAIH (35 Butir Refleksi)"
            className={cn(
              "group/btn relative inline-flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-xl transition-all duration-200 cursor-pointer active:scale-95",
              currentTab === "kaih"
                ? "bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-900 text-white font-black border-t-2 border-t-amber-300/80 border-x border-emerald-600 border-b-[3.5px] border-b-emerald-950 -translate-y-0.5 shadow-[0_4px_0_0_#064e3b,0_8px_20px_rgba(245,158,11,0.5),0_0_20px_rgba(251,191,36,0.5)] active:translate-y-0.5 active:border-b-2 active:shadow-[0_2px_0_0_#064e3b]"
                : "bg-gradient-to-b from-white via-slate-50 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 text-slate-800 dark:text-slate-200 font-bold border-t border-t-white/90 dark:border-t-slate-700 border-x border-slate-300 dark:border-slate-800 border-b-[3px] border-b-slate-400 dark:border-b-slate-950 shadow-[0_3px_0_0_rgba(148,163,184,0.6)] dark:shadow-[0_3px_0_0_#020617] hover:-translate-y-0.5 hover:border-b-[3.5px] hover:border-b-amber-600 dark:hover:border-b-amber-500 hover:text-amber-950 dark:hover:text-amber-300 hover:shadow-[0_4px_0_0_#b45309,0_6px_16px_rgba(245,158,11,0.35)] dark:hover:shadow-[0_4px_0_0_#78350f,0_0_18px_rgba(245,158,11,0.45)] active:translate-y-0.5 active:border-b-2"
            )}
          >
            <Sparkles
              className={cn(
                "h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0 transition-transform duration-200 group-hover/btn:scale-115",
                currentTab === "kaih"
                  ? "text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,1)] animate-pulse"
                  : "text-amber-500 dark:text-amber-400"
              )}
            />

            {/* Tooltip Mengambang - Muncul Saat Kursor Mendekat */}
            <div className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 scale-90 -translate-y-1 group-hover/btn:opacity-100 group-hover/btn:scale-100 group-hover/btn:translate-y-0 group-focus-visible/btn:opacity-100 group-focus-visible/btn:scale-100 group-focus-visible/btn:translate-y-0 transition-all duration-200 ease-out z-50 whitespace-nowrap">
              <div className="relative rounded-xl border border-amber-500/50 dark:border-amber-400/60 bg-slate-950/95 dark:bg-black/95 text-white px-3 py-1.5 text-xs font-bold shadow-xl shadow-amber-950/40 backdrop-blur-md flex items-center gap-2">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 dark:bg-black border-t border-l border-amber-500/50 dark:border-amber-400/60 rotate-45" />
                <span className="text-amber-300 [text-shadow:_0_0_8px_rgba(251,191,36,0.8)]">
                  7 Karakter KAIH
                </span>
                <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full border border-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.9)]">
                  35
                </span>
              </div>
            </div>
          </button>

          {/* 3. Tombol Profil Pembuat */}
          <button
            type="button"
            onClick={() => handleSwitchTab("profil")}
            aria-label={IS_PROFILE_LOCKED ? "Profil Tim Pembuat & Pembimbing (Ditutup Sementara)" : "Profil Tim Pembuat & Pembimbing"}
            title={IS_PROFILE_LOCKED ? "Akses profil ditutup sementara" : "Profil Tim Pembuat & Pembimbing"}
            className={cn(
              "group/btn relative inline-flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-xl transition-all duration-200 active:scale-95",
              IS_PROFILE_LOCKED
                ? "bg-slate-100 dark:bg-slate-900/80 text-slate-400 dark:text-slate-500 border border-dashed border-amber-500/50 hover:border-amber-400 shadow-xs cursor-not-allowed"
                : currentTab === "profil"
                ? "cursor-pointer bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-900 text-white font-black border-t-2 border-t-emerald-300/80 border-x border-emerald-600 border-b-[3.5px] border-b-emerald-950 -translate-y-0.5 shadow-[0_4px_0_0_#064e3b,0_8px_20px_rgba(16,185,129,0.5),0_0_18px_rgba(52,211,153,0.4)] active:translate-y-0.5 active:border-b-2 active:shadow-[0_2px_0_0_#064e3b]"
                : "cursor-pointer bg-gradient-to-b from-white via-slate-50 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 text-slate-800 dark:text-slate-200 font-bold border-t border-t-white/90 dark:border-t-slate-700 border-x border-slate-300 dark:border-slate-800 border-b-[3px] border-b-slate-400 dark:border-b-slate-950 shadow-[0_3px_0_0_rgba(148,163,184,0.6)] dark:shadow-[0_3px_0_0_#020617] hover:-translate-y-0.5 hover:border-b-[3.5px] hover:border-b-emerald-700 dark:hover:border-b-emerald-500 hover:text-emerald-950 dark:hover:text-emerald-300 hover:shadow-[0_4px_0_0_#047857,0_6px_16px_rgba(16,185,129,0.35)] dark:hover:shadow-[0_4px_0_0_#064e3b,0_0_18px_rgba(16,185,129,0.4)] active:translate-y-0.5 active:border-b-2"
            )}
          >
            <Users2
              className={cn(
                "h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0 transition-transform duration-200 group-hover/btn:scale-115",
                IS_PROFILE_LOCKED
                  ? "text-slate-400 dark:text-slate-500"
                  : currentTab === "profil"
                  ? "text-emerald-200 drop-shadow-[0_0_8px_rgba(52,211,153,1)]"
                  : "text-emerald-700 dark:text-emerald-400"
              )}
            />

            {/* Mini Lock Badge (Hanya saat profil terkunci) */}
            {IS_PROFILE_LOCKED && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-xs border border-white dark:border-black">
                <Lock className="h-2 w-2 stroke-[3]" />
              </span>
            )}

            {/* Tooltip Mengambang - Muncul Saat Kursor Mendekat */}
            <div className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 scale-90 -translate-y-1 group-hover/btn:opacity-100 group-hover/btn:scale-100 group-hover/btn:translate-y-0 group-focus-visible/btn:opacity-100 group-focus-visible/btn:scale-100 group-focus-visible/btn:translate-y-0 transition-all duration-200 ease-out z-50 whitespace-nowrap">
              {IS_PROFILE_LOCKED ? (
                <div className="relative rounded-xl border border-amber-500/50 dark:border-amber-400/60 bg-slate-950/95 dark:bg-black/95 text-white px-3 py-1.5 text-xs font-bold shadow-xl shadow-amber-950/40 backdrop-blur-md flex items-center gap-1.5">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 dark:bg-black border-t border-l border-amber-500/50 dark:border-amber-400/60 rotate-45" />
                  <Lock className="h-3 w-3 text-amber-400" />
                  <span className="text-amber-300">
                    Profil Ditutup Sementara
                  </span>
                </div>
              ) : (
                <div className="relative rounded-xl border border-emerald-500/50 dark:border-emerald-400/60 bg-slate-950/95 dark:bg-black/95 text-white px-3 py-1.5 text-xs font-bold shadow-xl shadow-emerald-950/40 backdrop-blur-md flex items-center gap-1.5">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 dark:bg-black border-t border-l border-emerald-500/50 dark:border-emerald-400/60 rotate-45" />
                  <span className="text-emerald-300 [text-shadow:_0_0_8px_rgba(52,211,153,0.8)]">
                    Profil Pembuat
                  </span>
                </div>
              )}
            </div>
          </button>
        </nav>

        {/* Floating Locked Notice Toast */}
        {lockedNotice && (
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50 border border-amber-400/80 whitespace-nowrap">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <Lock className="h-3.5 w-3.5 text-amber-400" />
            <span>Akses Profil Pembuat sedang dinonaktifkan sementara.</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SISI KANAN: THEME TOGGLE & CTA MULAI SURVEI DENGAN EFEK TIMBUL           */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <ThemeToggle />

          <Link
            href="/survei"
            aria-label="Mulai Survei Sekarang - Kuesioner Evaluasi 7 KAIH"
            title="Mulai Survei Sekarang"
            className={cn(
              "inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 text-white",
              pathname === "/survei"
                ? "bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-900 border-t-2 border-t-emerald-300/80 border-b-[3.5px] border-b-emerald-950 shadow-[0_4px_0_0_#064e3b,0_6px_16px_rgba(16,185,129,0.4)]"
                : "bg-gradient-to-b from-[#0F766E] to-[#0a524c] hover:from-[#11847c] hover:to-[#0c5d56] border-t border-t-emerald-300/60 border-b-[3.5px] border-b-emerald-950 shadow-[0_3px_0_0_#064e3b,0_4px_12px_rgba(15,118,110,0.35)] hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_#064e3b,0_8px_18px_rgba(15,118,110,0.45)] active:translate-y-0.5 active:border-b-2"
            )}
          >
            <ClipboardCheck className="h-4 w-4 shrink-0 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
            <span className="tracking-wide hidden xs:inline sm:inline [text-shadow:_0_1px_2px_rgba(0,0,0,0.8)]">
              Mulai Survei
            </span>
          </Link>
        </div>
      </header>
    </div>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}
