import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Lock,
  Scale,
  Binary,
  UserCheck,
  CheckCircle2,
  FileText,
  ClipboardCheck,
  Database,
  EyeOff,
  Sparkles,
  Server,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Kebijakan Privasi & Ketentuan Agregasi Data | SMAIT Ihsanul Fikri",
  description:
    "Standar legalitas perlindungan data pribadi dan protokol teknis agregasi data kuesioner mutu santri SMAIT Ihsanul Fikri Magelang.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-transparent py-10 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Beranda
          </Link>
          <Badge variant="gold" className="text-xs font-bold">
            Standar Inovasi IT & Etika Penelitian
          </Badge>
        </div>

        {/* Page Hero Header */}
        <div className="space-y-3 border-b border-slate-200/80 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/80 px-3.5 py-1 text-xs font-bold text-emerald-900 shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>Kepatuhan UU No. 27 Tahun 2022 (UU PDP)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Kebijakan Privasi & Protokol Teknis Agregasi Data
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            Dokumen resmi yang menjamin perlindungan privasi santri, transparansi metodologi penelitian, serta penjelasan teknis mengenai pengolahan data tanpa pelacakan perorangan pada platform survei mutu SMAIT Ihsanul Fikri Magelang.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/survei"
              aria-label="Mulai Survei Sekarang - Kuesioner 7 KAIH"
              title="Mulai Survei Sekarang"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(21,128,61,0.35)] transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <ClipboardCheck className="h-4 w-4 text-amber-300" />
              <span>Mulai Survei Sekarang</span>
              <ArrowRight className="h-4 w-4 text-amber-300" />
            </Link>
            <span className="text-xs text-slate-400">
              Terakhir diperbarui: 31 Oktober 2026 • Versi Instrumen 2.1
            </span>
          </div>
        </div>

        {/* Ringkasan Eksekutif (Card Timbul 3D) */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 h-44 w-44 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Award className="h-4 w-4" />
              <span>Prinsip Utama Perlindungan Responden</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-100">
              Data Diolah untuk Peningkatan Mutu Sekolah, Bukan Pelabelan Individu
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
              Platform kuesioner ini dirancang dengan komitmen etis tertinggi: setiap butir respon yang dimasukkan santri dihitung secara <strong>kolektif/agregat</strong>. Sistem tidak menyajikan profil individu kepada pihak umum, dewan guru, maupun sesama santri. Tidak ada konsekuensi nilai rapor, sanksi asrama, atau hukuman atas jawaban yang diberikan secara jujur.
            </p>
          </div>
        </div>

        {/* Rincian Pasal & Standar Teknis */}
        <div className="space-y-6">
          {/* Bab 1: Landasan Hukum & Etika Penelitian */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-emerald-400 hover:shadow-md space-y-3">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Pasal 1: Landasan Hukum & Kepatuhan Etika
                </h3>
                <p className="text-xs text-slate-500">Legalitas perlindungan data dalam ekosistem pendidikan</p>
              </div>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Platform ini beroperasi dengan mematuhi ketentuan perundang-undangan Republik Indonesia yang berlaku, antara lain:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>
                  <strong>Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP):</strong> Mengatur bahwa pemrosesan data pribadi wajib memiliki dasar hukum yang sah, dilaksanakan secara transparan, serta dibatasi sesuai dengan tujuan pengumpulan data.
                </li>
                <li>
                  <strong>Permendikbudristek Standar Penjaminan Mutu Pendidikan:</strong> Mengharuskan evaluasi berkala yang melibatkan suara peserta didik secara objektif, inklusif, dan bebas intimidasi.
                </li>
                <li>
                  <strong>Kode Etik Akademik SMAIT Ihsanul Fikri Magelang:</strong> Menjamin kebebasan berekspresi santri dalam kerangka adab islami untuk tujuan <em>islah</em> (perbaikan berkelanjutan).
                </li>
              </ul>
            </div>
          </div>

          {/* Bab 2: Penjelasan Teknis Agregasi Data (Mathematical & Algorithmic Formulation) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-emerald-400 hover:shadow-md space-y-3">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-900">
                <Binary className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Pasal 2: Penjelasan Teknis Agregasi Data (No-Individual Tracking)
                </h3>
                <p className="text-xs text-slate-500">Metodologi statistik dan ketiadaan pelacakan perorangan</p>
              </div>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Guna menjamin bahwa tidak ada pelacakan perorangan (<em>individual profiling</em>), sistem menerapkan algoritma agregasi data sebagai berikut:
              </p>

              {/* Formula Callout */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Formula Agregasi Rata-rata Dimensi (Mean Aggregation Formula):
                </div>
                <div className="font-mono text-xs sm:text-sm text-emerald-950 bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs">
                  {"$$\\bar{X}_{\\text{dimensi}} = \\frac{1}{N \\cdot M} \\sum_{i=1}^{N} \\sum_{j=1}^{M} S_{i,j}$$"}
                  <div className="text-[11px] text-slate-600 mt-2 font-sans leading-snug">
                    Keterangan: N adalah jumlah responden kelompok, M adalah jumlah butir pada dimensi KAIH terkait, dan S(i,j) adalah skor skala Likert (1–4) butir ke-j dari santri ke-i.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <EyeOff className="h-4 w-4 text-emerald-700" />
                    <span>Prinsip K-Anonymity</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Hasil analitik hanya ditampilkan pada level kohort/kelompok (misal: Rombel X, Angkatan XI, Seluruh Santri), sehingga tidak ada satu pun grafik yang merepresentasikan opini personal satu santri saja.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <Database className="h-4 w-4 text-amber-700" />
                    <span>Isolasi Antarmuka Publik</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Situs publik hanya menampilkan profil penelitian dan form kuesioner. Rincian data mentah disimpan secara terenkripsi dan hanya dapat diakses melalui portal Super Admin terotentikasi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bab 3: Protokol Keamanan & Enkripsi Sistem */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-emerald-400 hover:shadow-md space-y-3">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-900">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Pasal 3: Protokol Keamanan, Enkripsi & Akses Bertingkat
                </h3>
                <p className="text-xs text-slate-500">Standar rekayasa perangkat lunak dan arsitektur database</p>
              </div>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Sistem mengadopsi standar pengamanan data berlapis (<em>Defense in Depth</em>):
              </p>
              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <Server className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Enkripsi Data in-Transit (TLS 1.3)</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Seluruh komunikasi antara browser santri dan server dienkripsi menggunakan protokol HTTPS dengan cipher TLS 1.3 256-bit AES untuk mencegah penyadapan paket jaringan (<em>Man-in-the-Middle Attack</em>).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <Database className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Penyimpanan At-Rest & Row Level Security (RLS)</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Basis data PostgreSQL pada infrastruktur Supabase dilindungi oleh aturan <em>Row Level Security</em> (RLS). Akses publik dibatasi hanya untuk operasi INSERT terotentikasi, tanpa hak akses pengubahan publik (UPDATE/DELETE).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <UserCheck className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Akses Administratif Terbatas (Whitelisted RBAC)</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Portal Super Admin dilindungi sistem otentikasi ketat berbasis whitelist panitia peneliti resmi (NIS terdaftar) dan bypass master admin terenkripsi, mencegah akses dari pihak tidak berwenang.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bab 4: Prinsip Minimasi Data & Ketiadaan Monetisasi */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-emerald-400 hover:shadow-md space-y-3">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Pasal 4: Prinsip Minimasi Data & Bebas Komersialisasi
                </h3>
                <p className="text-xs text-slate-500">Integritas nirlaba penelitian pendidikan</p>
              </div>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li>
                  <strong>Minimasi Data (Data Minimization):</strong> Platform hanya mencatat parameter identitas esensial (Tingkat Kelas, Nomor Rombel, Peminatan Program) serta skor 35 butir instrumen KAIH. Tidak ada pengumpulan data sensitif seperti biometrik, keuangan, kontak keluarga, atau nomor telepon.
                </li>
                <li>
                  <strong>Bebas Tracker Pihak Ketiga:</strong> Sistem tidak menyematkan tracker komersial, Meta Pixel, script iklan, maupun cookie pelacak lintas situs.
                </li>
                <li>
                  <strong>Ketiadaan Monetisasi:</strong> Seluruh data yang dihimpun murni untuk kepentingan pengembangan kurikulum, fasilitas fisik, dan pembinaan karakter di SMAIT Ihsanul Fikri Magelang.
                </li>
              </ul>
            </div>
          </div>

          {/* Bab 5: Hak-Hak Santri Selaku Responden */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-emerald-400 hover:shadow-md space-y-3">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-900">
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Pasal 5: Hak-Hak Santri Selaku Responden
                </h3>
                <p className="text-xs text-slate-500">Jaminan hak asasi dan hak privasi subjek data</p>
              </div>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1">
                  <div className="font-bold text-xs text-purple-900">1. Hak Transparansi</div>
                  <p className="text-xs text-slate-600">
                    Santri berhak mengetahui tujuan penelitian dan instrumen 7 KAIH sebelum mengisi formulir.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1">
                  <div className="font-bold text-xs text-purple-900">2. Hak Kerahasiaan Penuh</div>
                  <p className="text-xs text-slate-600">
                    Penilaian subjektif santri dijamin terlindungi dari intimidasi atau intervensi pihak mana pun.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1">
                  <div className="font-bold text-xs text-purple-900">3. Hak Koreksi & Reset</div>
                  <p className="text-xs text-slate-600">
                    Data uji coba dapat direset sewaktu-waktu oleh panitia penjamin mutu jika terjadi kesalahan input.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bab 6: Narahubung & Tim Peneliti */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Pasal 6: Narahubung & Komite Penjamin Mutu
                </h3>
                <p className="text-xs text-slate-500">Lembaga pengawas dan koordinator proyek</p>
              </div>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Apabila santri, wali santri, guru, atau dewan juri evaluasi kompetisi memiliki pertanyaan mengenai etika penelitian dan kebijakan privasi ini, silakan menghubungi:
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1.5 text-xs text-slate-700">
                <p><strong>Lembaga:</strong> Tim Proyek Inovasi VERTIKALIF — SMAIT Ihsanul Fikri Magelang</p>
                <p><strong>Alamat:</strong> Jl. Pabelan I, Pabelan, Mungkid, Kabupaten Magelang, Jawa Tengah 56512</p>
                <p><strong>Koordinator Proyek:</strong> Naufal Abyan Maulana (Project Lead) & Tim Peneliti</p>
                <p><strong>Pembimbing:</strong> Ust. Rizal Hanifa Pratama, M.Kom & Ust. Taufan Maulana Haris, S.Pd.I</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-50 via-emerald-100/60 to-amber-50/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-slate-950">
              Siap Berpartisipasi dalam Evaluasi Mutu Sekolah?
            </h3>
            <p className="text-xs text-slate-600">
              Isi kuesioner 7 Karakter Utama Ihsanul Fikri (KAIH) dengan tenang dan jujur. Privasi Anda terjaga penuh.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Link
              href="/"
              className="w-1/2 sm:w-auto text-center px-4 py-3 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/survei"
              aria-label="Mulai Survei Sekarang - Kuesioner 7 KAIH"
              title="Mulai Survei Sekarang"
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm shadow-[0_8px_20px_rgba(21,128,61,0.35)] transition-all hover:-translate-y-0.5"
            >
              <ClipboardCheck className="h-4 w-4 text-amber-300" />
              <span>Mulai Survei Sekarang</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
