"use client";

import * as React from "react";
import { CheckCircle2, Circle } from "lucide-react";

interface DeliverablesTrackerProps {
  progressPercent: number;
  deliverablesDone: number;
  deliverablesTotal: number;
  inProgressCount: number;
  dueThisWeekCount: number;
  blockersCount: number;
}

export function DeliverablesTracker({
  progressPercent = 68,
  deliverablesDone = 17,
  deliverablesTotal = 25,
  inProgressCount = 4,
  dueThisWeekCount = 3,
  blockersCount = 0,
}: DeliverablesTrackerProps) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius; // ~125.6
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <section
      aria-label="Project Status and Milestone Tracker"
      className="p-5 md:p-6 rounded-[var(--radius-card)] bg-[var(--bg-surface)] shadow-none border border-[var(--border-subtle)] flex flex-col gap-4 transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Progress Ring & Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-12 h-12 -rotate-90 transform" viewBox="0 0 48 48">
              <circle
                className="text-[var(--bg-subdued)]"
                cx="24"
                cy="24"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeWidth="4"
              />
              <circle
                className="text-[var(--primary)]"
                cx="24"
                cy="24"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <span className="absolute text-xs font-bold text-[var(--text-primary)]">
              {progressPercent}%
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                Overall Deliverables
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-[var(--radius-md)] bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)] uppercase tracking-wider">
                On Track
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {deliverablesDone} of {deliverablesTotal} sprint deliverables validated
            </p>
          </div>
        </div>

        {/* Micro Metric Counters */}
        <div className="flex items-center gap-4 divide-x divide-[var(--border-subtle)]/60 text-xs">
          <div className="flex items-center gap-2 pl-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--secondary)]" />
            <span className="text-[var(--text-primary)]">
              <strong className="font-bold">{inProgressCount}</strong> in progress
            </span>
          </div>

          <div className="flex items-center gap-2 pl-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary-fixed-dim)]" />
            <span className="text-[var(--text-primary)]">
              <strong className="font-bold">{dueThisWeekCount}</strong> due this week
            </span>
          </div>

          <div className="flex items-center gap-2 pl-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--bg-highest)]" />
            <span className="text-[var(--text-secondary)]">
              <strong className="font-bold text-[var(--text-primary)]">{blockersCount}</strong> blockers
            </span>
          </div>
        </div>
      </div>

      {/* Milestone Progress Bar */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="w-full h-2.5 rounded-[var(--radius-md)] bg-[var(--bg-subdued)] overflow-hidden flex">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-700 ease-out rounded-[var(--radius-md)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Milestone Labels */}
        <div className="grid grid-cols-4 text-center text-xs pt-1">
          <div className="text-left text-[var(--text-primary)] font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--primary)] fill-[var(--primary)]/20" />
            <span className="truncate">Spec Review</span>
          </div>

          <div className="text-left sm:text-center text-[var(--text-primary)] font-semibold flex items-center justify-start sm:justify-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--primary)] fill-[var(--primary)]/20" />
            <span className="truncate">Hardware Proto</span>
          </div>

          <div className="text-center text-[var(--primary)] font-semibold flex items-center justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            <span className="truncate">Navigation Stack</span>
          </div>

          <div className="text-right text-[var(--text-secondary)] flex items-center justify-end gap-1">
            <Circle className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
            <span className="truncate">Final Defense</span>
          </div>
        </div>
      </div>
    </section>
  );
}
