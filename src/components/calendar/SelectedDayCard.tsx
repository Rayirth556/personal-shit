"use client";

import * as React from "react";
import { SEMESTER_5_DEADLINES } from "@/lib/runway-generator";

interface SelectedDayCardProps {
  year: number;
  month: number; // 0-based
  day: number;
}

const CATEGORY_TOKEN: Record<string, string> = {
  exam: "--exam",
  assignment: "--assignment",
  project: "--project",
  personal: "--personal",
};

const CATEGORY_LABEL: Record<string, string> = {
  exam: "exam",
  assignment: "assignment",
  project: "project",
  personal: "personal",
};

export function SelectedDayCard({ year, month, day }: SelectedDayCardProps) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const iso = `${year}-${pad(month + 1)}-${pad(day)}`;
  const items = SEMESTER_5_DEADLINES.filter((d) => d.targetDate === iso);

  const date = new Date(year, month, day);
  const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });
  const dateLabel = date.toLocaleDateString("en-GB", { day: "numeric", month: "long" });

  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-2.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
          Selected day
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
          {iso}
        </span>
      </div>

      <p className="display tnum mt-3 text-[30px] leading-none text-[var(--text-primary)]">
        {day}
      </p>
      <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
        {weekday}, {dateLabel}
      </p>

      {items.length === 0 ? (
        <p className="mt-4 border-t border-[var(--border-subtle)] pt-3 text-[11px] text-[var(--text-tertiary)]">
          Nothing scheduled. No Semester 5 deadline lands on this date.
        </p>
      ) : (
        <div className="mt-4 flex flex-col divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)]">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-2.5 py-2.5">
              <span
                className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: `var(${CATEGORY_TOKEN[item.category]})` }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] leading-snug text-[var(--text-primary)]">
                  {item.title}
                </p>
                <p className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                  {item.courseCode}
                  {item.targetTime ? ` · ${item.targetTime}` : ""}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
              </div>
              <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                {CATEGORY_LABEL[item.category]}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
