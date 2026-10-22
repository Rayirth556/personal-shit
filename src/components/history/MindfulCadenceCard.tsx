"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";

export function MindfulCadenceCard() {
  return (
    <div className="bg-[var(--bg-surface)] rounded-[20px] p-5 sm:p-6 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[var(--border-subtle)]/40 relative overflow-hidden transition-all">
      {/* Background Soft Glows */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[var(--primary)]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-[var(--secondary)]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Card Category & Status */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Mindful Cadence
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[var(--bg-subdued)] text-[var(--secondary)] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[var(--secondary)] animate-pulse" />
            <span>Balanced Flow</span>
          </span>
        </div>

        {/* Streak Main Indicator */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[var(--secondary-fixed)]/60 text-[var(--secondary)] flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                5 days
              </span>
              <span className="text-base font-semibold text-[var(--secondary)]">
                in rhythm
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
              Steady presence without burnout anxiety. You showed up with intentional focus on{" "}
              <strong className="text-[var(--text-primary)] font-semibold">24 of the last 28 days</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Metric Mini Cards */}
      <div className="relative z-10 grid grid-cols-3 gap-2 pt-5 border-t border-[var(--border-subtle)]/40 mt-4">
        <div className="bg-[var(--bg-subdued)]/60 rounded-xl p-2.5 flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Consistency
          </span>
          <span className="text-lg font-bold text-[var(--text-primary)]">88%</span>
          <span className="text-[10px] text-[var(--text-secondary)]">Task close rate</span>
        </div>

        <div className="bg-[var(--bg-subdued)]/60 rounded-xl p-2.5 flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Daily Focus
          </span>
          <span className="text-lg font-bold text-[var(--secondary)]">3.4h</span>
          <span className="text-[10px] text-[var(--text-secondary)]">Avg deep work</span>
        </div>

        <div className="bg-[var(--bg-subdued)]/60 rounded-xl p-2.5 flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Reflections
          </span>
          <span className="text-lg font-bold text-[var(--primary)]">14</span>
          <span className="text-[10px] text-[var(--text-secondary)]">Days noted</span>
        </div>
      </div>
    </div>
  );
}
