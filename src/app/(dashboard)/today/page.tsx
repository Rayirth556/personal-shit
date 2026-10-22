"use client";

import * as React from "react";
import { SlidersHorizontal, Sparkles, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Top3Card } from "@/components/today/Top3Card";
import { DeadlineRunwayCard } from "@/components/today/DeadlineRunwayCard";
import { MorningKickoffModal } from "@/components/today/MorningKickoffModal";
import { ScheduleTimeline } from "@/components/today/ScheduleTimeline";
import { CheckInCard } from "@/components/today/CheckInCard";
import { ComingUpCard } from "@/components/today/ComingUpCard";
import { WeeklyProgressCard } from "@/components/today/WeeklyProgressCard";
import { StudyHeatmapCard } from "@/components/today/StudyHeatmapCard";
import { GitHubProjectsCard } from "@/components/today/GitHubProjectsCard";
import { ViewOptionsModal } from "@/components/today/ViewOptionsModal";
import { mockProfile } from "@/lib/mock-data";
import { useTasks } from "@/lib/task-store";

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
  const [rolloverNotice, setRolloverNotice] = React.useState<string | null>(
    "1 unfinished task from yesterday was rolled over into today"
  );

  return (
    <div className="flex flex-col w-full gap-7">
      {/* Rollover Notification Banner */}
      {rolloverNotice && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] border border-[var(--border-subtle)]/60 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span>{rolloverNotice}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setKickoffOpen(true)}
              className="text-[11px] font-bold text-[var(--primary)] hover:underline px-2 py-1"
            >
              Review in Kickoff →
            </button>
            <button
              type="button"
              onClick={() => setRolloverNotice(null)}
              className="text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-2 py-1 rounded-md hover:bg-[var(--bg-subdued)]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Hero Header Section */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs text-[var(--text-secondary)] font-medium">
            <span className="text-[var(--primary)] font-semibold">
              {mockProfile.currentTerm}
            </span>
            <span>•</span>
            <span>Week {mockProfile.currentWeek}</span>
            <span>•</span>
            <span className="bg-[var(--bg-subdued)] px-2 py-0.5 rounded-full text-[11px] font-semibold text-[var(--text-primary)]">
              Day 4 in Session
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Thursday, 22 October
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            {stats.top3Remaining} priorities remaining • 4 scheduled classes • 4-7 PM Girlfriend Time Reserved
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-end flex-wrap">
          <Button
            type="button"
            size="sm"
            onClick={() => setKickoffOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold rounded-full shadow-[0_4px_14px_rgba(94,92,230,0.25)]"
          >
            <Sun className="h-3.5 w-3.5" />
            <span>Morning Kickoff</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setViewOptionsOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subdued)] shadow-xs border border-[var(--border-subtle)]/60 rounded-full"
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
          <ScheduleTimeline initialDayOrder={4} />

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
            velocity="+4 vs last wk"
          />

          {/* 4. Study Consistency 12-Week Heatmap */}
          <StudyHeatmapCard />
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
