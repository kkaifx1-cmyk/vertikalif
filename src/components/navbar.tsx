"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Users, ClipboardCheck, Sparkles, Home } from "lucide-react";
import { cn } from "@/lib/utils";

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "beranda";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-500/30 bg-white/90 backdrop-blur-xl shadow-[0_10px_35px_-5px_rgba(16,185,129,0.18),0_2px_10px_rgba(0,0,0,0.06)]">
      {/* Decorative Glowing Top Ambient Light Strip */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-teal-500 shadow-[0_0_14px_rgba(34,197,94,0.8)]" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo dengan Efek Timbul & Cahaya Berpendar */}
        <Link href="/?tab=beranda" className="flex items-center gap-3 group">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-emerald-500 bg-white p-0.5 shadow-[0_0_14px_rgba(16,185,129,0.35)] transition-all duration-300 group-hover:scale-110 group-hover:border-amber-400 group-hover:shadow-[0_0_24px_rgba(245,158,11,0.65)]">
            <Image
              src="/logo-ihsanul-fikri.png"
              alt="Logo SMAIT Ihsanul Fikri Magelang"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-tight text-emerald-950 sm:text-base leading-tight group-hover:text-emerald-700 transition-colors">
              SMAIT IHSANUL FIKRI
            </span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Kabupaten Magelang
            </span>
          </div>
        </Link>

        {/* Navigation & CTA dengan Efek Timbul & Cahaya */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/?tab=beranda"
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer",
              pathname === "/" && currentTab === "beranda"
                ? "bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 text-white shadow-[0_6px_18px_rgba(16,185,129,0.5),0_0_12px_rgba(34,197,94,0.35)] ring-2 ring-emerald-400/80 -translate-y-0.5 scale-102"
                : "text-slate-600 hover:text-emerald-950 hover:bg-white hover:shadow-[0_8px_20px_rgba(16,185,129,0.25),0_0_10px_rgba(250,204,21,0.2)] hover:ring-1 hover:ring-emerald-400/60 hover:-translate-y-1 active:scale-95"
            )}
          >
            <Home className={cn("h-4 w-4", pathname === "/" && currentTab === "beranda" ? "text-amber-300" : "text-emerald-600")} />
            <span>Beranda</span>
          </Link>

          <Link
            href="/?tab=kaih"
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer",
              pathname === "/" && currentTab === "kaih"
                ? "bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 text-white shadow-[0_6px_18px_rgba(16,185,129,0.5),0_0_12px_rgba(34,197,94,0.35)] ring-2 ring-emerald-400/80 -translate-y-0.5 scale-102"
                : "text-slate-600 hover:text-emerald-950 hover:bg-white hover:shadow-[0_8px_20px_rgba(16,185,129,0.25),0_0_10px_rgba(250,204,21,0.2)] hover:ring-1 hover:ring-emerald-400/60 hover:-translate-y-1 active:scale-95"
            )}
          >
            <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
            <span>7 Karakter KAIH</span>
          </Link>

          <Link
            href="/?tab=profil"
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer",
              pathname === "/" && currentTab === "profil"
                ? "bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 text-white shadow-[0_6px_18px_rgba(16,185,129,0.5),0_0_12px_rgba(34,197,94,0.35)] ring-2 ring-emerald-400/80 -translate-y-0.5 scale-102"
                : "text-slate-600 hover:text-emerald-950 hover:bg-white hover:shadow-[0_8px_20px_rgba(16,185,129,0.25),0_0_10px_rgba(250,204,21,0.2)] hover:ring-1 hover:ring-emerald-400/60 hover:-translate-y-1 active:scale-95"
            )}
          >
            <Users className={cn("h-4 w-4", pathname === "/" && currentTab === "profil" ? "text-amber-300" : "text-emerald-600")} />
            <span>Profil Pembuat</span>
          </Link>

          {/* Standout CTA Button to /survei dengan Cahaya Emas Timbul Menyilaukan */}
          <Link
            href="/survei"
            aria-label="Mulai Survei Sekarang - Kuesioner Evaluasi 7 KAIH"
            title="Mulai Survei Sekarang"
            className={cn(
              "inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer border active:scale-95",
              pathname === "/survei"
                ? "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-amber-300 shadow-[0_8px_25px_rgba(245,158,11,0.6),0_0_20px_rgba(251,191,36,0.5)] ring-3 ring-amber-300/80 -translate-y-1 scale-105"
                : "bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 border-amber-300/90 shadow-[0_6px_22px_rgba(245,158,11,0.5),0_0_16px_rgba(251,191,36,0.45)] hover:shadow-[0_12px_32px_rgba(245,158,11,0.75),0_0_24px_rgba(251,191,36,0.6)] hover:-translate-y-1 hover:scale-105"
            )}
          >
            <ClipboardCheck className="h-4 w-4 text-slate-950" />
            <span className="tracking-wide">Mulai Survei</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 w-full border-b border-emerald-500/30 bg-white/95 backdrop-blur-md h-16" />
    }>
      <NavbarContent />
    </Suspense>
  );
}
