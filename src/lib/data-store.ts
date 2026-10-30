import { SURVEY_THEMES, WHITELIST_MEMBERS } from "./survey-data";
import { supabase } from "./supabase";

export interface ResponseRecord {
  id: string;
  nama: string;
  kategori: string; // "Siswa Kelas X", "Siswa Kelas XI", "Siswa Kelas XII"
  jenisKelamin?: string; // "Ikhwan" | "Akhwat"
  nomorId?: string;
  totalScore: number;
  createdAt: string;
  answers: Record<string, number>; // questionId -> score (1-4)
  feedback?: string;
}

// Daftar ID respon lama dari instrumen terdahulu dan uji coba otomatis yang dihapus
export const DEFAULT_EXCLUDED_IDS = [
  "resp_01",
  "resp_02",
  "resp_03",
  "resp_04",
  "resp_05",
  "resp_06",
  "resp_07",
  "resp_1793352979751_hyto",
  "resp_1793354326975_hujo",
  "resp_1793355190142_l3yl",
  "resp_1793355247477_pst6",
  "resp_1793355353598_ghm4",
  "resp_1793356139871_zby6",
  "resp_1793356528401_9koo",
  "resp_1793366411575_cbc4",
  "resp_1793369999740_o0h5",
  "resp_1793372014251_zpqe",
];

const deletedIds = new Set<string>(DEFAULT_EXCLUDED_IDS);

export function verifyMemberAccess(
  nama: string,
  nis: string
): { verified: boolean; member?: (typeof WHITELIST_MEMBERS)[0] } {
  const cleanName = nama.trim().toLowerCase();
  const cleanNis = nis.trim().toLowerCase();

  // Master Admin bypass (admin / admin, admin123, VERTIKALIF2026)
  if (
    (cleanName === "admin" && (cleanNis === "admin" || cleanNis === "admin123" || cleanNis === "vertikalif2026")) ||
    cleanNis === "vertikalif2026" ||
    cleanNis === "admin" ||
    cleanNis === "admin123"
  ) {
    return {
      verified: true,
      member: {
        nama: "Super Administrator",
        nis: "ADMIN",
        kelas: "Pusat Kendali",
        peran: "Super Admin VERTIKAL IF",
        avatar: "/logo-ihsanul-fikri.png",
        bio: "Akses kendali penuh atas basis data kuesioner SMAIT Ihsanul Fikri.",
      },
    };
  }

  // Whitelist Panitia Check
  const found = WHITELIST_MEMBERS.find((m) => {
    const matchName =
      m.nama.toLowerCase().includes(cleanName) || cleanName.includes(m.nama.toLowerCase());
    const matchNis = m.nis.toLowerCase() === cleanNis;
    return matchName || matchNis;
  });

  if (found) {
    return { verified: true, member: found };
  }

  return { verified: false };
}


let responsesCache: ResponseRecord[] = [];

export async function getAllResponses(): Promise<ResponseRecord[]> {
  try {
    const { data, error } = await supabase
      .from("survey_responses")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      const mapped: ResponseRecord[] = [];

      for (const row of data) {
        // Abaikan ID yang telah dihapus
        if (deletedIds.has(row.id)) continue;

        const rawAnswers = typeof row.answers === "string" ? JSON.parse(row.answers) : row.answers || {};
        const keys = Object.keys(rawAnswers);

        // Abaikan format lama instrumen 3 tema (ka_, sp_, pb_)
        const hasLegacyKeys = keys.some((k) => k.startsWith("sp_") || k.startsWith("pb_") || k.startsWith("ka_"));
        if (hasLegacyKeys) continue;

        // Abaikan nama bot uji coba atau ketikan sembarangan
        if (
          row.nama === "Santri Uji Coba" ||
          row.nama === "sasdasad" ||
          row.nama === "ssdsd" ||
          row.nama === "TEST_UPDATE"
        ) {
          continue;
        }

        // Pastikan hanya memproses instrumen 7 KAIH (k1_1 s.d. k7_5)
        const hasKaihKeys = keys.some((k) => k.startsWith("k"));
        if (!hasKaihKeys) continue;

        const normalizedAnswers: Record<string, number> = {};
        let sum = 0;
        let count = 0;

        Object.entries(rawAnswers).forEach(([k, v]) => {
          const num = Number(v);
          const capped = Math.min(4, Math.max(1, num));
          normalizedAnswers[k] = capped;
          sum += capped;
          count++;
        });

        const calculatedScore = count > 0 ? Number((sum / count).toFixed(2)) : Math.min(4.0, Number(row.total_score));

        mapped.push({
          id: row.id,
          nama: row.nama,
          kategori: row.kategori,
          jenisKelamin: row.jenis_kelamin || "Ikhwan",
          nomorId: row.nomor_id || "",
          totalScore: calculatedScore,
          createdAt: row.created_at,
          answers: normalizedAnswers,
          feedback: row.feedback || "",
        });
      }

      responsesCache = mapped;
      return mapped;
    }
  } catch (err) {
    console.warn("Notice: Fetching from Supabase fallback to cache:", err);
  }

  return [...responsesCache]
    .filter((r) => !deletedIds.has(r.id))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function deleteResponse(id: string): Promise<boolean> {
  deletedIds.add(id);
  responsesCache = responsesCache.filter((r) => r.id !== id);
  return true;
}

export async function clearAllResponses(): Promise<boolean> {
  const current = await getAllResponses();
  current.forEach((r) => deletedIds.add(r.id));
  responsesCache = [];
  return true;
}

export async function saveResponse(
  newResponse: Omit<ResponseRecord, "id" | "totalScore" | "createdAt">
): Promise<ResponseRecord> {
  const scores = Object.values(newResponse.answers);
  const total = scores.length > 0 ? scores.reduce((acc, curr) => acc + curr, 0) / scores.length : 0;

  const record: ResponseRecord = {
    id: `resp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    ...newResponse,
    totalScore: Number(total.toFixed(2)),
    createdAt: new Date().toISOString(),
  };

  responsesCache.unshift(record);

  // Write to Supabase with jenis_kelamin
  try {
    const { error } = await supabase.from("survey_responses").insert({
      id: record.id,
      nama: record.nama,
      kategori: record.kategori,
      jenis_kelamin: record.jenisKelamin || "Ikhwan",
      nomor_id: record.nomorId || null,
      total_score: record.totalScore,
      answers: record.answers,
      feedback: record.feedback || null,
      created_at: record.createdAt,
    });

    if (error) {
      console.warn("Supabase insert notice:", error.message);
    } else {
      console.log("✓ Saved survey response with gender directly to Supabase!");
    }
  } catch (err) {
    console.warn("Supabase insert catch:", err);
  }

  return record;
}

export interface AnalyticsSummary {
  totalResponses: number;
  averageScoreOverall: number;
  highestTheme: { title: string; score: number };
  lowestTheme: { title: string; score: number };
  themeAverages: { id: string; title: string; average: number; count: number }[];
  categoryBreakdown: { kategori: string; count: number; percentage: number }[];
  genderBreakdown: { gender: string; count: number; percentage: number }[];
  scoreDistribution: { score: number; count: number; percentage: number }[];
  questionAverages: { questionId: string; questionText: string; themeTitle: string; average: number }[];
}

export async function getAnalytics(): Promise<AnalyticsSummary> {
  const responses = await getAllResponses();
  const total = responses.length;

  if (total === 0) {
    return {
      totalResponses: 0,
      averageScoreOverall: 0,
      highestTheme: { title: "-", score: 0 },
      lowestTheme: { title: "-", score: 0 },
      themeAverages: SURVEY_THEMES.map((theme) => ({
        id: theme.id,
        title: theme.title,
        average: 0,
        count: 0,
      })),
      categoryBreakdown: [],
      genderBreakdown: [],
      scoreDistribution: [1, 2, 3, 4].map((s) => ({ score: s, count: 0, percentage: 0 })),
      questionAverages: [],
    };
  }

  const totalScoreSum = responses.reduce((acc, r) => acc + r.totalScore, 0);
  const averageScoreOverall = Number((totalScoreSum / total).toFixed(2));

  // Theme Averages
  const themeAverages = SURVEY_THEMES.map((theme) => {
    let sum = 0;
    let count = 0;
    theme.questions.forEach((q) => {
      responses.forEach((r) => {
        if (r.answers[q.id] !== undefined) {
          sum += r.answers[q.id];
          count++;
        }
      });
    });
    const avg = count > 0 ? Number((sum / count).toFixed(2)) : 0;
    return {
      id: theme.id,
      title: theme.title,
      average: avg,
      count,
    };
  });

  const sortedThemes = [...themeAverages].filter(t => t.count > 0).sort((a, b) => b.average - a.average);
  const highestTheme = sortedThemes.length > 0 ? { title: sortedThemes[0].title, score: sortedThemes[0].average } : { title: "-", score: 0 };
  const lowestTheme = sortedThemes.length > 0 ? { title: sortedThemes[sortedThemes.length - 1].title, score: sortedThemes[sortedThemes.length - 1].average } : { title: "-", score: 0 };

  // Category Breakdown
  const catCounts: Record<string, number> = {};
  responses.forEach((r) => {
    catCounts[r.kategori] = (catCounts[r.kategori] || 0) + 1;
  });
  const categoryBreakdown = Object.entries(catCounts).map(([kategori, count]) => ({
    kategori,
    count,
    percentage: Math.round((count / total) * 100),
  }));

  // Gender Breakdown (Ikhwan vs Akhwat)
  const genderCounts: Record<string, number> = { Ikhwan: 0, Akhwat: 0 };
  responses.forEach((r) => {
    const g = r.jenisKelamin === "Akhwat" ? "Akhwat" : "Ikhwan";
    genderCounts[g] = (genderCounts[g] || 0) + 1;
  });
  const genderBreakdown = [
    { gender: "Ikhwan", count: genderCounts.Ikhwan, percentage: Math.round((genderCounts.Ikhwan / total) * 100) },
    { gender: "Akhwat", count: genderCounts.Akhwat, percentage: Math.round((genderCounts.Akhwat / total) * 100) },
  ];

  // Likert Distribution (Skala 1 - 4)
  const distCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  let allAnswerCount = 0;
  responses.forEach((r) => {
    Object.values(r.answers).forEach((score) => {
      const rounded = Math.min(4, Math.max(1, Math.round(score)));
      distCounts[rounded] = (distCounts[rounded] || 0) + 1;
      allAnswerCount++;
    });
  });

  const scoreDistribution = [1, 2, 3, 4].map((score) => ({
    score,
    count: distCounts[score],
    percentage: allAnswerCount > 0 ? Math.round((distCounts[score] / allAnswerCount) * 100) : 0,
  }));

  // Question Averages (Seluruh 35 Butir KAIH)
  const questionAverages: AnalyticsSummary["questionAverages"] = [];
  SURVEY_THEMES.forEach((theme) => {
    theme.questions.forEach((q) => {
      let sum = 0;
      let count = 0;
      responses.forEach((r) => {
        if (r.answers[q.id] !== undefined) {
          sum += r.answers[q.id];
          count++;
        }
      });
      questionAverages.push({
        questionId: q.id,
        questionText: q.question,
        themeTitle: theme.title,
        average: count > 0 ? Number((sum / count).toFixed(2)) : 0,
      });
    });
  });

  return {
    totalResponses: total,
    averageScoreOverall,
    highestTheme,
    lowestTheme,
    themeAverages,
    categoryBreakdown,
    genderBreakdown,
    scoreDistribution,
    questionAverages,
  };
}
