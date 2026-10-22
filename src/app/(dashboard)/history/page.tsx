"use client";

import * as React from "react";
import { HistoryHeader } from "@/components/history/HistoryHeader";
import { MindfulCadenceCard } from "@/components/history/MindfulCadenceCard";
import { ActivityDeepWorkHeatmap } from "@/components/history/ActivityDeepWorkHeatmap";
import { PastDayCard } from "@/components/history/PastDayCard";
import { mockHistoryDays } from "@/lib/mock-data";
import { ChevronRight } from "lucide-react";

export default function HistoryPage() {
  const [range, setRange] = React.useState<"30d" | "term" | "all">("term");
  const [days] = React.useState(mockHistoryDays);

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

      {/* Top Overview Cards: Mindful Cadence (5 cols) + Activity Heatmap (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 flex flex-col">
          <MindfulCadenceCard />
        </div>
        <div className="lg:col-span-7 flex flex-col">
          <ActivityDeepWorkHeatmap />
        </div>
      </div>

      {/* Chronological History Feed */}
      <div className="flex flex-col gap-6">
        {/* Section Header: This Week */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              This Week
            </h2>
            <span className="px-3 py-0.5 rounded-full bg-[var(--bg-high)] text-xs font-semibold text-[var(--text-secondary)]">
              Oct 18 — Oct 22
            </span>
          </div>

          <span className="text-xs text-[var(--text-secondary)] font-medium hidden sm:inline">
            13.5 focus hours logged
          </span>
        </div>

        {/* Days Feed List */}
        <div className="flex flex-col gap-5">
          {days.map((day) => (
            <PastDayCard key={day.id} day={day} />
          ))}
        </div>

        {/* Earlier in October Expand Button */}
        <div className="pt-2 flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--secondary)]" />
            <span className="font-semibold text-[var(--text-primary)]">Earlier in October</span>
            <span className="px-2 py-0.5 rounded-full bg-[var(--bg-subdued)] text-[10px]">
              Oct 1 — Oct 17
            </span>
          </div>

          <button
            type="button"
            className="text-[var(--primary)] hover:underline flex items-center gap-1 font-medium transition-colors"
          >
            <span>Show all 17 earlier logs</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
