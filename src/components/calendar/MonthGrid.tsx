"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CalendarEventChip {
  id: string;
  title: string;
  category: "exam" | "assignment" | "project" | "personal";
}

export interface DayData {
  dayNumber: number;
  month: "prev" | "current" | "next";
  isToday?: boolean;
  hasExam?: boolean;
  events?: CalendarEventChip[];
}

interface MonthGridProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  year?: number;
  month?: number;
}

const sampleEventsByMonthDay: Record<
  string,
  { hasExam?: boolean; events: CalendarEventChip[] }
> = {
  // October (month index 9)
  "9-1": { events: [{ id: "e1", title: "Syllabus intro", category: "assignment" }] },
  "9-3": { events: [{ id: "e2", title: "Lab 1 Prep", category: "personal" }] },
  "9-8": { events: [{ id: "e3", title: "Team Kickoff", category: "project" }] },
  "9-10": { events: [{ id: "e4", title: "Quiz 1: OS", category: "exam" }] },
  "9-15": { hasExam: true, events: [{ id: "e5", title: "Stats Test", category: "exam" }] },
  "9-18": { events: [{ id: "e6", title: "Reading Group", category: "personal" }] },
  "9-21": { events: [{ id: "e7", title: "Discrete Math", category: "assignment" }] },
  "9-22": {
    events: [
      { id: "e8", title: "OAuth Push", category: "project" },
      { id: "e9", title: "Gym & mobility", category: "personal" },
    ],
  },
  "9-23": { events: [{ id: "e10", title: "OS Past Papers", category: "personal" }] },
  "9-24": { events: [{ id: "e11", title: "DBMS Normalization", category: "assignment" }] },
  "9-25": { events: [{ id: "e12", title: "Campus Hackathon", category: "project" }] },
  "9-27": {
    events: [{ id: "e-fla", title: "FLA Chart Prep & Viva", category: "project" }],
  },
  "9-28": {
    hasExam: true,
    events: [
      { id: "e-bde", title: "Big Data Project Review", category: "assignment" },
      { id: "e14", title: "Review Hall B", category: "personal" },
    ],
  },
  "9-31": { events: [{ id: "e15", title: "Milestone Demo", category: "project" }] },
  // September (month index 8)
  "8-5": { events: [{ id: "sep1", title: "Orientation", category: "personal" }] },
  "8-12": { events: [{ id: "sep2", title: "Course Registration", category: "assignment" }] },
  "8-20": { hasExam: true, events: [{ id: "sep3", title: "Diagnostic Test", category: "exam" }] },
  // November (month index 10)
  "10-2": {
    hasExam: true,
    events: [{ id: "e-dm-ft4", title: "Discrete Math FT-IV", category: "exam" }],
  },
  "10-3": {
    hasExam: true,
    events: [{ id: "e-llt", title: "LLT Assessment Exam", category: "exam" }],
  },
  "10-4": { events: [{ id: "nov1", title: "Project Sprint 3", category: "project" }] },
  "10-14": { hasExam: true, events: [{ id: "nov2", title: "DBMS Midterm", category: "exam" }] },
  "10-25": { events: [{ id: "nov3", title: "Algorithms PSet", category: "assignment" }] },
};

export function MonthGrid({
  selectedDay,
  onSelectDay,
  year = 2024,
  month = 9,
}: MonthGridProps) {
  const days: DayData[] = React.useMemo(() => {
    const result: DayData[] = [];
    const firstDay = new Date(year, month, 1);
    // getDay() gives 0 for Sunday, 1 for Monday, etc.
    // Shift so Monday = 0, ..., Sunday = 6
    const startOffset = (firstDay.getDay() + 6) % 7;

    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Previous month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      result.push({
        dayNumber: daysInPrevMonth - i,
        month: "prev",
      });
    }

    // Current month days
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const isToday = year === 2024 && month === 9 && day === 22;
      const key = `${month}-${day}`;
      const metadata = sampleEventsByMonthDay[key];

      result.push({
        dayNumber: day,
        month: "current",
        isToday,
        hasExam: metadata?.hasExam,
        events: metadata?.events,
      });
    }

    // Next month padding to fill complete weeks (up to 35 or 42 slots)
    const totalSlots = result.length <= 35 ? 35 : 42;
    let nextDay = 1;
    while (result.length < totalSlots) {
      result.push({
        dayNumber: nextDay++,
        month: "next",
      });
    }

    return result;
  }, [year, month]);
  const getEventBadgeClass = (category: string) => {
    switch (category) {
      case "exam":
        return "bg-[var(--exam-tint)] text-[var(--exam-text)]";
      case "assignment":
        return "bg-[var(--assignment-tint)] text-[var(--assignment-text)]";
      case "project":
        return "bg-[var(--project-tint)] text-[var(--project-text)]";
      case "personal":
      default:
        return "bg-[var(--personal-tint)] text-[var(--personal-text)]";
    }
  };

  return (
    <div className="flex flex-col">
      {/* Day-of-Week Table Header */}
      <div className="grid grid-cols-7 mb-2 text-center">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <span
            key={day}
            className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] py-1"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Month Grid */}
      <div className="grid grid-cols-7 gap-1.5 auto-rows-fr">
        {days.map((day, idx) => {
          const isSelected = day.month === "current" && day.dayNumber === selectedDay;
          const isDimmed = day.month !== "current";

          return (
            <div
              key={idx}
              onClick={() => {
                if (day.month === "current") {
                  onSelectDay(day.dayNumber);
                }
              }}
              className={cn(
                "h-28 rounded-xl p-2 flex flex-col transition-all cursor-pointer select-none text-left",
                isDimmed
                  ? "bg-[var(--bg-subdued)]/40 opacity-40 cursor-default"
                  : isSelected
                  ? "bg-[var(--bg-surface)] ring-2 ring-[var(--primary)] shadow-[0_8px_24px_rgba(94,92,230,0.18)] z-10"
                  : day.isToday
                  ? "bg-[var(--primary-fixed)]/25 shadow-sm border border-[var(--primary)]/30"
                  : "bg-[var(--bg-subdued)]/70 hover:bg-[var(--bg-subdued)] hover:shadow-xs"
              )}
            >
              <div className="flex items-center justify-between">
                {day.isToday ? (
                  <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {day.dayNumber}
                  </span>
                ) : (
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      isSelected
                        ? "text-[var(--primary)] font-bold"
                        : isDimmed
                        ? "text-[var(--text-secondary)]/60"
                        : "text-[var(--text-primary)]"
                    )}
                  >
                    {day.dayNumber}
                  </span>
                )}

                {day.isToday && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--secondary)]">
                    Today
                  </span>
                )}

                {day.hasExam && (
                  <span className="w-2 h-2 rounded-full bg-[var(--exam)] shrink-0 animate-pulse" />
                )}
              </div>

              {/* Event Chips List */}
              {day.events && (
                <div className="mt-1.5 flex flex-col gap-1 overflow-hidden">
                  {day.events.map((evt) => (
                    <span
                      key={evt.id}
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-medium truncate",
                        getEventBadgeClass(evt.category)
                      )}
                    >
                      {evt.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
