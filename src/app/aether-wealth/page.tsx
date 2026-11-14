"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Layers,
  CheckCircle2,
  Wallet,
  Activity,
  Flame,
  Target,
  Sliders,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactRupiah(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
  }
  if (Math.abs(value) >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(0)} Jt`;
  }
  if (Math.abs(value) >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)} Rb`;
  }
  return `Rp ${Math.round(value)}`;
}

export default function AetherWealthPage() {
  const [currentAge, setCurrentAge] = useState<number>(26);
  const [retirementAge, setRetirementAge] = useState<number>(45);
  const [initialNetWorth, setInitialNetWorth] = useState<number>(65_000_000);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(25_000_000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(11_000_000);
  const [annualReturn, setAnnualReturn] = useState<number>(10);
  const [inflation, setInflation] = useState<number>(4);
  const [swr, setSwr] = useState<number>(4.0);
  const [marketCrash, setMarketCrash] = useState<boolean>(false);
  const [selectedFireVariant, setSelectedFireVariant] = useState<string>("Regular");
  const [activeTab, setActiveTab] = useState<"chart" | "radar">("chart");
  const [isLedgerOpen, setIsLedgerOpen] = useState<boolean>(false);
  const [activeLevelModal, setActiveLevelModal] = useState<number | null>(null);

  const monthlySavings = Math.max(0, monthlyIncome - monthlyExpenses);
  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;
  const isDeficit = monthlyExpenses > monthlyIncome;

  const currentCapital = marketCrash ? initialNetWorth * 0.75 : initialNetWorth;
  const annualExpense = monthlyExpenses * 12;
  const swrRate = swr / 100;
  const fireNumber = swrRate > 0 ? annualExpense / swrRate : 0;

  const projection = useMemo(() => {
    const list: Array<{
      age: number;
      year: number;
      depositedCapital: number;
      compoundInterest: number;
      totalAssets: number;
      monthlyPassiveIncome: number;
      level: string;
      levelNum: number;
    }> = [];

    const startYear = 2026;
    const effectiveReturn = (annualReturn - inflation) / 100;
    const monthlyRate = Math.pow(1 + Math.max(-0.9, effectiveReturn), 1 / 12) - 1;

    let balance = currentCapital;
    let totalDeposited = currentCapital;
    const maxProjectionYears = Math.min(50, Math.max(25, (retirementAge - currentAge) + 20));

    for (let yr = 0; yr <= maxProjectionYears; yr++) {
      const age = currentAge + yr;
      const calendarYear = startYear + yr;

      if (yr > 0) {
        for (let m = 0; m < 12; m++) {
          balance = balance * (1 + monthlyRate) + monthlySavings;
          totalDeposited += monthlySavings;
        }
      }

      const totalEarnedInterest = Math.max(0, balance - totalDeposited);
      const monthlyPassive = (balance * swrRate) / 12;

      let levelName = "Lv.1 Clarity";
      let levelNum = 1;
      if (balance >= fireNumber * 1.33) {
        levelName = "Lv.7 Abundant Wealth";
        levelNum = 7;
      } else if (balance >= fireNumber) {
        levelName = "Lv.6 Financial Independence";
        levelNum = 6;
      } else if (balance >= monthlyExpenses * 24) {
        levelName = "Lv.5 Flexibility";
        levelNum = 5;
      } else if (balance >= monthlyExpenses * 6) {
        levelName = "Lv.4 Stability";
        levelNum = 4;
      } else if (balance >= monthlyExpenses * 3) {
        levelName = "Lv.3 Breathing Room";
        levelNum = 3;
      } else if (balance >= monthlyExpenses * 1) {
        levelName = "Lv.2 Self-Sufficiency";
        levelNum = 2;
      }

      list.push({
        age,
        year: calendarYear,
        depositedCapital: Math.round(totalDeposited),
        compoundInterest: Math.round(totalEarnedInterest),
        totalAssets: Math.round(balance),
        monthlyPassiveIncome: Math.round(monthlyPassive),
        level: levelName,
        levelNum,
      });
    }

    return list;
  }, [currentAge, retirementAge, currentCapital, monthlySavings, annualReturn, inflation, swrRate, fireNumber, monthlyExpenses]);

  const fireHitEntry = projection.find((p) => p.totalAssets >= fireNumber);
  const fireAchievedAge = fireHitEntry ? fireHitEntry.age : null;
  const fireAchievedYear = fireHitEntry ? fireHitEntry.year : null;
  const yearsToFire = fireAchievedAge ? Math.max(0, fireAchievedAge - currentAge) : null;

  const retirementEntry = projection.find((p) => p.age === retirementAge) || projection[projection.length - 1];
  const projectedRetirementWealth = retirementEntry ? retirementEntry.totalAssets : 0;
  const finalProjectedInterest = retirementEntry ? retirementEntry.compoundInterest : 0;
  const finalDeposited = retirementEntry ? retirementEntry.depositedCapital : 1;
  const compoundingRatio = finalDeposited > 0 ? (finalProjectedInterest / finalDeposited) * 100 : 0;

  const currentLevelInfo = useMemo(() => {
    const nw = currentCapital;
    const exp = monthlyExpenses;

    const levels = [
      {
        lvl: 1,
        title: "Clarity",
        threshold: 0,
        req: "Pemetaan arus kas & aset bersih",
        desc: "Kamu menyadari kondisi finansial riil dan mencatat ke mana setiap Rupiah mengalir.",
        strategy: "Audit pengeluaran 90 hari terakhir, pangkas langganan zombie, mulai pisahkan pos darurat.",
      },
      {
        lvl: 2,
        title: "Self-Sufficiency",
        threshold: exp * 1,
        req: `Net Worth ≥ 1x Pengeluaran (${formatCompactRupiah(exp * 1)})`,
        desc: "Mampu bertahan 1 bulan penuh tanpa mengandalkan utang saat arus kas terhenti.",
        strategy: "Fokus menjaga arus kas operasional bulanan tetap positif sebelum berinvestasi agresif.",
      },
      {
        lvl: 3,
        title: "Breathing Room",
        threshold: exp * 3,
        req: `Dana Darurat 3x Pengeluaran (${formatCompactRupiah(exp * 3)})`,
        desc: "Kamu memiliki bantalan likuid jika terjadi keterlambatan gaji atau keadaan darurat ringan.",
        strategy: "Tempatkan dana darurat di instrumen likuid bebas fluktuasi seperti Reksadana Pasar Uang.",
      },
      {
        lvl: 4,
        title: "Stability",
        threshold: exp * 6,
        req: `Dana Darurat 6x Pengeluaran (${formatCompactRupiah(exp * 6)})`,
        desc: "Benteng pertahanan kuat terhadap gejolak ekonomi, bebas dari utang berbunga tinggi.",
        strategy: "Tutup utang kartu kredit/pinjol, kencangkan alokasi dana darurat hingga 6 bulan pengeluaran.",
      },
      {
        lvl: 5,
        title: "Flexibility",
        threshold: exp * 24,
        req: `Investasi 2 Tahun Biaya Hidup (${formatCompactRupiah(exp * 24)})`,
        desc: "Kebebasan memilih pekerjaan atau mengambil jeda karir (mini-retirement) selama 2 tahun.",
        strategy: "Mulai diversifikasi ke instrumen pertumbuhan modal (Saham/ETF Index & Obligasi SBN).",
      },
      {
        lvl: 6,
        title: "Financial Independence",
        threshold: fireNumber,
        req: `25x Pengeluaran Tahunan (${formatCompactRupiah(fireNumber)})`,
        desc: "Bekerja menjadi opsi sukarela. Passive income dari portofolio menutup 100% gaya hidup.",
        strategy: "Optimalkan penarikan teratur berbasis SWR 3.5% - 4.0% dengan buffer kas 1-2 tahun.",
      },
      {
        lvl: 7,
        title: "Abundant Wealth",
        threshold: fireNumber * 1.33,
        req: `33x+ Pengeluaran Tahunan (${formatCompactRupiah(fireNumber * 1.33)})`,
        desc: "Kekayaan generasi: modal berkembang lebih cepat daripada tingkat konsumsi maksimalmu.",
        strategy: "Estate planning, filantropi terstruktur, dan perlindungan aset lintas generasi.",
      },
    ];

    let current = levels[0];
    for (let i = levels.length - 1; i >= 0; i--) {
      if (nw >= levels[i].threshold) {
        current = levels[i];
        break;
      }
    }

    const nextIndex = Math.min(levels.length - 1, current.lvl);
    const nextLevel = levels[nextIndex];
    const isMaxLevel = current.lvl === 7;
    const progressPercent = isMaxLevel
      ? 100
      : Math.min(100, Math.max(0, ((nw - current.threshold) / (nextLevel.threshold - current.threshold || 1)) * 100));
    const gapToNext = isMaxLevel ? 0 : Math.max(0, nextLevel.threshold - nw);
    const monthsToNext = monthlySavings > 0 ? Math.ceil(gapToNext / monthlySavings) : null;

    return {
      current,
      nextLevel,
      progressPercent,
      gapToNext,
      monthsToNext,
      levels,
      isMaxLevel,
    };
  }, [currentCapital, monthlyExpenses, fireNumber, monthlySavings]);

  const fireVariants = useMemo(() => {
    const yearsToRetire = Math.max(1, retirementAge - currentAge);
    const realReturnRate = Math.max(0.01, (annualReturn - inflation) / 100);

    const coastTarget = fireNumber / Math.pow(1 + realReturnRate, yearsToRetire);
    const baristaTarget = fireNumber * 0.5;
    const regularTarget = fireNumber;
    const fatTarget = fireNumber * 1.75;

    const getAchieveAge = (targetVal: number) => {
      const match = projection.find((p) => p.totalAssets >= targetVal);
      return match ? `${match.age} Thn` : "> 75 Thn";
    };

    return [
      {
        id: "Coast",
        title: "Coast FIRE",
        badge: getAchieveAge(coastTarget),
        target: coastTarget,
        passiveMonthly: (coastTarget * swrRate) / 12,
        desc: "Modal saat ini dibiarkan bergulir bunga majemuk hingga pensiun tanpa perlu menabung lagi.",
        tagline: "Kerja santai cukup untuk biaya hidup harian.",
        accent: "from-teal-500/20 to-emerald-500/10",
      },
      {
        id: "Barista",
        title: "Barista FIRE",
        badge: getAchieveAge(baristaTarget),
        target: baristaTarget,
        passiveMonthly: (baristaTarget * swrRate) / 12,
        desc: "50% pengeluaran ditopang portofolio investasi, 50% sisanya dari pekerjaan part-time/hobi.",
        tagline: "Fleksibilitas tinggi tanpa stres jam kantor penuh.",
        accent: "from-cyan-500/20 to-blue-500/10",
      },
      {
        id: "Regular",
        title: "Regular FIRE",
        badge: getAchieveAge(regularTarget),
        target: regularTarget,
        passiveMonthly: (regularTarget * swrRate) / 12,
        desc: "100% pengeluaran gaya hidup saat ini ditutup sepenuhnya oleh hasil investasi seumur hidup.",
        tagline: "Standar emas kebebasan finansial sejati.",
        accent: "from-emerald-500/25 to-teal-500/15",
      },
      {
        id: "Fat",
        title: "Fat FIRE",
        badge: getAchieveAge(fatTarget),
        target: fatTarget,
        passiveMonthly: (fatTarget * swrRate) / 12,
        desc: "Gaya hidup pensiun mewah: 175% pengeluaran saat ini untuk liburan, kenyamanan, dan keluarga.",
        tagline: "Kenyamanan tanpa kompromi finansial.",
        accent: "from-amber-500/20 to-emerald-500/10",
      },
    ];
  }, [retirementAge, currentAge, annualReturn, inflation, fireNumber, swrRate, projection]);

  const radarData = useMemo(() => {
    const savingsScore = Math.min(100, Math.round(savingsRate * 1.8));
    const emergencyMonths = monthlyExpenses > 0 ? currentCapital / monthlyExpenses : 0;
    const emergencyScore = Math.min(100, Math.round((emergencyMonths / 12) * 100));
    const compoundingVelocityScore = Math.min(100, Math.round(annualReturn * 6.5));
    const inflationDefenseScore = Math.max(10, Math.min(100, Math.round(((annualReturn - inflation) / 10) * 100)));
    const fireReadinessScore = fireNumber > 0 ? Math.min(100, Math.round((currentCapital / fireNumber) * 100)) : 0;

    return [
      { subject: "Savings Power", score: savingsScore, fullMark: 100 },
      { subject: "Emergency Shield", score: emergencyScore, fullMark: 100 },
      { subject: "Compounding Speed", score: compoundingVelocityScore, fullMark: 100 },
      { subject: "Inflation Defense", score: inflationDefenseScore, fullMark: 100 },
      { subject: "FIRE Readiness", score: fireReadinessScore, fullMark: 100 },
    ];
  }, [savingsRate, monthlyExpenses, currentCapital, annualReturn, inflation, fireNumber]);

  const applyPrescriptiveOptimization = () => {
    const boostedSavings = Math.round(monthlyExpenses * 0.9);
    setMonthlyExpenses(boostedSavings);
    if (annualReturn < 10) {
      setAnnualReturn(10);
    }
  };

  const handleResetDefaults = () => {
    setCurrentAge(26);
    setRetirementAge(45);
    setInitialNetWorth(65_000_000);
    setMonthlyIncome(25_000_000);
    setMonthlyExpenses(11_000_000);
    setAnnualReturn(10);
    setInflation(4);
    setSwr(4.0);
    setMarketCrash(false);
    setSelectedFireVariant("Regular");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200 font-sans antialiased">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-slate-950/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.45)] border border-emerald-300/30">
              <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                  AETHER <span className="text-emerald-400">WEALTH</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Pro Engine v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Ekosistem Simulasi & Analitik Quantitative Financial Freedom
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/[0.06] text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Net Worth Awal</span>
                <span className="font-semibold text-emerald-300">{formatCompactRupiah(currentCapital)}</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[10px]">Target FIRE</span>
                <span className="font-semibold text-cyan-300">{formatCompactRupiah(fireNumber)}</span>
              </div>
            </div>

            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-800 text-slate-400 bg-slate-900/60 hover:text-slate-200 hover:border-slate-700 transition-all flex items-center gap-1.5"
              title="Reset ke parameter standar"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="group relative bg-slate-900/50 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_8px_35px_-10px_rgba(16,185,129,0.25)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Status Saat Ini: {currentLevelInfo.current.lvl}. {currentLevelInfo.current.title}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentLevelInfo.isMaxLevel ? "Level Tertinggi Tercapai" : `Target Berikutnya: Lv.${currentLevelInfo.nextLevel.lvl} ${currentLevelInfo.nextLevel.title}`}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {currentLevelInfo.current.desc}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                <span className="text-emerald-400 font-semibold">Rekomendasi Aksi: </span>
                {currentLevelInfo.current.strategy}
              </p>
            </div>

            <div className="lg:w-80 shrink-0 space-y-2 bg-slate-950/60 p-4 rounded-xl border border-white/[0.06]">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-400">Progres Menuju Lv.{currentLevelInfo.nextLevel.lvl}</span>
                <span className="text-emerald-400 font-bold font-mono">
                  {currentLevelInfo.progressPercent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/[0.05]">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                  style={{ width: `${currentLevelInfo.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>Kurang: {formatCompactRupiah(currentLevelInfo.gapToNext)}</span>
                <span>
                  {currentLevelInfo.monthsToNext !== null
                    ? `~${currentLevelInfo.monthsToNext} Bulan`
                    : "Butuh Surplus Kas"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                7 Tingkatan Financial Freedom (Klik Kartu Untuk Mempelajari Syarat)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
              {currentLevelInfo.levels.map((lvl) => {
                const isPassed = currentCapital >= lvl.threshold;
                const isCurrent = currentLevelInfo.current.lvl === lvl.lvl;
                return (
                  <button
                    key={lvl.lvl}
                    type="button"
                    onClick={() => setActiveLevelModal(lvl.lvl)}
                    className={`text-left p-3 rounded-xl border transition-all duration-200 relative group/btn ${
                      isCurrent
                        ? "bg-emerald-500/15 border-emerald-500/70 shadow-[0_0_18px_rgba(16,185,129,0.35)] ring-1 ring-emerald-500/40"
                        : isPassed
                        ? "bg-slate-900/60 border-emerald-500/30 text-slate-300 hover:border-emerald-400/50 hover:bg-slate-900"
                        : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isCurrent
                          ? "bg-emerald-500 text-slate-950"
                          : isPassed
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        Lv.{lvl.lvl}
                      </span>
                      {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="font-semibold text-xs text-white truncate group-hover/btn:text-emerald-300">
                      {lvl.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 truncate">
                      {formatCompactRupiah(lvl.threshold)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-5 space-y-6 bg-slate-900/50 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">The Command Center</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Real-Time Sync</span>
            </div>

            {isDeficit && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-rose-200">Defisit Keuangan Terdeteksi</span>
                  Pengeluaran bulanan ({formatRupiah(monthlyExpenses)}) lebih besar dari pendapatan ({formatRupiah(monthlyIncome)}). Tidak ada surplus yang dapat diakumulasikan ke portofolio investasi.
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Usia Saat Ini & Target Pensiun</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-300 border border-slate-700">
                      {currentAge} Thn
                    </span>
                    <span className="text-slate-400">➔</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-slate-700">
                      {retirementAge} Thn
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Usia Saat Ini</label>
                    <input
                      type="range"
                      min={18}
                      max={65}
                      value={currentAge}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCurrentAge(val);
                        if (val >= retirementAge) setRetirementAge(val + 5);
                      }}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Target Usia Pensiun</label>
                    <input
                      type="range"
                      min={currentAge + 1}
                      max={75}
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Total Aset Investasi Saat Ini</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-mono font-semibold">
                    {formatRupiah(initialNetWorth)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2_000_000_000}
                  step={5_000_000}
                  value={initialNetWorth}
                  onChange={(e) => setInitialNetWorth(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Rp 0</span>
                  <span>Rp 1 M</span>
                  <span>Rp 2 M+</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Pendapatan Bulanan Bersih</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700 font-mono">
                    {formatRupiah(monthlyIncome)}
                  </span>
                </div>
                <input
                  type="range"
                  min={3_000_000}
                  max={120_000_000}
                  step={1_000_000}
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Pengeluaran Bulanan Rutin</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700 font-mono">
                    {formatRupiah(monthlyExpenses)}
                  </span>
                </div>
                <input
                  type="range"
                  min={2_000_000}
                  max={100_000_000}
                  step={500_000}
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />

                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-1.5 mt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Savings Rate & Tabungan/Bulan:</span>
                    <span className={`font-mono font-bold ${
                      savingsRate >= 50
                        ? "text-emerald-400"
                        : savingsRate >= 20
                        ? "text-cyan-400"
                        : "text-amber-400"
                    }`}>
                      {savingsRate.toFixed(1)}% ({formatCompactRupiah(monthlySavings)}/bln)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        savingsRate >= 50
                          ? "bg-emerald-400"
                          : savingsRate >= 20
                          ? "bg-cyan-400"
                          : "bg-amber-400"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Return Investasi Tahunan (Nominal)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                    {annualReturn}% / tahun
                  </span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={22}
                  step={0.5}
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {[
                    { label: "Konservatif", val: 6, note: "SBN / Depo" },
                    { label: "Moderat", val: 10, note: "Campuran / ETF" },
                    { label: "Agresif", val: 14, note: "Saham Alpha" },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setAnnualReturn(preset.val)}
                      className={`whitespace-nowrap px-3 py-2 text-xs font-medium rounded-xl transition-all duration-300 flex flex-col items-center justify-center ${
                        annualReturn === preset.val
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/70 shadow-[0_0_22px_-2px_rgba(16,185,129,0.5)] font-semibold"
                          : "bg-slate-900/70 text-slate-300 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-300 hover:bg-emerald-950/30 hover:shadow-[0_0_18px_-3px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 active:scale-95"
                      }`}
                    >
                      <span className="font-semibold">{preset.label} ({preset.val}%)</span>
                      <span className="text-[10px] text-slate-400">{preset.note}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Asumsi Inflasi & Safe Withdrawal Rate (SWR)</span>
                  <span className="text-[11px] text-slate-400 font-mono">Inflasi: {inflation}%</span>
                </div>

                <div className="bg-slate-950/90 p-1.5 rounded-2xl border border-white/[0.08] flex items-center gap-1.5">
                  {[3.0, 3.5, 4.0].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setSwr(rate)}
                      className={`flex-1 whitespace-nowrap px-3 py-2 text-xs font-medium rounded-xl transition-all duration-300 ${
                        swr === rate
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/70 shadow-[0_0_22px_-2px_rgba(16,185,129,0.5)] font-semibold"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                      }`}
                    >
                      SWR {rate.toFixed(1)}% {rate === 4.0 ? "(Trinity)" : rate === 3.0 ? "(Ultra Safe)" : "(Balanced)"}
                    </button>
                  ))}
                </div>
              </div>

              <div
                onClick={() => setMarketCrash(!marketCrash)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 select-none ${
                  marketCrash
                    ? "bg-rose-950/20 border-rose-500/60 shadow-[0_0_25px_-4px_rgba(244,63,94,0.45)]"
                    : "bg-slate-950/60 border-slate-800 hover:border-rose-500/40 hover:shadow-[0_0_20px_-4px_rgba(244,63,94,0.25)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${marketCrash ? "bg-rose-500/20 text-rose-300" : "bg-slate-800 text-slate-400"}`}>
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                        Simulasi Badai Ekonomi (Crash -25%)
                        {marketCrash && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-200 font-mono">
                            AKTIF
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Menguji ketahanan jika portofolio awal anjlok 25% seketika
                      </p>
                    </div>
                  </div>

                  <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${marketCrash ? "bg-rose-500" : "bg-slate-800"}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${marketCrash ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-7 space-y-6">
            <div className="group relative bg-slate-900/50 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_8px_35px_-10px_rgba(6,182,212,0.25)]">
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Visualisasi Analitik Multi-Layer
                  </h3>
                  <p className="text-xs text-slate-400">
                    Proyeksi kekayaan vs target FIRE & profil keseimbangan portofolio
                  </p>
                </div>

                <div className="bg-slate-950/90 p-1.5 rounded-2xl border border-white/[0.08] flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab("chart")}
                    className={`whitespace-nowrap px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-300 ${
                      activeTab === "chart"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/70 shadow-[0_0_22px_-2px_rgba(16,185,129,0.5)] font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Kurva Kekayaan & Titik FIRE
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("radar")}
                    className={`whitespace-nowrap px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-300 ${
                      activeTab === "radar"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/70 shadow-[0_0_22px_-2px_rgba(16,185,129,0.5)] font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Radar Kesehatan & Alokasi
                  </button>
                </div>
              </div>

              {activeTab === "chart" ? (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={projection}
                      margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis
                        dataKey="age"
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        tickFormatter={(v) => `${v} Thn`}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        tickFormatter={(v) => formatCompactRupiah(v)}
                      />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#020617",
                          borderColor: "#1e293b",
                          borderRadius: "0.75rem",
                          color: "#f8fafc",
                          fontSize: "12px",
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                        }}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={(value: any, name: any) => {
                          const num = Number(value || 0);
                          const label =
                            name === "totalAssets"
                              ? "Total Proyeksi Aset"
                              : name === "depositedCapital"
                              ? "Modal Disetor"
                              : String(name || "");
                          return [formatRupiah(num), label];
                        }}
                        labelFormatter={(label) => `Usia: ${label} Tahun`}
                      />
                      <ReferenceLine
                        y={fireNumber}
                        stroke="#f59e0b"
                        strokeDasharray="4 4"
                        strokeWidth={2}
                        label={{
                          value: `Target FIRE: ${formatCompactRupiah(fireNumber)}`,
                          fill: "#f59e0b",
                          fontSize: 11,
                          position: "top",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="totalAssets"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#emeraldGradient)"
                        name="totalAssets"
                      />
                      <Area
                        type="monotone"
                        dataKey="depositedCapital"
                        stroke="#06b6d4"
                        strokeWidth={1.8}
                        fillOpacity={1}
                        fill="url(#cyanGradient)"
                        name="depositedCapital"
                      />
                    </AreaChart>
                  </ResponsiveContainer>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                        Total Aset (Pokok + Bunga)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-cyan-500 inline-block" />
                        Modal Keringat Sendiri
                      </span>
                    </div>
                    <span className="text-amber-400 font-medium">
                      {fireAchievedAge
                        ? `Titik Crossover FIRE: Usia ${fireAchievedAge} (${fireAchievedYear})`
                        : "Target FIRE belum tercapai dalam 50 tahun"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                        <PolarGrid stroke="#334155" opacity={0.4} />
                        <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                        <Radar
                          name="Kesehatan Finansial"
                          dataKey="score"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.35}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-white/[0.06]">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300">
                      Rekomendasi Alokasi Portofolio
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Disesuaikan dengan profil return {annualReturn}% dan horizon {retirementAge - currentAge} tahun.
                    </p>

                    <div className="space-y-2 pt-1 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-300 mb-0.5">
                          <span>Ekuitas / Saham Pertumbuhan & Index</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            {annualReturn >= 12 ? "70%" : annualReturn >= 9 ? "55%" : "30%"}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: annualReturn >= 12 ? "70%" : annualReturn >= 9 ? "55%" : "30%" }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-0.5">
                          <span>Surat Berharga Negara (SBN) & Obligasi</span>
                          <span className="font-mono text-cyan-400 font-bold">
                            {annualReturn >= 12 ? "20%" : annualReturn >= 9 ? "35%" : "50%"}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-cyan-500 h-full rounded-full"
                            style={{ width: annualReturn >= 12 ? "20%" : annualReturn >= 9 ? "35%" : "50%" }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-0.5">
                          <span>Pasar Uang & Emas Fisik (Buffer)</span>
                          <span className="font-mono text-amber-400 font-bold">
                            {annualReturn >= 12 ? "10%" : annualReturn >= 9 ? "10%" : "20%"}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: annualReturn >= 12 ? "10%" : annualReturn >= 9 ? "10%" : "20%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="group relative bg-slate-900/50 backdrop-blur-xl border border-white/[0.07] rounded-2xl p-5 transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-900/80 hover:shadow-[0_8px_35px_-10px_rgba(6,182,212,0.25)] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Deskriptif
                  </span>
                  <div className="text-xl font-bold text-white">
                    {savingsRate.toFixed(1)}% <span className="text-xs text-slate-400 font-normal">Savings Rate</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Kecepatan akumulasi: <span className="text-emerald-400 font-semibold">{formatCompactRupiah(monthlySavings)} / bulan</span>
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  {savingsRate >= 40
                    ? "Tingkat tabungan tinggi mempercepat akselerasi modal awal secara signifikan."
                    : "Tingkatkan tabungan ke 30-40% untuk memangkas waktu kerja hingga 7 tahun."}
                </div>
              </div>

              <div className="group relative bg-slate-900/50 backdrop-blur-xl border border-white/[0.07] rounded-2xl p-5 transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-900/80 hover:shadow-[0_8px_35px_-10px_rgba(6,182,212,0.25)] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Diagnostik
                  </span>
                  <div className="text-xl font-bold text-white">
                    {compoundingRatio.toFixed(0)}% <span className="text-xs text-slate-400 font-normal">Efek Bunga Majemuk</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Hasil investasi di usia {retirementAge}: <span className="text-cyan-400 font-semibold">{formatCompactRupiah(finalProjectedInterest)}</span>
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  Uang bekerja lebih keras daripada modal keringat sendiri setelah melewati tahun ke-10.
                </div>
              </div>

              <div className="group relative bg-slate-900/50 backdrop-blur-xl border border-white/[0.07] rounded-2xl p-5 transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-900/80 hover:shadow-[0_8px_35px_-10px_rgba(6,182,212,0.25)] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Prediktif
                  </span>
                  <div className="text-xl font-bold text-white">
                    {fireAchievedAge ? `Usia ${fireAchievedAge} Thn` : "Perlu Penyesuaian"}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Kekayaan di usia {retirementAge}: <span className="text-emerald-400 font-semibold">{formatCompactRupiah(projectedRetirementWealth)}</span>
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  {yearsToFire !== null
                    ? `Waktu tersisa menuju FIRE: ${yearsToFire} tahun lagi (${fireAchievedYear}).`
                    : "Tambah modal atau tingkatkan return tahunan agar FIRE tercapai sebelum usia 70."}
                </div>
              </div>

              <div className="group relative bg-slate-900/50 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-5 transition-all duration-300 hover:border-emerald-500/60 hover:bg-slate-900/80 hover:shadow-[0_8px_35px_-10px_rgba(16,185,129,0.35)] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3" /> Preskriptif (AI Action Card)
                  </span>
                  <div className="text-sm font-semibold text-white">
                    Pangkas Pengeluaran 10%
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Otomatis tingkatkan efisiensi tabungan ke {formatCompactRupiah(Math.round(monthlyExpenses * 0.9))} dan kunci return moderat 10%.
                  </p>
                </div>
                <div className="mt-auto pt-4">
                  <button
                    type="button"
                    onClick={applyPrescriptiveOptimization}
                    className="w-full relative overflow-hidden transition-all duration-300 ease-out bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_2px_rgba(16,185,129,0.75)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] whitespace-nowrap px-4 py-2.5 text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <span>Terapkan Simulasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Matrix 4 Gaya Hidup FIRE
              </h3>
              <p className="text-xs text-slate-400">
                Pilih varian strategi pensiun yang paling selaras dengan visi hidupmu
              </p>
            </div>
            <span className="text-xs text-slate-400">
              Target Dipilih: <span className="text-emerald-400 font-bold">{selectedFireVariant} FIRE</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {fireVariants.map((variant) => {
              const isSelected = selectedFireVariant === variant.id;
              return (
                <div
                  key={variant.id}
                  className={`group relative bg-slate-900/50 backdrop-blur-xl border rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between h-full ${
                    isSelected
                      ? "border-emerald-500/70 bg-slate-900/90 shadow-[0_0_25px_-3px_rgba(16,185,129,0.4)] ring-1 ring-emerald-500/40"
                      : "border-white/[0.07] hover:border-cyan-500/40 hover:bg-slate-900/80 hover:shadow-[0_8px_35px_-10px_rgba(6,182,212,0.25)]"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-base text-white">{variant.title}</h4>
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {variant.badge}
                      </span>
                    </div>

                    <div>
                      <div className="text-2xl font-extrabold text-white tracking-tight font-mono">
                        {formatCompactRupiah(variant.target)}
                      </div>
                      <div className="text-xs text-emerald-400 font-medium">
                        ~{formatCompactRupiah(variant.passiveMonthly)} / bulan pasif
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {variant.desc}
                    </p>

                    <div className="text-[11px] text-slate-400 italic">
                      &ldquo;{variant.tagline}&rdquo;
                    </div>
                  </div>

                  <div className="mt-auto pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedFireVariant(variant.id)}
                      className={`w-full whitespace-nowrap px-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all duration-300 ${
                        isSelected
                          ? "bg-emerald-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                          : "bg-slate-900/70 text-slate-300 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-300 hover:bg-emerald-950/30 hover:shadow-[0_0_18px_-3px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 active:scale-95"
                      }`}
                    >
                      {isSelected ? "Target Utama Aktif" : "Jadikan Target Utama"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <button
            type="button"
            onClick={() => setIsLedgerOpen(!isLedgerOpen)}
            className="w-full group relative bg-slate-900/50 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 transition-all duration-300 hover:border-emerald-500/40 hover:bg-slate-900/80 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.25)] flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-sm sm:text-base">
                  Tabel Audit Proyeksi Tahunan (Collapsible Ledger)
                </div>
                <div className="text-xs text-slate-400">
                  Rincian tahun demi tahun: usia, modal disetor, bunga majemuk, dan capaian level
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span>{isLedgerOpen ? "Sembunyikan Rincian" : "Buka Rincian Lengkap"}</span>
              {isLedgerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {isLedgerOpen && (
            <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-slate-950/90 shadow-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Tahun</th>
                    <th className="py-3 px-4 font-semibold">Usia</th>
                    <th className="py-3 px-4 font-semibold">Modal Disetor</th>
                    <th className="py-3 px-4 font-semibold">Bunga Majemuk</th>
                    <th className="py-3 px-4 font-semibold">Total Aset</th>
                    <th className="py-3 px-4 font-semibold">Passive Income/Bln</th>
                    <th className="py-3 px-4 font-semibold">Status Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  {projection.map((row) => {
                    const isFire = row.totalAssets >= fireNumber;
                    const isRetireYear = row.age === retirementAge;
                    return (
                      <tr
                        key={row.year}
                        className={`transition-colors ${
                          isRetireYear
                            ? "bg-cyan-950/30 text-cyan-200 font-semibold"
                            : isFire
                            ? "bg-emerald-950/20 text-emerald-200"
                            : "hover:bg-slate-900/50"
                        }`}
                      >
                        <td className="py-2.5 px-4 font-bold text-white">{row.year}</td>
                        <td className="py-2.5 px-4">{row.age} Thn</td>
                        <td className="py-2.5 px-4 text-slate-400">{formatRupiah(row.depositedCapital)}</td>
                        <td className="py-2.5 px-4 text-emerald-400">+{formatRupiah(row.compoundInterest)}</td>
                        <td className="py-2.5 px-4 font-bold text-white">{formatRupiah(row.totalAssets)}</td>
                        <td className="py-2.5 px-4 text-cyan-300">{formatCompactRupiah(row.monthlyPassiveIncome)}</td>
                        <td className="py-2.5 px-4 font-sans text-[11px]">
                          <span className={`px-2 py-0.5 rounded-md ${
                            row.levelNum >= 6
                              ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                              : "bg-slate-800 text-slate-300"
                          }`}>
                            {row.level}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {activeLevelModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/[0.1] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            {(() => {
              const modalLevel = currentLevelInfo.levels.find((l) => l.lvl === activeLevelModal);
              if (!modalLevel) return null;
              return (
                <>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                        Level {modalLevel.lvl}
                      </span>
                      <h4 className="font-bold text-white text-base">{modalLevel.title}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveLevelModal(null)}
                      className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-slate-800"
                    >
                      Tutup
                    </button>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Syarat Ambang Batas:</span>
                      <span className="text-emerald-300 font-mono font-semibold">{modalLevel.req}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Deskripsi Kondisi:</span>
                      <p className="leading-relaxed">{modalLevel.desc}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-white/[0.06]">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">Rekomendasi Taktis:</span>
                      <p className="text-slate-300 leading-relaxed">{modalLevel.strategy}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveLevelModal(null)}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                  >
                    Saya Mengerti
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
