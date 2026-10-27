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

const LEGEND = [
  { label: "Exam", token: "--exam" },
  { label: "Assign", token: "--assignment" },
  { label: "Project", token: "--project" },
  { label: "Study", token: "--personal" },
];

export function CalendarHeader({
  currentMonth,
  currentTerm,
  view,
  onViewChange,
  onNewEventClick,
  onPreviousMonth,
  onNextMonth,
  onTodayClick,
}: CalendarHeaderProps) {
  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      {/* Month + navigation */}
      <div className="flex items-end gap-3">
        <div>
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
            {currentTerm}
          </p>
          <h1 className="display text-[34px] leading-none text-[var(--text-primary)]">
            {currentMonth}
          </h1>
        </div>

        <div className="mb-0.5 flex items-center gap-0.5">
          <button
            type="button"
            onClick={onPreviousMonth}
            aria-label="Previous month"
            className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-subdued)] hover:text-[var(--text-primary)]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onTodayClick}
            className="rounded-[var(--radius-sm)] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-subdued)] hover:text-[var(--text-primary)]"
          >
            Today
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Next month"
            className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-subdued)] hover:text-[var(--text-primary)]"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Views, legend, new event */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2.5">
          {(["month", "week", "agenda"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onViewChange(v)}
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.06em] transition-colors",
                view === v
                  ? "text-[var(--text-primary)] underline decoration-1 underline-offset-4"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              )}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="hidden h-3 w-px bg-[var(--border-subtle)] sm:block" />

        <div className="hidden items-center gap-3 sm:flex">
          {LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: `var(${item.token})` }}
              />
              <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <Button
          type="button"
          onClick={onNewEventClick}
          size="sm"
          className="ml-auto text-[11px] font-medium"
        >
          <Plus className="h-3 w-3" />
          <span>New event</span>
        </Button>
      </div>
    </section>
  );
}
