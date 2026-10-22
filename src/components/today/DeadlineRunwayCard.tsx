"use client";

import * as React from "react";
import {
  Compass,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Plus,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    return generateRunwayMilestones(activeDeadline, "2026-10-22");
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
    <section className="bg-[var(--bg-surface)] rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[var(--border-subtle)]/40 transition-all flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border-subtle)]/40 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--primary-fixed)] text-[var(--primary)] flex items-center justify-center shrink-0">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                Reverse Deadline Runway
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--bg-subdued)] text-[var(--text-secondary)] uppercase">
                Zero All-Nighter Mode
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Staged milestones broken into 30–45 min tasks ahead of deadlines
            </p>
          </div>
        </div>

        {/* Course Deadline Tabs */}
        <div className="flex items-center p-1 bg-[var(--bg-high)]/60 rounded-full border border-[var(--border-subtle)]/40 shadow-inner flex-wrap">
          {SEMESTER_5_DEADLINES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveDeadlineId(d.id)}
              className={cn(
                "px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium transition-all truncate",
                activeDeadlineId === d.id
                  ? "bg-[var(--bg-surface)] text-[var(--primary)] font-bold shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {d.courseCode.substring(0, 7)}
            </button>
          ))}
        </div>
      </div>

      {/* Active Target Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-subdued)]/60 border border-[var(--border-subtle)]/50 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] shrink-0" />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[var(--text-primary)] truncate">
              {activeDeadline.title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] truncate">
              {activeDeadline.courseName} • Due {activeDeadline.targetDate} ({activeDeadline.location})
            </p>
          </div>
        </div>

        <Badge variant={activeDeadline.category} className="shrink-0 text-xs px-2.5 py-0.5">
          {activeDeadline.category.toUpperCase()}
        </Badge>
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
                  ? "bg-[var(--bg-subdued)]/40 border-[var(--border-subtle)]/60 opacity-80"
                  : m.isToday
                  ? "bg-[var(--bg-surface)] border-[var(--primary)] shadow-sm ring-1 ring-[var(--primary)]/20"
                  : "bg-[var(--bg-surface)] border-[var(--border-subtle)]/50 hover:border-[var(--primary)]/40"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <span className="text-[11px] font-bold text-[var(--primary)] uppercase tracking-wider">
                    Step {idx + 1} • {m.stageLabel}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-mono flex items-center gap-0.5">
                    <Clock className="h-3 w-3" />
                    {m.estimatedMinutes}m
                  </span>
                </div>

                <h4
                  className={cn(
                    "text-xs font-semibold leading-snug",
                    isDone ? "line-through text-[var(--text-secondary)]" : "text-[var(--text-primary)]"
                  )}
                >
                  {m.title}
                </h4>

                <p className="text-[11px] text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                  {m.actionableStep}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]/30">
                <button
                  type="button"
                  onClick={() => toggleStep(m.id)}
                  className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <CheckCircle2
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isDone ? "text-[var(--primary)] fill-[var(--primary-fixed)]" : "text-[var(--border-subtle)]"
                    )}
                  />
                  <span>{isDone ? "Done" : "Mark done"}</span>
                </button>

                <Button
                  size="sm"
                  variant={isAdded ? "outline" : "secondary"}
                  onClick={() => handlePromoteToTopPriority(m)}
                  disabled={isAdded || isDone}
                  className="rounded-full text-[11px] h-7 px-2.5 font-medium"
                >
                  {isAdded ? (
                    <span>In Priorities</span>
                  ) : (
                    <>
                      <Plus className="h-3 w-3" />
                      <span>Today</span>
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
