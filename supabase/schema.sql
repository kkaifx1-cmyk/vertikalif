-- ========================================================
-- SKEMA DATABASE SURVEI SMAIT IHSANUL FIKRI MAGELANG
-- Salin dan jalankan kode SQL ini di:
-- Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ========================================================

-- 1. Buat Tabel survey_responses
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id VARCHAR(255) PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    nomor_id VARCHAR(100),
    total_score NUMERIC(4, 2) NOT NULL,
    answers JSONB NOT NULL,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Kebijakan akses untuk publik
DROP POLICY IF EXISTS "Allow public insert" ON public.survey_responses;
CREATE POLICY "Allow public insert" 
ON public.survey_responses 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read" ON public.survey_responses;
CREATE POLICY "Allow public read" 
ON public.survey_responses 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- 2. Buat Tabel whitelisted_members
CREATE TABLE IF NOT EXISTS public.whitelisted_members (
    id VARCHAR(255) PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    nis VARCHAR(100) UNIQUE NOT NULL,
    kelas VARCHAR(100) NOT NULL,
    peran VARCHAR(255) NOT NULL,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.whitelisted_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read whitelisted_members" ON public.whitelisted_members;
CREATE POLICY "Allow read whitelisted_members" 
ON public.whitelisted_members 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- 3. Isi Data Anggota Whitelist Panitia
INSERT INTO public.whitelisted_members (id, nama, nis, kelas, peran)
VALUES 
    ('m1', 'Naufal Abyan Maulana', '2054', 'XI-2', 'Project Lead & Koordinator Proyek'),
    ('m2', 'Faiq Ahmad Zaidan', '3942', 'XI-6', 'Data Analyst'),
    ('m3', 'Muhammad Fatahillah', '4010', 'XI-4', 'Dashboard Lead UI/UX & Desain Sistem'),
    ('m4', 'Muhammad Gus Ubay Izzulhaq', '4014', 'XI-4', 'Gemini Insight Lead'),
    ('m5', 'Arbi Saiful Bahri', '2089', 'XI-4', 'Presentation Lead'),
    ('m6', 'Rizal Hanifa Pratama', '19890101', 'Pembimbing', 'Technology & AI Project Mentor'),
    ('m7', 'Taufan Maulana Haris', '19910202', 'Pembimbing', 'Substantive Advisor & Penjamin Mutu 7 KAIH')
ON CONFLICT (nis) DO NOTHING;

-- 4. Isi Data Percontohan Respon Survei Awal
INSERT INTO public.survey_responses (id, nama, kategori, nomor_id, total_score, answers, feedback, created_at)
VALUES 
    ('resp_01', 'Abdullah Rabbani', 'Siswa Kelas XII', '2024101', 4.5, '{"sp_1":4,"sp_2":4,"sp_3":5,"sp_4":4,"pb_1":5,"pb_2":4,"pb_3":5,"pb_4":4,"ka_1":5,"ka_2":4,"ka_3":5,"ka_4":5}', 'Fasilitas masjid dan bimbingan tahfizh sangat luar biasa. Mohon penambahan bandwidth WiFi di lab komputer.', '2026-10-28T08:30:00Z'),
    ('resp_02', 'Fatimah Az-Zahra', 'Siswa Kelas XI', '2025042', 4.25, '{"sp_1":4,"sp_2":3,"sp_3":4,"sp_4":5,"pb_1":5,"pb_2":4,"pb_3":4,"pb_4":4,"ka_1":5,"ka_2":3,"ka_3":5,"ka_4":5}', 'Musyrifah sangat peduli dan ramah. Menu katering variatif, namun terkadang sayur kurang banyak.', '2026-10-28T10:15:00Z'),
    ('resp_03', 'Drs. H. Mulyadi (Wali Murid)', 'Wali Murid', '08123456789', 4.67, '{"sp_1":5,"sp_2":4,"sp_3":5,"sp_4":5,"pb_1":5,"pb_2":5,"pb_3":4,"pb_4":4,"ka_1":5,"ka_2":4,"ka_3":5,"ka_4":5}', 'Alhamdulillah perkembangan adab dan hafalan anak kami meningkat pesat semenjak masuk di SMAIT Ihsanul Fikri.', '2026-10-29T13:45:00Z'),
    ('resp_04', 'Ibrahim Maulana', 'Siswa Kelas X', '2026019', 3.92, '{"sp_1":4,"sp_2":3,"sp_3":4,"sp_4":4,"pb_1":4,"pb_2":4,"pb_3":4,"pb_4":3,"ka_1":5,"ka_2":3,"ka_3":4,"ka_4":5}', 'Penyesuaian awal masa asrama sangat dibantu oleh ustadz pembina kamar.', '2026-10-29T15:20:00Z'),
    ('resp_05', 'Hj. Siti Aminah, S.E. (Wali Murid)', 'Wali Murid', '08139876543', 4.42, '{"sp_1":4,"sp_2":4,"sp_3":5,"sp_4":5,"pb_1":4,"pb_2":4,"pb_3":5,"pb_4":4,"ka_1":5,"ka_2":4,"ka_3":5,"ka_4":4}', 'Komunikasi wali kelas dengan orang tua murid melalui grup laporan berkala sangat transparan dan informatif.', '2026-10-30T09:10:00Z'),
    ('resp_06', 'Ustadzah Rina Maryani, S.Pd.', 'Guru / Pendidik', '19910405', 4.58, '{"sp_1":5,"sp_2":4,"sp_3":4,"sp_4":5,"pb_1":5,"pb_2":5,"pb_3":5,"pb_4":4,"ka_1":5,"ka_2":4,"ka_3":5,"ka_4":4}', 'Kultur saling menghormati antara guru dan santri sangat terjaga dengan baik di kampus Ihsanul Fikri.', '2026-10-30T11:00:00Z'),
    ('resp_07', 'Rifqi Al-Ghifari', 'Siswa Kelas XII', '2024088', 4.17, '{"sp_1":4,"sp_2":4,"sp_3":4,"sp_4":4,"pb_1":4,"pb_2":4,"pb_3":5,"pb_4":3,"ka_1":5,"ka_2":4,"ka_3":5,"ka_4":4}', 'Persiapan intensif UTBK dan bimbingan masuk PTN sangat membantu kami di kelas XII.', '2026-10-30T14:30:00Z')
ON CONFLICT (id) DO NOTHING;
