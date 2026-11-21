"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  ClipboardCheck,
  Home,
  BookOpen,
  Users2,
  Lock,
  ShieldCheck,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isHome = pathname === "/";
  const currentTab = isHome ? searchParams.get("tab") || "beranda" : null;

  // Status Kunci Profil Pembuat: Dibuka resmi sesuai instruksi pengguna
  const IS_PROFILE_LOCKED = false;
  const [lockedNotice, setLockedNotice] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Shortcut Global: Tekan Ctrl + A (atau Cmd + A di Mac) untuk membuka portal Super Admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "a" || e.key === "A")) {
        // Jangan intercept jika sedang mengetik di input, textarea, atau elemen yang bisa diedit
        const target = e.target as HTMLElement | null;
        const isInputField =
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable);

        if (isInputField) return;

        e.preventDefault();
        router.push("/super-admin");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  // Tutup menu mobile ketika navigasi berubah
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, searchParams]);

  // Tutup menu mobile saat tombol Escape ditekan
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSwitchTab = (tab: "beranda" | "kaih" | "profil") => {
    if (tab === "profil" && IS_PROFILE_LOCKED) {
      setLockedNotice(true);
      setTimeout(() => setLockedNotice(false), 3000);
      return;
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("vertikalif_switch_tab", { detail: tab })
      );
    }
    if (isHome) {
      router.push(`/?tab=${tab}`, { scroll: false });
    } else {
      router.push(`/?tab=${tab}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* ========================================================================= */}
        {/* SISI KIRI: LOGO + IDENTITAS SEKOLAH                                       */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 group rounded-lg focus-visible:outline-2 focus-visible:outline-emerald-600 focus-visible:outline-offset-2"
          >
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-full border border-emerald-500/40 bg-white dark:bg-slate-950 p-0.5 shadow-xs transition-transform duration-200 group-hover:scale-105">
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
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
                Kabupaten Magelang
              </span>
            </div>
          </Link>

          {/* Badge Tahun Ajaran */}
          <span className="hidden xl:inline-flex items-center text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-800/80">
            TA 2026/2027
          </span>
        </div>

        {/* ========================================================================= */}
        {/* TENGAH: NAVIGASI UTAMA BERLABEL JELAS (DESKTOP)                            */}
        {/* ========================================================================= */}
        <nav
          aria-label="Navigasi Menu Utama"
          className="hidden md:flex items-center gap-1 lg:gap-1.5 text-xs lg:text-sm font-medium"
        >
          {/* 1. Beranda */}
          <button
            type="button"
            onClick={() => handleSwitchTab("beranda")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600 focus-visible:outline-offset-2",
              isHome && currentTab === "beranda"
                ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold border border-emerald-200/80 dark:border-emerald-800/80"
                : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
            )}
          >
            <Home className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Beranda</span>
          </button>

          {/* 2. 7 Karakter KAIH */}
          <button
            type="button"
            onClick={() => handleSwitchTab("kaih")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600 focus-visible:outline-offset-2",
              isHome && currentTab === "kaih"
                ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold border border-emerald-200/80 dark:border-emerald-800/80"
                : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
            )}
          >
            <BookOpen className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>7 Karakter KAIH</span>
          </button>

          {/* 3. Laporan Riset */}
          <Link
            href="/laporan"
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600 focus-visible:outline-offset-2",
              pathname === "/laporan"
                ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold border border-emerald-200/80 dark:border-emerald-800/80"
                : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
            )}
          >
            <BarChart3 className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
            <span>Laporan Riset</span>
          </Link>

          {/* 4. Profil Tim */}
          <button
            type="button"
            onClick={() => handleSwitchTab("profil")}
            disabled={IS_PROFILE_LOCKED}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600 focus-visible:outline-offset-2",
              isHome && currentTab === "profil"
                ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold border border-emerald-200/80 dark:border-emerald-800/80"
                : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60",
              IS_PROFILE_LOCKED && "opacity-60 cursor-not-allowed"
            )}
          >
            <Users2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Profil Tim</span>
            {IS_PROFILE_LOCKED && <Lock className="h-3 w-3 text-amber-500" />}
          </button>
        </nav>

        {/* Floating Locked Notice Toast */}
        {lockedNotice && (
          <div className="absolute top-18 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50 border border-amber-400 whitespace-nowrap">
            <Lock className="h-3.5 w-3.5 text-amber-400" />
            <span>Akses Profil Pembuat sedang dinonaktifkan sementara.</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SISI KANAN: THEME TOGGLE, PORTAL ADMIN & CTA UTAMA                        */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <ThemeToggle />

          {/* Akses Portal Super Admin (Diskrit & Profesional) */}
          <Link
            href="/super-admin"
            aria-label="Portal Super Admin (Shortcut Ctrl+A)"
            title="Portal Super Admin dan Manajemen Basis Data (Shortcut: Ctrl + A)"
            className={cn(
              "hidden sm:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap border focus-visible:outline-2 focus-visible:outline-emerald-600",
              pathname === "/super-admin"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-transparent shadow-xs"
                : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white border-slate-200/80 dark:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
            )}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>Admin</span>
            <kbd className="hidden lg:inline-block text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 py-0.2 rounded border border-slate-200 dark:border-slate-700">
              Ctrl+A
            </kbd>
          </Link>

          {/* CTA Utama: Mulai Survei */}
          <Link
            href="/survei"
            aria-label="Mulai Survei Sekarang: Kuesioner Evaluasi 7 KAIH"
            title="Mulai Survei Evaluasi 7 KAIH"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer whitespace-nowrap shadow-xs active:scale-95 focus-visible:outline-2 focus-visible:outline-emerald-600 focus-visible:outline-offset-2",
              pathname === "/survei"
                ? "bg-emerald-700 ring-2 ring-emerald-500/40"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/10 hover:shadow-emerald-900/20"
            )}
          >
            <ClipboardCheck className="h-4 w-4 shrink-0" />
            <span>Mulai Survei</span>
          </Link>

          {/* Tombol Hamburger Menu Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DRAWER MENU NAVIGASI MOBILE (RESPONSIF & BEBAS MISTERI)                    */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/90 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-lg px-4 pt-3 pb-5 space-y-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              handleSwitchTab("beranda");
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-left",
              isHome && currentTab === "beranda"
                ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/60"
                : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <Home className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Beranda</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              handleSwitchTab("kaih");
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-left",
              isHome && currentTab === "kaih"
                ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/60"
                : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>7 Karakter KAIH</span>
          </button>

          <Link
            href="/laporan"
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer",
              pathname === "/laporan"
                ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/60"
                : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <BarChart3 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span>Laporan Riset</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              handleSwitchTab("profil");
            }}
            disabled={IS_PROFILE_LOCKED}
            className={cn(
              "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-left",
              isHome && currentTab === "profil"
                ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/60"
                : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
              IS_PROFILE_LOCKED && "opacity-60 cursor-not-allowed"
            )}
          >
            <span className="flex items-center gap-3">
              <Users2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Profil Tim dan Pembimbing</span>
            </span>
            {IS_PROFILE_LOCKED && <Lock className="h-3.5 w-3.5 text-amber-500" />}
          </button>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <Link
              href="/super-admin"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer",
                pathname === "/super-admin"
                  ? "bg-purple-50 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300 font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <span className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span>Portal Super Admin</span>
              </span>
              <kbd className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                Ctrl+A
              </kbd>
            </Link>

            <Link
              href="/survei"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
            >
              <ClipboardCheck className="h-4 w-4" />
              <span>Mulai Survei 7 KAIH</span>
            </Link>
          </div>
        </div>
      )}
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
