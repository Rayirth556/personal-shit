"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SEMESTER_5_DEADLINES, AcademicDeadline } from "@/lib/runway-generator";

interface MonthGridProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  year?: number;
  month?: number; // 0-based
}

const CATEGORY_TOKEN: Record<string, string> = {
  exam: "--exam",
  assignment: "--assignment",
  project: "--project",
  personal: "--personal",
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const pad = (n: number) => String(n).padStart(2, "0");

function shortTitle(title: string): string {
  return title
    .replace(/ Chart Preparation & Viva Presentation$/i, "")
    .replace(/ Examination$/i, "")
    .replace(/ Project Review$/i, "")
    .replace(/ Assessment Exam$/i, "");
}

export function MonthGrid({
  selectedDay,
  onSelectDay,
  year = new Date().getFullYear(),
  month = new Date().getMonth(),
}: MonthGridProps) {
  const now = new Date();
  const todayY = now.getFullYear();
  const todayM = now.getMonth();
  const todayD = now.getDate();

  // Every deadline, keyed by its ISO date, so adjacent-month cells can
  // surface their events too (the November exams are the important ones).
  const byDate = React.useMemo(() => {
    const map = new Map<string, AcademicDeadline[]>();
    for (const dl of SEMESTER_5_DEADLINES) {
      const arr = map.get(dl.targetDate) ?? [];
      arr.push(dl);
      map.set(dl.targetDate, arr);
    }
    return map;
  }, []);

  const cells = React.useMemo(() => {
    const result: { y: number; m: number; d: number; month: "prev" | "current" | "next" }[] = [];
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7; // Monday = 0

    const prevLast = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      const dt = new Date(year, month - 1, prevLast - i);
      result.push({ y: dt.getFullYear(), m: dt.getMonth(), d: dt.getDate(), month: "prev" });
    }

    const daysInCur = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInCur; d++) {
      result.push({ y: year, m: month, d, month: "current" });
    }

    const total = 42; // six weeks — keeps next-month deadlines (Nov exams) visible
    let add = 0;
    while (result.length < total) {
      const dt = new Date(year, month + 1, 1 + add);
      result.push({ y: dt.getFullYear(), m: dt.getMonth(), d: dt.getDate(), month: "next" });
      add++;
    }

    return result;
  }, [year, month]);

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-subtle)]">
      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-px border-b border-[var(--border-subtle)] bg-[var(--border-subtle)]">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="bg-[var(--bg-surface)] px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells, hairline-separated */}
      <div className="grid grid-cols-7 gap-px bg-[var(--border-subtle)]">
        {cells.map((cell, idx) => {
          const dimmed = cell.month !== "current";
          const isToday = cell.y === todayY && cell.m === todayM && cell.d === todayD;
          const isSelected = !dimmed && cell.d === selectedDay;
          const iso = `${cell.y}-${pad(cell.m + 1)}-${pad(cell.d)}`;
          const events = byDate.get(iso) ?? [];

          return (
            <button
              key={idx}
              type="button"
              disabled={dimmed}
              onClick={() => onSelectDay(cell.d)}
              className={cn(
                "flex min-h-[86px] flex-col gap-1.5 p-2 text-left align-top transition-colors",
                dimmed
                  ? "cursor-default bg-[var(--bg-canvas)]"
                  : "cursor-pointer bg-[var(--bg-surface)] hover:bg-[var(--bg-subdued)]/50",
                isSelected && "bg-[var(--bg-subdued)]/70 ring-1 ring-inset ring-[var(--primary)]"
              )}
            >
              <span
                className={cn(
                  "tnum inline-flex h-[18px] w-[18px] items-center justify-center rounded-[4px] font-mono text-[10px]",
                  isToday
                    ? "bg-[var(--primary)] text-[var(--on-primary)]"
                    : dimmed
                      ? "text-[var(--text-tertiary)]"
                      : "text-[var(--text-secondary)]"
                )}
              >
                {cell.d}
              </span>

              <span className="flex flex-col gap-0.5 overflow-hidden">
                {events.slice(0, 2).map((e) => (
                  <span
                    key={e.id}
                    className={cn(
                      "flex items-center gap-1.5 text-[9.5px] leading-tight",
                      dimmed ? "text-[var(--text-tertiary)]" : "text-[var(--text-primary)]"
                    )}
                  >
                    <span
                      className="h-1 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: `var(${CATEGORY_TOKEN[e.category]})` }}
                    />
                    <span className="truncate">{shortTitle(e.title)}</span>
                  </span>
                ))}
                {events.length > 2 && (
                  <span className="font-mono text-[8.5px] text-[var(--text-tertiary)]">
                    +{events.length - 2}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
