import pg from "pg";
const { Client } = pg;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const connectionString = "postgresql://postgres.pxpyjryuwjseltfyzpye:VERTIKALIF2026@aws-0-eu-west-1.pooler.supabase.com:5432/postgres";

async function main() {
  console.log("Connecting to Supabase PostgreSQL at aws-0-eu-west-1.pooler.supabase.com:5432...");
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("✓ Connected successfully to Supabase PostgreSQL (eu-west-1)!");

    // 1. Create survey_responses table
    await client.query(`
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
    `);
    console.log("✓ Table 'survey_responses' created in Supabase!");

    // Enable RLS and policies
    await client.query(`
      ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow public insert" ON public.survey_responses;
      CREATE POLICY "Allow public insert" ON public.survey_responses FOR INSERT TO anon, authenticated WITH CHECK (true);
      DROP POLICY IF EXISTS "Allow public read" ON public.survey_responses;
      CREATE POLICY "Allow public read" ON public.survey_responses FOR SELECT TO anon, authenticated USING (true);
    `);
    console.log("✓ RLS Policies configured for 'survey_responses'!");

    // 2. Create whitelisted_members table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.whitelisted_members (
        id VARCHAR(255) PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        nis VARCHAR(100) UNIQUE NOT NULL,
        kelas VARCHAR(100) NOT NULL,
        peran VARCHAR(255) NOT NULL,
        avatar TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("✓ Table 'whitelisted_members' created in Supabase!");

    await client.query(`
      ALTER TABLE public.whitelisted_members ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow read whitelisted_members" ON public.whitelisted_members;
      CREATE POLICY "Allow read whitelisted_members" ON public.whitelisted_members FOR SELECT TO anon, authenticated USING (true);
    `);
    console.log("✓ RLS Policies configured for 'whitelisted_members'!");

    // 3. Seed whitelisted members
    const members = [
      { id: "m1", nama: "Muhammad Fathurrahman", nis: "20240101", kelas: "XII MIPA 1", peran: "Ketua Tim & Koordinator Proyek" },
      { id: "m2", nama: "Aisyah Nurul Izzah", nis: "20240102", kelas: "XII MIPA 2", peran: "Lead UI/UX & Desain Sistem" },
      { id: "m3", nama: "Zaidan Ahmad Al-Farisi", nis: "20240103", kelas: "XII IPS 1", peran: "Frontend & Integrasi Form" },
      { id: "m4", nama: "Fathiya Khansa Azzahra", nis: "20240104", kelas: "XII MIPA 1", peran: "Data Analyst & Pelaporan" },
      { id: "m5", nama: "Ust. Hendra Setiawan, S.Pd.", nis: "19870512", kelas: "Pembimbing", peran: "Guru Pembimbing Proyek" },
    ];

    for (const m of members) {
      await client.query(`
        INSERT INTO public.whitelisted_members (id, nama, nis, kelas, peran)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (nis) DO UPDATE SET
          nama = EXCLUDED.nama,
          kelas = EXCLUDED.kelas,
          peran = EXCLUDED.peran;
      `, [m.id, m.nama, m.nis, m.kelas, m.peran]);
    }
    console.log("✓ Whitelisted members seeded in Supabase!");

    // 4. Seed initial realistic responses if empty
    const resCount = await client.query("SELECT COUNT(*) FROM public.survey_responses");
    console.log(`Current survey responses count in Supabase: ${resCount.rows[0].count}`);

    if (parseInt(resCount.rows[0].count, 10) === 0) {
      const initialSeed = [
        {
          id: "resp_01",
          nama: "Abdullah Rabbani",
          kategori: "Siswa Kelas XII",
          nomor_id: "2024101",
          total_score: 4.5,
          created_at: "2026-10-28T08:30:00Z",
          answers: JSON.stringify({ sp_1: 4, sp_2: 4, sp_3: 5, sp_4: 4, pb_1: 5, pb_2: 4, pb_3: 5, pb_4: 4, ka_1: 5, ka_2: 4, ka_3: 5, ka_4: 5 }),
          feedback: "Fasilitas masjid dan bimbingan tahfizh sangat luar biasa. Mohon penambahan bandwidth WiFi di lab komputer.",
        },
        {
          id: "resp_02",
          nama: "Fatimah Az-Zahra",
          kategori: "Siswa Kelas XI",
          nomor_id: "2025042",
          total_score: 4.25,
          created_at: "2026-10-28T10:15:00Z",
          answers: JSON.stringify({ sp_1: 4, sp_2: 3, sp_3: 4, sp_4: 5, pb_1: 5, pb_2: 4, pb_3: 4, pb_4: 4, ka_1: 5, ka_2: 3, ka_3: 5, ka_4: 5 }),
          feedback: "Musyrifah sangat peduli dan ramah. Menu katering variatif, namun terkadang sayur kurang banyak.",
        },
        {
          id: "resp_03",
          nama: "Drs. H. Mulyadi (Wali Murid)",
          kategori: "Wali Murid",
          nomor_id: "08123456789",
          total_score: 4.67,
          created_at: "2026-10-29T13:45:00Z",
          answers: JSON.stringify({ sp_1: 5, sp_2: 4, sp_3: 5, sp_4: 5, pb_1: 5, pb_2: 5, pb_3: 4, pb_4: 4, ka_1: 5, ka_2: 4, ka_3: 5, ka_4: 5 }),
          feedback: "Alhamdulillah perkembangan adab dan hafalan anak kami meningkat pesat semenjak masuk di SMAIT Ihsanul Fikri.",
        },
        {
          id: "resp_04",
          nama: "Ibrahim Maulana",
          kategori: "Siswa Kelas X",
          nomor_id: "2026019",
          total_score: 3.92,
          created_at: "2026-10-29T15:20:00Z",
          answers: JSON.stringify({ sp_1: 4, sp_2: 3, sp_3: 4, sp_4: 4, pb_1: 4, pb_2: 4, pb_3: 4, pb_4: 3, ka_1: 5, ka_2: 3, ka_3: 4, ka_4: 5 }),
          feedback: "Penyesuaian awal masa asrama sangat dibantu oleh ustadz pembina kamar.",
        },
        {
          id: "resp_05",
          nama: "Hj. Siti Aminah, S.E. (Wali Murid)",
          kategori: "Wali Murid",
          nomor_id: "08139876543",
          total_score: 4.42,
          created_at: "2026-10-30T09:10:00Z",
          answers: JSON.stringify({ sp_1: 4, sp_2: 4, sp_3: 5, sp_4: 5, pb_1: 4, pb_2: 4, pb_3: 5, pb_4: 4, ka_1: 5, ka_2: 4, ka_3: 5, ka_4: 4 }),
          feedback: "Komunikasi wali kelas dengan orang tua murid melalui grup laporan berkala sangat transparan dan informatif.",
        },
        {
          id: "resp_06",
          nama: "Ustadzah Rina Maryani, S.Pd.",
          kategori: "Guru / Pendidik",
          nomor_id: "19910405",
          total_score: 4.58,
          created_at: "2026-10-30T11:00:00Z",
          answers: JSON.stringify({ sp_1: 5, sp_2: 4, sp_3: 4, sp_4: 5, pb_1: 5, pb_2: 5, pb_3: 5, pb_4: 4, ka_1: 5, ka_2: 4, ka_3: 5, ka_4: 4 }),
          feedback: "Kultur saling menghormati antara guru dan santri sangat terjaga dengan baik di kampus Ihsanul Fikri.",
        },
        {
          id: "resp_07",
          nama: "Rifqi Al-Ghifari",
          kategori: "Siswa Kelas XII",
          nomor_id: "2024088",
          total_score: 4.17,
          created_at: "2026-10-30T14:30:00Z",
          answers: JSON.stringify({ sp_1: 4, sp_2: 4, sp_3: 4, sp_4: 4, pb_1: 4, pb_2: 4, pb_3: 5, pb_4: 3, ka_1: 5, ka_2: 4, ka_3: 5, ka_4: 4 }),
          feedback: "Persiapan intensif UTBK dan bimbingan masuk PTN sangat membantu kami di kelas XII.",
        },
      ];

      for (const s of initialSeed) {
        await client.query(`
          INSERT INTO public.survey_responses (id, nama, kategori, nomor_id, total_score, answers, feedback, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING;
        `, [s.id, s.nama, s.kategori, s.nomor_id, s.total_score, s.answers, s.feedback, s.created_at]);
      }
      console.log("✓ Initial survey responses seeded into Supabase!");
    }

    await client.end();
    console.log("✓ SUPABASE MIGRATION & SEED COMPLETED 100%!");
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}

main();
