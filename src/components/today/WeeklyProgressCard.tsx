"use client";

import * as React from "react";

interface WeeklyProgressCardProps {
  completedTasks?: number;
  totalTasks?: number;
}

export function WeeklyProgressCard({
  completedTasks = 0,
  totalTasks = 0,
}: WeeklyProgressCardProps) {
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const remaining = Math.max(0, totalTasks - completedTasks);

  return (
    <section className="bg-[var(--bg-surface)] rounded-[var(--radius-card)] p-5 shadow-none border border-[var(--border-subtle)]">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <h3 className="text-[15px] font-medium text-[var(--text-primary)]">
          Throughput
        </h3>
        <span className="tnum font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
          {totalTasks > 0 ? `${percent}%` : "no tasks"}
        </span>
      </div>

      {/* Numbers over a rule, not a ring */}
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="display tnum text-[40px] leading-none text-[var(--text-primary)]">
          {completedTasks}
        </span>
        <span className="tnum text-[13px] text-[var(--text-tertiary)]">
          / {totalTasks} closed
        </span>
      </div>

      {/* Thin progress rule */}
      <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-[var(--bg-high)]">
        <div
          className="h-full rounded-full bg-[var(--secondary)] transition-[width] duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3 text-[10.5px] text-[var(--text-tertiary)]">
        <span>
          <span className="tnum font-mono text-[var(--text-primary)]">{remaining}</span> open
        </span>
        <span>
          <span className="tnum font-mono text-[var(--text-primary)]">{completedTasks}</span> done
        </span>
      </div>
    </section>
  );
}
