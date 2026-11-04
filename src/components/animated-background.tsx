"use client";

import React from "react";

export function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden transition-colors duration-500"
    >
      {/* 1. Base Gradient Dasar (Hijau Zamrud & Kuning Emas Ihsanul Fikri) */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 via-amber-50/60 to-teal-100/40 dark:from-[#000000] dark:via-[#020b05] dark:to-[#000000]" />

      {/* 2. Pendaran Warna Hijau Zamrud (Kiri Atas) - Menyebar Halus Tanpa Bulatan & Tanpa Berputar */}
      <div className="absolute -top-[10%] -left-[10%] w-[65%] h-[65%] bg-gradient-to-br from-emerald-500/30 via-emerald-600/20 to-transparent dark:from-emerald-500/22 dark:via-emerald-700/14 dark:to-transparent blur-[120px]" />

      {/* 3. Pendaran Warna Kuning Emas (Kanan Atas) - Menyebar Halus Tanpa Bulatan & Tanpa Berputar */}
      <div className="absolute -top-[10%] -right-[10%] w-[65%] h-[65%] bg-gradient-to-bl from-amber-400/35 via-yellow-500/20 to-transparent dark:from-amber-400/18 dark:via-yellow-500/12 dark:to-transparent blur-[125px]" />

      {/* 4. Pendaran Warna Hijau Teal / Mint (Kiri Bawah) - Menyebar Halus Tanpa Bulatan */}
      <div className="absolute -bottom-[10%] -left-[10%] w-[65%] h-[65%] bg-gradient-to-tr from-teal-500/25 via-emerald-500/18 to-transparent dark:from-teal-600/16 dark:via-emerald-600/10 dark:to-transparent blur-[120px]" />

      {/* 5. Pendaran Warna Emas Berkilau (Kanan Bawah) - Menyebar Halus Tanpa Bulatan */}
      <div className="absolute -bottom-[10%] -right-[10%] w-[65%] h-[65%] bg-gradient-to-tl from-amber-400/30 via-yellow-400/18 to-transparent dark:from-amber-500/16 dark:via-yellow-600/10 dark:to-transparent blur-[130px]" />

      {/* 6. Pendaran Tengah Halus Seimbang */}
      <div className="absolute inset-x-[15%] inset-y-[20%] bg-gradient-to-r from-emerald-400/15 via-amber-300/15 to-teal-300/12 dark:from-emerald-400/10 dark:via-amber-400/8 dark:to-transparent blur-[140px]" />
    </div>
  );
}
