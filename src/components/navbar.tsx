"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Users, ClipboardCheck, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-emerald-600 bg-emerald-50 p-0.5 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(21,128,61,0.4)]">
            <Image
              src="/logo-ihsanul-fikri.png"
              alt="Logo SMAIT Ihsanul Fikri Magelang"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-emerald-950 sm:text-base leading-tight">
              SMAIT IHSANUL FIKRI
            </span>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Kabupaten Magelang
            </span>
          </div>
        </Link>

        {/* Navigation & CTA */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className={cn(
              "hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-200",
              pathname === "/"
                ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <Users className="h-4 w-4 text-emerald-700" />
            <span>Profil Tim</span>
          </Link>

          <Link
            href="/kebijakan-privasi"
            aria-label="Kebijakan Privasi & Agregasi Data"
            title="Kebijakan Privasi & Agregasi Data"
            className={cn(
              "hidden md:flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-200",
              pathname === "/kebijakan-privasi"
                ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>Kebijakan Privasi</span>
          </Link>

          {/* Standout CTA Button to /survei */}
          <Link
            href="/survei"
            aria-label="Mulai Survei Sekarang - Kuesioner Evaluasi 7 KAIH"
            title="Mulai Survei Sekarang"
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 sm:px-4.5 sm:py-2.5 text-xs sm:text-sm font-extrabold transition-all duration-300 shadow-sm cursor-pointer border",
              pathname === "/survei"
                ? "bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 text-slate-950 border-amber-500 shadow-[0_6px_18px_rgba(245,158,11,0.45)] ring-2 ring-amber-300 -translate-y-0.5 scale-102"
                : "bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-600 shadow-[0_4px_14px_rgba(21,128,61,0.35)] hover:shadow-[0_8px_20px_rgba(21,128,61,0.45)] hover:-translate-y-0.5 active:translate-y-0"
            )}
          >
            <ClipboardCheck className={cn("h-4 w-4", pathname === "/survei" ? "text-slate-950" : "text-amber-300")} />
            <span className="tracking-wide">Mulai Survei Sekarang</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
