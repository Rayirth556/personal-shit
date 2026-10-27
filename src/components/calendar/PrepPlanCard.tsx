"use client";

import * as React from "react";
import { CheckCircle2, Circle, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PrepStep {
  id: string;
  dateLabel: string;
  durationLabel: string;
  taskTitle: string;
  completed: boolean;
  isToday?: boolean;
}

const initialSteps: PrepStep[] = [
  {
    id: "step-1",
    dateLabel: "Thu 22 Oct (Today)",
    durationLabel: "Scheduled",
    taskTitle: "Process Scheduling & Paging (2 hrs)",
    completed: true,
    isToday: true,
  },
  {
    id: "step-2",
    dateLabel: "Fri 23 Oct",
    durationLabel: "1.5 hrs",
    taskTitle: "Solve Past Papers 2022–2023",
    completed: false,
  },
  {
    id: "step-3",
    dateLabel: "Sat 24 Oct",
    durationLabel: "2.5 hrs",
    taskTitle: "Page Replacement Algorithms",
    completed: false,
  },
  {
    id: "step-4",
    dateLabel: "Mon 26 Oct",
    durationLabel: "2.0 hrs",
    taskTitle: "Timed Mock Exam Simulation",
    completed: false,
  },
  {
    id: "step-5",
    dateLabel: "Tue 27 Oct",
    durationLabel: "1.0 hr",
    taskTitle: "Formula cheat sheet & rest",
    completed: false,
  },
];

export function PrepPlanCard() {
  const [steps, setSteps] = React.useState<PrepStep[]>(initialSteps);
  const [blocksAdded, setBlocksAdded] = React.useState(false);

  const toggleStep = (id: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleAddAll = () => {
    setBlocksAdded(true);
    setSteps((prev) => prev.map((s) => ({ ...s, completed: true })));
  };

  return (
    <div className="bg-[var(--bg-surface)] rounded-[var(--radius-card)] p-5 shadow-none border border-[var(--border-subtle)] flex flex-col gap-4 transition-all">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <span className="text-[15px] font-medium text-[var(--text-primary)]">
          Prep plan
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
          {steps.length} sittings
        </span>
      </div>

      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
        Sittings spread over the days before the exam.
      </p>

      {/* Plan Timeline Checklist */}
      <div className="flex flex-col gap-2">
        {steps.map((step) => {
          return (
            <div
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={cn(
                "flex items-start gap-2.5 p-2 rounded-xl transition-all cursor-pointer select-none",
                step.isToday
                  ? "bg-[var(--primary-fixed)]/20 border border-[var(--primary)]/20"
                  : "hover:bg-[var(--bg-subdued)]"
              )}
            >
              {step.completed ? (
                <CheckCircle2 className="h-4 w-4 text-[var(--primary)] mt-0.5 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-[var(--text-secondary)] mt-0.5 shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      step.completed
                        ? "text-[var(--primary)]"
                        : "text-[var(--text-primary)]"
                    )}
                  >
                    {step.dateLabel}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      step.isToday ? "text-[var(--primary)] uppercase font-bold" : "text-[var(--text-secondary)]"
                    )}
                  >
                    {step.durationLabel}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-xs truncate mt-0.5",
                    step.completed && !step.isToday
                      ? "line-through text-[var(--text-secondary)]"
                      : "text-[var(--text-primary)] font-normal"
                  )}
                >
                  {step.taskTitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      <Button
        type="button"
        onClick={handleAddAll}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-[var(--radius-md)] text-xs font-medium shadow-sm"
      >
        <CalendarCheck className="h-4 w-4" />
        <span>
          {blocksAdded ? "All 5 prep blocks scheduled ✓" : "Add all prep blocks to calendar"}
        </span>
      </Button>
    </div>
  );
}
