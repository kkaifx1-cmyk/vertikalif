"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-500/30 dark:border-emerald-500/50 bg-white/90 dark:bg-black/95 backdrop-blur-xl shadow-[0_10px_35px_-5px_rgba(16,185,129,0.18),0_2px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.8),0_0_20px_rgba(16,185,129,0.2)] transition-colors duration-300">
      {/* Decorative Glowing Top Ambient Light Strip */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-teal-500 shadow-[0_0_14px_rgba(34,197,94,0.8)]" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo dengan Efek Timbul & Cahaya Berpendar */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-emerald-500 bg-white dark:bg-black p-0.5 shadow-[0_0_14px_rgba(16,185,129,0.35)] transition-all duration-300 group-hover:scale-110 group-hover:border-amber-400 group-hover:shadow-[0_0_24px_rgba(245,158,11,0.65)]">
            <Image
              src="/logo-ihsanul-fikri.png"
              alt="Logo SMAIT Ihsanul Fikri Magelang"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-tight text-emerald-950 dark:text-emerald-400 sm:text-base leading-tight group-hover:text-emerald-700 dark:group-hover:text-amber-400 transition-colors">
              SMAIT IHSANUL FIKRI
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Kabupaten Magelang
            </span>
          </div>
        </Link>

        {/* Action Controls: Theme Toggle & Mulai Survei CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />

          <Link
            href="/survei"
            aria-label="Mulai Survei Sekarang - Kuesioner Evaluasi 7 KAIH"
            title="Mulai Survei Sekarang"
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer border active:scale-95",
              pathname === "/survei"
                ? "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-amber-300 shadow-[0_8px_25px_rgba(245,158,11,0.6),0_0_20px_rgba(251,191,36,0.5)] ring-3 ring-amber-300/80 -translate-y-1 scale-105"
                : "bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 border-amber-300/90 shadow-[0_6px_22px_rgba(245,158,11,0.5),0_0_16px_rgba(251,191,36,0.45)] hover:shadow-[0_12px_32px_rgba(245,158,11,0.75),0_0_24px_rgba(251,191,36,0.6)] hover:-translate-y-1 hover:scale-105"
            )}
          >
            <ClipboardCheck className="h-4 w-4 text-slate-950" />
            <span className="tracking-wide">Mulai Survei</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
