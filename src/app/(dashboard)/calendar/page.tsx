"use client";

import * as React from "react";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { SelectedDayCard } from "@/components/calendar/SelectedDayCard";
import { PrepPlanCard } from "@/components/calendar/PrepPlanCard";
import { NewEventModal } from "@/components/calendar/NewEventModal";
import { SEMESTER_5_DEADLINES } from "@/lib/runway-generator";
import { cn } from "@/lib/utils";

const CATEGORY_TOKEN: Record<string, string> = {
  exam: "--exam",
  assignment: "--assignment",
  project: "--project",
  personal: "--personal",
};

function localIso(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function daysUntil(dateString: string, todayIso: string): number {
  const a = new Date(`${dateString}T00:00:00`);
  const b = new Date(`${todayIso}T00:00:00`);
  return Math.round((a.getTime() - b.getTime()) / 86_400_000);
}

/** Monday-based week containing the given date. */
function weekDates(anchor: Date): Date[] {
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() - ((anchor.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = React.useState<Date>(() => new Date());
  const [view, setView] = React.useState<"month" | "week" | "agenda">("month");
  const [selectedDay, setSelectedDay] = React.useState<number>(() => new Date().getDate());
  const [newEventOpen, setNewEventOpen] = React.useState(false);
  const [todayIso, setTodayIso] = React.useState<string | null>(null);

  React.useEffect(() => {
    setTodayIso(localIso());
  }, []);

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

  const upcoming = React.useMemo(() => {
    if (!todayIso) return [];
    return SEMESTER_5_DEADLINES.map((d) => ({
      ...d,
      days: daysUntil(d.targetDate, todayIso),
    })).sort((a, b) => a.targetDate.localeCompare(b.targetDate));
  }, [todayIso]);

  const week = React.useMemo(() => weekDates(new Date()), []);

  return (
    <div className="flex flex-col w-full gap-6">
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

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
        {/* Main column */}
        <div className="xl:col-span-8">
          {view === "month" && (
            <MonthGrid
              year={currentDate.getFullYear()}
              month={currentDate.getMonth()}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
          )}

          {view === "week" && (
            <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <div className="grid grid-cols-7 gap-px border-b border-[var(--border-subtle)] bg-[var(--border-subtle)]">
                {week.map((d) => {
                  const iso = localIso(d);
                  const has = SEMESTER_5_DEADLINES.some((x) => x.targetDate === iso);
                  const isToday = iso === todayIso;
                  return (
                    <div
                      key={iso}
                      className="bg-[var(--bg-surface)] px-2 py-2.5 text-center"
                    >
                      <p className="font-mono text-[8.5px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                        {d.toLocaleDateString("en-GB", { weekday: "short" })}
                      </p>
                      <p
                        className={cn(
                          "display tnum mt-1 text-[22px] leading-none",
                          isToday
                            ? "text-[var(--primary)]"
                            : "text-[var(--text-primary)]"
                        )}
                      >
                        {d.getDate()}
                      </p>
                      <span
                        className={cn(
                          "mx-auto mt-1.5 block h-1 w-1 rounded-full",
                          has ? "bg-[var(--exam)]" : "bg-transparent"
                        )}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col divide-y divide-[var(--border-subtle)]">
                {upcoming
                  .filter((d) => {
                    const iso = d.targetDate;
                    return week.some((wd) => localIso(wd) === iso);
                  })
                  .map((d) => (
                    <div key={d.id} className="flex items-center gap-3 px-4 py-2.5">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: `var(${CATEGORY_TOKEN[d.category]})` }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] text-[var(--text-primary)]">
                          {d.title}
                        </p>
                        <p className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                          {d.courseCode} · {d.targetDate}
                        </p>
                      </div>
                      <span className="tnum shrink-0 font-mono text-[10px] text-[var(--text-tertiary)]">
                        {d.days < 0 ? "past" : d.days === 0 ? "today" : `in ${d.days}d`}
                      </span>
                    </div>
                  ))}
                {!upcoming.some((d) => week.some((wd) => localIso(wd) === d.targetDate)) && (
                  <p className="px-4 py-6 text-center text-[11px] text-[var(--text-tertiary)]">
                    Nothing due this week.
                  </p>
                )}
              </div>
            </section>
          )}

          {view === "agenda" && (
            <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] px-4 py-3">
                <h2 className="text-[15px] font-medium text-[var(--text-primary)]">
                  Deadlines
                </h2>
                <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                  semester 5
                </span>
              </div>

              <div className="flex flex-col divide-y divide-[var(--border-subtle)]">
                {upcoming.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 px-4 py-3">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: `var(${CATEGORY_TOKEN[d.category]})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] text-[var(--text-primary)]">
                        {d.title}
                      </p>
                      <p className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                        {d.courseCode}
                        {d.targetTime ? ` · ${d.targetTime}` : ""}
                        {d.location ? ` · ${d.location}` : ""}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="tnum font-mono text-[10.5px] text-[var(--text-secondary)]">
                        {d.targetDate}
                      </p>
                      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                        {d.days < 0 ? "past" : d.days === 0 ? "today" : `in ${d.days}d`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Inspector column */}
        <aside className="flex flex-col gap-6 xl:col-span-4">
          <SelectedDayCard
            year={currentDate.getFullYear()}
            month={currentDate.getMonth()}
            day={selectedDay}
          />
          <PrepPlanCard />
        </aside>
      </div>

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
