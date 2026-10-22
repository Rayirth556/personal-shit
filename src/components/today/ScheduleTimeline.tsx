"use client";

import * as React from "react";
import {
  CalendarDays,
  MapPin,
  Utensils,
  ChevronRight,
  BookOpen,
  FlaskConical,
  Heart,
} from "lucide-react";
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
    <div className="relative py-1.5 flex items-center gap-2.5 animate-in fade-in duration-300">
      <span className="text-[11px] font-bold text-red-500 shrink-0 w-11 text-right">
        {formatted24h}
      </span>

      <div className="relative flex items-center flex-1">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
        </span>
        <div className="flex-1 h-[1.5px] bg-red-500/80 ml-2" />
        <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
          {label} • {formattedTime}
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
        card: "bg-teal-500/[0.08] dark:bg-teal-500/[0.14] border border-teal-500/25 hover:border-teal-500/40",
        pill: "bg-teal-500/15 text-teal-700 dark:text-teal-300 font-semibold",
        dot: "bg-teal-500",
        typeBadge: "Practical Lab",
      };
    }

    if (cls.courseName.toLowerCase().includes("stress") || cls.courseName.toLowerCase().includes("art")) {
      return {
        card: "bg-purple-500/[0.08] dark:bg-purple-500/[0.14] border border-purple-500/25 hover:border-purple-500/40",
        pill: "bg-purple-500/15 text-purple-700 dark:text-purple-300 font-semibold",
        dot: "bg-purple-500",
        typeBadge: "Elective",
      };
    }

    if (cls.courseName.toLowerCase().includes("discrete") || cls.courseName.toLowerCase().includes("automata")) {
      return {
        card: "bg-indigo-500/[0.08] dark:bg-indigo-500/[0.14] border border-indigo-500/25 hover:border-indigo-500/40",
        pill: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-semibold",
        dot: "bg-[var(--primary)]",
        typeBadge: "Core Theory",
      };
    }

    return {
      card: "bg-amber-500/[0.08] dark:bg-amber-500/[0.14] border border-amber-500/25 hover:border-amber-500/40",
      pill: "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold",
      dot: "bg-amber-500",
      typeBadge: "Theory",
    };
  };

  return (
    <section className="bg-[var(--bg-surface)] rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[var(--border-subtle)]/40 transition-all">
      {/* Header with Title and Day Order Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)]/40 mb-5 gap-3">
        <div className="flex items-center gap-2.5">
          <CalendarDays className="h-5 w-5 text-[var(--primary)] shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                Today&apos;s Schedule
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)] uppercase">
                Batch 2
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Campus Web Timetable • {currentSchedule.classes.length} scheduled sessions
              {!isViewingToday && ` • Viewing Day ${activeDayOrder} (Today: Day ${initialDayOrder})`}
            </p>
          </div>
        </div>

        {/* Day Order Tabs (Day 1 - 5) */}
        <div className="flex items-center p-1 bg-[var(--bg-high)]/60 rounded-full border border-[var(--border-subtle)]/40 shadow-inner self-start sm:self-auto">
          {[1, 2, 3, 4, 5].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setActiveDayOrder(d)}
              className={cn(
                "px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium transition-all",
                activeDayOrder === d
                  ? "bg-[var(--bg-surface)] text-[var(--primary)] font-bold shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              Day {d}
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
              {/* Class Card */}
              <div
                className={cn(
                  "group relative p-4 rounded-2xl transition-all duration-200 flex flex-col gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]",
                  style.card,
                  isCurrentSession && "ring-2 ring-red-500/60 shadow-md"
                )}
              >
                {/* Top Row: Time, Type Badge, Room, Duration */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full shrink-0", style.dot)} />
                    <span className="text-xs font-bold text-[var(--text-primary)] tracking-tight">
                      {cls.startTime} – {cls.endTime}
                    </span>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full", style.pill)}>
                      {style.typeBadge}
                    </span>
                    {isCurrentSession && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                        In Session Now
                      </span>
                    )}
                    {cls.courseCode && (
                      <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                        {cls.courseCode}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {cls.room && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--text-secondary)] bg-[var(--bg-surface)] px-2.5 py-0.5 rounded-full shadow-xs border border-[var(--border-subtle)]/40">
                        <MapPin className="h-3 w-3 text-[var(--text-secondary)]" />
                        <span>Room {cls.room}</span>
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-[var(--text-secondary)] bg-[var(--bg-surface)] px-2 py-0.5 rounded-full shadow-xs border border-[var(--border-subtle)]/40">
                      {cls.durationLabel}
                    </span>
                  </div>
                </div>

                {/* Content Row: Course Name */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {cls.type === "practical" ? (
                      <FlaskConical className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    ) : (
                      <BookOpen className="h-4 w-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
                    )}
                    <h3 className="text-[15px] font-bold text-[var(--text-primary)] leading-snug">
                      {cls.courseName}
                    </h3>
                  </div>

                  <button
                    type="button"
                    aria-label="View session details"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Dynamic Current Time Indicator */}
              {isViewingToday && timeLinePosition === idx && formatted24h && (
                <CurrentTimeIndicator
                  formatted24h={formatted24h}
                  formattedTime={formattedTime}
                  label={isCurrentSession ? "Active Class Slot" : "Current Time"}
                />
              )}

              {/* Free Study Window / Buffer between classes */}
              {hasGapAfter && (
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[var(--bg-subdued)]/40 border border-dashed border-[var(--border-subtle)]/70 text-xs text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-subdued)]/70 gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[11px] font-semibold text-[var(--text-secondary)] shrink-0 w-11 text-right">
                      {cls.endTime}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--border-subtle)] shrink-0" />
                    <Utensils className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="font-medium text-[var(--text-primary)] truncate">
                      Free Study &amp; Buffer Window
                    </span>
                    <span className="text-[var(--text-secondary)] hidden sm:inline text-[11px]">
                      • Open focus time before {nextClass.courseName}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] shrink-0 bg-[var(--bg-surface)] px-2 py-0.5 rounded-full shadow-xs border border-[var(--border-subtle)]/40">
                    {cls.endTime} – {nextClass.startTime}
                  </span>
                </div>
              )}
            </React.Fragment>
          );
        })}

        {/* Sacred Personal Block: 4:00 PM – 7:00 PM Girlfriend Time */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-rose-500/5 border border-rose-500/30 text-xs shadow-xs transition-all hover:border-rose-500/50">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 shrink-0 w-11 text-right font-mono">
              16:00
            </span>
            <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Heart className="h-3.5 w-3.5 fill-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[13px] text-rose-950 dark:text-rose-100">
                  {GIRLFRIEND_TIME_BLOCK.title}
                </span>
                <span className="px-2 py-0.2 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                  Sacred Focus-Free Block
                </span>
              </div>
              <p className="text-[11px] text-rose-900/80 dark:text-rose-200/80 mt-0.5 truncate">
                {GIRLFRIEND_TIME_BLOCK.description}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 shrink-0 bg-white/70 dark:bg-rose-950/50 px-2.5 py-1 rounded-full border border-rose-300/40">
            4:00 PM – 7:00 PM
          </span>
        </div>
      </div>
    </section>
  );
}
