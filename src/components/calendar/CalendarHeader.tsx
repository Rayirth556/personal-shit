"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarHeaderProps {
  currentMonth: string;
  currentTerm: string;
  view: "month" | "week" | "agenda";
  onViewChange: (view: "month" | "week" | "agenda") => void;
  onNewEventClick?: () => void;
  onPreviousMonth?: () => void;
  onNextMonth?: () => void;
  onTodayClick?: () => void;
}

export function CalendarHeader({
  currentMonth = "October 2024",
  currentTerm = "Term 1",
  view,
  onViewChange,
  onNewEventClick,
  onPreviousMonth,
  onNextMonth,
  onTodayClick,
}: CalendarHeaderProps) {
  return (
    <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Month Title & Navigation */}
      <div className="flex items-center gap-3 md:gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            {currentMonth}
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)] text-[11px] font-semibold">
            {currentTerm}
          </span>
        </div>

        {/* Date Jump Controls */}
        <div className="flex items-center gap-1 bg-[var(--bg-high)]/60 rounded-full p-1 shadow-sm border border-[var(--border-subtle)]/40">
          <button
            type="button"
            onClick={onPreviousMonth}
            aria-label="Previous month"
            className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] hover:shadow-sm transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onTodayClick}
            className="px-2.5 py-0.5 rounded-full text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)] hover:shadow-sm transition-all"
          >
            Today
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Next month"
            className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] hover:shadow-sm transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* View Switcher, Category Indicators, and New Event Button */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Month / Week / Agenda Segmented Toggle */}
        <div className="flex items-center p-1 bg-[var(--bg-high)]/60 rounded-full border border-[var(--border-subtle)]/40 shadow-inner">
          {(["month", "week", "agenda"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onViewChange(v)}
              className={cn(
                "px-3.5 py-1 rounded-full text-xs font-medium capitalize transition-all",
                view === v
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Category Legend Pills */}
        <div className="hidden sm:flex items-center gap-2 bg-[var(--bg-surface)] px-3 py-1.5 rounded-full shadow-sm border border-[var(--border-subtle)]/40 text-xs">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--exam)]" />
            <span>Exams</span>
          </div>
          <span className="text-[var(--border-subtle)]">•</span>
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--assignment)]" />
            <span>Assign</span>
          </div>
          <span className="text-[var(--border-subtle)]">•</span>
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--project)]" />
            <span>Projects</span>
          </div>
          <span className="text-[var(--border-subtle)]">•</span>
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            <span>Study</span>
          </div>
        </div>

        {/* New Event Button */}
        <Button
          type="button"
          onClick={onNewEventClick}
          size="sm"
          className="rounded-full shadow-[0_4px_14px_rgba(94,92,230,0.25)]"
        >
          <Plus className="h-4 w-4" />
          <span>New Event</span>
        </Button>
      </div>
    </section>
  );
}
