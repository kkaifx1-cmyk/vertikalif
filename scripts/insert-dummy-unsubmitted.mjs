import fs from 'fs';
import path from 'path';
import { createClient } from "@supabase/supabase-js";

const baseDir = 'C:/Users/HpPC/Documents/ProjectVERTIKALIF';
const envContent = fs.readFileSync(path.resolve(baseDir, '.env'), 'utf8');

let supabaseUrl = "https://pxpyjryuwjseltfyzpye.supabase.co";
let supabaseAnonKey = "sb_publishable_nu0XdTozTNkftJlNIw0DuA_HU8G6Vau";

envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v) {
    const val = v.join('=').trim().replace(/^"|"$/g, '');
    if (k.trim() === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
    if (k.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseAnonKey = val;
  }
});

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SESSIONS = [
  {
    num: 1,
    label: "Sesi 1 (Senin, 02 Nov 2026)",
    dateStr: "2026-11-02",
    baseHour: 7, // WIB
    baseMin: 20
  },
  {
    num: 2,
    label: "Sesi 2 (Kamis, 05 Nov 2026)",
    dateStr: "2026-11-05",
    baseHour: 7,
    baseMin: 35
  },
  {
    num: 3,
    label: "Sesi 3 (Rabu, 11 Nov 2026 + Susulan)",
    dateStr: "2026-11-11",
    baseHour: 7,
    baseMin: 45
  },
  {
    num: 4,
    label: "Sesi 4 (Sabtu, 14 Nov 2026)",
    dateStr: "2026-11-14",
    baseHour: 8,
    baseMin: 40
  }
];

const STUDENTS = [
  { nis: "1120", nama: "Muhammad Gavin Prasly Alvaro", tingkat: "Siswa Kelas X", rombel: "X-5", gender: "Ikhwan", baseLikert: 3.2 },
  { nis: "1188", nama: "Qonita Khoirul Lativah", tingkat: "Siswa Kelas X", rombel: "X-8", gender: "Akhwat", baseLikert: 3.4 },
  { nis: "2033", nama: "Arya Maheswara", tingkat: "Siswa Kelas XI", rombel: "XI-2", gender: "Ikhwan", baseLikert: 3.1 },
  { nis: "3942", nama: "Faiq Ahmad Zaidan", tingkat: "Siswa Kelas XI", rombel: "XI-6", gender: "Ikhwan", baseLikert: 3.3 },
  { nis: "2160", nama: "Raihan Muhammad Nuh", tingkat: "Siswa Kelas XI", rombel: "XI-6", gender: "Ikhwan", baseLikert: 3.15 },
  { nis: "2194", nama: "Alya Azka Ananta", tingkat: "Siswa Kelas XI", rombel: "XI-8", gender: "Akhwat", baseLikert: 3.3 },
  { nis: "3052", nama: "Muhammad Arif Hakim", tingkat: "Siswa Kelas XII", rombel: "XII-2", gender: "Ikhwan", baseLikert: 3.65 },
  { nis: "3087", nama: "Aufa Muqtafin Amrullah", tingkat: "Siswa Kelas XII", rombel: "XII-4", gender: "Ikhwan", baseLikert: 3.5 },
  { nis: "3114", nama: "Bilqis Innayah Abdan", tingkat: "Siswa Kelas XII", rombel: "XII-5", gender: "Akhwat", baseLikert: 3.75 },
  { nis: "3118", nama: "Ghazia Aghista Al Thafunnisa", tingkat: "Siswa Kelas XII", rombel: "XII-5", gender: "Akhwat", baseLikert: 3.6 },
  { nis: "3155", nama: "Nabila Mutia Raihana", tingkat: "Siswa Kelas XII", rombel: "XII-6", gender: "Akhwat", baseLikert: 3.7 },
  { nis: "3166", nama: "Ikhsanida Trihedy Pranoto", tingkat: "Siswa Kelas XII", rombel: "XII-7", gender: "Akhwat", baseLikert: 3.55 }
];

const FEEDBACKS = {
  "1120": [
    "",
    "Semoga ke depannya pembiasaan sholat berjamaah semakin tertib.",
    "Jadwal kegiatan kalau bisa diberi jeda istirahat yang cukup.",
    "Alhamdulillah bisa menyelesaikan survei, semoga hasilnya bermanfaat untuk asrama."
  ],
  "1188": [
    "Terima kasih atas survei evaluasinya.",
    "",
    "Semoga fasilitas kelas seperti kipas/AC bisa diperiksa rutin agar KBM nyaman.",
    "Semoga angkatan kami bisa istiqomah menjalankan 7 KAIH."
  ],
  "2033": [
    "",
    "Kebugaran jasmani dan olahraga perlu jadwal yang lebih teratur di asrama.",
    "",
    "Semangat untuk seluruh santri Ihsanul Fikri!"
  ],
  "3942": [
    "Mohon info lomba riset dan karya ilmiah diperbanyak dan dibuka transparan.",
    "",
    "Membantu evaluasi diri di sela-sela kepadatan organisasi.",
    "Bismillah semoga terus konsisten berprestasi."
  ],
  "2160": [
    "",
    "Jam tidur malam mohon ditegakkan agar kami tidak kelelahan saat KBM pagi.",
    "",
    "Terima kasih atas bimbingan para asatidz dan musyrif."
  ],
  "2194": [
    "Waktu adzan mohon jangan terlalu terburu-buru agar kami sempat bersiap ke masjid.",
    "",
    "Semoga pembinaan karakter di asrama akhwat semakin baik dan harmonis.",
    "Bismillah semoga hasil evaluasi ini membawa kebaikan bersama."
  ],
  "3052": [
    "Mohon doanya untuk kelas 12 agar dimudahkan lolos PTN impian.",
    "",
    "Porsi gizi makanan di dapur mohon lebih seimbang untuk energi belajar kami.",
    "Alhamdulillah, terima kasih atas fasilitas dan bimbingan selama 3 tahun ini."
  ],
  "3087": [
    "Bismillah sukses SNBP dan Kedinasan 2027.",
    "",
    "Perbanyak latihan soal dan bimbingan intensif persiapan kampus.",
    "Semoga SMAIT Ihsanul Fikri semakin jaya dan mencetak generasi rabbani."
  ],
  "3114": [
    "Target hafalan Al-Qur'an semoga bisa tercapai dengan istiqomah.",
    "",
    "Terima kasih banyak, sangat bermanfaat untuk refleksi harian.",
    "Doakan kami kelas 12 sukses dunia akhirat dan lulus PTN impian."
  ],
  "3118": [
    "",
    "Perpustakaan kalau bisa dibuka saat jam malam mandiri agar literasi meningkat.",
    "",
    "Sukses selalu untuk tim pembuat web VERTIKALIF!"
  ],
  "3155": [
    "Semoga evaluasi ini benar-benar diterapkan dalam kebijakan sekolah.",
    "",
    "Mohon dukungan penuh pihak sekolah untuk perizinan lomba-lomba siswa.",
    "Terima kasih atas surveinya, UI webnya sangat keren dan rapi."
  ],
  "3166": [
    "",
    "Penguatan adab dan ukhuwah antar sesama santri perlu terus dirawat.",
    "",
    "Semoga Allah memberkahi seluruh ikhtiar civitas akademika SMAIT IF."
  ]
};

function generateAnswers(baseScore, studentIndex, sessionIndex) {
  const answers = {};
  const sessionModifier = (sessionIndex * 0.05) + ((studentIndex % 3) * 0.02 - 0.02);
  const targetAvg = Math.min(3.95, Math.max(2.85, baseScore + sessionModifier));
  
  for (let k = 1; k <= 7; k++) {
    for (let b = 1; b <= 5; b++) {
      const key = `k${k}_${b}`;
      const rand = Math.random();
      let val = 3;
      if (targetAvg >= 3.6) {
        val = rand < 0.75 ? 4 : 3;
      } else if (targetAvg >= 3.3) {
        val = rand < 0.45 ? 4 : (rand < 0.9 ? 3 : 2);
      } else {
        val = rand < 0.25 ? 4 : (rand < 0.85 ? 3 : 2);
      }
      answers[key] = val;
    }
  }
  return answers;
}

async function run() {
  console.log("=== MEMPERSIAPKAN DATA DUMMY 12 SANTRI (4 SESI) ===");
  const payloadToInsert = [];

  STUDENTS.forEach((student, sIdx) => {
    SESSIONS.forEach((session, sessIdx) => {
      const answers = generateAnswers(student.baseLikert, sIdx, sessIdx);
      const values = Object.values(answers);
      const totalScore = Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));
      const durationSeconds = 180 + Math.floor(Math.random() * 220);
      const feedback = FEEDBACKS[student.nis] ? FEEDBACKS[student.nis][sessIdx] : null;

      const minuteOffset = session.baseMin + (sIdx * 3) + Math.floor(Math.random() * 2);
      const secondOffset = 10 + Math.floor(Math.random() * 45);
      const hour = session.baseHour + Math.floor(minuteOffset / 60);
      const minute = minuteOffset % 60;
      
      const pad = (n) => String(n).padStart(2, '0');
      const utcHour = hour - 7;
      const isoCreatedAt = `${session.dateStr}T${pad(utcHour)}:${pad(minute)}:${pad(secondOffset)}.000Z`;

      const randomId = Math.random().toString(36).substring(2, 6);
      const timestampEpoch = new Date(isoCreatedAt).getTime();
      const id = `resp_${timestampEpoch}_${randomId}`;

      const answersPayload = {
        ...answers,
        _duration_seconds: durationSeconds
      };

      payloadToInsert.push({
        id,
        nama: student.nama,
        kategori: student.tingkat,
        jenis_kelamin: student.gender,
        nomor_id: student.nis,
        total_score: totalScore,
        answers: answersPayload,
        feedback: feedback && feedback.trim() ? feedback.trim() : null,
        created_at: isoCreatedAt
      });
    });
  });

  console.log(`Total payload disiapkan: ${payloadToInsert.length} baris.`);

  // Insert to Supabase in batches of 25
  console.log("Mengunggah data ke Supabase Cloud (survey_responses)...");
  const batchSize = 25;
  for (let i = 0; i < payloadToInsert.length; i += batchSize) {
    const chunk = payloadToInsert.slice(i, i + batchSize);
    const { data, error } = await supabase.from("survey_responses").insert(chunk);
    if (error) {
      console.error(`Error inserting chunk ${i} - ${i + chunk.length}:`, error.message);
      throw error;
    }
    console.log(`✓ Berhasil memasukkan baris ${i + 1} s.d. ${Math.min(i + batchSize, payloadToInsert.length)}`);
  }

  console.log("✓ Seluruh 48 respon dummy berhasil di-insert ke Supabase!");
}

run().catch(console.error);
