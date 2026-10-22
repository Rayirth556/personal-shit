"use client";

import * as React from "react";
import Link from "next/link";
import { Folder, MoreHorizontal, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectData } from "@/lib/mock-data";

interface ProjectHeaderProps {
  project: ProjectData;
  onNewTaskClick?: () => void;
}

export function ProjectHeader({ project, onNewTaskClick }: ProjectHeaderProps) {
  return (
    <header className="flex flex-col gap-5">
      {/* Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <Link
            href="/projects"
            className="hover:text-[var(--primary)] transition-colors flex items-center gap-1.5 font-medium"
          >
            <Folder className="h-3.5 w-3.5" />
            <span>Projects</span>
          </Link>
          <span className="text-[var(--border-subtle)]">/</span>
          <span className="flex items-center gap-1.5 text-[var(--text-primary)] font-semibold bg-[var(--bg-high)]/80 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
            <span>{project.title}</span>
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--bg-subdued)] text-xs text-[var(--text-secondary)] border border-[var(--border-subtle)]/40">
            <Clock className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span>Updated 14m ago</span>
          </span>

          <button
            type="button"
            aria-label="Project actions"
            className="w-8 h-8 rounded-full bg-[var(--bg-surface)] shadow-xs hover:bg-[var(--bg-high)] transition-all flex items-center justify-center text-[var(--text-secondary)] border border-[var(--border-subtle)]/40"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          <Button
            type="button"
            onClick={onNewTaskClick}
            size="sm"
            className="rounded-full shadow-[0_4px_14px_rgba(94,92,230,0.3)]"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </Button>
        </div>
      </div>

      {/* Main Title, Lab Badges & Deadline Context */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="default" className="uppercase text-[11px] font-semibold tracking-wider px-2.5 py-0.5">
              {project.labTag}
            </Badge>
            <Badge variant="project" className="uppercase text-[11px] font-semibold tracking-wider px-2.5 py-0.5">
              {project.courseTag}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[var(--text-primary)] tracking-tight">
            {project.title}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Right Badges */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-end shrink-0">
          {/* Deadline */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] shadow-xs border border-[var(--border-subtle)]/40">
            <div className="w-2 h-2 rounded-full bg-[var(--exam)] animate-pulse" />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">
                Deadline
              </span>
              <span className="text-xs text-[var(--text-primary)] font-semibold">
                {project.deadline}{" "}
                <span className="text-[var(--primary)] font-medium">
                  • {project.deadlineDaysLeft}d left
                </span>
              </span>
            </div>
          </div>

          {/* Advisor & Team */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] shadow-xs border border-[var(--border-subtle)]/40">
            <div className="w-7 h-7 rounded-full bg-[var(--bg-high)] flex items-center justify-center text-[var(--text-primary)] text-xs font-semibold">
              AT
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">
                Advisor &amp; Team
              </span>
              <span className="text-xs text-[var(--text-primary)] font-medium">
                {project.advisor}{" "}
                <span className="text-[var(--text-secondary)]">
                  • {project.teamCount} members
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
