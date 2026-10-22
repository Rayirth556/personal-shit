"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sun,
  Heart,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTasks } from "@/lib/task-store";
import { GIRLFRIEND_TIME_BLOCK, TIMETABLE_DAYS } from "@/lib/timetable-data";
import { SEMESTER_5_DEADLINES } from "@/lib/runway-generator";

interface MorningKickoffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MorningKickoffModal({
  open,
  onOpenChange,
}: MorningKickoffModalProps) {
  const { tasks, top3Tasks, setTop3Priorities, toggleTask } = useTasks();
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [selectedTop3, setSelectedTop3] = React.useState<string[]>(() =>
    top3Tasks.map((t) => t.id)
  );

  // Sync selected Top 3 when modal opens
  React.useEffect(() => {
    if (open) {
      const currentIds = top3Tasks.map((t) => t.id);
      if (currentIds.length > 0) {
        setSelectedTop3(currentIds);
      } else {
        setSelectedTop3(tasks.slice(0, 3).map((t) => t.id));
      }
      setStep(1);
    }
  }, [open, top3Tasks, tasks]);

  const toggleSelectTask = (id: string) => {
    setSelectedTop3((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id]; // keep latest 3
      }
      return [...prev, id];
    });
  };

  const handleFinish = () => {
    setTop3Priorities(selectedTop3);
    onOpenChange(false);
  };

  const todaySchedule = TIMETABLE_DAYS.find((d) => d.dayOrder === 4) || TIMETABLE_DAYS[3];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[88vh] overflow-y-auto p-6 rounded-[28px]">
        <DialogHeader>
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
                <Sun className="h-4.5 w-4.5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">
                  Morning Kickoff
                </DialogTitle>
                <DialogDescription className="text-xs">
                  60-Second Daily Alignment • Step {step} of 3
                </DialogDescription>
              </div>
            </div>

            {/* Step Pills */}
            <div className="flex items-center gap-1.5 bg-[var(--bg-subdued)] p-1 rounded-full text-xs">
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStep(s as 1 | 2 | 3)}
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all",
                    step === s
                      ? "bg-[var(--primary)] text-white shadow-xs"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-high)]"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </DialogHeader>

        {/* STEP 1: Rollover Tasks & Morning Triage */}
        {step === 1 && (
          <div className="flex flex-col gap-4 py-2 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[var(--text-primary)] font-semibold">
                  Triage yesterday&apos;s tasks
                </strong>
                <p className="text-[var(--text-secondary)] mt-0.5">
                  Confirm what carries over into today. Start with a clean psychological slate.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              {tasks.slice(0, 5).map((t) => {
                const isDone = t.status === "done";
                return (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => toggleTask(t.id)}
                        className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                          isDone
                            ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                            : "border-[var(--border-subtle)] text-transparent"
                        )}
                      >
                        <Check className="h-3 w-3 stroke-[3]" />
                      </button>
                      <div className="min-w-0">
                        <p
                          className={cn(
                            "font-medium truncate",
                            isDone && "line-through text-[var(--text-secondary)]"
                          )}
                        >
                          {t.title}
                        </p>
                        <span className="text-[10px] text-[var(--text-secondary)]">
                          {t.dueLabel || t.category}
                        </span>
                      </div>
                    </div>

                    <Badge variant={t.category} className="text-[10px] shrink-0">
                      {t.category}
                    </Badge>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setStep(2)}
                className="rounded-full gap-1.5 text-xs font-semibold"
              >
                <span>Check Horizon</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Today's Schedule & Girlfriend Time Protection */}
        {step === 2 && (
          <div className="flex flex-col gap-4 py-2 animate-in fade-in duration-200">
            {/* Sacred Girlfriend Time Callout */}
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex flex-col gap-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center">
                    <Heart className="h-3.5 w-3.5 fill-white" />
                  </div>
                  <span className="text-sm font-bold text-rose-950 dark:text-rose-100">
                    {GIRLFRIEND_TIME_BLOCK.title} • 4:00 PM – 7:00 PM
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                  Sacred Personal Block
                </span>
              </div>
              <p className="text-xs text-rose-900/80 dark:text-rose-200/80 leading-relaxed pl-8">
                {GIRLFRIEND_TIME_BLOCK.description} Study goals are automatically scheduled around this window.
              </p>
            </div>

            {/* Today's Timetable Snapshot */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Today&apos;s Class Sessions (Batch 2 • Day 4)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {todaySchedule.classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-2.5 rounded-xl bg-[var(--bg-subdued)] border border-[var(--border-subtle)]/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-[var(--text-primary)] truncate max-w-[170px]">
                        {cls.courseName}
                      </p>
                      <span className="text-[10px] text-[var(--text-secondary)] font-mono">
                        {cls.startTime} – {cls.endTime} • Room {cls.room}
                      </span>
                    </div>
                    <Badge variant="subtle" className="text-[9px] uppercase font-bold">
                      {cls.durationLabel}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines Radar */}
            <div className="p-3 rounded-xl bg-[var(--bg-subdued)]/60 border border-[var(--border-subtle)]/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[var(--primary)]" />
                <span className="font-medium text-[var(--text-primary)]">
                  Upcoming: FLA Chart (27 Oct) &amp; Big Data Review (28 Oct)
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[var(--secondary)]">
                Runways Active
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="subtle"
                onClick={() => setStep(1)}
                className="rounded-full gap-1.5 text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="rounded-full gap-1.5 text-xs font-semibold"
              >
                <span>Select Top 3</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Select Today's Top 3 Priorities */}
        {step === 3 && (
          <div className="flex flex-col gap-4 py-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Lock in today&apos;s intentions
                </p>
                <p className="text-xs text-[var(--text-primary)] font-semibold mt-0.5">
                  Pick at most 3 core priorities ({selectedTop3.length}/3 selected)
                </p>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)]">
                {selectedTop3.length === 3 ? "Optimal Focus Reached" : `${3 - selectedTop3.length} remaining`}
              </span>
            </div>

            {/* Tasks Pool */}
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              {tasks.map((task) => {
                const isSelected = selectedTop3.includes(task.id);

                return (
                  <div
                    key={task.id}
                    onClick={() => toggleSelectTask(task.id)}
                    className={cn(
                      "p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all select-none",
                      isSelected
                        ? "bg-[var(--bg-surface)] border-[var(--primary)] shadow-xs ring-1 ring-[var(--primary)]/30"
                        : "bg-[var(--bg-subdued)]/60 border-transparent hover:bg-[var(--bg-subdued)]"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                          isSelected
                            ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                            : "border-[var(--border-subtle)] bg-[var(--bg-surface)]"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                          {task.title}
                        </p>
                        <p className="text-[10px] text-[var(--text-secondary)] truncate">
                          {task.dueLabel || task.subtitle || "Task"}
                        </p>
                      </div>
                    </div>

                    <Badge variant={task.category} className="text-[10px] shrink-0">
                      {task.category}
                    </Badge>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]/40">
              <Button
                variant="subtle"
                onClick={() => setStep(2)}
                className="rounded-full gap-1.5 text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </Button>

              <Button
                onClick={handleFinish}
                className="rounded-full gap-2 text-xs font-semibold px-5 shadow-[0_4px_16px_rgba(94,92,230,0.3)]"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Start Calm &amp; Focused Day</span>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
