"use client";

import React from "react";

export function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-amber-50/20"
    >
      {/* Dynamic Animated Ambient Orbs with visible smooth fluid motion & Ihsanul Fikri colors */}
      {/* Orb 1: Forest Green (Top Left) */}
      <div className="absolute -top-[10%] -left-[5%] h-[520px] w-[520px] sm:h-[680px] sm:w-[680px] rounded-full bg-gradient-to-br from-emerald-500/40 via-emerald-600/30 to-teal-700/15 blur-[75px] animate-float-1 will-change-transform" />

      {/* Orb 2: School Gold / Warm Yellow (Top Right) */}
      <div className="absolute top-[3%] -right-[5%] h-[480px] w-[480px] sm:h-[640px] sm:w-[640px] rounded-full bg-gradient-to-bl from-amber-400/45 via-yellow-500/35 to-amber-600/20 blur-[80px] animate-float-2 will-change-transform" />

      {/* Orb 3: Fresh Emerald / Mint (Center / Bottom Left) */}
      <div className="absolute top-[40%] -left-[8%] h-[460px] w-[460px] sm:h-[600px] sm:w-[600px] rounded-full bg-gradient-to-tr from-emerald-600/35 via-teal-500/25 to-transparent blur-[70px] animate-float-3 will-change-transform" />

      {/* Orb 4: Golden Glow (Bottom Right) */}
      <div className="absolute bottom-[2%] right-[5%] h-[500px] w-[500px] sm:h-[640px] sm:w-[640px] rounded-full bg-gradient-to-tl from-amber-400/40 via-yellow-400/30 to-emerald-600/15 blur-[85px] animate-float-4 will-change-transform" />

      {/* Subtle Islamic Lattice Pattern Overlay (Geometric Motif) */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.045] mix-blend-multiply"
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
