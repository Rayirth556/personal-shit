"use client";

import * as React from "react";
import { Clock, MapPin, Share2, MoreHorizontal } from "lucide-react";

interface ExamSpotlightCardProps {
  selectedDay?: number;
}

export function ExamSpotlightCard({ selectedDay = 28 }: ExamSpotlightCardProps) {
  const isOct28 = selectedDay === 28;

  return (
    <div className="bg-[var(--bg-surface)] rounded-[var(--radius-card)] p-5 shadow-none border border-[var(--border-subtle)] flex flex-col gap-3 transition-all">
      {/* Header Badge & Action Icons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--exam)]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--exam)]">
            Exam Day
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Share agenda"
            className="w-7 h-7 rounded-[var(--radius-md)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-high)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Options"
            className="w-7 h-7 rounded-[var(--radius-md)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-high)] hover:text-[var(--text-primary)] transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Date Title */}
      <div>
        <h2 className="text-xl font-bold tracking-[-0.015em] text-[var(--text-primary)]">
          Wednesday, {selectedDay} Oct
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Academic Assessment Calendar
        </p>
      </div>

      {/* Highlight Assessment Card */}
      <div className="bg-[var(--bg-subdued)] rounded-xl p-3.5 flex flex-col gap-2 relative overflow-hidden border-l-4 border-l-[var(--exam)]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {isOct28 ? "Operating Systems Midterm" : `Assessment Session: Day ${selectedDay}`}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--text-secondary)]">
              <Clock className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
              <span>10:00 AM – 12:30 PM</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-[var(--radius-md)] bg-[var(--exam-tint)] text-[var(--exam-text)] text-[10px] font-bold uppercase tracking-wider shrink-0">
            6 days left
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <MapPin className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
          <span>Turing Hall B (Floor 3)</span>
        </div>

        {/* Topic Badges */}
        <div className="pt-1.5 flex flex-wrap gap-1.5">
          {["Virtual Memory", "Semaphores", "Scheduling"].map((topic) => (
            <span
              key={topic}
              className="px-2.5 py-0.5 rounded-[var(--radius-md)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs font-medium shadow-xs border border-[var(--border-subtle)]"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
