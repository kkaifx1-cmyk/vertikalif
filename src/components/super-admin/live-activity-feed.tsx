"use client";

import React, { useState, useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Sparkles,
  Zap,
  ShieldCheck,
  ChevronRight,
  Eye,
  RefreshCw,
} from "lucide-react";
import { ResponseRecord } from "@/lib/data-store";
import { Badge } from "@/components/ui/badge";

interface LiveActivityFeedProps {
  responses: ResponseRecord[];
  onInspectResponse?: (response: ResponseRecord) => void;
}

export function LiveActivityFeed({ responses, onInspectResponse }: LiveActivityFeedProps) {
  const [filterAnomalyOnly, setFilterAnomalyOnly] = useState(false);

  // Detect Outliers / Anomalous responses:
  // 1. Duration < 45 seconds (speeding / spam click)
  // 2. Uniform flat answers (all identical answers across all questions)
  const anomalies = useMemo(() => {
    return responses.filter((r) => {
      // Check speed
      const isTooFast = typeof r.durationSeconds === "number" && r.durationSeconds > 0 && r.durationSeconds < 45;

      // Check flatline
      const answers = Object.values(r.answers || {});
      const isFlatline = answers.length >= 10 && answers.every((val) => val === answers[0]);

      return isTooFast || isFlatline;
    });
  }, [responses]);

  // Sorted recent responses (descending by createdAt)
  const recentResponses = useMemo(() => {
    const list = [...responses].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime() || 0;
      const timeB = new Date(b.createdAt).getTime() || 0;
      return timeB - timeA;
    });

    if (filterAnomalyOnly) {
      return list.filter((r) => {
        const isTooFast = typeof r.durationSeconds === "number" && r.durationSeconds > 0 && r.durationSeconds < 45;
        const answers = Object.values(r.answers || {});
        const isFlatline = answers.length >= 10 && answers.every((val) => val === answers[0]);
        return isTooFast || isFlatline;
      });
    }

    return list.slice(0, 10);
  }, [responses, filterAnomalyOnly]);

  const formatRelativeTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "Terkonfirmasi";
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return "Baru saja";
      if (diffMins < 60) return `${diffMins} mnt lalu`;
      if (diffHours < 24) return `${diffHours} jam lalu`;
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch {
      return "Terkonfirmasi";
    }
  };

  const integrityPct = useMemo(() => {
    if (responses.length === 0) return 100;
    const validCount = responses.length - anomalies.length;
    return Number(((validCount / responses.length) * 100).toFixed(1));
  }, [responses, anomalies]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 backdrop-blur-md p-5 shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300">
      {/* Corner subtle glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Live Stream Activity &amp; Audit Anomali</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                Live Sync
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              Aliran data respon santri terverifikasi secara langsung dari Supabase Database.
            </p>
          </div>
        </div>

        {/* Integrity Status Pill & Outlier Alert Chip */}
        <div className="flex items-center gap-2 flex-wrap">
          {anomalies.length > 0 ? (
            <button
              type="button"
              onClick={() => setFilterAnomalyOnly(!filterAnomalyOnly)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterAnomalyOnly
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>
                {filterAnomalyOnly ? "Tampilkan Semua" : `⚡ ${anomalies.length} Anomali Terdeteksi (<45s)`}
              </span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Integritas: {integrityPct}% Bersih</span>
            </div>
          )}
        </div>
      </div>

      {/* Stream Items List */}
      <div className="relative z-10 mt-3 space-y-2">
        {recentResponses.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            Belum ada aktivitas respon pada filter ini.
          </div>
        ) : (
          recentResponses.map((item) => {
            const isIkhwan = item.jenisKelamin?.toLowerCase().includes("ikhwan") ?? true;
            const duration = item.durationSeconds || 0;
            const isTooFast = duration > 0 && duration < 45;
            const answers = Object.values(item.answers || {});
            const isFlatline = answers.length >= 10 && answers.every((val) => val === answers[0]);
            const isAnomalous = isTooFast || isFlatline;

            return (
              <div
                key={item.id}
                onClick={() => onInspectResponse && onInspectResponse(item)}
                className={`group p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 text-xs cursor-pointer ${
                  isAnomalous
                    ? "bg-amber-50/70 dark:bg-amber-950/20 border-amber-300/80 dark:border-amber-700/50 hover:border-amber-500"
                    : "bg-slate-50/60 dark:bg-zinc-950/40 border-slate-200/60 dark:border-zinc-800/60 hover:bg-slate-100/70 dark:hover:bg-zinc-900/80 hover:border-emerald-500/40"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Avatar */}
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isAnomalous
                        ? "bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                        : isIkhwan
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20"
                    }`}
                  >
                    {item.nama.charAt(0).toUpperCase()}
                  </div>

                  {/* Name & Class */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-slate-900 dark:text-white truncate block max-w-[160px] sm:max-w-[220px]">
                        {item.nama}
                      </span>
                      {isAnomalous && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 shrink-0">
                          {isTooFast ? "Kilat <45s" : "Flatline"}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-400 block truncate">
                      {item.kategori} • {item.jenisKelamin || "Ikhwan"}
                    </span>
                  </div>
                </div>

                {/* Right side: Duration, Persona, Score */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-right">
                  {duration > 0 && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        isTooFast
                          ? "bg-red-500/15 text-red-700 dark:text-red-400 font-bold border border-red-500/30"
                          : "bg-slate-200/60 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400"
                      }`}
                    >
                      <Clock className="h-2.5 w-2.5" />
                      {duration}s
                    </span>
                  )}

                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 block">
                      {item.confidenceScore ? `${item.confidenceScore.toFixed(2)}` : "3.18"}
                    </span>
                    <span className="text-[9px] text-slate-400 block font-mono">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
