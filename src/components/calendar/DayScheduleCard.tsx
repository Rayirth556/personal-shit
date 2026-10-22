"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ScheduleItem {
  id: string;
  timeLabel: string;
  title: string;
  category: "exam" | "assignment" | "project" | "personal";
  highlight?: boolean;
}

interface DayScheduleCardProps {
  selectedDay?: number;
}

const defaultItems: ScheduleItem[] = [
  {
    id: "ds-1",
    timeLabel: "08:30 AM",
    title: "Formula review & breakfast",
    category: "personal",
  },
  {
    id: "ds-2",
    timeLabel: "10:00 AM",
    title: "OS Midterm (Hall B)",
    category: "exam",
    highlight: true,
  },
  {
    id: "ds-3",
    timeLabel: "02:00 PM",
    title: "Team sync on Final-year project",
    category: "project",
  },
];

export function DayScheduleCard({ selectedDay = 28 }: DayScheduleCardProps) {
  return (
    <div className="bg-[var(--bg-surface)] rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[var(--border-subtle)]/40 flex flex-col gap-3 transition-all">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">
          {selectedDay} Oct Schedule
        </h3>
        <span className="text-xs text-[var(--text-secondary)]">
          {defaultItems.length} items
        </span>
      </div>

      <div className="flex flex-col gap-2 mt-1">
        {defaultItems.map((item) => {
          let dotBg = "bg-[var(--text-secondary)]";
          if (item.category === "exam") dotBg = "bg-[var(--exam)]";
          else if (item.category === "project") dotBg = "bg-[var(--project)]";
          else if (item.category === "assignment") dotBg = "bg-[var(--assignment)]";

          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-3 p-2.5 rounded-xl transition-colors",
                item.highlight
                  ? "bg-[var(--exam-tint)]/80 text-[var(--exam-text)]"
                  : "bg-[var(--bg-subdued)]/60 text-[var(--text-primary)]"
              )}
            >
              <span
                className={cn(
                  "text-[11px] font-semibold uppercase tracking-wider w-16 shrink-0",
                  item.highlight ? "text-[var(--exam-text)] font-bold" : "text-[var(--text-secondary)]"
                )}
              >
                {item.timeLabel}
              </span>

              <div className={cn("w-2 h-2 rounded-full shrink-0", dotBg)} />

              <span className="text-xs font-medium truncate flex-1">
                {item.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
