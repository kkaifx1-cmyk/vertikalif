"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Heart, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/90 backdrop-blur-xs text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-emerald-600 bg-emerald-50 p-0.5">
                <Image
                  src="/logo-ihsanul-fikri.png"
                  alt="SMAIT Ihsanul Fikri"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">SMAIT IHSANUL FIKRI</h4>
                <p className="text-xs text-emerald-700 font-medium">Kabupaten Magelang, Jawa Tengah</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Platform instrumen survei evaluasi mutu pembelajaran, fasilitas sarana prasarana, dan pembiasaan karakter islami santri berbasis data valid dan transparan.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Navigasi Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-emerald-700 transition-colors">
                  Profil & Anggota Tim Peneliti
                </Link>
              </li>
              <li>
                <Link
                  href="/survei"
                  aria-label="Mulai Survei Sekarang - Kuesioner Evaluasi 7 KAIH"
                  title="Mulai Survei Sekarang"
                  className="font-bold text-emerald-800 hover:text-emerald-950 transition-colors inline-flex items-center gap-1"
                >
                  <span>Mulai Survei Sekarang (7 KAIH)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/kebijakan-privasi"
                  aria-label="Kebijakan Privasi & Ketentuan Agregasi Data"
                  title="Kebijakan Privasi & Ketentuan Agregasi Data"
                  className="hover:text-emerald-700 transition-colors"
                >
                  Kebijakan Privasi & Agregasi Data
                </Link>
              </li>
            </ul>
          </div>

          {/* Standard & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Integritas & Keamanan
            </h4>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>Privasi data santri dijamin sesuai UU PDP No. 27/2022 dan diproses secara agregat murni.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                <span>Seluruh 35 butir instrumen KAIH terstandar skala Likert 1–4.</span>
              </div>
              <div className="pt-1">
                <Link
                  href="/kebijakan-privasi"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                >
                  <span>Lihat Dokumen Kebijakan Privasi Legal & Teknis &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© 2026 Proyek Survei SMAIT Ihsanul Fikri Magelang. Seluruh hak cipta dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibangun dengan dedikasi <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 inline" /> untuk kemajuan pendidikan Islam terpadu
          </p>
        </div>
      </div>
    </footer>
  );
}
