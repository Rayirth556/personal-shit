"use client";

import * as React from "react";
import { Check, Edit3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HistoryDay } from "@/lib/mock-data";

interface PastDayCardProps {
  day: HistoryDay;
}

export function PastDayCard({ day }: PastDayCardProps) {
  return (
    <article className="bg-[var(--bg-surface)] rounded-[20px] p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[var(--border-subtle)]/40 flex flex-col gap-4 relative overflow-hidden transition-all hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
      {/* Accent Indicator Bar on Left Edge */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--primary)]" />

      {/* Day Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)]">
            {day.dateString}
          </h3>
          <span className="text-xs text-[var(--text-secondary)] font-medium">
            {day.relativeLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--secondary-fixed)]/40 text-[var(--secondary)] text-xs font-semibold">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
            <span>
              {day.tasksCompleted} of {day.tasksTotal} completed • {day.completionPercent}%
            </span>
          </span>
          <span className="text-[var(--text-secondary)] text-xs font-medium pl-1 hidden sm:inline">
            ⏱️ {day.deepWorkHours}h deep work
          </span>
        </div>
      </div>

      {/* Daily Journal Reflection Box */}
      {day.reflection && (
        <div className="bg-[var(--bg-subdued)] rounded-xl p-3.5 flex items-start gap-3 border border-[var(--border-subtle)]/30">
          <div className="w-7 h-7 rounded-full bg-[var(--secondary-fixed)]/60 text-[var(--secondary)] flex items-center justify-center shrink-0 mt-0.5">
            <Edit3 className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Evening Reflection
            </span>
            <p className="text-xs sm:text-sm text-[var(--text-primary)] italic leading-relaxed">
              &ldquo;{day.reflection}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Scheduled Agenda 2-Column Task Grid */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Scheduled Agenda
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {day.tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-subdued)]/60 hover:bg-[var(--bg-subdued)] transition-colors border border-[var(--border-subtle)]/30"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-medium text-[var(--text-secondary)] line-through truncate">
                    {task.title}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    {task.timeLabel} • {task.details}
                  </span>
                </div>
              </div>

              <Badge variant={task.category} className="shrink-0 text-[10px] px-2 py-0.5 capitalize ml-2">
                {task.category}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Day Summary Metrics */}
      <div className="pt-2 border-t border-[var(--border-subtle)]/40 flex items-center gap-3 text-xs text-[var(--text-secondary)] flex-wrap">
        <span>⏱️ {day.summary.deepWorkHours} hrs deep work</span>
        <span className="text-[var(--border-subtle)]">•</span>
        <span>🎓 {day.summary.lecturesAttended} lectures attended</span>
        <span className="text-[var(--border-subtle)]">•</span>
        <span>📖 {day.summary.pagesLogged} pages logged</span>
      </div>
    </article>
  );
}
