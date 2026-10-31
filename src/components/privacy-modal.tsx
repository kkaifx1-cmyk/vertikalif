"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Scale,
  Binary,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  EyeOff,
  X,
} from "lucide-react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Backdrop click dismiss */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Box */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-emerald-300 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header Banner */}
        <div className="flex items-center justify-between border-b border-emerald-100 bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-950 px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-slate-950 shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 id="privacy-modal-title" className="text-base font-extrabold text-white leading-tight">
                Kebijakan Privasi & Ketentuan Agregasi Data
              </h2>
              <p className="text-[11px] text-emerald-200 font-medium">
                Standar Hukum UU PDP & Protokol Teknis No-Individual Tracking
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela kebijakan privasi"
            className="rounded-lg p-1.5 text-emerald-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {/* Quick Highlight Box */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-950 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-900">
                Jaminan Perlindungan Data Santri
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5 leading-snug">
                Data evaluasi 7 KAIH (35 butir) diproses secara <strong>agregat kolektif</strong>. Hasil survei digunakan semata-mata untuk penyempurnaan fasilitas dan kurikulum sekolah, <strong>bukan untuk melacak, memberi sanksi, atau memberi nilai rapor individu santri</strong>.
              </p>
            </div>
          </div>

          {/* Section 1: Landasan Hukum & Regulasi */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <Scale className="h-4 w-4 text-emerald-700" />
              <span>1. Landasan Hukum & Kepatuhan Etika</span>
            </div>
            <p className="text-xs text-slate-600 pl-6 leading-relaxed">
              Platform survei mutu SMAIT Ihsanul Fikri tunduk pada <strong>UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)</strong> serta kode etik penelitian internal sekolah berasrama. Pengumpulan data berlandaskan prinsip pemrosesan yang sah, transparan, dan dibatasi hanya untuk tujuan evaluasi pendidikan yang terukur.
            </p>
          </div>

          {/* Section 2: Penjelasan Teknis Agregasi Data */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <Binary className="h-4 w-4 text-emerald-700" />
              <span>2. Penjelasan Teknis Agregasi Data (No-Individual Tracking)</span>
            </div>
            <div className="pl-6 space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                Secara arsitektural dan algoritmis, sistem menerapkan prinsip <em>Differential Anonymity & Group Metric</em>:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>
                  <strong>Agregasi Statistik:</strong> Setiap butir jawaban dihitung rata-rata skornya (Mean Index) berdasarkan kelompok kelas/rombel dan dimensi KAIH.
                </li>
                <li>
                  <strong>Tanpa Dashboard Pelacakan Publik:</strong> Tidak ada antarmuka pencarian profil santri untuk umum. Jawaban perseorangan tidak dapat diakses oleh sesama santri maupun pihak luar.
                </li>
                <li>
                  <strong>Pencegahan Bias Subjektif:</strong> Hasil penilaian santri tidak berpengaruh terhadap catatan pelanggaran disiplin atau penilaian akademik perorangan.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Protokol Keamanan & Enkripsi */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <Lock className="h-4 w-4 text-emerald-700" />
              <span>3. Protokol Keamanan & Enkripsi Infrastruktur</span>
            </div>
            <div className="pl-6 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-800 shrink-0">• Enkripsi In-Transit:</span>
                <span>Seluruh jalur komunikasi data diamankan protokol HTTPS dengan enkripsi TLS 1.3 standar industri 256-bit.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-800 shrink-0">• Enkripsi At-Rest:</span>
                <span>Basis data PostgreSQL Supabase terlindungi mekanisme <em>Row Level Security (RLS)</em> terisolasi.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-800 shrink-0">• Akses Terotentikasi:</span>
                <span>Hanya panitia terdaftar dalam daftar putih (whitelist) yang dapat mengakses portal analisis agregat.</span>
              </div>
            </div>
          </div>

          {/* Section 4: Hak Responden Santri */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <UserCheck className="h-4 w-4 text-emerald-700" />
              <span>4. Hak Asasi Santri Selaku Responden</span>
            </div>
            <p className="text-xs text-slate-600 pl-6 leading-relaxed">
              Setiap santri berhak atas kejujuran dan kerahasiaan pendapat. Pengisian kuesioner dilandasi asas sukarela dan kejujuran nurani demi perbaikan mutu bersama, sebagaimana sabda Rasulullah SAW mengenai pentingnya kejujuran dan saling menasihati dalam kebaikan.
            </p>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-slate-100 bg-slate-50/80 px-5 py-3.5">
          <Link
            href="/kebijakan-privasi"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
          >
            <span>Baca Dokumen Kebijakan Lengkap</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Saya Memahami & Setuju
          </button>
        </div>
      </div>
    </div>
  );
}
