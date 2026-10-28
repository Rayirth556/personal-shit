"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TIME_SLOTS,
  TIMETABLE_DAYS,
  ENROLLED_COURSES,
  ClassSession,
} from "@/lib/timetable-data";
import { cn } from "@/lib/utils";

/** Rules are coloured by class type, using the same three tokens as the
 *  rest of the app: theory = assignment, lab = project, elective = personal. */
function ruleColor(cls: ClassSession): string {
  if (cls.type === "practical") return "var(--project)";
  const name = cls.courseName.toLowerCase();
  if (name.includes("stress") || name.includes("art")) return "var(--personal)";
  return "var(--assignment)";
}

function typeLabel(cls: ClassSession): string {
  if (cls.type === "practical") return "lab";
  const name = cls.courseName.toLowerCase();
  if (name.includes("stress") || name.includes("art")) return "elective";
  return "theory";
}

function minutesBetween(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return Math.max(0, eh * 60 + em - (sh * 60 + sm));
}

export default function TimetablePage() {
  const [activeView, setActiveView] = React.useState<"matrix" | "day">("matrix");
  const [selectedDayOrder, setSelectedDayOrder] = React.useState<number>(1);
  const [selectedClass, setSelectedClass] = React.useState<ClassSession | null>(null);

  const totalSessions = React.useMemo(
    () => TIMETABLE_DAYS.reduce((sum, day) => sum + day.classes.length, 0),
    []
  );

  const totalMinutes = React.useMemo(
    () =>
      TIMETABLE_DAYS.reduce(
        (sum, day) =>
          sum + day.classes.reduce((s, c) => s + minutesBetween(c.startTime, c.endTime), 0),
        0
      ),
    []
  );

  const getClassInSlot = (dayOrder: number, slotNumber: number) => {
    const day = TIMETABLE_DAYS.find((d) => d.dayOrder === dayOrder);
    if (!day) return null;
    return day.classes.find((c) => slotNumber >= c.startSlot && slotNumber <= c.endSlot);
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

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(TIMETABLE_DAYS, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "timetable-semester-5.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full gap-7">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
            Semester 5 · 5 day orders
          </p>
          <h1 className="display text-[40px] leading-[0.92] text-[var(--text-primary)]">
            Timetable
          </h1>
          <p className="mt-2.5 text-[13px] text-[var(--text-secondary)]">
            {totalSessions} sessions
            <span className="mx-1.5 text-[var(--text-tertiary)]">·</span>
            {(totalMinutes / 60).toFixed(1)}h contact across the cycle
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Type legend */}
          <div className="hidden items-center gap-3 sm:flex">
            {[
              { label: "Theory", token: "--assignment" },
              { label: "Lab", token: "--project" },
              { label: "Elective", token: "--personal" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: `var(${item.token})` }}
                />
                <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="h-3 w-px bg-[var(--border-subtle)]" />

          {/* View switch */}
          <div className="flex items-center gap-2.5">
            {(["matrix", "day"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setActiveView(v)}
                className={cn(
                  "font-mono text-[10px] uppercase tracking-[0.06em] transition-colors",
                  activeView === v
                    ? "text-[var(--text-primary)] underline decoration-1 underline-offset-4"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                )}
              >
                {v === "matrix" ? "Grid" : "Day"}
              </button>
            ))}
          </div>

          <Button variant="secondary" size="sm" onClick={handleExportJSON} className="text-[11px]">
            <Download className="h-3 w-3" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </header>

      {/* GRID */}
      {activeView === "matrix" ? (
        <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="overflow-x-auto">
            <div className="min-w-[1020px]">
              {/* Slot header */}
              <div className="grid grid-cols-13 border-b border-[var(--border-subtle)]">
                <div className="px-3 py-2 font-mono text-[9px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                  Day
                </div>
                {TIME_SLOTS.map((slot) => (
                  <div
                    key={slot.slotNumber}
                    className="border-l border-[var(--border-subtle)] px-1 py-2 text-center font-mono text-[9px] leading-tight"
                  >
                    <div className="text-[var(--text-secondary)]">{slot.timeStart}</div>
                    <div className="text-[8px] text-[var(--text-tertiary)]">{slot.timeEnd}</div>
                  </div>
                ))}
              </div>

              {/* Day rows */}
              {TIMETABLE_DAYS.map((day) => {
                let skipSlots = 0;

                return (
                  <div
                    key={day.dayOrder}
                    className="grid grid-cols-13 border-b border-[var(--border-subtle)] last:border-b-0"
                  >
                    {/* Day marker */}
                    <div className="flex items-baseline gap-1 px-3 py-3">
                      <span className="display tnum text-[22px] leading-none text-[var(--text-primary)]">
                        {day.dayOrder}
                      </span>
                      <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                        day
                      </span>
                    </div>

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

                        return (
                          <button
                            key={slot.slotNumber}
                            type="button"
                            onClick={() => setSelectedClass(cls)}
                            style={{ gridColumn: `span ${span} / span ${span}` }}
                            className="group relative flex min-h-[74px] flex-col justify-between border-l border-[var(--border-subtle)] px-2 py-2 text-left transition-colors hover:bg-[var(--bg-subdued)]/60"
                          >
                            <span
                              className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full"
                              style={{ backgroundColor: ruleColor(cls) }}
                            />

                            <span className="line-clamp-3 pl-1 text-[11px] leading-[1.25] text-[var(--text-primary)]">
                              {cls.courseName}
                            </span>

                            <span className="mt-1 flex items-baseline justify-between gap-1 pl-1">
                              <span className="truncate font-mono text-[9px] text-[var(--text-tertiary)]">
                                {cls.room || "TBA"}
                              </span>
                              <span className="shrink-0 font-mono text-[8px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                                {typeLabel(cls)}
                              </span>
                            </span>
                          </button>
                        );
                      }

                      if (!cls) {
                        return (
                          <div
                            key={slot.slotNumber}
                            className="min-h-[74px] border-l border-[var(--border-subtle)]"
                          />
                        );
                      }

                      return null;
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        /* DAY VIEW */
        <section className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] px-4 py-3">
            <h2 className="text-[15px] font-medium text-[var(--text-primary)]">
              Day {selectedDayOrder}
            </h2>
            <div className="flex items-center gap-2.5">
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDayOrder(d)}
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-[0.06em] transition-colors",
                    selectedDayOrder === d
                      ? "text-[var(--text-primary)] underline decoration-1 underline-offset-4"
                      : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                  )}
                >
                  D{d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col divide-y divide-[var(--border-subtle)]">
            {(TIMETABLE_DAYS.find((d) => d.dayOrder === selectedDayOrder)?.classes ?? []).map(
              (cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => setSelectedClass(cls)}
                  className="group relative flex items-start gap-3 py-3 pl-4 pr-3 text-left transition-colors hover:bg-[var(--bg-subdued)]/50"
                >
                  <span
                    className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full"
                    style={{ backgroundColor: ruleColor(cls) }}
                  />

                  <span className="tnum w-11 shrink-0 pt-[3px] text-right font-mono text-[10px] text-[var(--text-tertiary)]">
                    {cls.startTime}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="truncate text-[13.5px] text-[var(--text-primary)]">
                        {cls.courseName}
                      </span>
                      <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                        {typeLabel(cls)}
                      </span>
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-[var(--text-tertiary)]">
                      <span className="tnum">
                        {cls.startTime}–{cls.endTime}
                      </span>
                      {cls.courseCode && (
                        <>
                          <span>·</span>
                          <span>{cls.courseCode}</span>
                        </>
                      )}
                      {cls.room && (
                        <>
                          <span>·</span>
                          <span>{cls.room}</span>
                        </>
                      )}
                    </span>
                  </span>

                  <span className="tnum shrink-0 font-mono text-[10px] text-[var(--text-tertiary)]">
                    {cls.durationLabel}
                  </span>
                </button>
              )
            )}
          </div>
        </section>
      )}

      {/* Class detail panel */}
      {selectedClass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedClass(null)}
        >
          <div
            className="flex w-full max-w-sm flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                  {typeLabel(selectedClass)} · {selectedClass.courseCode || "no code"}
                </p>
                <h3 className="mt-1 text-[15px] text-[var(--text-primary)]">
                  {selectedClass.courseName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                aria-label="Close"
                className="rounded-[var(--radius-sm)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-subdued)] hover:text-[var(--text-primary)]"
              >
                esc
              </button>
            </div>

            <dl className="flex flex-col divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
              {[
                {
                  label: "Time",
                  value: `${selectedClass.startTime}–${selectedClass.endTime}`,
                },
                { label: "Length", value: selectedClass.durationLabel },
                { label: "Room", value: selectedClass.room || "TBA" },
                {
                  label: "Slots",
                  value: `${selectedClass.startSlot}–${selectedClass.endSlot}`,
                },
              ].map((row) => (
                <div key={row.label} className="flex items-baseline justify-between py-2">
                  <dt className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                    {row.label}
                  </dt>
                  <dd className="tnum font-mono text-[11px] text-[var(--text-primary)]">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <Button size="sm" className="w-full text-[11px]" onClick={() => setSelectedClass(null)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Modules table */}
      <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] px-4 py-3">
          <h2 className="text-[15px] font-medium text-[var(--text-primary)]">Modules</h2>
          <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
            {ENROLLED_COURSES.length} enrolled
          </span>
        </div>

        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--border-subtle)]">
              {["Code", "Module", "Type", "Venue"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 font-mono text-[9px] font-normal uppercase tracking-[0.08em] text-[var(--text-tertiary)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ENROLLED_COURSES.map((course) => (
              <tr
                key={course.code}
                className="border-b border-[var(--border-subtle)] last:border-b-0 hover:bg-[var(--bg-subdued)]/40"
              >
                <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[10.5px] text-[var(--text-tertiary)]">
                  {course.code}
                </td>
                <td className="px-4 py-2.5 text-[12.5px] text-[var(--text-primary)]">
                  {course.name}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[9.5px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                  {course.type}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[10px] text-[var(--text-tertiary)]">
                  {course.labRoom
                    ? `${course.theoryRoom} / ${course.labRoom}`
                    : course.theoryRoom}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
