"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// 16 weeks of 7-day deep work activity
const sixteenWeeksMatrix: number[][] = [
  [0, 1, 2, 1, 3, 0, 0], // W1
  [1, 2, 3, 4, 2, 0, 1], // W2
  [2, 3, 3, 1, 2, 0, 0], // W3
  [3, 3, 2, 3, 1, 1, 0], // W4
  [0, 1, 3, 3, 2, 0, 0], // W5
  [1, 3, 3, 3, 2, 1, 0], // W6
  [3, 3, 3, 1, 2, 0, 0], // W7
  [0, 2, 3, 3, 4, 1, 0], // W8
  [2, 1, 3, 3, 1, 0, 0], // W9
  [2, 3, 3, 4, 1, 2, 0], // W10
  [3, 3, 1, 2, 3, 0, 0], // W11
  [1, 3, 3, 3, 2, 0, 1], // W12
  [0, 1, 3, 3, 1, 0, 0], // W13
  [3, 3, 1, 2, 3, 2, 0], // W14
  [3, 3, 3, 1, 2, 1, 0], // W15
  [3, 3, 3, 4, 0, 0, 0], // W16 (Current - Thu 22 Oct)
];

export function ActivityDeepWorkHeatmap() {
  const getCellClass = (level: number, isToday = false) => {
    let bg = "bg-[var(--bg-high)]";
    if (level === 1) bg = "bg-[var(--secondary-fixed)]/60";
    else if (level === 2) bg = "bg-[var(--secondary-fixed)]";
    else if (level === 3) bg = "bg-[var(--secondary)]/80";
    else if (level === 4) bg = "bg-[var(--secondary)]";

    return cn(
      "w-3.5 h-3.5 rounded-[3px] transition-transform hover:scale-125 cursor-pointer",
      bg,
      isToday && "ring-2 ring-[var(--secondary)] ring-offset-1 ring-offset-[var(--bg-surface)]"
    );
  };

  return (
    <div className="bg-[var(--bg-surface)] rounded-[20px] p-5 sm:p-6 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[var(--border-subtle)]/40 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Activity &amp; Deep Work
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Focus volume across the last 16 academic weeks
          </p>
        </div>
        <div className="hidden sm:flex items-center text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          <span>Aug 26 — Oct 22</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto py-2">
        <div className="min-w-[460px] flex flex-col gap-2">
          {/* Month Labels */}
          <div className="flex text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] pl-6 justify-between pr-2">
            <span>Late Aug</span>
            <span>September</span>
            <span>Mid Oct</span>
            <span>Current</span>
          </div>

          {/* Matrix with Day Labels */}
          <div className="flex gap-2 items-center">
            <div className="flex flex-col justify-between text-[10px] font-bold uppercase text-[var(--text-secondary)] h-28 pr-1 select-none">
              <span>M</span>
              <span>W</span>
              <span>F</span>
              <span>S</span>
            </div>

            <div className="grid grid-flow-col grid-rows-7 gap-1.5 flex-1">
              {sixteenWeeksMatrix.map((week, wIdx) =>
                week.map((level, dIdx) => {
                  const isToday = wIdx === 15 && dIdx === 3;
                  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                  const tooltip = `${days[dIdx]} • Week ${wIdx + 1}: ${
                    level === 0 ? "Rest / No focus" : `${level * 1.5}h deep work`
                  }${isToday ? " • Today" : ""}`;

                  return (
                    <div
                      key={`${wIdx}-${dIdx}`}
                      className={getCellClass(level, isToday)}
                      title={tooltip}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-[var(--border-subtle)]/40 text-xs text-[var(--text-secondary)] mt-2">
        <span className="text-[11px]">Hover individual dates for focus logs</span>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span>Rest</span>
          <div className="w-3 h-3 rounded-[3px] bg-[var(--bg-high)]" />
          <div className="w-3 h-3 rounded-[3px] bg-[var(--secondary-fixed)]/60" />
          <div className="w-3 h-3 rounded-[3px] bg-[var(--secondary-fixed)]" />
          <div className="w-3 h-3 rounded-[3px] bg-[var(--secondary)]" />
          <span>Deep focus</span>
        </div>
      </div>
    </div>
  );
}
