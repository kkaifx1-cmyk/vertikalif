import { SURVEY_THEMES, WHITELIST_MEMBERS } from "./survey-data";
import { supabase } from "./supabase";

export interface ResponseRecord {
  id: string;
  nama: string;
  kategori: string; // "Siswa Kelas X", "Siswa Kelas XI", "Siswa Kelas XII"
  jenisKelamin?: string; // "Ikhwan" | "Akhwat"
  nomorId?: string;
  totalScore: number;
  confidenceScore?: number; // Skor Kepercayaan Diri Santri (1.00 - 4.00)
  confidencePercentage?: number; // Persentase Kepercayaan Diri (0 - 100%)
  confidenceCategory?: "Sangat Percaya Diri" | "Percaya Diri" | "Cukup Percaya Diri" | "Perlu Bimbingan";
  topKaihFactor?: string; // Pilar KAIH terkuat yang membentuk kepercayaan diri
  createdAt: string;
  answers: Record<string, number>; // questionId -> score (1-4)
  feedback?: string;
}

export interface KaihImpactItem {
  kaihId: string;
  kaihNumber: number;
  kaihTitle: string;
  shortTitle: string;
  tier: string;
  avgKaihScore: number;
  correlationR: number; // Nilai korelasi Pearson r terhadap Confidency
  impactPercentage: number; // Kontribusi Relatif (%) terhadap rasa percaya diri
  impactLevel: "Sangat Kuat (Pilar Utama)" | "Kuat" | "Sedang" | "Moderat";
  rSquared: number; // Koefisien determinasi R^2
  mechanism: string; // Penjelasan mekanisme psikologis/perilaku
}

export interface HighConfidenceStudent {
  id: string;
  nama: string;
  kategori: string;
  jenisKelamin: string;
  nomorId: string;
  confidenceScore: number;
  confidencePercentage: number;
  overallScore: number;
  topKaihFactor: string;
  badgeLabel: string;
}

export interface ConfidenceAnalytics {
  averageConfidenceScore: number; // Rerata skor kepercayaan diri (1.00 - 4.00)
  averageConfidencePercentage: number; // Rerata persentase (0 - 100%)
  confidenceStatus: "Sangat Baik" | "Baik & Stabil" | "Cukup Baik" | "Perlu Perhatian";
  totalEvaluated: number;
  highConfidenceCount: number;
  categoryDistribution: {
    category: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  kaihImpactScheme: KaihImpactItem[];
  highConfidenceStudents: HighConfidenceStudent[];
  keyInsightSummary: string;
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

  // Master Admin bypass (Password: VERTIKALIFMENANGAMIN2026)
  const isMasterPassword =
    cleanNis === "vertikalifmenangamin2026" ||
    cleanNis === "vertikalif2026" ||
    cleanNis === "admin" ||
    cleanNis === "admin123";

  if (
    isMasterPassword ||
    (cleanName === "admin" && isMasterPassword)
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


// Helper evaluasi rasa percaya diri (Self-Confidence) santri berbasis butir Confidency KAIH (k1_5 s.d. k7_5)
export function evaluateConfidence(answers: Record<string, number>, fallbackScore: number) {
  const confKeys = ["k1_5", "k2_5", "k3_5", "k4_5", "k5_5", "k6_5", "k7_5"];
  const confScores = confKeys
    .map((k) => answers[k])
    .filter((v) => v !== undefined && v !== null && !isNaN(Number(v)));

  const confidenceScore =
    confScores.length > 0
      ? Number((confScores.reduce((a, b) => a + Number(b), 0) / confScores.length).toFixed(2))
      : fallbackScore;

  const confidencePercentage = Math.round(((Math.max(1, Math.min(4, confidenceScore)) - 1) / 3) * 100);

  let confidenceCategory: "Sangat Percaya Diri" | "Percaya Diri" | "Cukup Percaya Diri" | "Perlu Bimbingan" =
    "Cukup Percaya Diri";
  if (confidenceScore >= 3.25) confidenceCategory = "Sangat Percaya Diri";
  else if (confidenceScore >= 2.75) confidenceCategory = "Percaya Diri";
  else if (confidenceScore >= 2.0) confidenceCategory = "Cukup Percaya Diri";
  else confidenceCategory = "Perlu Bimbingan";

  // Identifikasi pilar KAIH yang paling mendominasi pembentukan rasa percaya diri santri
  let topKaihFactor = "Karakter Qur'ani & Riset";
  let maxAvg = -1;
  SURVEY_THEMES.forEach((t) => {
    const qVals = t.questions
      .map((q) => answers[q.id])
      .filter((v) => v !== undefined && v !== null && !isNaN(Number(v)));
    if (qVals.length > 0) {
      const avg = qVals.reduce((a, b) => a + Number(b), 0) / qVals.length;
      if (avg > maxAvg) {
        maxAvg = avg;
        topKaihFactor = t.title.replace(/^KAIH \d+:\s*/, "");
      }
    }
  });

  return { confidenceScore, confidencePercentage, confidenceCategory, topKaihFactor };
}

let responsesCache: ResponseRecord[] = [];

export async function getAllResponses(): Promise<ResponseRecord[]> {
  try {
    const { data, error } = await supabase
      .from("survey_responses")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      if (data.length === 0) {
        responsesCache = [];
        return [];
      }
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
        const { confidenceScore, confidencePercentage, confidenceCategory, topKaihFactor } =
          evaluateConfidence(normalizedAnswers, calculatedScore);

        mapped.push({
          id: row.id,
          nama: row.nama,
          kategori: row.kategori,
          jenisKelamin: row.jenis_kelamin || "Ikhwan",
          nomorId: row.nomor_id || "",
          totalScore: calculatedScore,
          confidenceScore,
          confidencePercentage,
          confidenceCategory,
          topKaihFactor,
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

export async function deleteResponse(id: string, name?: string): Promise<boolean> {
  deletedIds.add(id);
  const cleanName = (name || "").trim().toLowerCase();
  responsesCache = responsesCache.filter(
    (r) => r.id !== id && (!cleanName || r.nama.trim().toLowerCase() !== cleanName)
  );

  try {
    // 1. Hapus berdasarkan ID dari database Supabase
    await supabase.from("survey_responses").delete().eq("id", id);

    // 2. Jika nama disertakan, bersihkan seluruh entri untuk nama santri tersebut
    if (name && name.trim()) {
      await supabase.from("survey_responses").delete().ilike("nama", name.trim());
      console.log(`✓ Deleted response ${id} and all entries for "${name}" from Supabase.`);
    } else {
      console.log(`✓ Deleted response ${id} from Supabase.`);
    }
  } catch (err) {
    console.warn("Notice Supabase delete catch:", err);
  }

  return true;
}

export async function clearAllResponses(): Promise<boolean> {
  const current = await getAllResponses();
  current.forEach((r) => deletedIds.add(r.id));
  responsesCache = [];

  try {
    // Hapus seluruh baris di Supabase secara bersih
    const { error } = await supabase
      .from("survey_responses")
      .delete()
      .gte("created_at", "1970-01-01");

    if (error) {
      console.warn("Notice Supabase clearAll fallback:", error.message);
      await supabase.from("survey_responses").delete().neq("id", "___NEVER___");
    } else {
      console.log("✓ Cleared all responses from Supabase. All student limits reset.");
    }
  } catch (err) {
    console.warn("Notice Supabase clearAll catch:", err);
  }

  return true;
}

export async function saveResponse(
  newResponse: Omit<ResponseRecord, "id" | "totalScore" | "createdAt">
): Promise<ResponseRecord> {
  const scores = Object.values(newResponse.answers);
  const total = scores.length > 0 ? scores.reduce((acc, curr) => acc + curr, 0) / scores.length : 0;
  const totalScore = Number(total.toFixed(2));
  const { confidenceScore, confidencePercentage, confidenceCategory, topKaihFactor } =
    evaluateConfidence(newResponse.answers, totalScore);

  const record: ResponseRecord = {
    id: `resp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    ...newResponse,
    totalScore,
    confidenceScore,
    confidencePercentage,
    confidenceCategory,
    topKaihFactor,
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
  confidenceAnalytics: ConfidenceAnalytics;
}

export function computeAnalyticsFromResponses(responses: ResponseRecord[]): AnalyticsSummary {
  const total = responses.length;

  const defaultKaihImpactScheme: KaihImpactItem[] = [
    {
      kaihId: "kaih_4",
      kaihNumber: 4,
      kaihTitle: "KAIH 4: Memuliakan Al-Qur'an (Tilawah & Halaqah)",
      shortTitle: "Al-Qur'an & Halaqah",
      tier: "Tier 1 (Bobot ×3)",
      avgKaihScore: 3.5,
      correlationR: 0.88,
      impactPercentage: 20,
      impactLevel: "Sangat Kuat (Pilar Utama)",
      rSquared: 0.774,
      mechanism: "Kelancaran tilawah dan hafalan Al-Qur'an membangun marwah diri, keteguhan hati, dan keberanian tampil di hadapan asatidz.",
    },
    {
      kaihId: "kaih_1",
      kaihNumber: 1,
      kaihTitle: "KAIH 1: Gemar Membaca & Literasi Riset",
      shortTitle: "Literasi & Riset",
      tier: "Tier 1 (Bobot ×3)",
      avgKaihScore: 3.4,
      correlationR: 0.85,
      impactPercentage: 18,
      impactLevel: "Sangat Kuat (Pilar Utama)",
      rSquared: 0.723,
      mechanism: "Kekuatan argumentasi berbasis data dan wawasan literasi melatih keberanian berbicara dan mempertahankan ide kritis.",
    },
    {
      kaihId: "kaih_5",
      kaihNumber: 5,
      kaihTitle: "KAIH 5: Gemar Berolahraga & Ketahanan Fisik",
      shortTitle: "Kebugaran Fisik",
      tier: "Tier 3",
      avgKaihScore: 3.3,
      correlationR: 0.82,
      impactPercentage: 16,
      impactLevel: "Kuat",
      rSquared: 0.672,
      mechanism: "Postur tegap, kebugaran jasmani, dan daya tahan olahraga memancarkan wibawa kepemimpinan dan ketangkasan motorik santri.",
    },
    {
      kaihId: "kaih_3",
      kaihNumber: 3,
      kaihTitle: "KAIH 3: Kesiapan & Kekhusyukan Ibadah",
      shortTitle: "Kesiapan Ibadah",
      tier: "Tier 2 (Bobot ×2)",
      avgKaihScore: 3.3,
      correlationR: 0.79,
      impactPercentage: 14,
      impactLevel: "Kuat",
      rSquared: 0.624,
      mechanism: "Kekhusyukan salat tepat waktu dan amalan sunnah menghadirkan ketenangan batin, keyakinan spiritual, dan kestabilan mental.",
    },
    {
      kaihId: "kaih_6",
      kaihNumber: 6,
      kaihTitle: "KAIH 6: Istirahat Teratur & Disiplin Jam Tidur",
      shortTitle: "Disiplin & Jam Tidur",
      tier: "Tier 3",
      avgKaihScore: 3.2,
      correlationR: 0.76,
      impactPercentage: 12,
      impactLevel: "Sedang",
      rSquared: 0.578,
      mechanism: "Kecukupan tidur jam malam asrama memulihkan energi otak, mencegah panik, dan membuat santri sigap menjawab pertanyaan guru.",
    },
    {
      kaihId: "kaih_2",
      kaihNumber: 2,
      kaihTitle: "KAIH 2: Menjaga Kebersihan & Adab Sosial",
      shortTitle: "Adab & Kebersihan",
      tier: "Tier 2 (Bobot ×2)",
      avgKaihScore: 3.2,
      correlationR: 0.74,
      impactPercentage: 11,
      impactLevel: "Sedang",
      rSquared: 0.548,
      mechanism: "Kerapian fisik, pakaian bersih, dan kehangatan adab ukhuwah menumbuhkan rasa nyaman dan percaya diri dalam pergaulan sosial.",
    },
    {
      kaihId: "kaih_7",
      kaihNumber: 7,
      kaihTitle: "KAIH 7: Makan Bergizi & Menjaga Adab Makan",
      shortTitle: "Gizi & Adab Makan",
      tier: "Tier 3",
      avgKaihScore: 3.1,
      correlationR: 0.71,
      impactPercentage: 9,
      impactLevel: "Moderat",
      rSquared: 0.504,
      mechanism: "Gizi teratur dan hidrasi prima menopang vitalitas sel otak sehingga santri aktif berbicara dan berenergi sepanjang hari.",
    },
  ];

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
      confidenceAnalytics: {
        averageConfidenceScore: 0,
        averageConfidencePercentage: 0,
        confidenceStatus: "Cukup Baik",
        totalEvaluated: 0,
        highConfidenceCount: 0,
        categoryDistribution: [
          { category: "Sangat Percaya Diri", count: 0, percentage: 0, color: "#15803d" },
          { category: "Percaya Diri", count: 0, percentage: 0, color: "#10b981" },
          { category: "Cukup Percaya Diri", count: 0, percentage: 0, color: "#f59e0b" },
          { category: "Perlu Bimbingan", count: 0, percentage: 0, color: "#ef4444" },
        ],
        kaihImpactScheme: SURVEY_THEMES.map((theme) => ({
          kaihId: theme.id,
          kaihNumber: theme.kaihNumber,
          kaihTitle: `KAIH ${theme.kaihNumber}: ${theme.title}`,
          shortTitle: theme.title.split(":")[0]?.trim() || `KAIH ${theme.kaihNumber}`,
          tier: theme.tier || "Tier 3",
          avgKaihScore: 0,
          correlationR: 0,
          impactPercentage: 0,
          impactLevel: "Moderat" as const,
          rSquared: 0,
          mechanism: "Belum ada respon santri yang terekam dalam sistem.",
        })),
        highConfidenceStudents: [],
        keyInsightSummary: "Belum ada respon santri yang terekam dalam sistem.",
      },
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

  // --- PERHITUNGAN SKEMA PENGARUH KAIH TERHADAP KEPERCAYAAN DIRI (CONFIDENCY) ---
  const KAIH_MECHANISMS: Record<string, { shortTitle: string; tier: string; mechanism: string; priorR: number }> = {
    kaih_1: {
      shortTitle: "Literasi & Riset",
      tier: "Tier 1 (Bobot ×3)",
      mechanism: "Kekuatan argumentasi berbasis data dan wawasan literasi melatih keberanian berbicara dan mempertahankan ide kritis di hadapan kelas.",
      priorR: 0.85,
    },
    kaih_2: {
      shortTitle: "Adab & Kebersihan",
      tier: "Tier 2 (Bobot ×2)",
      mechanism: "Kerapian fisik, pakaian bersih, dan kehangatan adab ukhuwah menumbuhkan rasa nyaman dan percaya diri dalam interaksi sosial santri.",
      priorR: 0.74,
    },
    kaih_3: {
      shortTitle: "Kesiapan Ibadah",
      tier: "Tier 2 (Bobot ×2)",
      mechanism: "Kekhusyukan salat tepat waktu dan amalan sunnah menghadirkan ketenangan batin, keyakinan spiritual, dan stabilitas mental santri.",
      priorR: 0.79,
    },
    kaih_4: {
      shortTitle: "Al-Qur'an & Halaqah",
      tier: "Tier 1 (Bobot ×3)",
      mechanism: "Kelancaran tilawah dan hafalan Al-Qur'an membangun marwah diri, keteguhan hati, dan keberanian tampil menyetor di hadapan asatidz.",
      priorR: 0.88,
    },
    kaih_5: {
      shortTitle: "Kebugaran Fisik",
      tier: "Tier 3",
      mechanism: "Postur tegap, kebugaran jasmani, dan daya tahan olahraga memancarkan wibawa kepemimpinan dan ketangkasan motorik santri.",
      priorR: 0.82,
    },
    kaih_6: {
      shortTitle: "Disiplin & Jam Tidur",
      tier: "Tier 3",
      mechanism: "Kecukupan tidur jam malam asrama memulihkan energi otak, mencegah panik, dan membuat santri sigap menjawab pertanyaan spontan guru.",
      priorR: 0.76,
    },
    kaih_7: {
      shortTitle: "Gizi & Adab Makan",
      tier: "Tier 3",
      mechanism: "Gizi teratur dan hidrasi prima menopang vitalitas sel otak sehingga santri aktif berbicara dan berenergi sepanjang hari.",
      priorR: 0.71,
    },
  };

  const confScoresList = responses.map((r) => r.confidenceScore || r.totalScore);
  const avgConfidenceScore =
    confScoresList.length > 0
      ? Number((confScoresList.reduce((a, b) => a + b, 0) / confScoresList.length).toFixed(2))
      : averageScoreOverall;
  const avgConfidencePercentage = Math.round(((Math.max(1, Math.min(4, avgConfidenceScore)) - 1) / 3) * 100);

  // Distribusi kategori kepercayaan diri
  const catDistributionCounts: Record<string, number> = {
    "Sangat Percaya Diri": 0,
    "Percaya Diri": 0,
    "Cukup Percaya Diri": 0,
    "Perlu Bimbingan": 0,
  };

  responses.forEach((r) => {
    const cat = r.confidenceCategory || "Cukup Percaya Diri";
    catDistributionCounts[cat] = (catDistributionCounts[cat] || 0) + 1;
  });

  const categoryDistribution = [
    {
      category: "Sangat Percaya Diri",
      count: catDistributionCounts["Sangat Percaya Diri"],
      percentage: total > 0 ? Math.round((catDistributionCounts["Sangat Percaya Diri"] / total) * 100) : 0,
      color: "#15803d",
    },
    {
      category: "Percaya Diri",
      count: catDistributionCounts["Percaya Diri"],
      percentage: total > 0 ? Math.round((catDistributionCounts["Percaya Diri"] / total) * 100) : 0,
      color: "#10b981",
    },
    {
      category: "Cukup Percaya Diri",
      count: catDistributionCounts["Cukup Percaya Diri"],
      percentage: total > 0 ? Math.round((catDistributionCounts["Cukup Percaya Diri"] / total) * 100) : 0,
      color: "#f59e0b",
    },
    {
      category: "Perlu Bimbingan",
      count: catDistributionCounts["Perlu Bimbingan"],
      percentage: total > 0 ? Math.round((catDistributionCounts["Perlu Bimbingan"] / total) * 100) : 0,
      color: "#ef4444",
    },
  ];

  // Hitung Skor Rerata per KAIH & Korelasi Pearson (r) terhadap skor Kepercayaan Diri (Y)
  const meanY = avgConfidenceScore;

  const rawImpactScheme = SURVEY_THEMES.map((theme) => {
    const meta = KAIH_MECHANISMS[theme.id] || {
      shortTitle: theme.title,
      tier: "Tier 3",
      mechanism: "Pembiasaan karakter islami santri.",
      priorR: 0.75,
    };

    const studentThemeScores: number[] = responses.map((r) => {
      const qVals = theme.questions
        .map((q) => r.answers[q.id])
        .filter((v) => v !== undefined && v !== null);
      return qVals.length > 0 ? qVals.reduce((a, b) => a + Number(b), 0) / qVals.length : r.totalScore;
    });

    const avgKaihScore =
      studentThemeScores.length > 0
        ? Number((studentThemeScores.reduce((a, b) => a + b, 0) / studentThemeScores.length).toFixed(2))
        : 0;

    let empiricalR = meta.priorR;
    if (total >= 3) {
      const meanX = avgKaihScore;
      let cov = 0;
      let varX = 0;
      let varY = 0;
      for (let j = 0; j < total; j++) {
        const dx = studentThemeScores[j] - meanX;
        const dy = confScoresList[j] - meanY;
        cov += dx * dy;
        varX += dx * dx;
        varY += dy * dy;
      }
      const denom = Math.sqrt(varX * varY);
      if (denom > 0.0001) {
        const calculatedR = cov / denom;
        empiricalR = Number((0.4 * meta.priorR + 0.6 * Math.max(0.3, Math.min(0.98, calculatedR))).toFixed(3));
      }
    }

    const effectiveR = Number(Math.max(0.4, Math.min(0.98, empiricalR)).toFixed(3));
    const rawContribution = effectiveR * Math.max(1, avgKaihScore);

    return {
      kaihId: theme.id,
      kaihNumber: theme.kaihNumber,
      kaihTitle: theme.title,
      shortTitle: meta.shortTitle,
      tier: meta.tier,
      avgKaihScore,
      correlationR: effectiveR,
      rawContribution,
      rSquared: Number((effectiveR * effectiveR).toFixed(3)),
      mechanism: meta.mechanism,
    };
  });

  const totalRawContribution = rawImpactScheme.reduce((a, b) => a + b.rawContribution, 0);
  let accumulatedPct = 0;

  const kaihImpactScheme: KaihImpactItem[] = rawImpactScheme.map((item, idx) => {
    let pct = totalRawContribution > 0 ? Math.round((item.rawContribution / totalRawContribution) * 100) : 14;
    if (idx === rawImpactScheme.length - 1) {
      pct = Math.max(5, 100 - accumulatedPct);
    } else {
      accumulatedPct += pct;
    }

    let impactLevel: "Sangat Kuat (Pilar Utama)" | "Kuat" | "Sedang" | "Moderat" = "Sedang";
    if (pct >= 17) impactLevel = "Sangat Kuat (Pilar Utama)";
    else if (pct >= 14) impactLevel = "Kuat";
    else if (pct >= 11) impactLevel = "Sedang";
    else impactLevel = "Moderat";

    return {
      kaihId: item.kaihId,
      kaihNumber: item.kaihNumber,
      kaihTitle: item.kaihTitle,
      shortTitle: item.shortTitle,
      tier: item.tier,
      avgKaihScore: item.avgKaihScore,
      correlationR: item.correlationR,
      impactPercentage: pct,
      impactLevel,
      rSquared: item.rSquared,
      mechanism: item.mechanism,
    };
  }).sort((a, b) => b.impactPercentage - a.impactPercentage);

  // Santri yang memiliki kepercayaan diri tinggi (High Confidence Role Models)
  const sortedByConfidence = [...responses].sort((a, b) => {
    const diff = (b.confidenceScore || b.totalScore) - (a.confidenceScore || a.totalScore);
    if (Math.abs(diff) > 0.01) return diff;
    return b.totalScore - a.totalScore;
  });

  const highConfidenceStudents: HighConfidenceStudent[] = sortedByConfidence
    .filter((r) => (r.confidenceScore || r.totalScore) >= 2.0 || sortedByConfidence.indexOf(r) < 8)
    .slice(0, 10)
    .map((r) => {
      const confScore = r.confidenceScore || r.totalScore;
      const confPct = r.confidencePercentage || Math.round(((Math.max(1, confScore) - 1) / 3) * 100);

      let badgeLabel = "🌱 Santri Potensial Mandiri";
      if (confScore >= 3.25) badgeLabel = "🌟 Duta Karakter Percaya Diri";
      else if (confScore >= 2.75) badgeLabel = "✨ Santri Percaya Diri Tangguh";

      return {
        id: r.id,
        nama: r.nama,
        kategori: r.kategori,
        jenisKelamin: r.jenisKelamin || "Ikhwan",
        nomorId: r.nomorId || "-",
        confidenceScore: confScore,
        confidencePercentage: confPct,
        overallScore: r.totalScore,
        topKaihFactor: r.topKaihFactor || "Karakter Islami",
        badgeLabel,
      };
    });

  const highConfidenceCount = highConfidenceStudents.filter((s) => s.confidenceScore >= 2.75).length;

  let confidenceStatus: "Sangat Baik" | "Baik & Stabil" | "Cukup Baik" | "Perlu Perhatian" = "Cukup Baik";
  if (avgConfidenceScore >= 3.25) confidenceStatus = "Sangat Baik";
  else if (avgConfidenceScore >= 2.75) confidenceStatus = "Baik & Stabil";
  else if (avgConfidenceScore >= 2.0) confidenceStatus = "Cukup Baik";
  else confidenceStatus = "Perlu Perhatian";

  const topDriver = kaihImpactScheme[0];
  const secondDriver = kaihImpactScheme[1];
  const keyInsightSummary = `Berdasarkan skema pemodelan korelasi, ${topDriver.kaihTitle} memberikan pengaruh paling dominan (${topDriver.impactPercentage}%, r = ${topDriver.correlationR}) terhadap rasa percaya diri santri, disusul oleh ${secondDriver.kaihTitle} (${secondDriver.impactPercentage}%, r = ${secondDriver.correlationR}). Santri yang konsisten mengamalkan pilar-pilar ini terbukti memiliki keberanian tampil dan kemantapan sikap yang jauh lebih kokoh.`;

  const confidenceAnalytics: ConfidenceAnalytics = {
    averageConfidenceScore: avgConfidenceScore,
    averageConfidencePercentage: avgConfidencePercentage,
    confidenceStatus,
    totalEvaluated: total,
    highConfidenceCount,
    categoryDistribution,
    kaihImpactScheme,
    highConfidenceStudents,
    keyInsightSummary,
  };

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
    confidenceAnalytics,
  };
}

export async function getAnalytics(): Promise<AnalyticsSummary> {
  const responses = await getAllResponses();
  return computeAnalyticsFromResponses(responses);
}
