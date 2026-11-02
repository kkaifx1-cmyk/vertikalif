"use client";

import React, { useState, useEffect } from "react";
import { Lock, ShieldAlert, CheckCircle2, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface AuthGuardProps {
  children: React.ReactNode;
  pageTitle: string;
  pageDescription: string;
}

export function AuthGuard({ children, pageTitle, pageDescription }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentMember, setCurrentMember] = useState<{ nama: string; nis: string; peran?: string } | null>(null);

  const [namaInput, setNamaInput] = useState("");
  const [nisInput, setNisInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check saved session in localStorage
    const saved = localStorage.getItem("vertikal_auth_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.nis && parsed.nama) {
          setIsAuthenticated(true);
          setCurrentMember(parsed);
          return;
        }
      } catch (e) {
        console.error("Invalid session format", e);
      }
    }
    setIsAuthenticated(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!namaInput.trim() || !nisInput.trim()) {
      setErrorMsg("Mohon masukkan Nama Pengguna dan Kunci Sandi Akses.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama: namaInput, nis: nisInput }),
      });
      const data = await res.json();

      if (data.success && data.member) {
        setIsAuthenticated(true);
        setCurrentMember(data.member);
        localStorage.setItem(
          "vertikal_auth_session",
          JSON.stringify({
            nama: data.member.nama,
            nis: data.member.nis,
            peran: data.member.peran || "Super Administrator",
          })
        );
      } else {
        setErrorMsg(data.message || "Kredensial Super Admin / Panitia tidak valid.");
      }
    } catch {
      setErrorMsg("Gagal menghubungi server verifikasi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vertikal_auth_session");
    setIsAuthenticated(false);
    setCurrentMember(null);
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div>
        {/* Top Super Admin Verified Bar */}
        <div className="border-b border-emerald-700/20 dark:border-emerald-500/50 bg-emerald-900 dark:bg-black text-white px-4 py-2 sm:px-6 shadow-xs dark:shadow-[0_0_15px_rgba(16,185,129,0.25)]">
          <div className="mx-auto flex max-w-7xl items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                Sesi Super Admin Aktif: <strong>{currentMember?.nama}</strong>
                {currentMember?.peran && (
                  <span className="hidden sm:inline text-emerald-200 font-normal"> — {currentMember.peran}</span>
                )}
              </span>
              <Badge variant="gold" className="text-[10px] ml-2 py-0">
                Super Admin Mode
              </Badge>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-300 hover:text-white hover:underline cursor-pointer transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Keluar Sesi
            </button>
          </div>
        </div>
        {children}
      </div>
    );
  }

  // Super Admin Login Screen (No demo hints, clean password field)
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <Card className="border-slate-200 dark:border-emerald-500/60 bg-white dark:bg-black/95 shadow-md dark:shadow-[0_0_30px_rgba(16,185,129,0.25)] overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-[0_20px_45px_-10px_rgba(21,128,61,0.25)] dark:hover:shadow-[0_0_40px_rgba(245,158,11,0.55)] hover:border-emerald-500 dark:hover:border-amber-400">
        <div className="h-2 bg-gradient-to-r from-emerald-800 via-amber-500 to-emerald-700" />
        <CardHeader className="text-center pt-8 pb-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-950 dark:bg-black text-amber-400 ring-8 ring-emerald-50 dark:ring-emerald-950/60 border border-transparent dark:border-emerald-500/60 shadow-sm dark:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-transform duration-300 hover:scale-105">
            <Lock className="h-6 w-6" />
          </div>
          <div className="mt-4">
            <Badge variant="gold" className="text-[10px] mb-2 uppercase tracking-wider font-bold">
              Area Khusus Terbatas
            </Badge>
            <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Autentikasi Super Admin
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Halaman {pageTitle} hanya dapat diakses oleh Administrator Sistem dan Panitia Mutu SMAIT Ihsanul Fikri.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-2">
          {errorMsg && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Nama Pengguna / Admin
              </label>
              <input
                type="text"
                value={namaInput}
                onChange={(e) => setNamaInput(e.target.value)}
                placeholder="Masukkan nama pengguna admin"
                className="w-full rounded-lg border border-slate-300 dark:border-emerald-500/50 bg-white dark:bg-black/90 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200 hover:border-emerald-500 dark:hover:border-amber-400 focus:border-emerald-600 dark:focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Kata Sandi Akses
              </label>
              <input
                type="password"
                value={nisInput}
                onChange={(e) => setNisInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-slate-300 dark:border-emerald-500/50 bg-white dark:bg-black/90 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200 hover:border-emerald-500 dark:hover:border-amber-400 focus:border-emerald-600 dark:focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-xs mt-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(21,128,61,0.35)] active:scale-95"
              disabled={isLoading}
            >
              {isLoading ? "Mengautentikasi..." : "Masuk ke Super Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
