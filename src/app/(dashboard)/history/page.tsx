"use client";

import * as React from "react";
import { HistoryHeader } from "@/components/history/HistoryHeader";
import { MindfulCadenceCard } from "@/components/history/MindfulCadenceCard";
import { PastDayCard } from "@/components/history/PastDayCard";
import { mockHistoryDays } from "@/lib/mock-data";

export default function HistoryPage() {
  const [range, setRange] = React.useState<"30d" | "term" | "all">("term");
  const [days] = React.useState(mockHistoryDays);

  const totalFocusHours = React.useMemo(
    () => days.reduce((sum, day) => sum + day.deepWorkHours, 0),
    [days]
  );

  const handleExport = () => {
    const jsonStr = JSON.stringify(days, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plan-journal-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Header with Title and Range Filters */}
      <HistoryHeader
        range={range}
        onRangeChange={setRange}
        onExport={handleExport}
      />

      {/* Workload Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
        <MindfulCadenceCard />

        <div className="bg-[var(--bg-surface)] rounded-[var(--radius-card)] p-5 sm:p-6 flex flex-col justify-between shadow-[var(--shadow-card)]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Logged in this view
            </span>
            <p className="text-2xl sm:text-3xl font-bold tracking-[-0.015em] text-[var(--text-primary)] mt-2">
              {days.length} {days.length === 1 ? "day" : "days"}
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              {totalFocusHours.toFixed(1)} focus hours recorded across those days.
            </p>
          </div>

          <p className="text-xs text-[var(--text-secondary)] pt-5 border-t border-[var(--border-subtle)] mt-4">
            Reflections are stored per day below.
          </p>
        </div>
      </div>

      {/* Chronological History Feed */}
      <div className="flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-[-0.015em] text-[var(--text-primary)]">
              Recent days
            </h2>
            <span className="px-3 py-0.5 rounded-[var(--radius-md)] bg-[var(--bg-high)] text-xs font-semibold text-[var(--text-secondary)]">
              {days.length} logged
            </span>
          </div>

          <span className="text-xs text-[var(--text-secondary)] font-medium hidden sm:inline">
            {totalFocusHours.toFixed(1)} focus hours logged
          </span>
        </div>

        {/* Days Feed List */}
        <div className="flex flex-col gap-5">
          {days.map((day) => (
            <PastDayCard key={day.id} day={day} />
          ))}
        </div>
      </div>
    </div>
  );
}
