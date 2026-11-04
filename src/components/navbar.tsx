"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ClipboardCheck, Home, Sparkles, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isHome = pathname === "/";
  const currentTab = isHome ? (searchParams.get("tab") || "beranda") : null;

  const handleSwitchTab = (tab: "beranda" | "kaih" | "profil") => {
    if (isHome) {
      router.push(`/?tab=${tab}`, { scroll: false });
    } else {
      router.push(`/?tab=${tab}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-500/30 dark:border-emerald-500/50 bg-white/90 dark:bg-black/95 backdrop-blur-xl shadow-[0_10px_35px_-5px_rgba(16,185,129,0.18),0_2px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.8),0_0_20px_rgba(16,185,129,0.2)] transition-colors duration-300">
      {/* Decorative Glowing Top Ambient Light Strip */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-teal-500 shadow-[0_0_14px_rgba(34,197,94,0.8)]" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2">
        {/* Sisi Kiri: Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-full border-2 border-emerald-500 bg-white dark:bg-black p-0.5 shadow-[0_0_14px_rgba(16,185,129,0.35)] transition-all duration-300 group-hover:scale-110 group-hover:border-amber-400 group-hover:shadow-[0_0_24px_rgba(245,158,11,0.65)]">
            <Image
              src="/logo-ihsanul-fikri.png"
              alt="Logo SMAIT Ihsanul Fikri Magelang"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-extrabold tracking-tight text-emerald-950 dark:text-emerald-400 leading-tight group-hover:text-emerald-700 dark:group-hover:text-amber-400 transition-colors">
              SMAIT IHSANUL FIKRI
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden xs:inline">
              Kabupaten Magelang
            </span>
          </div>
        </Link>

        {/* ========================================================================= */}
        {/* DOCK CAPSULE DI TENGAH: LOGONYA DULU, PAS KURSOR MENDEKAT BARU MELEBAR     */}
        {/* ========================================================================= */}
        <nav
          aria-label="Navigasi Menu Utama"
          className="group relative inline-flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 bg-slate-100/95 dark:bg-black/95 backdrop-blur-md rounded-2xl border-2 border-emerald-400/60 dark:border-emerald-500/60 shadow-[0_6px_25px_rgba(16,185,129,0.22),inset_0_2px_4px_rgba(0,0,0,0.06)] dark:shadow-[0_0_25px_rgba(16,185,129,0.35),inset_0_2px_6px_rgba(0,0,0,0.8)] hover:border-emerald-500 dark:hover:border-amber-400 hover:shadow-[0_14px_35px_rgba(16,185,129,0.45),0_0_25px_rgba(34,197,94,0.35)] dark:hover:shadow-[0_0_40px_rgba(245,158,11,0.55),0_0_20px_rgba(16,185,129,0.4)] transition-all duration-500 ease-out cursor-pointer"
        >
          {/* Efek Pendaran Cahaya Timbul Halus di Balik Navigasi */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600 opacity-0 group-hover:opacity-35 blur-md transition-opacity duration-500 -z-10" />

          {/* 1. Tombol Beranda */}
          <button
            type="button"
            onClick={() => handleSwitchTab("beranda")}
            title="Beranda & Visi Sekolah"
            className={`relative inline-flex items-center justify-center px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer whitespace-nowrap active:scale-95 group-hover:px-4 sm:group-hover:px-5.5 ${
              currentTab === "beranda"
                ? "bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 text-white shadow-[0_8px_25px_rgba(16,185,129,0.55)] dark:shadow-[0_0_25px_rgba(16,185,129,0.8),0_0_12px_rgba(34,197,94,0.6)] ring-2 ring-emerald-400 -translate-y-0.5"
                : "text-slate-700 dark:text-slate-300 hover:text-emerald-950 dark:hover:text-amber-300 hover:bg-white dark:hover:bg-emerald-950/40 hover:shadow-[0_4px_16px_rgba(16,185,129,0.25)] dark:hover:shadow-[0_0_18px_rgba(245,158,11,0.4)] hover:ring-1 hover:ring-emerald-400/60 dark:hover:ring-amber-400/60"
            }`}
          >
            <Home className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <span className="max-w-0 opacity-0 overflow-hidden group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-400 ease-out font-bold">
              Beranda
            </span>
          </button>

          {/* 2. Tombol 7 Karakter KAIH */}
          <button
            type="button"
            onClick={() => handleSwitchTab("kaih")}
            title="7 Karakter KAIH (35 Butir Refleksi)"
            className={`relative inline-flex items-center justify-center px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer whitespace-nowrap active:scale-95 group-hover:px-4 sm:group-hover:px-5.5 ${
              currentTab === "kaih"
                ? "bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 text-white shadow-[0_8px_25px_rgba(16,185,129,0.55)] dark:shadow-[0_0_25px_rgba(16,185,129,0.8),0_0_12px_rgba(34,197,94,0.6)] ring-2 ring-emerald-400 -translate-y-0.5"
                : "text-slate-700 dark:text-slate-300 hover:text-emerald-950 dark:hover:text-amber-300 hover:bg-white dark:hover:bg-emerald-950/40 hover:shadow-[0_4px_16px_rgba(16,185,129,0.25)] dark:hover:shadow-[0_0_18px_rgba(245,158,11,0.4)] hover:ring-1 hover:ring-emerald-400/60 dark:hover:ring-amber-400/60"
            }`}
          >
            <Sparkles className="h-4 w-4 shrink-0 text-amber-400 animate-pulse transition-transform duration-300 group-hover:scale-110" />
            <span className="max-w-0 opacity-0 overflow-hidden group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-400 ease-out inline-flex items-center gap-1.5 font-bold">
              <span>7 Karakter KAIH</span>
              <span className="text-[10px] bg-emerald-800/80 dark:bg-black text-amber-300 px-2 py-0.5 rounded-full font-black border border-amber-300/40 dark:border-emerald-500/60">
                35 Butir
              </span>
            </span>
          </button>

          {/* 3. Tombol Profil Pembuat */}
          <button
            type="button"
            onClick={() => handleSwitchTab("profil")}
            title="Profil Tim Pembuat & Pembimbing"
            className={`relative inline-flex items-center justify-center px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer whitespace-nowrap active:scale-95 group-hover:px-4 sm:group-hover:px-5.5 ${
              currentTab === "profil"
                ? "bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 text-white shadow-[0_8px_25px_rgba(16,185,129,0.55)] dark:shadow-[0_0_25px_rgba(16,185,129,0.8),0_0_12px_rgba(34,197,94,0.6)] ring-2 ring-emerald-400 -translate-y-0.5"
                : "text-slate-700 dark:text-slate-300 hover:text-emerald-950 dark:hover:text-amber-300 hover:bg-white dark:hover:bg-emerald-950/40 hover:shadow-[0_4px_16px_rgba(16,185,129,0.25)] dark:hover:shadow-[0_0_18px_rgba(245,158,11,0.4)] hover:ring-1 hover:ring-emerald-400/60 dark:hover:ring-amber-400/60"
            }`}
          >
            <Users2 className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
            <span className="max-w-0 opacity-0 overflow-hidden group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-400 ease-out font-bold">
              Profil Pembuat
            </span>
          </button>
        </nav>

        {/* Sisi Kanan: Action Controls: Theme Toggle & Mulai Survei CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle />

          <Link
            href="/survei"
            aria-label="Mulai Survei Sekarang - Kuesioner Evaluasi 7 KAIH"
            title="Mulai Survei Sekarang"
            className={cn(
              "inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer border active:scale-95 whitespace-nowrap",
              pathname === "/survei"
                ? "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-amber-300 shadow-[0_8px_25px_rgba(245,158,11,0.6),0_0_20px_rgba(251,191,36,0.5)] ring-3 ring-amber-300/80 -translate-y-1 scale-105"
                : "bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 border-amber-300/90 shadow-[0_6px_22px_rgba(245,158,11,0.5),0_0_16px_rgba(251,191,36,0.45)] hover:shadow-[0_12px_32px_rgba(245,158,11,0.75),0_0_24px_rgba(251,191,36,0.6)] hover:-translate-y-1 hover:scale-105"
            )}
          >
            <ClipboardCheck className="h-4 w-4 text-slate-950" />
            <span className="tracking-wide hidden xs:inline sm:inline">Mulai Survei</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}
