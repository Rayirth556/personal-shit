"use client";

import * as React from "react";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { VelocitySparkline } from "@/components/calendar/VelocitySparkline";
import { ExamSpotlightCard } from "@/components/calendar/ExamSpotlightCard";
import { PrepPlanCard } from "@/components/calendar/PrepPlanCard";
import { DayScheduleCard } from "@/components/calendar/DayScheduleCard";
import { NewEventModal } from "@/components/calendar/NewEventModal";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = React.useState<Date>(() => new Date());
  const [view, setView] = React.useState<"month" | "week" | "agenda">("month");
  const [selectedDay, setSelectedDay] = React.useState<number>(() => new Date().getDate());
  const [newEventOpen, setNewEventOpen] = React.useState(false);

  const currentMonth = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleTodayClick = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDay(now.getDate());
  };

  // Week view label follows the displayed month instead of a frozen date.
  const weekRangeLabel = React.useMemo(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
    return `${fmt(monday)} – ${fmt(sunday)}`;
  }, []);

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Calendar Top Navigation Header */}
      <CalendarHeader
        currentMonth={currentMonth}
        currentTerm="Semester 5"
        view={view}
        onViewChange={setView}
        onNewEventClick={() => setNewEventOpen(true)}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onTodayClick={handleTodayClick}
      />

      {/* Main Workspace: Calendar Grid + Inspector Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Main Calendar Grid Column (xl:col-span-8) */}
        <div className="xl:col-span-8 flex flex-col bg-[var(--bg-surface)] rounded-[20px] p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[var(--border-subtle)]/40 transition-all">
          {view === "month" && (
            <MonthGrid
              year={currentDate.getFullYear()}
              month={currentDate.getMonth()}
              selectedDay={selectedDay}
              onSelectDay={(day) => setSelectedDay(day)}
            />
          )}

          {view === "week" && (
            <div className="py-12 text-center text-sm text-[var(--text-secondary)]">
              <p className="font-semibold text-base text-[var(--text-primary)] mb-1">
                This week ({weekRangeLabel})
              </p>
              <p>Active 7-day academic horizon with hourly time slots.</p>
              <button
                type="button"
                onClick={() => setView("month")}
                className="mt-4 text-xs text-[var(--primary)] font-medium hover:underline"
              >
                ← Return to Month Grid
              </button>
            </div>
          )}

          {view === "agenda" && (
            <div className="py-6 flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Upcoming Academic Horizon &amp; Deadlines
              </p>
              {[
                {
                  date: "Tue 27 Oct",
                  title: "Formal Language & Automata — Chart Prep & Viva Presentation",
                  type: "project",
                },
                {
                  date: "Wed 28 Oct",
                  title: "Big Data Essentials — Project Review Milestone",
                  type: "assignment",
                },
                {
                  date: "Mon 02 Nov",
                  title: "Discrete Mathematics — FT-IV Exam (Units 4 & 5)",
                  type: "exam",
                },
                {
                  date: "Tue 03 Nov",
                  title: "Linux & Container Technologies — LLT Assessment Exam",
                  type: "exam",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-subdued)] gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        item.type === "exam"
                          ? "bg-[var(--exam)]"
                          : item.type === "assignment"
                          ? "bg-[var(--assignment)]"
                          : "bg-[var(--project)]"
                      }`}
                    />
                    <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-secondary)] shrink-0 bg-[var(--bg-surface)] px-2.5 py-0.5 rounded-full border border-[var(--border-subtle)]/40 shadow-xs">
                    {item.date}
                  </span>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setView("month")}
                className="mt-2 text-xs text-[var(--primary)] font-medium hover:underline text-left"
              >
                ← Return to Month Grid
              </button>
            </div>
          )}

          {/* Inline Month Velocity & Distribution Sparkline */}
          <VelocitySparkline />
        </div>

        {/* Right Inspector Panel: 340px (xl:col-span-4) */}
        <aside className="xl:col-span-4 flex flex-col gap-6">
          {/* Selected Date Header Card */}
          <ExamSpotlightCard selectedDay={selectedDay} />

          {/* Auto-suggested "Prep Plan" Card */}
          <PrepPlanCard />

          {/* Selected Day Timeline / Schedule Strip */}
          <DayScheduleCard selectedDay={selectedDay} />
        </aside>
      </div>

      {/* New Event Modal */}
      <NewEventModal
        open={newEventOpen}
        onOpenChange={setNewEventOpen}
        onAddEvent={(evt) => {
          console.log("New scheduled event:", evt);
        }}
      />
    </div>
  );
}
