"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TIMETABLE_DAYS, ClassSession, GIRLFRIEND_TIME_BLOCK } from "@/lib/timetable-data";

function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function CurrentTimeIndicator({
  formatted24h,
  formattedTime,
  label = "Current Time",
}: {
  formatted24h: string;
  formattedTime: string;
  label?: string;
}) {
  return (
    <div className="relative flex items-center gap-3 py-1" title={formattedTime}>
      <span className="tnum w-12 shrink-0 text-right font-mono text-[10px] text-[var(--exam-text)]">
        {formatted24h}
      </span>

      <div className="relative flex flex-1 items-center">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--exam)]" />
        <div className="mx-2 h-px flex-1 bg-[var(--exam)]/40" />
        <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--exam-text)]">
          {label}
        </span>
      </div>
    </div>
  );
}

interface ScheduleTimelineProps {
  initialDayOrder?: number;
}

export function ScheduleTimeline({ initialDayOrder = 4 }: ScheduleTimelineProps) {
  const [activeDayOrder, setActiveDayOrder] = React.useState<number>(initialDayOrder);
  const [currentTime, setCurrentTime] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const currentSchedule =
    TIMETABLE_DAYS.find((d) => d.dayOrder === activeDayOrder) || TIMETABLE_DAYS[3];

  const isViewingToday = activeDayOrder === initialDayOrder;

  const currentMinutes = currentTime
    ? currentTime.getHours() * 60 + currentTime.getMinutes()
    : null;
  const formatted24h = currentTime
    ? `${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}`
    : "";
  const formattedTime = currentTime
    ? currentTime.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : "";

  const timeLinePosition = React.useMemo(() => {
    if (!isViewingToday || currentMinutes === null || currentSchedule.classes.length === 0) {
      return null;
    }
    const firstStart = parseTimeToMinutes(currentSchedule.classes[0].startTime);
    if (currentMinutes < firstStart) return -1;

    for (let i = 0; i < currentSchedule.classes.length - 1; i++) {
      const thisEnd = parseTimeToMinutes(currentSchedule.classes[i].endTime);
      const nextStart = parseTimeToMinutes(currentSchedule.classes[i + 1].startTime);
      if (currentMinutes >= thisEnd && currentMinutes < nextStart) {
        return i;
      }
      const thisStart = parseTimeToMinutes(currentSchedule.classes[i].startTime);
      if (currentMinutes >= thisStart && currentMinutes < thisEnd) {
        return i;
      }
    }

    return currentSchedule.classes.length - 1;
  }, [isViewingToday, currentMinutes, currentSchedule.classes]);

  const getClassStyle = (cls: ClassSession) => {
    if (cls.type === "practical") {
      return {
        rule: "before:bg-[var(--project)]",
        dot: "bg-[var(--project)]",
        typeBadge: "Practical",
      };
    }

    if (cls.courseName.toLowerCase().includes("stress") || cls.courseName.toLowerCase().includes("art")) {
      return {
        rule: "before:bg-[var(--personal)]",
        dot: "bg-[var(--personal)]",
        typeBadge: "Elective",
      };
    }

    if (cls.courseName.toLowerCase().includes("discrete") || cls.courseName.toLowerCase().includes("automata")) {
      return {
        rule: "before:bg-[var(--exam)]",
        dot: "bg-[var(--exam)]",
        typeBadge: "Core theory",
      };
    }

    return {
      rule: "before:bg-[var(--assignment)]",
      dot: "bg-[var(--assignment)]",
      typeBadge: "Theory",
    };
  };

  return (
    <section className="bg-[var(--bg-surface)] rounded-[var(--radius-card)] p-5 md:p-6 shadow-none border border-[var(--border-subtle)] transition-all">
      {/* Header with Title and Day Order Selector */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-3 border-b border-[var(--border-subtle)] gap-2">
        <div>
          <h2 className="text-[15px] font-medium text-[var(--text-primary)]">
            Schedule
          </h2>
          <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
            {currentSchedule.classes.length} sessions
            {!isViewingToday && ` · viewing day ${activeDayOrder}, today is day ${initialDayOrder}`}
          </p>
        </div>

        {/* Day order selector */}
        <div className="flex items-center gap-0.5 self-start sm:self-auto">
          {[1, 2, 3, 4, 5].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setActiveDayOrder(d)}
              className={cn(
                "px-2 py-1 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors",
                activeDayOrder === d
                  ? "text-[var(--text-primary)] underline decoration-1 underline-offset-4"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              )}
            >
              D{d}
            </button>
          ))}
        </div>
      </div>

      {/* Proportional Timetable Stream for the Selected Day */}
      <div className="flex flex-col gap-3">
        {isViewingToday && timeLinePosition === -1 && formatted24h && (
          <CurrentTimeIndicator
            formatted24h={formatted24h}
            formattedTime={formattedTime}
            label="Current Time"
          />
        )}

        {currentSchedule.classes.map((cls, idx) => {
          const style = getClassStyle(cls);
          const nextClass = currentSchedule.classes[idx + 1];

          // Check if there is a gap between this class and next class
          const hasGapAfter = nextClass && nextClass.startTime !== cls.endTime;

          const isCurrentSession =
            isViewingToday &&
            currentMinutes !== null &&
            currentMinutes >= parseTimeToMinutes(cls.startTime) &&
            currentMinutes <= parseTimeToMinutes(cls.endTime);

          return (
            <React.Fragment key={cls.id}>
              {/* Class row */}
              <div
                className={cn(
                  "group relative flex items-start gap-3 py-2.5 pl-3 pr-1 transition-colors hover:bg-[var(--bg-subdued)]/60",
                  "before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-[2px] before:rounded-full",
                  style.rule
                )}
              >
                <span className="tnum w-11 shrink-0 pt-[3px] text-right font-mono text-[10px] text-[var(--text-tertiary)]">
                  {cls.startTime}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h3 className="text-[13.5px] leading-snug text-[var(--text-primary)]">
                      {cls.courseName}
                    </h3>
                    <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                      {style.typeBadge}
                    </span>
                    {isCurrentSession && (
                      <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--exam-text)]">
                        in session
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-1.5 text-[10.5px] text-[var(--text-tertiary)]">
                    <span className="tnum font-mono">
                      {cls.startTime}–{cls.endTime}
                    </span>
                    {cls.courseCode && (
                      <>
                        <span>·</span>
                        <span className="font-mono">{cls.courseCode}</span>
                      </>
                    )}
                    {cls.room && (
                      <>
                        <span>·</span>
                        <span>{cls.room}</span>
                      </>
                    )}
                  </div>
                </div>

                <span className="tnum shrink-0 font-mono text-[10px] text-[var(--text-tertiary)]">
                  {cls.durationLabel}
                </span>
              </div>

              {/* Dynamic Current Time Indicator */}
              {isViewingToday && timeLinePosition === idx && formatted24h && (
                <CurrentTimeIndicator
                  formatted24h={formatted24h}
                  formattedTime={formattedTime}
                  label={isCurrentSession ? "Active Class Slot" : "Current Time"}
                />
              )}

              {/* Gap between sessions */}
              {hasGapAfter && (
                <div className="flex items-center justify-between gap-3 py-1.5 pl-3 pr-1 text-[10.5px] text-[var(--text-tertiary)]">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="tnum w-11 shrink-0 text-right font-mono">
                      {cls.endTime}
                    </span>
                    <span className="h-px w-4 shrink-0 bg-[var(--border-subtle)]" />
                    <span className="truncate">
                      Open block before {nextClass.courseName}
                    </span>
                  </div>

                  <span className="tnum shrink-0 font-mono">
                    {cls.endTime}–{nextClass.startTime}
                  </span>
                </div>
              )}
            </React.Fragment>
          );
        })}

        {/* Protected personal block */}
        <div className="relative mt-1 flex items-start gap-3 py-2.5 pl-3 pr-1 before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-[2px] before:rounded-full before:bg-[var(--exam)]">
          <span className="tnum w-11 shrink-0 pt-[3px] text-right font-mono text-[10px] text-[var(--text-tertiary)]">
            {GIRLFRIEND_TIME_BLOCK.startTime}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[13.5px] text-[var(--text-primary)]">
                {GIRLFRIEND_TIME_BLOCK.title}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--exam-text)]">
                protected
              </span>
            </div>
            <p className="mt-1 text-[10.5px] text-[var(--text-tertiary)]">
              {GIRLFRIEND_TIME_BLOCK.description}
            </p>
          </div>

          <span className="tnum shrink-0 font-mono text-[10px] text-[var(--text-tertiary)]">
            {GIRLFRIEND_TIME_BLOCK.startTime}–{GIRLFRIEND_TIME_BLOCK.endTime}
          </span>
        </div>
      </div>
    </section>
  );
}
