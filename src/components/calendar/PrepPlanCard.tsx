"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SEMESTER_5_DEADLINES, generateRunwayMilestones } from "@/lib/runway-generator";
import { useTasks } from "@/lib/task-store";

function localIso(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function PrepPlanCard() {
  const { addTask } = useTasks();
  const [completed, setCompleted] = React.useState<Record<string, boolean>>({});
  const [addedId, setAddedId] = React.useState<string | null>(null);

  // The nearest upcoming exam, falling back to the nearest deadline.
  const today = localIso();
  const deadline = React.useMemo(() => {
    const upcoming = SEMESTER_5_DEADLINES.filter((d) => d.targetDate >= today).sort(
      (a, b) => a.targetDate.localeCompare(b.targetDate)
    );
    if (upcoming.length === 0) return SEMESTER_5_DEADLINES[0];
    const nextExam = upcoming.find((d) => d.category === "exam");
    return nextExam ?? upcoming[0];
  }, [today]);

  const steps = React.useMemo(
    () => generateRunwayMilestones(deadline, today),
    [deadline, today]
  );

  const firstOpen = steps.find((s) => !completed[s.id]);

  const handleAddFirst = () => {
    if (!firstOpen) return;
    addTask({
      title: firstOpen.title,
      category: firstOpen.category,
      priority: "high",
      status: "todo",
      isTopPriorityToday: true,
      dueLabel: `Prep · ${deadline.courseCode}`,
      subtitle: firstOpen.actionableStep,
    });
    setAddedId(firstOpen.id);
  };

  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-2.5">
        <span className="text-[15px] font-medium text-[var(--text-primary)]">Prep plan</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
          {deadline.courseCode}
        </span>
      </div>

      <p className="mt-2.5 text-[11px] text-[var(--text-secondary)]">
        Sittings leading up to{" "}
        <span className="text-[var(--text-primary)]">{deadline.title}</span>
      </p>

      <div className="mt-3 flex flex-col">
        {steps.map((step) => {
          const done = !!completed[step.id];
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setCompleted((p) => ({ ...p, [step.id]: !p[step.id] }))}
              className="group flex items-start gap-2.5 border-t border-[var(--border-subtle)] py-2 text-left transition-colors hover:bg-[var(--bg-subdued)]/40"
            >
              <span
                className={cn(
                  "mt-[2px] flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[3px] border transition-colors",
                  done
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--on-primary)]"
                    : "border-[var(--text-tertiary)] text-transparent group-hover:border-[var(--text-primary)]"
                )}
              >
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={cn(
                      "text-[12px]",
                      done ? "text-[var(--text-tertiary)] line-through" : "text-[var(--text-primary)]"
                    )}
                  >
                    {step.title}
                  </span>
                  <span className="tnum shrink-0 font-mono text-[9px] text-[var(--text-tertiary)]">
                    {step.estimatedMinutes}m
                  </span>
                </div>
                <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                  <span>{step.stageLabel}</span>
                  <span>·</span>
                  <span>
                    {step.daysRemaining <= 0 ? "today" : `in ${step.daysRemaining}d`}
                  </span>
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <Button
        type="button"
        size="sm"
        onClick={handleAddFirst}
        disabled={!firstOpen || addedId === firstOpen.id}
        className="mt-3 w-full text-[11px] font-medium"
      >
        {addedId === firstOpen?.id
          ? "Added to today"
          : firstOpen
            ? "Add first sitting to today"
            : "Plan complete"}
      </Button>
    </section>
  );
}
