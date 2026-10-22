"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockComingUp } from "@/lib/mock-data";

export function ComingUpCard() {
  return (
    <section className="bg-[var(--bg-surface)] rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[var(--border-subtle)]/40 transition-all">
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-[17px] font-semibold text-[var(--text-primary)]">
          Coming up
        </h3>
        <Link
          href="/calendar"
          className="text-xs font-medium text-[var(--secondary)] hover:underline flex items-center gap-0.5 transition-colors"
        >
          <span>View all</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-[var(--border-subtle)]/50">
        {mockComingUp.map((item) => {
          let dotColor = "bg-[var(--primary)]";
          let badgeVariant: "exam" | "assignment" | "project" | "personal" = "assignment";

          if (item.type === "exam") {
            dotColor = "bg-[var(--exam)]";
            badgeVariant = "exam";
          } else if (item.type === "assignment") {
            dotColor = "bg-[var(--assignment)]";
            badgeVariant = "assignment";
          } else if (item.type === "project") {
            dotColor = "bg-[var(--project)]";
            badgeVariant = "project";
          }

          return (
            <div
              key={item.id}
              className="py-3 flex items-center justify-between gap-3 group hover:bg-[var(--bg-subdued)]/40 px-1 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--primary)] transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {item.dueDate}
                  </p>
                </div>
              </div>

              <Badge variant={badgeVariant} className="shrink-0 text-xs px-2.5 py-0.5 font-semibold">
                {item.countdown}
              </Badge>
            </div>
          );
        })}
      </div>
    </section>
  );
}
