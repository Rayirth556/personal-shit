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
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <section className="bg-[var(--bg-surface)] rounded-[20px] p-5 shadow-[var(--shadow-card)] transition-all">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[17px] font-semibold text-[var(--text-primary)]">
            This week
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Tasks closed vs. open
          </p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-subdued)] text-[var(--text-secondary)] text-[11px] font-semibold uppercase tracking-wider">
          {totalTasks > 0 ? `${percent}%` : "No tasks"}
        </span>
      </div>

      {/* Circular Progress Ring */}
      <div className="relative flex items-center justify-center my-4">
        <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
          {/* Background Track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="var(--bg-high)"
            strokeWidth="9"
          />
          {/* Animated Active Ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Counter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {completedTasks}{" "}
            <span className="text-[var(--text-secondary)] font-normal text-sm">
              / {totalTasks}
            </span>
          </span>
          <span className="text-xs text-[var(--text-secondary)] mt-0.5">
            tasks done
          </span>
        </div>
      </div>

      {/* Bottom Summary Stats */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border-subtle)]/60 text-center">
        <div className="p-2 rounded-xl bg-[var(--bg-subdued)]/60">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Remaining
          </p>
          <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
            {Math.max(0, totalTasks - completedTasks)} tasks
          </p>
        </div>

        <div className="p-2 rounded-xl bg-[var(--bg-subdued)]/60">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Done
          </p>
          <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
            {completedTasks} tasks
          </p>
        </div>
      </div>
    </section>
  );
}
