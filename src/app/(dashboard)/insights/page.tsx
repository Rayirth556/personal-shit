"use client";

import * as React from "react";
import { TIMETABLE_DAYS, ENROLLED_COURSES } from "@/lib/timetable-data";
import { SEMESTER_5_DEADLINES } from "@/lib/runway-generator";
import { useTasks } from "@/lib/task-store";

function minutesBetween(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return Math.max(0, eh * 60 + em - (sh * 60 + sm));
}

function formatHours(minutes: number): string {
  const h = minutes / 60;
  return Number.isInteger(h) ? `${h}h` : `${h.toFixed(1)}h`;
}

function daysUntil(dateString: string, todayIso: string): number {
  const a = new Date(`${dateString}T00:00:00`);
  const b = new Date(`${todayIso}T00:00:00`);
  return Math.round((a.getTime() - b.getTime()) / 86_400_000);
}

/** Local calendar date as YYYY-MM-DD. toISOString() would roll back a day
 *  for IST users between midnight and 05:30. */
function localIsoDate(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function InsightsPage() {
  const { stats } = useTasks();
  const [todayIso, setTodayIso] = React.useState<string | null>(null);

  React.useEffect(() => {
    setTodayIso(localIsoDate());
  }, []);

  // Real contact hours, summed across the five day orders from the timetable.
  const courseLoad = React.useMemo(() => {
    const byCourse = new Map<string, { name: string; minutes: number; sessions: number }>();

    for (const day of TIMETABLE_DAYS) {
      for (const cls of day.classes) {
        const key = cls.courseCode || cls.courseName;
        const entry = byCourse.get(key) ?? {
          name: cls.courseName,
          minutes: 0,
          sessions: 0,
        };
        entry.minutes += minutesBetween(cls.startTime, cls.endTime);
        entry.sessions += 1;
        byCourse.set(key, entry);
      }
    }

    return [...byCourse.entries()]
      .map(([code, v]) => ({ code, ...v }))
      .sort((a, b) => b.minutes - a.minutes);
  }, []);

  const totalMinutes = courseLoad.reduce((sum, c) => sum + c.minutes, 0);
  const maxMinutes = courseLoad[0]?.minutes ?? 1;

  const upcoming = React.useMemo(() => {
    if (!todayIso) return [];
    return SEMESTER_5_DEADLINES.map((d) => ({
      ...d,
      days: daysUntil(d.targetDate, todayIso),
    }))
      .filter((d) => d.days >= -1)
      .sort((a, b) => a.days - b.days);
  }, [todayIso]);

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Header */}
      <header>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
          Semester 5
        </p>
        <h1 className="display text-[40px] sm:text-[48px] leading-[0.95] text-[var(--text-primary)]">
          Insights
        </h1>
        <p className="mt-2 max-w-xl text-[13px] text-[var(--text-secondary)]">
          Computed from your timetable and tracked tasks. Nothing here is estimated.
        </p>
      </header>

      {/* Real counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--border-subtle)]">
        {[
          { label: "Tracked", value: String(stats.total), note: "tasks total" },
          { label: "Closed", value: String(stats.completed), note: "tasks done" },
          { label: "Open", value: String(stats.remaining), note: "tasks left" },
          { label: "Deadlines", value: String(upcoming.length), note: "still ahead" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[var(--bg-surface)] p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
              {stat.label}
            </p>
            <p className="display tnum mt-1.5 text-[32px] leading-none text-[var(--text-primary)]">
              {stat.value}
            </p>
            <p className="mt-1 text-[10.5px] text-[var(--text-tertiary)]">{stat.note}</p>
          </div>
        ))}
      </div>

      {/* Course load */}
      <section className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
        <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-2.5">
          <h2 className="text-[15px] font-medium text-[var(--text-primary)]">
            Contact hours
          </h2>
          <span className="tnum font-mono text-[10px] text-[var(--text-tertiary)]">
            {formatHours(totalMinutes)}/wk · {TIMETABLE_DAYS.length} day orders
          </span>
        </div>

        {courseLoad.length === 0 ? (
          <p className="py-8 text-center text-[11px] text-[var(--text-tertiary)]">
            No sessions in the timetable.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3.5">
            {courseLoad.map((course) => {
              const enrolled = ENROLLED_COURSES.find((c) => c.code === course.code);
              const width = Math.max(2, Math.round((course.minutes / maxMinutes) * 100));

              return (
                <div key={course.code} className="flex items-center gap-3">
                  <div className="w-44 shrink-0">
                    <p className="flex items-center gap-1.5 truncate text-[12.5px] text-[var(--text-primary)]">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: enrolled?.color ?? "var(--text-tertiary)" }}
                      />
                      <span className="truncate">{course.name}</span>
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[9.5px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                      {course.code}
                      {enrolled ? ` · ${enrolled.category}` : ""}
                    </p>
                  </div>

                  <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-[var(--bg-subdued)]">
                    <div
                      className="h-full rounded-full bg-[var(--text-primary)]"
                      style={{ width: `${width}%` }}
                    />
                  </div>

                  <span className="tnum w-20 shrink-0 text-right font-mono text-[10.5px] text-[var(--text-secondary)]">
                    {formatHours(course.minutes)} · {course.sessions}x
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Deadlines */}
      <section className="rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
        <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-2.5">
          <h2 className="text-[15px] font-medium text-[var(--text-primary)]">
            Deadlines ahead
          </h2>
          <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
            semester 5
          </span>
        </div>

        {upcoming.length === 0 ? (
          <p className="py-8 text-center text-[11px] text-[var(--text-tertiary)]">
            Nothing scheduled ahead.
          </p>
        ) : (
          <div className="mt-1 flex flex-col divide-y divide-[var(--border-subtle)]">
            {upcoming.map((deadline) => (
              <div
                key={deadline.id}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: `var(--${deadline.category})` }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] text-[var(--text-primary)]">
                      {deadline.title}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[9.5px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                      {deadline.courseCode} · {deadline.courseName}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="tnum font-mono text-[10.5px] text-[var(--text-secondary)]">
                    {deadline.targetDate}
                  </p>
                  <p className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                    {deadline.days < 0
                      ? "past"
                      : deadline.days === 0
                        ? "today"
                        : `in ${deadline.days}d`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
