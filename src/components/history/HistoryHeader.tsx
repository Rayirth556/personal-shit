"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HistoryHeaderProps {
  range: "30d" | "term" | "all";
  onRangeChange: (range: "30d" | "term" | "all") => void;
  onExport?: () => void;
}

export function HistoryHeader({
  range,
  onRangeChange,
  onExport,
}: HistoryHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
      {/* Title & Metadata */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[var(--text-secondary)] text-[11px] font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)]" />
          <span>Academic Logbook &amp; Archive</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.015em] text-[var(--text-primary)]">
          History &amp; Reflection
        </h1>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] flex items-center gap-2 mt-0.5">
          <span>Autumn Term</span>
          <span className="text-[var(--border-subtle)]">•</span>
          <span className="font-semibold text-[var(--text-primary)]">42 days logged</span>
          <span className="text-[var(--border-subtle)]">•</span>
          <span>Looking back on your natural momentum</span>
        </p>
      </div>

      {/* Filter Range Pills & Export */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="p-1 rounded-[var(--radius-md)] bg-[var(--bg-high)]/60 border border-[var(--border-subtle)] flex items-center shadow-inner">
          {[
            { id: "30d", label: "Last 30 Days" },
            { id: "term", label: "Autumn Term 2024" },
            { id: "all", label: "All Time" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onRangeChange(item.id as "30d" | "term" | "all")}
              className={cn(
                "px-3 py-1 rounded-[var(--radius-md)] text-xs font-medium transition-all",
                range === item.id
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onExport}
          className="rounded-[var(--radius-md)] flex items-center gap-1.5 text-xs font-medium text-[var(--secondary)] shadow-xs"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Journal</span>
        </Button>
      </div>
    </div>
  );
}
