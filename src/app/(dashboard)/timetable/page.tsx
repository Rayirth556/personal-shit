"use client";

import * as React from "react";
import { BookOpen, MapPin, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TIME_SLOTS,
  TIMETABLE_DAYS,
  ENROLLED_COURSES,
  ClassType,
  ClassSession,
} from "@/lib/timetable-data";
import { cn } from "@/lib/utils";

export default function TimetablePage() {
  const [activeView, setActiveView] = React.useState<"matrix" | "day">("matrix");
  const [selectedDayOrder, setSelectedDayOrder] = React.useState<number>(4);
  const [selectedClass, setSelectedClass] = React.useState<ClassSession | null>(null);

  // Helper to find class in a specific slot for a day
  const getClassInSlot = (dayOrder: number, slotNumber: number) => {
    const day = TIMETABLE_DAYS.find((d) => d.dayOrder === dayOrder);
    if (!day) return null;
    return day.classes.find(
      (c) => slotNumber >= c.startSlot && slotNumber <= c.endSlot
    );
  };

  const isSlotStart = (dayOrder: number, slotNumber: number) => {
    const day = TIMETABLE_DAYS.find((d) => d.dayOrder === dayOrder);
    if (!day) return false;
    return day.classes.some((c) => c.startSlot === slotNumber);
  };

  const getSlotSpan = (dayOrder: number, slotNumber: number) => {
    const day = TIMETABLE_DAYS.find((d) => d.dayOrder === dayOrder);
    if (!day) return 1;
    const cls = day.classes.find((c) => c.startSlot === slotNumber);
    if (!cls) return 1;
    return cls.endSlot - cls.startSlot + 1;
  };

  const getCellStyling = (type?: ClassType, name?: string) => {
    if (type === "practical") {
      return {
        container:
          "bg-teal-50 border-teal-200 text-teal-950 dark:bg-teal-950/40 dark:border-teal-700/50 dark:text-teal-200 hover:border-teal-400",
        badge: "bg-teal-200/60 text-teal-900 dark:bg-teal-800/60 dark:text-teal-100",
        border: "border-teal-200/80 dark:border-teal-800/60",
      };
    }
    if (name?.toLowerCase().includes("stress") || name?.toLowerCase().includes("art")) {
      return {
        container:
          "bg-purple-50 border-purple-200 text-purple-950 dark:bg-purple-950/40 dark:border-purple-700/50 dark:text-purple-200 hover:border-purple-400",
        badge: "bg-purple-200/60 text-purple-900 dark:bg-purple-800/60 dark:text-purple-100",
        border: "border-purple-200/80 dark:border-purple-800/60",
      };
    }
    return {
      container:
        "bg-amber-50/90 border-amber-200 text-amber-950 dark:bg-amber-950/40 dark:border-amber-700/50 dark:text-amber-100 hover:border-amber-400",
      badge: "bg-amber-200/60 text-amber-900 dark:bg-amber-800/60 dark:text-amber-100",
      border: "border-amber-200/80 dark:border-amber-800/60",
    };
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(TIMETABLE_DAYS, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "campus-web-timetable-batch-2.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              The Campus Web
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--border-subtle)]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)]">
              Batch 2
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Academic Timetable
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            5-Day Order Cycle • Theory, Practical Labs &amp; Classroom Venues
          </p>
        </div>

        {/* Legend & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-2 bg-[var(--bg-surface)] px-3 py-1.5 rounded-full shadow-xs border border-[var(--border-subtle)]/40 text-xs">
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 border border-amber-500/40" />
              <span>Theory</span>
            </div>
            <span className="text-[var(--border-subtle)]">•</span>
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
              <span className="w-2.5 h-2.5 rounded-xs bg-teal-400 border border-teal-500/40" />
              <span>Practical (Lab)</span>
            </div>
            <span className="text-[var(--border-subtle)]">•</span>
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
              <span className="w-2.5 h-2.5 rounded-xs bg-purple-400 border border-purple-500/40" />
              <span>Elective</span>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-[var(--bg-high)]/60 rounded-full border border-[var(--border-subtle)]/40 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveView("matrix")}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all",
                activeView === "matrix"
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              Full Grid
            </button>
            <button
              type="button"
              onClick={() => setActiveView("day")}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all",
                activeView === "day"
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              Day View
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportJSON}
            className="rounded-full shadow-xs text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </header>

      {/* MATRIX VIEW (Full Table matching Campus Web) */}
      {activeView === "matrix" ? (
        <Card className="p-4 sm:p-6 flex flex-col gap-4 overflow-hidden">
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[1020px] flex flex-col">
              {/* Header Row: Slots */}
              <div className="grid grid-cols-13 gap-1.5 pb-2 border-b border-[var(--border-subtle)]/60 text-center font-mono">
                <div className="text-[11px] font-bold text-[var(--text-secondary)] uppercase flex items-center justify-center p-2 bg-[var(--bg-subdued)] rounded-lg">
                  DAY
                </div>
                {TIME_SLOTS.map((slot) => (
                  <div
                    key={slot.slotNumber}
                    className="p-1.5 rounded-lg bg-[var(--bg-subdued)]/60 flex flex-col items-center justify-center text-[10px] leading-tight"
                  >
                    <span className="font-semibold text-[var(--text-primary)]">
                      {slot.timeStart}
                    </span>
                    <span className="text-[9px] text-[var(--text-secondary)] opacity-80">
                      {slot.timeEnd}
                    </span>
                  </div>
                ))}
              </div>

              {/* Day Rows (Day 1 to 5) */}
              <div className="flex flex-col gap-2 pt-2">
                {TIMETABLE_DAYS.map((day) => {
                  let skipSlots = 0;

                  return (
                    <div
                      key={day.dayOrder}
                      className="grid grid-cols-13 gap-1.5 items-stretch min-h-[82px]"
                    >
                      {/* Day Number Label */}
                      <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[var(--bg-subdued)] font-bold text-sm text-[var(--text-primary)] shadow-xs border border-[var(--border-subtle)]/40">
                        <span className="text-base font-extrabold">{day.dayOrder}</span>
                        <span className="text-[9px] font-semibold text-[var(--text-secondary)] uppercase">
                          DAY
                        </span>
                      </div>

                      {/* 12 Slot Columns */}
                      {TIME_SLOTS.map((slot) => {
                        if (skipSlots > 0) {
                          skipSlots--;
                          return null;
                        }

                        const cls = getClassInSlot(day.dayOrder, slot.slotNumber);
                        const isStart = isSlotStart(day.dayOrder, slot.slotNumber);
                        const span = isStart ? getSlotSpan(day.dayOrder, slot.slotNumber) : 1;

                        if (cls && isStart) {
                          skipSlots = span - 1;
                          const styling = getCellStyling(cls.type, cls.courseName);

                          return (
                            <div
                              key={slot.slotNumber}
                              style={{ gridColumn: `span ${span} / span ${span}` }}
                              onClick={() => setSelectedClass(cls)}
                              className={cn(
                                "p-2 sm:p-2.5 rounded-xl border flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-md cursor-pointer select-none",
                                styling.container
                              )}
                            >
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[11px] sm:text-xs font-bold leading-snug line-clamp-2">
                                  {cls.courseName}
                                </span>
                              </div>

                              <div
                                className={cn(
                                  "flex items-center justify-between text-[10px] font-semibold pt-1 border-t mt-1",
                                  styling.border
                                )}
                              >
                                <span className="font-mono text-[9px] sm:text-[10px] tracking-tight truncate">
                                  {cls.room || "TBA"}
                                </span>
                                {span > 1 && (
                                  <span
                                    className={cn(
                                      "uppercase text-[8px] sm:text-[9px] tracking-wider px-1.5 py-0.2 rounded-full shrink-0",
                                      styling.badge
                                    )}
                                  >
                                    {cls.type === "practical" ? "Lab" : "Theory"}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        }

                        if (!cls) {
                          return (
                            <div
                              key={slot.slotNumber}
                              className="p-1 rounded-xl bg-[var(--bg-subdued)]/25 border border-dashed border-[var(--border-subtle)]/30 flex items-center justify-center"
                            >
                              <span className="text-[10px] text-[var(--text-secondary)]/30 select-none">
                                —
                              </span>
                            </div>
                          );
                        }

                        return null;
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        /* DAY VIEW (Deep dive into single day) */
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 p-1 bg-[var(--bg-high)]/60 rounded-full border border-[var(--border-subtle)]/40 self-start">
            {[1, 2, 3, 4, 5].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDayOrder(d)}
                className={cn(
                  "px-3.5 py-1 rounded-full text-xs font-semibold transition-all",
                  selectedDayOrder === d
                    ? "bg-[var(--bg-surface)] text-[var(--primary)] shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                Day {d}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TIMETABLE_DAYS.find((d) => d.dayOrder === selectedDayOrder)?.classes.map(
              (cls) => {
                const styling = getCellStyling(cls.type, cls.courseName);

                return (
                  <Card
                    key={cls.id}
                    className={cn(
                      "p-4 rounded-2xl flex flex-col justify-between border cursor-pointer hover:shadow-md transition-all",
                      styling.container
                    )}
                    onClick={() => setSelectedClass(cls)}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-tight">
                          {cls.startTime} – {cls.endTime}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                            styling.badge
                          )}
                        >
                          {cls.type}
                        </span>
                      </div>

                      <h3 className="text-base font-bold leading-snug">
                        {cls.courseName}
                      </h3>
                      {cls.courseCode && (
                        <span className="text-xs font-mono opacity-80">
                          Code: {cls.courseCode}
                        </span>
                      )}
                    </div>

                    <div
                      className={cn(
                        "flex items-center justify-between pt-3 border-t mt-3 text-xs font-medium",
                        styling.border
                      )}
                    >
                      <div className="flex items-center gap-1 font-semibold">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>Room {cls.room}</span>
                      </div>
                      <span>{cls.durationLabel}</span>
                    </div>
                  </Card>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Selected Class Detail Modal / Flyout if tapped */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-[var(--bg-surface)] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.2)] border border-[var(--border-subtle)] flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] px-2 py-0.5 rounded-full bg-[var(--primary-fixed)]">
                  {selectedClass.type}
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mt-1.5">
                  {selectedClass.courseName}
                </h3>
                {selectedClass.courseCode && (
                  <p className="text-xs font-mono text-[var(--text-secondary)]">
                    Course Code: {selectedClass.courseCode}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="w-7 h-7 rounded-full bg-[var(--bg-subdued)] flex items-center justify-center text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--bg-subdued)]/60 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center justify-between">
                <span>Time Window:</span>
                <strong className="text-[var(--text-primary)]">
                  {selectedClass.startTime} – {selectedClass.endTime} ({selectedClass.durationLabel})
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Classroom / Lab:</span>
                <strong className="text-[var(--text-primary)]">
                  {selectedClass.room || "TBA"}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Timetable Slots:</span>
                <strong className="text-[var(--text-primary)]">
                  Slots {selectedClass.startSlot} – {selectedClass.endSlot}
                </strong>
              </div>
            </div>

            <Button
              size="sm"
              className="w-full rounded-full"
              onClick={() => setSelectedClass(null)}
            >
              Done
            </Button>
          </div>
        </div>
      )}

      {/* Enrolled Courses Master Directory */}
      <section className="flex flex-col gap-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[var(--primary)]" />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Enrolled Course Modules &amp; Venues
            </h2>
          </div>
          <span className="text-xs text-[var(--text-secondary)]">
            {ENROLLED_COURSES.length} Courses Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ENROLLED_COURSES.map((course) => (
            <Card
              key={course.code}
              className="p-3.5 rounded-2xl flex flex-col justify-between gap-2 border border-[var(--border-subtle)]/40 hover:border-[var(--primary)]/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[var(--primary)]">
                    {course.code}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    {course.type}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mt-1 leading-snug">
                  {course.name}
                </h4>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] bg-[var(--bg-subdued)] px-2 py-1 rounded-lg">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">
                  {course.labRoom ? `Theory: ${course.theoryRoom} • Lab: ${course.labRoom}` : `Room: ${course.theoryRoom}`}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
