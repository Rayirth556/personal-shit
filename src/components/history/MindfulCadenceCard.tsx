"use client";

import * as React from "react";
import { useTasks } from "@/lib/task-store";

export function MindfulCadenceCard() {
  const { stats } = useTasks();

  return (
    <div className="bg-[var(--bg-surface)] rounded-[20px] p-5 sm:p-6 flex flex-col justify-between shadow-[var(--shadow-card)] transition-all">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Current workload
          </span>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {stats.total > 0 ? `${stats.percentage}%` : "—"}
            </span>
            <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
              {stats.total > 0
                ? `${stats.completed} of ${stats.total} tracked tasks closed.`
                : "No tasks tracked yet. Add one from the sidebar to start."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-5 border-t border-[var(--border-subtle)]/40 mt-4">
        <div className="bg-[var(--bg-subdued)]/60 rounded-xl p-2.5 flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Open
          </span>
          <span className="text-lg font-bold text-[var(--text-primary)]">
            {stats.remaining}
          </span>
        </div>

        <div className="bg-[var(--bg-subdued)]/60 rounded-xl p-2.5 flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Top 3 left
          </span>
          <span className="text-lg font-bold text-[var(--text-primary)]">
            {stats.top3Remaining}
          </span>
        </div>
      </div>
    </div>
  );
}
