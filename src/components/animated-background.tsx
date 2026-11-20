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

      {/* 2. Pendaran Warna Halus menggunakan Radial Gradient Asli (Zero Blur Rasterization = 120 FPS Ultra Responsif) */}
      <div
        className="absolute inset-0 opacity-85 dark:opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 8%, rgba(16, 185, 129, 0.28) 0%, transparent 45%),
            radial-gradient(circle at 90% 10%, rgba(245, 158, 11, 0.28) 0%, transparent 45%),
            radial-gradient(circle at 12% 90%, rgba(20, 184, 166, 0.24) 0%, transparent 45%),
            radial-gradient(circle at 88% 88%, rgba(245, 158, 11, 0.24) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.12) 0%, transparent 55%)
          `,
        }}
      />
    </div>
  );
}
