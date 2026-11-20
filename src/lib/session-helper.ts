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
    description: "Evaluasi pekan ke-2 (Rabu) terintegrasi dengan rekapan seluruh respon pengisian berkala.",
    phase: "Retensi Pekan 2 & Rekap Respon",
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
 * Menentukan alokasi sesi untuk setiap respon evaluasi:
 * - 02 Nov 2026 -> sesi_1 (Senin)
 * - 05 Nov 2026 -> sesi_2 (Kamis)
 * - 14 Nov 2026 -> sesi_4 (Sabtu)
 * - 11 Nov 2026 serta SEMUA respon pengisian di luar sesi resmi -> sesi_3 (Rabu)
 *   (Seluruh respon di luar sesi dialokasikan dan direkap penuh ke Hari Rabu)
 */
export function getSessionIdForResponse(
  dateStr: string | number | Date | undefined | null
): "sesi_1" | "sesi_2" | "sesi_3" | "sesi_4" {
  const d = extractWibDate(dateStr);
  if (d === "2026-11-02") return "sesi_1";
  if (d === "2026-11-05") return "sesi_2";
  if (d === "2026-11-14") return "sesi_4";
  // Respon tanggal 11 Nov maupun tanggal lainnya di luar sesi resmi dialokasikan ke Sesi 3 (Rabu)
  return "sesi_3";
}

/**
 * Filter respon berdasarkan ID sesi pengisian
 */
export function filterResponsesBySession(
  responses: ResponseRecord[],
  sessionId: string
): ResponseRecord[] {
  if (!responses || responses.length === 0) return [];

  // Sesi "all" (Rekapan Gabungan 4 Sesi): Mencakup seluruh data respon tanpa terkecuali
  if (sessionId === "all") {
    return responses;
  }

  // Jika Sesi 1, Sesi 2, Sesi 3 (Rabu), atau Sesi 4 dipilih spesifik
  if (
    sessionId === "sesi_1" ||
    sessionId === "sesi_2" ||
    sessionId === "sesi_3" ||
    sessionId === "sesi_4"
  ) {
    return responses.filter((r) => getSessionIdForResponse(r.createdAt) === sessionId);
  }

  // Jika "other" dipilih (karena data di luar sesi sudah direkap ke Hari Rabu, kembalikan Sesi 3)
  if (sessionId === "other") {
    return responses.filter((r) => getSessionIdForResponse(r.createdAt) === "sesi_3");
  }

  // Fallback pencocokan session
  const session = EVALUATION_SESSIONS.find((s) => s.id === sessionId);
  if (session && session.id) {
    return responses.filter((r) => getSessionIdForResponse(r.createdAt) === session.id);
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
      : filterResponsesBySession(allResponses, session.id);

  const totalCount = sessionResponses.length;

  if (totalCount === 0) {
    const todayWib = extractWibDate(new Date());
    let status: SessionMetricsSummary["status"] = "Belum Berjalan";
    if (session.dateKey) {
      if (todayWib === session.dateKey) status = "Aktif Hari Ini";
      else if (
        session.id === "sesi_3" &&
        todayWib !== "2026-11-02" &&
        todayWib !== "2026-11-05" &&
        todayWib !== "2026-11-14"
      ) {
        status = "Aktif Hari Ini";
      } else if (todayWib < session.dateKey) status = "Mendatang";
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
  } else if (
    session.id === "sesi_3" &&
    todayWib !== "2026-11-02" &&
    todayWib !== "2026-11-05" &&
    todayWib !== "2026-11-14"
  ) {
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
