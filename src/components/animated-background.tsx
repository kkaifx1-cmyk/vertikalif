"use client";

import React from "react";

export function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-gradient-to-tr from-emerald-100/50 via-amber-50/60 to-teal-100/40 animate-gradient-flow"
    >
      {/* Dynamic Animated Ambient Orbs with visible smooth fluid motion & Ihsanul Fikri colors */}
      {/* Orb 1: Forest Green (Top Left) */}
      <div className="absolute -top-[12%] -left-[8%] h-[560px] w-[560px] sm:h-[720px] sm:w-[720px] rounded-full bg-gradient-to-br from-emerald-500/45 via-emerald-600/35 to-teal-700/20 blur-[80px] animate-float-1 will-change-transform" />

      {/* Orb 2: School Gold / Warm Yellow (Top Right) */}
      <div className="absolute top-[2%] -right-[8%] h-[520px] w-[520px] sm:h-[680px] sm:w-[680px] rounded-full bg-gradient-to-bl from-amber-400/50 via-yellow-500/40 to-amber-600/25 blur-[85px] animate-float-2 will-change-transform" />

      {/* Orb 3: Fresh Emerald / Mint (Center / Bottom Left) */}
      <div className="absolute top-[35%] -left-[10%] h-[500px] w-[500px] sm:h-[640px] sm:w-[640px] rounded-full bg-gradient-to-tr from-emerald-500/40 via-teal-400/30 to-emerald-700/15 blur-[75px] animate-float-3 will-change-transform" />

      {/* Orb 4: Golden Glow (Bottom Right) */}
      <div className="absolute bottom-[0%] right-[3%] h-[540px] w-[540px] sm:h-[700px] sm:w-[700px] rounded-full bg-gradient-to-tl from-amber-400/45 via-yellow-400/35 to-emerald-600/20 blur-[90px] animate-float-4 will-change-transform" />

      {/* Orb 5: Center Ambient Pulse (Tengah Mengalir) */}
      <div className="absolute top-[25%] left-[25%] h-[400px] w-[400px] sm:h-[550px] sm:w-[550px] rounded-full bg-gradient-to-r from-emerald-400/25 via-amber-300/25 to-teal-300/20 blur-[100px] animate-float-5 will-change-transform" />

      {/* Subtle Islamic Lattice Pattern Overlay (Geometric Motif) with gentle drift */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.055] mix-blend-multiply animate-wave-drift"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="islamic-grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M24 0 L48 24 L24 48 L0 24 Z"
              fill="none"
              stroke="#0f172a"
              strokeWidth="0.8"
            />
            <circle cx="24" cy="24" r="3" fill="#15803d" />
            <path
              d="M0 0 L24 24 L48 0 M0 48 L24 24 L48 48"
              fill="none"
              stroke="#ca8a04"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-grid)" />
      </svg>
    </div>
  );
}
