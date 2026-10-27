"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { mockComingUp } from "@/lib/mock-data";

export function ComingUpCard() {
  return (
    <section className="bg-[var(--bg-surface)] rounded-[var(--radius-card)] p-5 shadow-none border border-[var(--border-subtle)] transition-all">
      <div className="flex items-baseline justify-between pb-2">
        <h3 className="text-[15px] font-medium text-[var(--text-primary)]">
          Coming up
        </h3>
        <Link
          href="/calendar"
          className="flex items-center gap-0.5 text-[11px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <span>Calendar</span>
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-[var(--border-subtle)]">
        {mockComingUp.map((item) => {
          let dotColor = "bg-[var(--primary)]";

          if (item.type === "exam") {
            dotColor = "bg-[var(--exam)]";
          } else if (item.type === "assignment") {
            dotColor = "bg-[var(--assignment)]";
          } else if (item.type === "project") {
            dotColor = "bg-[var(--project)]";
          }

          return (
            <div
              key={item.id}
              className="group flex items-center justify-between gap-3 py-2.5 px-1 transition-colors hover:bg-[var(--bg-subdued)]/60"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`h-1.5 w-1.5 rounded-full ${dotColor} shrink-0`} />
                <div className="min-w-0">
                  <p className="truncate text-[13px] text-[var(--text-primary)]">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-[var(--text-tertiary)]">
                    {item.dueDate}
                  </p>
                </div>
              </div>

              <span className="tnum shrink-0 font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                {item.countdown}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
