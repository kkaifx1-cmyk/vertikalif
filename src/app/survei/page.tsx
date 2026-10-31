"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Users,
  Sun,
  Sparkles,
  Activity,
  Moon,
  UtensilsCrossed,
  CheckCircle2,
  Send,
  AlertCircle,
  RotateCcw,
  UserCheck,
  ShieldCheck,
  Search,
  Check,
  BookMarked,
  Compass,
  Globe,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LIKERT_OPTIONS,
  STUDENT_CLASSES,
  GENDER_OPTIONS,
  STUDENT_ROSTER,
  JURUSAN_OPTIONS,
  getKaihThemes,
  SurveyTheme,
} from "@/lib/survey-data";
import { PrivacyModal } from "@/components/privacy-modal";

const THEME_ICONS: Record<string, React.ElementType> = {
  BookOpen,
  Users,
  Sun,
  Sparkles,
  Activity,
  Moon,
  UtensilsCrossed,
};

export default function SurveyPage() {
  // Pop-up Kebijakan Privasi
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  // Jurusan / Peminatan Santri
  const [selectedJurusan, setSelectedJurusan] = useState<string>("tahfizh");

  // Dynamic 7 KAIH based on selected Jurusan
  const currentThemes: SurveyTheme[] = useMemo(
    () => getKaihThemes(selectedJurusan),
    [selectedJurusan]
  );

  // Wizard Steps:
  // 0: Identitas Santri
  // 1: KAIH 1 (Gemar Membaca & Literasi)
  // 2: KAIH 2 (Bermasyarakat & Adab Sosial)
  // 3: KAIH 3 (Kesiapan Pagi & Produktivitas)
  // 4: KAIH 4 (Beribadah & Time Qur'an / Belajar Mandiri)
  // 5: KAIH 5 (Olahraga & Kebugaran Jasmani)
  // 6: KAIH 6 (Istirahat & Jam Tidur Asrama)
  // 7: KAIH 7 (Makan Bergizi & Adab Makan)
  // 8: Ucapan Terima Kasih & Konfirmasi Penutup
  // 9: Selesai / Success Screen
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Respondent Identity State (Khusus Santri Ikhwan & Akhwat)
  const [identity, setIdentity] = useState({
    nama: "",
    kategori: "",
    jenisKelamin: "Ikhwan",
    nomorId: "",
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>("" );
  const [selectedRombel, setSelectedRombel] = useState<string>("" );
  const [searchQuery, setSearchQuery] = useState<string>("" );
  const [isManualName, setIsManualName] = useState<boolean>(false);

  // Survey Answers: Record<questionId, score 1-4>
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<string>("" );

  // Total questions count (35 butir across 7 KAIH)
  const totalQuestionsCount = useMemo(
    () => currentThemes.reduce((acc, t) => acc + t.questions.length, 0),
    [currentThemes]
  );

  // Derivasi daftar rombel sesuai kelas yang dipilih
  const availableRombels = useMemo(
    () =>
      Array.from(
        new Set(
          STUDENT_ROSTER.filter((s) => s.kelas === identity.kategori).map(
            (s) => s.rombel
          )
        )
      ).filter(Boolean) as string[],
    [identity.kategori]
  );

  // Filter daftar siswa berdasarkan kelas, rombel, dan kata kunci pencarian
  const filteredStudents = useMemo(() => {
    return STUDENT_ROSTER.filter((s) => {
      if (s.kelas !== identity.kategori) return false;
      if (selectedRombel && s.rombel !== selectedRombel) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.nama.toLowerCase().includes(q) ||
          (s.rombel && s.rombel.toLowerCase().includes(q)) ||
          s.nis.includes(q)
        );
      }
      return true;
    });
  }, [identity.kategori, selectedRombel, searchQuery]);

  // Helper to extract grade prefix ("X", "XI", "XII")
  const getGradePrefix = (gradeValue: string) => {
    if (gradeValue.includes("XII")) return "XII";
    if (gradeValue.includes("XI")) return "XI";
    return "X";
  };

  const currentPrefix = getGradePrefix(identity.kategori || "Siswa Kelas X");
  const maxRombelNumber = identity.kategori === "Siswa Kelas XII" ? 9 : 10;
  const rombelNumbers = Array.from({ length: maxRombelNumber }, (_, i) => i + 1);

  // Handler when Tingkat Kelas changes
  const handleGradeChange = (gradeValue: string) => {
    const newPrefix = getGradePrefix(gradeValue);
    setIdentity((prev) => ({
      ...prev,
      kategori: gradeValue,
      nama: "",
      nomorId: "",
    }));
    setSelectedStudentId("");
    if (selectedRombel) {
      const parts = selectedRombel.split("-");
      const rombelNum = parts.length > 1 ? parts[1] : "";
      const maxNum = gradeValue === "Siswa Kelas XII" ? 9 : 10;
      if (rombelNum && Number(rombelNum) <= maxNum) {
        setSelectedRombel(`${newPrefix}-${rombelNum}`);
      } else {
        setSelectedRombel("");
      }
    }
    setSearchQuery("");
    setIsManualName(false);
    setValidationError("");
  };

  // Handler when Rombel Number (1-10) is selected
  const handleRombelSelect = (rombelCode: string) => {
    const newRombel = selectedRombel === rombelCode ? "" : rombelCode;
    setSelectedRombel(newRombel);
    setSelectedStudentId("");
    setSearchQuery("");
    setIsManualName(false);
    setValidationError("");
  };

  // Handler when Student Name is selected
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    setValidationError("");

    if (studentId === "manual") {
      setIsManualName(true);
      setIdentity((prev) => ({ ...prev, nama: "", nomorId: "" }));
      return;
    }

    if (!studentId) {
      setIsManualName(false);
      setIdentity((prev) => ({ ...prev, nama: "", nomorId: "" }));
      return;
    }

    const found = STUDENT_ROSTER.find((s) => s.id === studentId);
    if (found) {
      setIsManualName(false);
      setIdentity((prev) => ({
        ...prev,
        nama: found.nama,
        jenisKelamin: found.jenisKelamin,
        nomorId: found.nis,
      }));
    }
  };

  // UI State
  const [validationError, setValidationError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<{ id: string; totalScore: number } | null>(null);

  // Total steps = 9 (0: Identitas, 1..7: KAIH 1..7, 8: Penutup)
  const totalSteps = currentThemes.length + 2;
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  // Handle Score Selection
  const handleSelectScore = (questionId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
    setValidationError("");
  };

  // Step Validation
  const validateCurrentStep = (): boolean => {
    setValidationError("");

    // Step 0: Identitas
    if (currentStep === 0) {
      if (!identity.kategori) {
        setValidationError("Mohon pilih Tingkat Kelas Anda terlebih dahulu.");
        return false;
      }
      if (!identity.nama.trim()) {
        setValidationError("Mohon tentukan Nama Lengkap Anda dari daftar kelas yang sesuai.");
        return false;
      }
      return true;
    }

    // Step 1 to 7: KAIH Pages
    const themeIndex = currentStep - 1;
    if (themeIndex >= 0 && themeIndex < currentThemes.length) {
      const currentTheme = currentThemes[themeIndex];
      const unanswered = currentTheme.questions.filter((q) => !answers[q.id]);
      if (unanswered.length > 0) {
        setValidationError(
          `Mohon beri penilaian untuk seluruh ${currentTheme.questions.length} butir pertanyaan pada ${currentTheme.title} sebelum melanjutkan.`
        );
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setValidationError("");
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setValidationError("");

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: identity.nama,
          kategori: identity.kategori,
          jenisKelamin: identity.jenisKelamin,
          nomorId: identity.nomorId,
          answers,
          feedback,
        }),
      });

      const result = await response.json();
      if (result.success && result.data) {
        setSubmittedData({
          id: result.data.id,
          totalScore: result.data.totalScore,
        });
        setCurrentStep(currentThemes.length + 2); // Go to Success Screen (Step 9)
      } else {
        setValidationError(result.message || "Gagal menyimpan respon. Silakan periksa kembali formulir Anda.");
      }
    } catch {
      setValidationError("Terjadi kendala jaringan saat mengirimkan respon. Silakan coba kembali.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSurvey = () => {
    setIdentity({ nama: "", kategori: "", jenisKelamin: "Ikhwan", nomorId: "" });
    setSelectedStudentId("");
    setSelectedRombel("");
    setSearchQuery("");
    setIsManualName(false);
    setAnswers({});
    setFeedback("");
    setCurrentStep(0);
    setSubmittedData(null);
  };

  // Dimension badge style helper
  const getDimensionBadgeClass = (dim: string) => {
    switch (dim) {
      case "Action":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Atensi Selektif":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Atensi Terbuka":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "Atensi Eksekutif":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Confidency":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  // STEP 9: Success / Closing Screen
  if (currentStep === currentThemes.length + 2) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Card className="border-emerald-200 bg-white shadow-xl overflow-hidden text-center rounded-2xl">
          <div className="h-3 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-700" />
          <CardHeader className="pt-8 pb-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 ring-8 ring-emerald-50">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <CardTitle className="mt-4 text-2xl font-extrabold text-slate-900">
              Jazakumullah Khairan Katsiran!
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Terima kasih atas partisipasi dan kontribusi berharga <strong>{identity.nama}</strong> ({identity.kategori}). Seluruh 35 butir respon 7 Karakter Utama Ihsanul Fikri (KAIH) Anda telah berhasil tersimpan dalam sistem.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-6 py-4">
            <div className="text-xs text-slate-500 space-y-1">
              <p>ID Transaksi Respon: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-700">{submittedData?.id}</code></p>
              <p>Setiap butir penilaian Anda dianalisis secara objektif untuk penyempurnaan mutu dan pembentukan karakter santri SMAIT Ihsanul Fikri Magelang.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full">
                  Kembali ke Beranda
                </Button>
              </Link>
              <Button
                variant="outline"
                size="md"
                onClick={handleResetSurvey}
                className="w-full sm:w-auto text-slate-700 hover:text-slate-900 gap-1.5"
              >
                <RotateCcw className="h-4 w-4 text-slate-500" />
                Isi Kuesioner Baru
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Current step label for wizard subtitle
  const getCurrentStepLabel = () => {
    if (currentStep === 0) return "Tahap 1 • Identitas Santri & Jurusan";
    if (currentStep >= 1 && currentStep <= currentThemes.length) {
      const t = currentThemes[currentStep - 1];
      return `KAIH ${t.kaihNumber} dari 7 • ${t.title.replace(/^KAIH \d+:\s*/, "")}`;
    }
    return "Tahap Akhir • Konfirmasi & Kirim";
  };

  return (
    <div className="min-h-screen bg-transparent py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Top Header & Step Indicator */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Profil
            </Link>
            <Badge variant="gold" className="text-xs font-bold">
              Instrumen KAIH Resmi (35 Butir)
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                Instrumen Evaluasi 7 Karakter Santri (KAIH)
              </h1>
              <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                {getCurrentStepLabel()}
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 self-start sm:self-auto bg-slate-100 px-2.5 py-1 rounded-full">
              Langkah {currentStep + 1} dari {totalSteps}
            </span>
          </div>

          {/* Wizard Step Bar */}
          <div className="space-y-2">
            <Progress value={progressPercent} barColor="bg-emerald-600" />
            
            {/* Step Pills Navigation */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => currentStep > 0 && setCurrentStep(0)}
                className={`px-2.5 py-1 rounded-full transition-all shrink-0 cursor-pointer ${
                  currentStep === 0
                    ? "bg-emerald-700 text-white font-bold shadow-xs"
                    : currentStep > 0
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                1. Identitas
              </button>

              {currentThemes.map((t, idx) => {
                const stepNum = idx + 1;
                const isActive = currentStep === stepNum;
                const isPassed = currentStep > stepNum;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      if (currentStep > stepNum) setCurrentStep(stepNum);
                    }}
                    className={`px-2.5 py-1 rounded-full transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-emerald-700 text-white font-bold shadow-xs"
                        : isPassed
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    KAIH {t.kaihNumber}
                  </button>
                );
              })}

              <button
                type="button"
                className={`px-2.5 py-1 rounded-full transition-all shrink-0 ${
                  currentStep === currentThemes.length + 1
                    ? "bg-emerald-700 text-white font-bold shadow-xs"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        {/* STEP 0: IDENTITAS RESPONDEN & PILIHAN PROGRAM/JURUSAN */}
        {currentStep === 0 && (
          <Card className="border-slate-200 bg-white shadow-sm rounded-2xl">
            <CardHeader className="border-b border-slate-100 bg-emerald-50/40 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white text-xs font-bold">
                  1
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    Tahap 1: Identitas & Peminatan Santri
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Tentukan tingkat kelas, nomor rombel, peminatan program belajar, dan nama lengkap Anda.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              {/* 1. Pilih Kelas & Nomor Rombel */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-b border-slate-200/70 pb-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                      1. Pilih Tingkat Kelas & Rombel (1–10) <span className="text-red-500">*</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pilih jenjang kelas Anda (X, XI, XII), kemudian klik nomor rombel santri.
                    </p>
                  </div>
                  {selectedRombel ? (
                    <Badge variant="success" className="text-xs px-3 py-1 font-bold animate-in fade-in self-start sm:self-auto">
                      ✓ Kelas {selectedRombel} Terpilih
                    </Badge>
                  ) : identity.kategori ? (
                    <Badge variant="gold" className="text-[11px] px-2.5 py-0.5 font-semibold self-start sm:self-auto">
                      Pilih Nomor Rombel (1–{maxRombelNumber})
                    </Badge>
                  ) : null}
                </div>

                {/* Tingkat Kelas: X, XI, XII */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Tingkat Kelas:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {STUDENT_CLASSES.map((c) => {
                      const isSelected = identity.kategori === c.value;
                      return (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => handleGradeChange(c.value)}
                          className={`flex items-center justify-center py-2.5 px-3 rounded-lg font-extrabold text-sm sm:text-base transition-all duration-200 cursor-pointer border ${
                            isSelected
                              ? "-translate-y-1 bg-emerald-700 text-white border-emerald-600 shadow-[0_10px_22px_-3px_rgba(21,128,61,0.45),0_0_16px_2px_rgba(34,197,94,0.3)] ring-2 ring-emerald-500/40"
                              : "bg-white text-slate-700 border-slate-300 shadow-xs hover:-translate-y-1.5 hover:border-emerald-500 hover:text-emerald-800 hover:bg-emerald-50/60 hover:shadow-[0_12px_24px_-4px_rgba(21,128,61,0.35),0_0_16px_2px_rgba(34,197,94,0.22)] active:translate-y-0 active:scale-95"
                          }`}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Nomor Rombel: 1 - 10 Interaktif */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Nomor Kelas / Rombel {identity.kategori ? `(${identity.kategori.replace("Siswa ", "")})` : ""}:
                    </div>
                    {identity.kategori && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        1–5: Ikhwan • 6–{maxRombelNumber}: Akhwat
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
                    {rombelNumbers.map((num) => {
                      const rombelCode = `${currentPrefix}-${num}`;
                      const isRombelSelected = selectedRombel === rombelCode;

                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            if (!identity.kategori) {
                              setIdentity((prev) => ({ ...prev, kategori: "Siswa Kelas X" }));
                            }
                            handleRombelSelect(rombelCode);
                          }}
                          className={`group relative flex flex-col items-center justify-center py-2 sm:py-2.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                            isRombelSelected
                              ? "-translate-y-1 bg-gradient-to-b from-amber-400 via-amber-400 to-amber-500 text-slate-950 border-amber-500 shadow-[0_10px_22px_-3px_rgba(245,158,11,0.5),0_0_14px_2px_rgba(251,191,36,0.35)] font-black ring-2 ring-amber-300 scale-105"
                              : "bg-white text-slate-800 border-slate-200 shadow-xs hover:-translate-y-1.5 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-900 hover:shadow-[0_10px_20px_-3px_rgba(21,128,61,0.35),0_0_14px_2px_rgba(34,197,94,0.25)] active:translate-y-0 active:scale-95"
                          }`}
                        >
                          <span className="text-sm sm:text-base font-extrabold leading-tight">
                            {num}
                          </span>
                          <span
                            className={`text-[9px] sm:text-[10px] font-semibold leading-none mt-0.5 ${
                              isRombelSelected ? "text-slate-950 font-bold" : "text-slate-400 group-hover:text-emerald-700"
                            }`}
                          >
                            {rombelCode}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Banner Interaktif Feedback Rombel */}
                {selectedRombel && (
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/90 px-3.5 py-2 text-xs text-emerald-950 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>
                        Rombel <strong>{selectedRombel}</strong> aktif — <strong>{filteredStudents.length} santri</strong> siap dipilih pada daftar nama di bawah.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedRombel("")}
                      className="text-[11px] text-emerald-700 hover:underline font-bold shrink-0 ml-2 cursor-pointer"
                    >
                      Tampilkan Semua
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Pilihan Peminatan / Jurusan Program */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    2. Peminatan / Program Santri <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Menyesuaikan redaksi butir KAIH 1, 3, dan 4
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {JURUSAN_OPTIONS.map((j) => {
                    const isSelected = selectedJurusan === j.id;
                    const IconComp = j.id === "tahfizh" ? BookMarked : j.id === "reguler" ? Compass : Globe;

                    return (
                      <button
                        key={j.id}
                        type="button"
                        onClick={() => setSelectedJurusan(j.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "-translate-y-1 bg-gradient-to-br from-emerald-50 to-emerald-100/70 border-emerald-600 shadow-[0_8px_20px_-3px_rgba(21,128,61,0.35),0_0_12px_1px_rgba(34,197,94,0.25)] ring-2 ring-emerald-500/50"
                            : "bg-white border-slate-200 shadow-xs hover:-translate-y-1 hover:border-emerald-400 hover:shadow-[0_6px_16px_-3px_rgba(21,128,61,0.2)]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className={`p-1.5 rounded-lg ${isSelected ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600"}`}>
                              <IconComp className="h-4 w-4" />
                            </div>
                            {isSelected && (
                              <Badge variant="success" className="text-[10px] py-0 px-2 font-bold">
                                Aktif
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs font-bold text-slate-900 leading-tight">
                            {j.label}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                            {j.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Pilih Nama Santri */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    3. Nama Lengkap Santri <span className="text-red-500">*</span>
                  </label>
                  {selectedRombel ? (
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Kelas {selectedRombel} • {filteredStudents.length} Santri
                    </span>
                  ) : identity.kategori ? (
                    <span className="text-[11px] text-slate-500">
                      Tersedia {filteredStudents.length} santri ({identity.kategori.replace("Siswa ", "")})
                    </span>
                  ) : null}
                </div>

                {/* Kolom Pencarian Cepat Nama */}
                {identity.kategori && (
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={selectedRombel ? `Cari nama santri di kelas ${selectedRombel}...` : "Ketik nama santri untuk mencari cepat..."}
                      className="w-full rounded-lg border border-slate-300 bg-white pl-8.5 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-[0_6px_16px_-2px_rgba(21,128,61,0.2),0_0_12px_1px_rgba(34,197,94,0.15)] focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    />
                  </div>
                )}

                {/* Dropdown Pemilihan Nama */}
                <select
                  disabled={!identity.kategori}
                  value={selectedStudentId}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 cursor-pointer transition-all duration-200 ${
                    !identity.kategori
                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                      : "bg-white border-slate-300 font-medium hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-[0_8px_20px_-3px_rgba(21,128,61,0.25),0_0_14px_1px_rgba(34,197,94,0.18)] focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  }`}
                >
                  {!identity.kategori ? (
                    <option value="">-- Pilih Kelas terlebih dahulu di atas --</option>
                  ) : (
                    <>
                      <option value="">-- Pilih Nama Santri ({filteredStudents.length} santri) --</option>
                      {availableRombels
                        .filter((r) => !selectedRombel || r === selectedRombel)
                        .map((r) => {
                          const studentsInRombel = filteredStudents.filter((s) => s.rombel === r);
                          if (studentsInRombel.length === 0) return null;
                          return (
                            <optgroup key={r} label={`Kelas ${r} (${studentsInRombel[0]?.jenisKelamin})`}>
                              {studentsInRombel.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.nama} ({s.rombel})
                                </option>
                              ))}
                            </optgroup>
                          );
                        })}
                      <option value="manual">[+] Nama Tidak Ada di Daftar / Ketik Manual</option>
                    </>
                  )}
                </select>

                {/* Notifikasi nama santri terpilih */}
                {selectedStudentId && selectedStudentId !== "manual" && (
                  <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/70 px-3.5 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900">{identity.nama}</span>
                        <span className="text-slate-500 ml-1.5 font-normal">
                          • {identity.kategori} ({identity.jenisKelamin})
                        </span>
                      </div>
                    </div>
                    <span className="text-emerald-700 font-bold text-[11px]">Terverifikasi</span>
                  </div>
                )}

                {/* Input manual jika nama tidak ada di daftar */}
                {isManualName && (
                  <div className="mt-2 space-y-1.5 p-3 rounded-lg border border-amber-300 bg-amber-50/60">
                    <label className="block text-xs font-semibold text-amber-900">
                      Tuliskan Nama Lengkap Anda:
                    </label>
                    <input
                      type="text"
                      value={identity.nama}
                      onChange={(e) => setIdentity({ ...identity, nama: e.target.value })}
                      placeholder="Masukkan nama lengkap santri..."
                      className="w-full rounded-lg border border-amber-400 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* 4. Dropdown Jenis Kelamin & Input NIS dengan Efek Timbul & Glow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={identity.jenisKelamin}
                    onChange={(e) => setIdentity({ ...identity, jenisKelamin: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all duration-200 cursor-pointer shadow-xs hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-[0_8px_20px_-3px_rgba(21,128,61,0.2),0_0_12px_1px_rgba(34,197,94,0.15)] focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:shadow-[0_0_16px_rgba(21,128,61,0.25)]"
                  >
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nomor Induk Siswa (NIS)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={identity.nomorId}
                    onChange={(e) => setIdentity({ ...identity, nomorId: e.target.value.replace(/\D/g, "") })}
                    placeholder="Contoh: 2024"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 font-mono transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-[0_8px_20px_-3px_rgba(21,128,61,0.2),0_0_12px_1px_rgba(34,197,94,0.15)] focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:shadow-[0_0_16px_rgba(21,128,61,0.25)]"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    Survei ini mematuhi standar <strong>UU PDP No. 27/2022</strong>. Data santri diolah secara <strong>agregat kolektif</strong> tanpa pelacakan perorangan.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline shrink-0 cursor-pointer"
                >
                  Pelajari Kebijakan Privasi &rarr;
                </button>
              </div>
            </CardContent>

            <CardFooter className="border-t border-slate-100 bg-slate-50/50 p-4 flex justify-end rounded-b-2xl">
              <Button onClick={handleNext} variant="primary" size="md" className="gap-2 font-semibold">
                Lanjut ke KAIH 1
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 1 s.d. 7: HALAMAN PER KAIH (7 HALAMAN DEDIKASI) */}
        {currentStep >= 1 && currentStep <= currentThemes.length && (
          (() => {
            const themeIndex = currentStep - 1;
            const theme = currentThemes[themeIndex];
            const ThemeIcon = THEME_ICONS[theme.iconName] || BookOpen;

            return (
              <Card className="border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-emerald-50/40">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700 text-white shrink-0 shadow-xs">
                      <ThemeIcon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300">
                          KAIH #{theme.kaihNumber} dari 7
                        </span>
                        {theme.tier && (
                          <Badge variant="outline" className="text-[10px] font-bold text-slate-600 bg-white">
                            {theme.tier}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                        {theme.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-600 leading-relaxed">
                        {theme.subtitle}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-8 p-5 sm:p-6">
                  {theme.questions.map((q) => {
                    const currentScore = answers[q.id];

                    return (
                      <div key={q.id} className="space-y-3 pb-6 border-b border-slate-100 last:border-b-0 last:pb-0">
                        {/* Butir Header & Badges */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-mono font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                              Butir {q.butirNum}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getDimensionBadgeClass(q.dimension)}`}>
                              [{q.dimension}]
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug pt-0.5">
                            {q.question}
                          </h4>

                          {q.description && (
                            <p className="text-xs text-slate-500 leading-relaxed italic">
                              {q.description}
                            </p>
                          )}
                        </div>

                        {/* Likert Scale Radio Button Cards (Skala 1-4) dengan Efek Timbul 3D */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
                          {LIKERT_OPTIONS.map((opt) => {
                            const isSelected = currentScore === opt.value;

                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleSelectScore(q.id, opt.value)}
                                className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all duration-200 cursor-pointer ${
                                  isSelected
                                    ? "border-emerald-600 bg-emerald-700 text-white font-bold -translate-y-1.5 shadow-[0_12px_26px_-4px_rgba(21,128,61,0.5),0_0_18px_2px_rgba(34,197,94,0.4)] ring-2 ring-emerald-500/50 scale-[1.02]"
                                    : "border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-500 hover:-translate-y-1.5 hover:shadow-[0_10px_22px_-4px_rgba(21,128,61,0.3),0_0_14px_1px_rgba(34,197,94,0.22)] text-slate-700 active:translate-y-0"
                                }`}
                              >
                                <span className={`text-lg font-black ${isSelected ? "text-amber-300" : "text-slate-800"}`}>
                                  {opt.value}
                                </span>
                                <span className={`text-xs leading-tight mt-1 font-medium ${isSelected ? "text-white font-bold" : "text-slate-600"}`}>
                                  {opt.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>

                <CardFooter className="border-t border-slate-100 bg-slate-50/50 p-4 flex items-center justify-between">
                  <Button onClick={handleBack} variant="outline" size="md" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {currentStep === 1 ? "Kembali ke Identitas" : `KAIH ${theme.kaihNumber - 1}`}
                  </Button>
                  <Button onClick={handleNext} variant="primary" size="md" className="gap-2 font-semibold">
                    {currentStep === currentThemes.length ? "Lanjut ke Ucapan Terima Kasih" : `Lanjut ke KAIH ${theme.kaihNumber + 1}`}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })()
        )}

        {/* STEP 8: UCAPAN TERIMA KASIH & KONFIRMASI PENUTUP */}
        {currentStep === currentThemes.length + 1 && (
          <Card className="border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-emerald-50/40">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white text-xs font-bold">
                  ✓
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    Tahap Akhir: Ucapan Terima Kasih & Konfirmasi Penutup
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Apresiasi yang tulus atas kesediaan ananda santri meluangkan waktu mengisi seluruh 35 butir instrumen 7 KAIH.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              {/* Kartu Khusus Ucapan Terima Kasih & Doa Keberkahan */}
              <div className="relative overflow-hidden rounded-xl border border-emerald-300 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 p-5 text-white shadow-md">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-amber-400/15 blur-xl pointer-events-none" />
                <div className="relative z-10 flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-inner">
                    <Sparkles className="h-6 w-6 text-amber-300" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-amber-200 tracking-wide">
                      Jazakumullah Khairan Katsiran!
                    </h3>
                    <p className="text-xs text-emerald-100/95 leading-relaxed">
                      Terima kasih yang sebesar-besarnya kepada ananda santri atas partisipasi aktif, kejujuran, dan kesungguhan dalam mengevaluasi <strong>35 butir instrumen survei</strong> yang terbagi ke dalam <strong>7 Karakter Utama Ihsanul Fikri (KAIH 1 s.d. KAIH 7)</strong>.
                    </p>
                    <p className="text-[11px] text-amber-200/90 italic pt-0.5">
                      "Barangsiapa yang tidak berterima kasih kepada manusia, maka ia tidak bersyukur kepada Allah." (HR. Tirmidzi & Abu Dawud)
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary of completeness */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Responden Terdaftar
                  </span>
                  <div className="text-base font-bold text-slate-900">{identity.nama}</div>
                  <div className="text-xs text-emerald-700 font-medium">
                    {identity.kategori} • {identity.jenisKelamin} ({selectedJurusan === "internasional" ? "Internasional" : selectedJurusan === "reguler" ? "Reguler" : "Tahfizh & Riset"})
                  </div>
                </div>

                <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Kelengkapan Kuesioner (7 KAIH)
                  </span>
                  <div className="text-base font-bold text-emerald-950">
                    {Object.keys(answers).length} / {totalQuestionsCount} Butir Terisi
                  </div>
                  <div className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 7 Halaman KAIH Lengkap & Siap Dikirimkan
                  </div>
                </div>
              </div>

              {/* Optional Feedback / Saran Terbuka */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Kritik, Saran, atau Harapan Tambahan (Opsional)
                </label>
                <textarea
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tuliskan saran konkret mengenai pembinaan ibadah, penguatan adab, manajemen waktu asrama, atau harapan pengembangan sekolah ke depan..."
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                />
                <p className="text-[11px] text-slate-400">
                  Umpan balik naratif sangat berharga dalam rapat dewan guru dan evaluasi pembinaan karakter santri.
                </p>
              </div>

              {/* Statement & Privacy Reminder */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Konfirmasi Pengiriman & Jaminan Privasi</p>
                  <p className="text-amber-800 leading-snug">
                    Dengan menekan tombol kirim di bawah, Anda menyatakan bahwa penilaian dibuat secara jujur untuk kemaslahatan pembinaan bersama.
                  </p>
                  <p className="text-[11px] text-emerald-900 pt-0.5">
                    Data Anda dilindungi penuh oleh{" "}
                    <button
                      type="button"
                      onClick={() => setIsPrivacyModalOpen(true)}
                      className="font-bold underline text-emerald-800 hover:text-emerald-950 cursor-pointer"
                    >
                      Kebijakan Privasi & Protokol Agregasi Data
                    </button>
                    .
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t border-slate-100 bg-slate-50/50 p-4 flex items-center justify-between">
              <Button onClick={handleBack} variant="outline" size="md" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke KAIH 7
              </Button>
              <Button
                onClick={handleSubmit}
                variant="gold"
                size="lg"
                disabled={isSubmitting}
                className="gap-2 font-bold shadow-xs text-slate-950 transition-all hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(202,138,4,0.35)] active:scale-95 cursor-pointer"
              >
                <Send className="h-4 w-4 text-slate-950" />
                {isSubmitting ? "Mengirimkan Data..." : "Kirim Respon Survei"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Pop-up Dialog Kebijakan Privasi */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}
