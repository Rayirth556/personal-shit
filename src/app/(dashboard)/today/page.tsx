"use client";

import * as React from "react";
import { SlidersHorizontal, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Top3Card } from "@/components/today/Top3Card";
import { DeadlineRunwayCard } from "@/components/today/DeadlineRunwayCard";
import { MorningKickoffModal } from "@/components/today/MorningKickoffModal";
import { ScheduleTimeline } from "@/components/today/ScheduleTimeline";
import { CheckInCard } from "@/components/today/CheckInCard";
import { ComingUpCard } from "@/components/today/ComingUpCard";
import { WeeklyProgressCard } from "@/components/today/WeeklyProgressCard";
import { GitHubProjectsCard } from "@/components/today/GitHubProjectsCard";
import { ViewOptionsModal } from "@/components/today/ViewOptionsModal";
import { GIRLFRIEND_TIME_BLOCK } from "@/lib/timetable-data";
import { useTasks } from "@/lib/task-store";

function formatTime12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12} ${suffix}` : `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export default function TodayPage() {
  const { stats } = useTasks();

  const [viewOptionsOpen, setViewOptionsOpen] = React.useState(false);
  const [kickoffOpen, setKickoffOpen] = React.useState(false);
  const [density, setDensity] = React.useState<"comfortable" | "compact">("comfortable");
  const [showCompleted, setShowCompleted] = React.useState(true);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([
    "exam",
    "assignment",
    "project",
    "personal",
  ]);

  // Rendered in an effect so the static shell and the hydrated client agree,
  // and so the date is actually today rather than a hardcoded string.
  const [todayLabel, setTodayLabel] = React.useState<string | null>(null);
  React.useEffect(() => {
    setTodayLabel(
      new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    );
  }, []);

  const girlfriendWindow = `${formatTime12h(GIRLFRIEND_TIME_BLOCK.startTime)} – ${formatTime12h(
    GIRLFRIEND_TIME_BLOCK.endTime
  )}`;

  return (
    <div className="flex flex-col w-full gap-7">
      {/* Hero Header Section */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]/30">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {todayLabel ?? "\u00A0"}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            {stats.top3Remaining} of 3 priorities open • {girlfriendWindow} reserved for{" "}
            {GIRLFRIEND_TIME_BLOCK.title.toLowerCase()}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-end flex-wrap">
          <Button
            type="button"
            size="sm"
            onClick={() => setKickoffOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold rounded-full shadow-[var(--shadow-glow)]"
          >
            <Sun className="h-3.5 w-3.5" />
            <span>Morning Kickoff</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setViewOptionsOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subdued)] border border-[var(--border-subtle)]/60 rounded-full"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Customize</span>
          </Button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* MAIN COLUMN (8 cols): Focus Tasks + Timetable Schedule + Reflection */}
        <div className="lg:col-span-8 flex flex-col gap-7 min-w-0">
          {/* 1. Top Priorities List (Backed by Reactive Task Store) */}
          <Top3Card
            density={density}
            showCompleted={showCompleted}
            selectedCategories={selectedCategories}
          />

          {/* 2. Reverse Deadline Runway (Staged Milestones) */}
          <DeadlineRunwayCard />

          {/* 3. Today's Class Schedule (Sunsama-Style Proportional Timetable) */}
          <ScheduleTimeline initialDayOrder={1} />

          {/* 4. Daily Reflection Journal Note */}
          <CheckInCard
            onReflect={(reflection) => {
              console.log("Journal reflection recorded:", reflection);
            }}
          />
        </div>

        {/* RIGHT UTILITY & DEVELOPER COLUMN (4 cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* 1. Live GitHub Projects & Latest Commits */}
          <GitHubProjectsCard initialUsername="Rayirth556" />

          {/* 2. Coming Up Deadlines (Exams & Assignments) */}
          <ComingUpCard />

          {/* 3. Weekly Progress Ring */}
          <WeeklyProgressCard
            completedTasks={stats.completed}
            totalTasks={stats.total}
          />
        </aside>
      </div>

      {/* Morning Kickoff Modal */}
      <MorningKickoffModal
        open={kickoffOpen}
        onOpenChange={setKickoffOpen}
      />

      {/* View Options Modal */}
      <ViewOptionsModal
        open={viewOptionsOpen}
        onOpenChange={setViewOptionsOpen}
        density={density}
        setDensity={setDensity}
        showCompleted={showCompleted}
        setShowCompleted={setShowCompleted}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
    </div>
  );
}
