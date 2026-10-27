"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";

export function VelocitySparkline() {
  return (
    <div className="mt-5 pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--bg-subdued)]/60 rounded-xl px-4 py-3 border border-[var(--border-subtle)]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--primary)] shadow-sm shrink-0">
          <TrendingUp className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            October Velocity &amp; Distribution
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            4 milestones, 1 midterm, 8 assignments total
          </p>
        </div>
      </div>

      {/* SVG Sparkline Distribution Curve */}
      <div className="flex items-center gap-3">
        <svg
          className="h-8 w-44 text-[var(--primary)] shrink-0"
          fill="none"
          viewBox="0 0 160 32"
        >
          <path
            d="M0 24C15 24 20 8 35 8C50 8 55 28 70 28C85 28 90 4 105 4C120 4 135 18 160 18"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Midterm Peak Circle */}
          <circle cx="105" cy="4" r="3.5" fill="#FF3B30" />
          {/* Milestone Circle */}
          <circle cx="70" cy="28" r="3.5" fill="#5E5CE6" />
        </svg>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          W4 Peak
        </span>
      </div>
    </div>
  );
}
