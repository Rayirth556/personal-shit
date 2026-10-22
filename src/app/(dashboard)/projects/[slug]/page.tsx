"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { DeliverablesTracker } from "@/components/projects/DeliverablesTracker";
import { KanbanBoard } from "@/components/projects/KanbanBoard";
import { DailyLogPanel } from "@/components/projects/DailyLogPanel";
import { mockCampusRoverProject, mockPortfolioProject, ProjectData } from "@/lib/mock-data";

function ProjectContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const project: ProjectData =
    slug === "portfolio-website" ? mockPortfolioProject : mockCampusRoverProject;

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Project Header */}
      <ProjectHeader
        project={project}
        onNewTaskClick={() => {
          console.log("Create new project task");
        }}
      />

      {/* Deliverables Tracker Card */}
      <DeliverablesTracker
        progressPercent={project.progressPercent}
        deliverablesDone={project.deliverablesDone}
        deliverablesTotal={project.deliverablesTotal}
        inProgressCount={project.inProgressCount}
        dueThisWeekCount={project.dueThisWeekCount}
        blockersCount={project.blockersCount}
      />

      {/* Main Workspace: Kanban Board (8 cols) + Daily Log Panel (4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <main className="xl:col-span-8 flex flex-col gap-6">
          <KanbanBoard
            initialTasks={project.columns}
            onAddTask={(col) => {
              console.log("Add task to column:", col);
            }}
          />
        </main>

        <aside className="xl:col-span-4 flex flex-col gap-6 xl:sticky xl:top-24">
          <DailyLogPanel />
        </aside>
      </div>
    </div>
  );
}

export default function ProjectDetailsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-[var(--text-secondary)]">Loading project...</div>}>
      <ProjectContent />
    </React.Suspense>
  );
}
