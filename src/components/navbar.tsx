"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Users } from "lucide-react";
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

        {/* Navigation - Profil Tim Saja, tombol survei atas dan pojok kanan atas dihilangkan */}
        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200",
              pathname === "/"
                ? "bg-emerald-700 text-white shadow-xs font-semibold shadow-[0_4px_12px_rgba(21,128,61,0.35)]"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:-translate-y-0.5 hover:shadow-xs"
            )}
          >
            <Users className={cn("h-4 w-4", pathname === "/" ? "text-amber-300" : "text-slate-500")} />
            Profil Tim
          </Link>
        </nav>
      </div>
    </header>
  );
}
