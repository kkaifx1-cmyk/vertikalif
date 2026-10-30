# Platform Survei Evaluasi Terpadu — SMAIT Ihsanul Fikri Magelang

Website kuesioner dan analitik evaluasi mutu pendidikan, fasilitas sarana prasarana, serta pembiasaan karakter asrama santri untuk **SMAIT Ihsanul Fikri Kabupaten Magelang**.

Dibangun dengan **Next.js 16 (App Router)**, **Tailwind CSS**, gaya antarmuka **shadcn/ui**, palet warna resmi logo sekolah (*Islamic Forest Green* & *School Gold Yellow*), serta mematuhi standar desain [Anti-Slop](https://github.com/miqdadbadjuber/anti-slop).

---

## 🌟 Fitur Utama

1. **Halaman Beranda & Profil Tim (`/`)**:
   - Sambutan resmi proyek evaluasi mutu SMAIT Ihsanul Fikri.
   - Kartu profil anggota tim peneliti santri & pembimbing dengan efek timbul berpendar.
   - Background animasi bergerak bertema hijau dan emas islami.

2. **Formulir Survei Santri Multi-Step 3 Tahap (`/survei`)**:
   - **Tahap 1 — Identitas Santri**:
     - Nama Lengkap / Inisial.
     - **Tingkat Kelas (Gaya Dropdown)**: *Kelas X (Fase E)*, *Kelas XI (Fase F)*, *Kelas XII (Tingkat Akhir)*.
     - **Jenis Kelamin (Gaya Dropdown)**: *Ikhwan (Santri Putra)* / *Akhwat (Santri Putri)*.
     - NIS / NISN opsional.
   - **Tahap 2 — Kuesioner Bertema**:
     - *Halaman Tema 1*: Sarana & Prasarana Sekolah
     - *Halaman Tema 2*: Kualitas Pembelajaran & Pengajar
     - *Halaman Tema 3*: Keasramaan & Pembiasaan Karakter
     - Menggunakan **Skala Likert 1–5 Murni** (*Sangat Tidak Puas* s/d *Sangat Puas*) dengan efek tombol timbul bercahaya saat kursor mendekat.
   - **Tahap 3 — Closing & Konfirmasi**: Ringkasan pengisian, kolom saran terbuka, serta ucapan terima kasih islami (*Jazakumullah Khairan Katsiran*).

3. **Portal Super Admin — Analisis Visual (`/analisis`)**:
   - Dilindungi autentikasi **Super Admin** resmi (tanpa bocoran tombol demo).
   - Metrik KPI: Total responden santri, rata-rata indeks kepuasan, dimensi tertinggi & evaluasi.
   - **Analisis Demografi Khusus**: Perbandingan jumlah dan persentase **Santri Ikhwan vs Santri Akhwat**.
   - Diagram batang rata-rata kepuasan per tema (*Bar Chart* via Recharts).
   - Diagram distribusi bobot jawaban skala Likert 1–5.
   - Tabel rincian skor rata-rata per butir pertanyaan.

4. **Portal Super Admin — Tabel Data Respon Mentah (`/data`)**:
   - Dilindungi autentikasi **Super Admin**.
   - Menampilkan seluruh catatan respon santri real-time dari database Supabase Cloud.
   - Dilengkapi badge penanda **Ikhwan** (hijau) & **Akhwat** (emas).
   - Filter dropdown multi-parameter: Filter Kelas (X, XI, XII) & Filter Gender (Ikhwan, Akhwat).
   - Tombol **Ekspor ke Excel / CSV** langsung ke komputer Anda.

---

## 🔐 Kredensial Akses Super Admin (`/analisis` & `/data`)

| Hak Akses | Nama Pengguna / Admin | Kunci Sandi / NIS |
| :--- | :--- | :--- |
| **Super Administrator Utama** | `Super Admin` | `SUPERADMIN2026` |
| **Panitia Ketua Proyek** | `Muhammad Fathurrahman` | `20240101` |
| **Guru Pembimbing** | `Ust. Hendra Setiawan, S.Pd.` | `19870512` |

---

## 🚀 Cara Menjalankan Proyek

1. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```

2. Buka browser di [http://localhost:3000](http://localhost:3000)
