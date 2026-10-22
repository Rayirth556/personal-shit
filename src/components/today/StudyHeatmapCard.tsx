"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// 12 weeks of 7-day activity mock (0 = none, 1 = 1-2h, 2 = 2-3h, 3 = 3-4h, 4 = 4h+)
const heatmapMatrix: number[][] = [
  // W1
  [0, 1, 2, 0, 1, 3, 0],
  // W2
  [1, 3, 2, 1, 0, 4, 2],
  // W3
  [0, 1, 0, 2, 1, 3, 0],
  // W4
  [1, 2, 3, 4, 1, 0, 1],
  // W5
  [2, 3, 4, 1, 3, 1, 0],
  // W6
  [0, 1, 2, 3, 2, 4, 1],
  // W7
  [1, 3, 3, 2, 0, 1, 1],
  // W8
  [2, 0, 1, 3, 4, 3, 2],
  // W9
  [1, 1, 2, 0, 3, 4, 0],
  // W10
  [3, 4, 3, 2, 1, 3, 1],
  // W11
  [1, 2, 3, 4, 3, 1, 0],
  // W12 (Current Week - Thursday is index 3)
  [3, 4, 3, 4, 0, 0, 0],
];

export function StudyHeatmapCard() {
  const getIntensityClass = (level: number, isToday = false) => {
    let bg = "bg-[var(--bg-high)]";
    if (level === 1) bg = "bg-[var(--primary-fixed)]";
    else if (level === 2) bg = "bg-[var(--secondary-fixed-dim)]";
    else if (level === 3) bg = "bg-[var(--primary)]/75";
    else if (level === 4) bg = "bg-[var(--primary)]";

    return cn(
      "w-2.5 h-2.5 rounded-[2.5px] transition-transform hover:scale-125 cursor-pointer",
      bg,
      isToday && "ring-2 ring-[var(--primary)]/40 ring-offset-1 ring-offset-[var(--bg-surface)]"
    );
  };

  return (
    <section className="bg-[var(--bg-surface)] rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[var(--border-subtle)]/40 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[17px] font-semibold text-[var(--text-primary)]">
          Study consistency
        </h3>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Last 12 wks
        </span>
      </div>
      <p className="text-xs text-[var(--text-secondary)] mb-4">
        Daily deep-work sessions recorded
      </p>

      {/* Grid: Day Labels + 12 Column Matrix */}
      <div className="flex gap-2.5 items-start justify-center">
        {/* Day Indicators */}
        <div className="flex flex-col justify-between h-[96px] text-[10px] font-medium text-[var(--text-secondary)] pt-0.5">
          <span>M</span>
          <span>W</span>
          <span>F</span>
          <span>S</span>
        </div>

        {/* Matrix Container */}
        <div className="grid grid-flow-col grid-rows-7 gap-[3.5px] select-none">
          {heatmapMatrix.map((week, weekIdx) =>
            week.map((level, dayIdx) => {
              const isToday = weekIdx === 11 && dayIdx === 3;
              const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
              const tooltip = `${days[dayIdx]} (W${weekIdx + 1}): ${
                level === 0 ? "No focus session" : `${level * 1.2}h deep work`
              }${isToday ? " • Today" : ""}`;

              return (
                <div
                  key={`${weekIdx}-${dayIdx}`}
                  className={getIntensityClass(level, isToday)}
                  title={tooltip}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]/60 flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <span>Less</span>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-[2.5px] bg-[var(--bg-high)]" />
          <span className="w-2.5 h-2.5 rounded-[2.5px] bg-[var(--primary-fixed)]" />
          <span className="w-2.5 h-2.5 rounded-[2.5px] bg-[var(--secondary-fixed-dim)]" />
          <span className="w-2.5 h-2.5 rounded-[2.5px] bg-[var(--primary)]/75" />
          <span className="w-2.5 h-2.5 rounded-[2.5px] bg-[var(--primary)]" />
        </div>
        <span>More</span>
      </div>
    </section>
  );
}
