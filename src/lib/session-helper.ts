import { ResponseRecord } from "./data-store";

export interface EvaluationSession {
  id: string; // "all" | "sesi_1" | "sesi_2" | "sesi_3" | "sesi_4" | "other"
  dateKey: string; // "2026-11-02", "2026-11-05", etc. Or "" for all
  sesiNumber: number | null;
  name: string;
  dayName: string;
  formattedDate: string;
  fullLabel: string;
  badge: string;
  badgeColor: string;
  description: string;
  phase: string;
}

export const OFFICIAL_SESSION_DATES = [
  "2026-11-02",
  "2026-11-05",
  "2026-11-11",
  "2026-11-14",
] as const;

export const TOTAL_IHSANUL_FIKRI_STUDENTS = 777;

export const EVALUATION_SESSIONS: EvaluationSession[] = [
  {
    id: "all",
    dateKey: "",
    sesiNumber: null,
    name: "Rekapan Gabungan 4 Sesi",
    dayName: "Kompilasi",
    formattedDate: "02 - 14 Nov 2026",
    fullLabel: "Konsolidasi Agregat 4 Sesi Evaluasi",
    badge: "Gabungan",
    badgeColor: "bg-emerald-600 text-white",
    description: "Akumulasi komprehensif seluruh respon dari 4 hari pengisian survei.",
    phase: "Konsolidasi Total",
  },
  {
    id: "sesi_1",
    dateKey: "2026-11-02",
    sesiNumber: 1,
    name: "Sesi 1: Senin, 02 Nov 2026",
    dayName: "Senin",
    formattedDate: "02 Nov 2026",
    fullLabel: "Senin, 02 November 2026",
    badge: "Sesi 1",
    badgeColor: "bg-blue-600 text-white",
    description: "Evaluasi pembuka baseline karakter & fokus santri pekan ke-1.",
    phase: "Baseline Pekan 1",
  },
  {
    id: "sesi_2",
    dateKey: "2026-11-05",
    sesiNumber: 2,
    name: "Sesi 2: Kamis, 05 Nov 2026",
    dayName: "Kamis",
    formattedDate: "05 Nov 2026",
    fullLabel: "Kamis, 05 November 2026",
    badge: "Sesi 2",
    badgeColor: "bg-teal-600 text-white",
    description: "Evaluasi tengah pekan ke-1 untuk memantau konsistensi ibadah & adab.",
    phase: "Mid-Check Pekan 1",
  },
  {
    id: "sesi_3",
    dateKey: "2026-11-11",
    sesiNumber: 3,
    name: "Sesi 3: Rabu, 11 Nov 2026",
    dayName: "Rabu",
    formattedDate: "11 Nov 2026",
    fullLabel: "Rabu, 11 November 2026",
    badge: "Sesi 3",
    badgeColor: "bg-indigo-600 text-white",
    description: "Evaluasi awal pekan ke-2 untuk mengukur retensi fokus pasca awal pekan.",
    phase: "Retensi Pekan 2",
  },
  {
    id: "sesi_4",
    dateKey: "2026-11-14",
    sesiNumber: 4,
    name: "Sesi 4: Sabtu, 14 Nov 2026",
    dayName: "Sabtu",
    formattedDate: "14 Nov 2026",
    fullLabel: "Sabtu, 14 November 2026",
    badge: "Sesi 4",
    badgeColor: "bg-amber-600 text-white",
    description: "Evaluasi penutup siklus pengamatan untuk verifikasi stabilitas confidency.",
    phase: "Finalisasi Siklus",
  },
];

/**
 * Ekstraksi tanggal dalam format YYYY-MM-DD zona waktu Asia/Jakarta (WIB)
 * Menangani secara presisi ISO string UTC, timestamp numerik, maupun format tanggal lainnya.
 */
export function extractWibDate(dateStr: string | number | Date | undefined | null): string {
  if (!dateStr) return "";
  try {
    const d = typeof dateStr === "object" ? dateStr : new Date(dateStr);
    if (isNaN(d.getTime())) {
      const match = String(dateStr).match(/^\d{4}-\d{2}-\d{2}/);
      return match ? match[0] : "";
    }
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  } catch {
    const match = String(dateStr).match(/^\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : "";
  }
}

/**
 * Filter respon berdasarkan ID sesi pengisian
 */
export function filterResponsesBySession(
  responses: ResponseRecord[],
  sessionId: string
): ResponseRecord[] {
  if (!responses || responses.length === 0) return [];

  // Jika Sesi 1 - 4 dipilih spesifik
  const session = EVALUATION_SESSIONS.find((s) => s.id === sessionId);
  if (session && session.dateKey) {
    return responses.filter((r) => extractWibDate(r.createdAt) === session.dateKey);
  }

  // Jika "other" dipilih (data di luar 4 tanggal resmi, misal data uji coba)
  if (sessionId === "other") {
    const officialSet = new Set(OFFICIAL_SESSION_DATES as readonly string[]);
    return responses.filter((r) => !officialSet.has(extractWibDate(r.createdAt)));
  }

  // Sesi "all" (Rekapan Gabungan 4 Sesi):
  // Cek apakah ada respon pada 4 tanggal resmi
  const officialSet = new Set(OFFICIAL_SESSION_DATES as readonly string[]);
  const officialResponses = responses.filter((r) => officialSet.has(extractWibDate(r.createdAt)));

  // Jika data 4 sesi sudah terisi, prioritaskan 4 sesi resmi.
  // Jika saat masa uji coba belum ada respon pada 4 tanggal tersebut, tampilkan semua respon agar tidak kosong.
  if (officialResponses.length > 0) {
    return officialResponses;
  }

  return responses;
}

export interface SessionMetricsSummary {
  session: EvaluationSession;
  totalCount: number;
  participationPct: number; // Persentase santri yang mengisi dari total 777 santri Ihsanul Fikri (100% = 777 siswa)
  uniqueCount: number;
  avgIkv: number;
  ikvPct: number;
  avgIk: number;
  avgIf: number;
  avgIc: number;
  ikhwanCount: number;
  akhwatCount: number;
  status: "Terekam" | "Aktif Hari Ini" | "Mendatang" | "Belum Berjalan";
}

/**
 * Hitung metrik ringkas per sesi untuk ditampilkan di kolom / blok navigasi kiri
 */
export function computeSessionMetrics(
  session: EvaluationSession,
  allResponses: ResponseRecord[]
): SessionMetricsSummary {
  const sessionResponses =
    session.id === "all"
      ? filterResponsesBySession(allResponses, "all")
      : allResponses.filter((r) => extractWibDate(r.createdAt) === session.dateKey);

  const totalCount = sessionResponses.length;

  if (totalCount === 0) {
    const todayWib = extractWibDate(new Date());
    let status: SessionMetricsSummary["status"] = "Belum Berjalan";
    if (session.dateKey) {
      if (todayWib === session.dateKey) status = "Aktif Hari Ini";
      else if (todayWib < session.dateKey) status = "Mendatang";
      else status = "Belum Berjalan";
    }

    return {
      session,
      totalCount: 0,
      participationPct: 0,
      uniqueCount: 0,
      avgIkv: 0,
      ikvPct: 0,
      avgIk: 0,
      avgIf: 0,
      avgIc: 0,
      ikhwanCount: 0,
      akhwatCount: 0,
      status,
    };
  }

  // Persentase terhadap 100% akumulasi seluruh santri SMAIT Ihsanul Fikri (Total: 777 Siswa)
  const uniqueNames = new Set(sessionResponses.map((r) => r.nama.trim().toLowerCase()));
  const uniqueCount = uniqueNames.size;
  const participationPct =
    session.id === "all"
      ? Math.min(100, Math.round((uniqueCount / TOTAL_IHSANUL_FIKRI_STUDENTS) * 100))
      : Math.min(100, Math.round((totalCount / TOTAL_IHSANUL_FIKRI_STUDENTS) * 100));

  const sumTotalScore = sessionResponses.reduce((acc, r) => acc + (r.totalScore || 0), 0);
  const avgIkv = Number((sumTotalScore / totalCount).toFixed(2));
  const ikvPct = Math.round(((Math.max(1, Math.min(4, avgIkv)) - 1) / 3) * 100);

  // Trio Metrik: Ik (Konsistensi butir #1), If (Fokus butir #2, #3, #4), Ic (Confidency butir #5)
  let sumK = 0;
  let countK = 0;
  let sumF = 0;
  let countF = 0;
  let sumC = 0;
  let countC = 0;

  sessionResponses.forEach((r) => {
    const answers = (r.answers || {}) as Record<string, any>;
    // 7 KAIH butir
    for (let k = 1; k <= 7; k++) {
      const q1 = answers[`k${k}_1`] ?? answers[`q${k}_1`];
      if (q1 !== undefined && !isNaN(Number(q1))) {
        sumK += Number(q1);
        countK++;
      }
      const q2 = answers[`k${k}_2`] ?? answers[`q${k}_2`];
      const q3 = answers[`k${k}_3`] ?? answers[`q${k}_3`];
      const q4 = answers[`k${k}_4`] ?? answers[`q${k}_4`];
      if (q2 !== undefined && !isNaN(Number(q2))) {
        sumF += Number(q2);
        countF++;
      }
      if (q3 !== undefined && !isNaN(Number(q3))) {
        sumF += Number(q3);
        countF++;
      }
      if (q4 !== undefined && !isNaN(Number(q4))) {
        sumF += Number(q4);
        countF++;
      }
      const q5 = answers[`k${k}_5`] ?? answers[`q${k}_5`];
      if (q5 !== undefined && !isNaN(Number(q5))) {
        sumC += Number(q5);
        countC++;
      }
    }
  });

  const avgIkScore = countK > 0 ? sumK / countK : 0;
  const avgIfScore = countF > 0 ? sumF / countF : 0;
  const avgIcScore = countC > 0 ? sumC / countC : 0;

  const avgIk = Math.round(((Math.max(1, Math.min(4, avgIkScore)) - 1) / 3) * 100);
  const avgIf = Math.round(((Math.max(1, Math.min(4, avgIfScore)) - 1) / 3) * 100);
  const avgIc = Math.round(((Math.max(1, Math.min(4, avgIcScore)) - 1) / 3) * 100);

  const ikhwanCount = sessionResponses.filter((r) => r.jenisKelamin !== "Akhwat").length;
  const akhwatCount = sessionResponses.filter((r) => r.jenisKelamin === "Akhwat").length;

  const todayWib = extractWibDate(new Date());
  let status: SessionMetricsSummary["status"] = "Terekam";
  if (session.dateKey && todayWib === session.dateKey) {
    status = "Aktif Hari Ini";
  }

  return {
    session,
    totalCount,
    participationPct,
    uniqueCount,
    avgIkv,
    ikvPct,
    avgIk,
    avgIf,
    avgIc,
    ikhwanCount,
    akhwatCount,
    status,
  };
}
