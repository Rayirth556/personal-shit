"use client";

import * as React from "react";
import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SEMESTER_5_DEADLINES,
  generateRunwayMilestones,
  AcademicDeadline,
  RunwayMilestone,
} from "@/lib/runway-generator";
import { useTasks } from "@/lib/task-store";

export function DeadlineRunwayCard() {
  const { addTask } = useTasks();
  const [activeDeadlineId, setActiveDeadlineId] = React.useState<string>("dl-fla");
  const [completedSteps, setCompletedSteps] = React.useState<Record<string, boolean>>({
    "dl-fla-m1": true,
  });
  const [addedTasks, setAddedTasks] = React.useState<Record<string, boolean>>({});

  const activeDeadline =
    SEMESTER_5_DEADLINES.find((d) => d.id === activeDeadlineId) ||
    SEMESTER_5_DEADLINES[0];

  const milestones = React.useMemo(() => {
    // Local date, not UTC: toISOString() rolls back a day before 05:30 IST.
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")}`;
    return generateRunwayMilestones(activeDeadline, today);
  }, [activeDeadline]);

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const handlePromoteToTopPriority = (milestone: RunwayMilestone) => {
    addTask({
      title: milestone.title,
      category: milestone.category,
      priority: "high",
      status: "todo",
      isTopPriorityToday: true,
      dueLabel: `Runway Milestone • ${milestone.stageLabel} (${milestone.estimatedMinutes}m)`,
      subtitle: milestone.actionableStep,
    });

    setAddedTasks((prev) => ({
      ...prev,
      [milestone.id]: true,
    }));
  };

  return (
    <section className="bg-[var(--bg-surface)] rounded-[var(--radius-card)] p-5 md:p-6 shadow-none border border-[var(--border-subtle)] transition-all flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-3 border-b border-[var(--border-subtle)] gap-2">
        <div>
          <h2 className="text-[15px] font-medium text-[var(--text-primary)]">
            Deadline runway
          </h2>
          <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
            This deadline broken into {milestones.length} sittings
          </p>
        </div>

        {/* Course deadline selector */}
        <div className="flex items-center gap-0.5 flex-wrap self-start sm:self-auto">
          {SEMESTER_5_DEADLINES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveDeadlineId(d.id)}
              className={cn(
                "px-2 py-1 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors truncate",
                activeDeadlineId === d.id
                  ? "text-[var(--text-primary)] underline decoration-1 underline-offset-4"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              )}
            >
              {d.courseCode.substring(0, 7)}
            </button>
          ))}
        </div>
      </div>

      {/* Active target */}
      <div className="flex items-center justify-between gap-3 py-1">
        <div className="min-w-0">
          <h3 className="text-[13.5px] text-[var(--text-primary)] truncate">
            {activeDeadline.title}
          </h3>
          <p className="mt-0.5 text-[10.5px] text-[var(--text-tertiary)] truncate">
            {activeDeadline.courseName} · due{" "}
            <span className="tnum font-mono">{activeDeadline.targetDate}</span>
            {activeDeadline.location ? ` · ${activeDeadline.location}` : ""}
          </p>
        </div>

        <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
          {activeDeadline.category}
        </span>
      </div>

      {/* Staged Milestones Runway Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {milestones.map((m, idx) => {
          const isDone = !!completedSteps[m.id];
          const isAdded = !!addedTasks[m.id];

          return (
            <div
              key={m.id}
              className={cn(
                "p-3.5 rounded-xl border flex flex-col justify-between gap-3 transition-all",
                isDone
                  ? "bg-[var(--bg-subdued)]/40 border-[var(--border-subtle)] opacity-80"
                  : m.isToday
                  ? "bg-[var(--bg-surface)] border-[var(--primary)] shadow-sm ring-1 ring-[var(--primary)]/20"
                  : "bg-[var(--bg-surface)] border-[var(--border-subtle)]/50 hover:border-[var(--primary)]/40"
              )}
            >
              <div>
                <div className="flex items-baseline justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                    {String(idx + 1).padStart(2, "0")} · {m.stageLabel}
                  </span>
                  <span className="tnum font-mono text-[10px] text-[var(--text-tertiary)]">
                    {m.estimatedMinutes}m
                  </span>
                </div>

                <h4
                  className={cn(
                    "text-[12.5px] leading-snug",
                    isDone
                      ? "line-through text-[var(--text-tertiary)]"
                      : "text-[var(--text-primary)]"
                  )}
                >
                  {m.title}
                </h4>

                <p className="mt-1 text-[10.5px] text-[var(--text-tertiary)] line-clamp-2 leading-relaxed">
                  {m.actionableStep}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => toggleStep(m.id)}
                  className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <span
                    className={cn(
                      "flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border transition-colors",
                      isDone
                        ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--on-primary)]"
                        : "border-[var(--outline-variant)] text-transparent"
                    )}
                  >
                    <CheckCircle2 className="h-2.5 w-2.5" />
                  </span>
                  <span>{isDone ? "Done" : "Mark done"}</span>
                </button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handlePromoteToTopPriority(m)}
                  disabled={isAdded || isDone}
                  className="h-6 px-1.5 text-[10.5px] font-medium"
                >
                  {isAdded ? (
                    <span>In priorities</span>
                  ) : (
                    <>
                      <Plus className="h-3 w-3" />
                      <span>Add</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
