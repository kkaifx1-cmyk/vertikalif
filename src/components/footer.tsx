"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Heart, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xs text-slate-600 dark:text-slate-400 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-emerald-600 bg-emerald-50 dark:bg-slate-900 p-0.5">
                <Image
                  src="/logo-ihsanul-fikri.png"
                  alt="SMAIT Ihsanul Fikri"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">SMAIT IHSANUL FIKRI</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Kabupaten Magelang, Jawa Tengah</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Platform instrumen refleksi mandiri evaluasi 7 Karakter Utama Ihsanul Fikri (7 KAIH) untuk mengukur pembiasaan ibadah, literasi riset, adab ukhuwah, dan kedisiplinan santri berbasis data objektif dan terukur.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigasi Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/?tab=beranda" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  Beranda &amp; Visi Sekolah
                </Link>
              </li>
              <li>
                <Link href="/?tab=kaih" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  7 Karakter Utama (KAIH 1 s.d. 7)
                </Link>
              </li>
              <li>
                <Link href="/?tab=profil" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  Profil Tim Pembuat &amp; Pembimbing
                </Link>
              </li>
              <li>
                <Link href="/analisis" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  Portal Analitik &amp; Visualisasi
                </Link>
              </li>
              <li>
                <Link href="/super-admin" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  Portal Super Admin (Restricted)
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Values & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Integritas &amp; Kerahasiaan
            </h4>
            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Data refleksi diri dianonimkan untuk analisis objektif pembinaan santri.</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Instrumen dirancang selaras dengan kurikulum kepesantrenan dan pembinaan asrama.</span>
              </div>
            </div>
            <div className="pt-2">
              <span className="inline-block rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Tahun Ajaran 2026/2027 • Siklus Evaluasi
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500">
          <p>© 2026 SMAIT Ihsanul Fikri Kabupaten Magelang. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            <span>Dikembangkan dengan</span>
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
            <span>oleh Tim IT Mandiri Santri &amp; Pembimbing</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
