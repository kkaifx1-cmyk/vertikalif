import fs from 'fs';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pxpyjryuwjseltfyzpye.supabase.co";
const supabaseAnonKey = "sb_publishable_nu0XdTozTNkftJlNIw0DuA_HU8G6Vau";
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
  { nis: "1120", nama: "Muhammad Gavin Prasly Alvaro", tingkat: "Siswa Kelas X", rombel: "X-5", gender: "Ikhwan", baseLikert: 3.2, profile: "ibadah" },
  { nis: "1188", nama: "Qonita Khoirul Lativah", tingkat: "Siswa Kelas X", rombel: "X-8", gender: "Akhwat", baseLikert: 3.4, profile: "literasi" },
  { nis: "2033", nama: "Arya Maheswara", tingkat: "Siswa Kelas XI", rombel: "XI-2", gender: "Ikhwan", baseLikert: 3.1, profile: "olahraga" },
  { nis: "3942", nama: "Faiq Ahmad Zaidan", tingkat: "Siswa Kelas XI", rombel: "XI-6", gender: "Ikhwan", baseLikert: 3.3, profile: "riset" },
  { nis: "2160", nama: "Raihan Muhammad Nuh", tingkat: "Siswa Kelas XI", rombel: "XI-6", gender: "Ikhwan", baseLikert: 3.15, profile: "ibadah" },
  { nis: "2194", nama: "Alya Azka Ananta", tingkat: "Siswa Kelas XI", rombel: "XI-8", gender: "Akhwat", baseLikert: 3.3, profile: "adab" },
  { nis: "3052", nama: "Muhammad Arif Hakim", tingkat: "Siswa Kelas XII", rombel: "XII-2", gender: "Ikhwan", baseLikert: 3.65, profile: "akademik" },
  { nis: "3087", nama: "Aufa Muqtafin Amrullah", tingkat: "Siswa Kelas XII", rombel: "XII-4", gender: "Ikhwan", baseLikert: 3.5, profile: "ibadah" },
  { nis: "3114", nama: "Bilqis Innayah Abdan", tingkat: "Siswa Kelas XII", rombel: "XII-5", gender: "Akhwat", baseLikert: 3.75, profile: "tahfizh" },
  { nis: "3118", nama: "Ghazia Aghista Al Thafunnisa", tingkat: "Siswa Kelas XII", rombel: "XII-5", gender: "Akhwat", baseLikert: 3.6, profile: "literasi" },
  { nis: "3155", nama: "Nabila Mutia Raihana", tingkat: "Siswa Kelas XII", rombel: "XII-6", gender: "Akhwat", baseLikert: 3.7, profile: "akademik" },
  { nis: "3166", nama: "Ikhsanida Trihedy Pranoto", tingkat: "Siswa Kelas XII", rombel: "XII-7", gender: "Akhwat", baseLikert: 3.55, profile: "adab" }
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

// Generates 35 items consistent with student's target score
function generateAnswers(baseScore, studentIndex, sessionIndex) {
  const answers = {};
  // Trend: slight improvement or fluctuation
  const sessionModifier = (sessionIndex * 0.05) + ((studentIndex % 3) * 0.02 - 0.02);
  const targetAvg = Math.min(3.95, Math.max(2.85, baseScore + sessionModifier));
  
  let total = 0;
  for (let k = 1; k <= 7; k++) {
    for (let b = 1; b <= 5; b++) {
      const key = `k${k}_${b}`;
      // randomize slightly around targetAvg (1 to 4)
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
      total += val;
    }
  }
  return answers;
}

function evaluateScores(answers) {
  const values = Object.values(answers);
  const totalScore = Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));
  
  // 28 focus items (butir 1-4)
  const focusKeys = [];
  for (let k = 1; k <= 7; k++) {
    for (let b = 1; b <= 4; b++) focusKeys.push(`k${k}_${b}`);
  }
  const avgFocus = focusKeys.reduce((a, k) => a + answers[k], 0) / 28;
  
  // 7 confidence items (butir 5)
  const confKeys = ["k1_5", "k2_5", "k3_5", "k4_5", "k5_5", "k6_5", "k7_5"];
  const avgConf = confKeys.reduce((a, k) => a + answers[k], 0) / 7;
  
  const confidenceScore = Number((0.5 * avgFocus + 0.5 * avgConf).toFixed(2));
  const confidencePercentage = Math.round(((Math.max(1, Math.min(4, confidenceScore)) - 1) / 3) * 100);
  const ikvPercentage = Math.round(((Math.max(1, Math.min(4, totalScore)) - 1) / 3) * 100);
  
  let category = "Cukup Percaya Diri";
  if (confidenceScore >= 3.25) category = "Sangat Percaya Diri";
  else if (confidenceScore >= 2.75) category = "Percaya Diri";
  else if (confidenceScore >= 2.0) category = "Cukup Percaya Diri";
  else category = "Perlu Bimbingan";
  
  return { totalScore, ikvPercentage, confidenceScore, confidencePercentage, category };
}

export function buildAllDummyResponses() {
  const allRecords = [];
  
  STUDENTS.forEach((student, sIdx) => {
    SESSIONS.forEach((session, sessIdx) => {
      const answers = generateAnswers(student.baseLikert, sIdx, sessIdx);
      const metrics = evaluateScores(answers);
      
      const durationSeconds = 180 + Math.floor(Math.random() * 220); // 3 to 6.5 mins
      const feedback = FEEDBACKS[student.nis] ? FEEDBACKS[student.nis][sessIdx] : "";
      
      // Calculate realistic created_at time on session date
      // Minutes offset per student so they don't submit at identical timestamp
      const minuteOffset = session.baseMin + (sIdx * 3) + Math.floor(Math.random() * 2);
      const secondOffset = 10 + Math.floor(Math.random() * 45);
      const hour = session.baseHour + Math.floor(minuteOffset / 60);
      const minute = minuteOffset % 60;
      
      const pad = (n) => String(n).padStart(2, '0');
      const wibTimeFormatted = `${session.dateStr.split('-').reverse().join('/')}, ${pad(hour)}:${pad(minute)}:${pad(secondOffset)}`;
      
      // UTC ISO date (WIB is UTC+7)
      const utcHour = hour - 7;
      const isoCreatedAt = `${session.dateStr}T${pad(utcHour)}:${pad(minute)}:${pad(secondOffset)}.000Z`;
      
      const randomId = Math.random().toString(36).substring(2, 6);
      const timestampEpoch = new Date(isoCreatedAt).getTime();
      const id = `resp_${timestampEpoch}_${randomId}`;
      
      allRecords.push({
        id,
        nama: student.nama,
        kategori: student.tingkat,
        rombel: student.rombel,
        gender: student.gender,
        nomorId: student.nis,
        sessionLabel: session.label,
        sessionNum: session.num,
        wibTimeFormatted,
        isoCreatedAt,
        durationSeconds,
        feedback,
        answers,
        ...metrics
      });
    });
  });
  
  return allRecords;
}

const records = buildAllDummyResponses();
console.log(`Generated ${records.length} records (${STUDENTS.length} students × ${SESSIONS.length} sessions).`);
console.log('Sample record 1:', JSON.stringify(records[0], null, 2));
