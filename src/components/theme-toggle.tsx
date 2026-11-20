"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Laptop, ChevronDown } from "lucide-react";
import { useTheme } from "./theme-provider";

interface ThemeToggleProps {
  variant?: "pill" | "icon" | "dropdown";
  className?: string;
}

export function ThemeToggle({ variant = "icon", className = "" }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Segmented Pill Variant (Perfect for Home tab bar & Hero)
  if (variant === "pill") {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-2xl border border-emerald-400/50 dark:border-emerald-500/60 bg-white/90 dark:bg-black/95 shadow-[0_4px_16px_rgba(16,185,129,0.12)] dark:shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:dark:border-amber-400 hover:dark:shadow-[0_0_25px_rgba(245,158,11,0.45)] backdrop-blur-md transition-all duration-300 ${className}`}
        role="group"
        aria-label="Pilihan Mode Tampilan Terang atau Gelap"
      >
        <button
          type="button"
          onClick={() => setTheme("light")}
          aria-label="Aktifkan Mode Terang (Light Mode)"
          title="Mode Terang"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer active:scale-95 ${
            resolvedTheme === "light"
              ? "bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.5),0_0_12px_rgba(251,191,36,0.35)] ring-1 ring-amber-300 -translate-y-0.5 scale-102"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-amber-300 hover:bg-slate-100/60 dark:hover:bg-emerald-950/40"
          }`}
        >
          <Sun className={`h-3.5 w-3.5 ${resolvedTheme === "light" ? "text-slate-950 fill-amber-500/40" : "text-amber-500"}`} />
          <span>Terang</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          aria-label="Aktifkan Mode Gelap (Dark Mode)"
          title="Mode Gelap"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer active:scale-95 ${
            resolvedTheme === "dark"
              ? "bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-[0_0_20px_rgba(16,185,129,0.7),0_0_10px_rgba(34,197,94,0.5)] ring-1 ring-emerald-400 -translate-y-0.5 scale-102"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-emerald-300 hover:bg-slate-100/60 dark:hover:bg-emerald-950/40"
          }`}
        >
          <Moon className={`h-3.5 w-3.5 ${resolvedTheme === "dark" ? "text-amber-300 fill-amber-300/40" : "text-slate-400"}`} />
          <span>Gelap</span>
        </button>
      </div>
    );
  }

  // Dropdown Variant
  if (variant === "dropdown") {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Pilih Tema Tampilan"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-emerald-500/60 bg-white/90 dark:bg-black/95 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs dark:shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:border-emerald-500 dark:hover:border-amber-400 hover:text-emerald-700 dark:hover:text-amber-400 dark:hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all duration-200 cursor-pointer active:scale-95"
        >
          {resolvedTheme === "dark" ? (
            <Moon className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
          ) : (
            <Sun className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20" />
          )}
          <span className="capitalize">
            {theme === "system" ? "Sistem" : theme === "dark" ? "Gelap" : "Terang"}
          </span>
          <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-200 dark:border-emerald-500/60 bg-white dark:bg-black/95 p-1.5 shadow-xl dark:shadow-[0_0_25px_rgba(16,185,129,0.35)] ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => {
                setTheme("light");
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                theme === "light"
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40 dark:hover:text-amber-300"
              }`}
            >
              <Sun className="h-3.5 w-3.5 text-amber-500" />
              <span>Terang (Light)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTheme("dark");
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                theme === "dark"
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
              }`}
            >
              <Moon className="h-3.5 w-3.5 text-amber-400" />
              <span>Gelap (Dark)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTheme("system");
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                theme === "system"
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40"
              }`}
            >
              <Laptop className="h-3.5 w-3.5 text-blue-500" />
              <span>Otomatis OS</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default Icon Button with Smooth 3D Hover & Glow
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={resolvedTheme === "dark" ? "Ganti ke Mode Terang (Light Theme)" : "Ganti ke Mode Gelap (Dark Theme)"}
      title={resolvedTheme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
      className={`relative inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 dark:border-emerald-500/60 bg-white/80 dark:bg-black/90 backdrop-blur-md text-slate-700 dark:text-slate-200 shadow-xs dark:shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:border-emerald-500 dark:hover:border-amber-400 hover:shadow-md dark:hover:shadow-[0_0_25px_rgba(245,158,11,0.55)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden ${className}`}
    >
      <Sun
        className={`h-4 w-4 text-amber-500 transition-all duration-300 transform ${
          resolvedTheme === "dark"
            ? "-rotate-90 scale-0 opacity-0 absolute"
            : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <Moon
        className={`h-4 w-4 text-amber-400 transition-all duration-300 transform ${
          resolvedTheme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0 absolute"
        }`}
      />
    </button>
  );
}
