"use client";

import * as React from "react";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  CheckCircle2,
  GitCommit,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: string;
  dateLabel: string;
  hoursLogged: string;
  content: string;
  tags: string[];
  dotColorClass: string;
}

const initialEntries: LogEntry[] = [
  {
    id: "entry-1",
    dateLabel: "Today at 2:15 PM",
    hoursLogged: "2.0 hrs logged",
    content:
      "[autonomous-campus-rover (8f4a1c9)] feat(slam): tune velocity curves and optimize lidar point cloud drift",
    tags: ["Code", "ROS2", "SLAM"],
    dotColorClass: "bg-[var(--primary)]",
  },
  {
    id: "entry-2",
    dateLabel: "Yesterday at 6:45 PM",
    hoursLogged: "2.5 hrs logged",
    content:
      "Resolved motor controller PWM glitch. Tested steering servo angle mapping with Dr. Thorne. Next step is wiring the secondary battery bus.",
    tags: ["Hardware", "Debugging"],
    dotColorClass: "bg-[var(--secondary)]",
  },
  {
    id: "entry-3",
    dateLabel: "Monday, 19 Oct",
    hoursLogged: "4.0 hrs logged",
    content:
      "Configured Ubuntu 22.04 LTS on Raspberry Pi 5. Flashed ROS2 Humble desktop build and verified camera pipeline via RTSP.",
    tags: ["Software", "Setup"],
    dotColorClass: "bg-[var(--primary)]",
  },
];

const PROJECT_LOGS_STORAGE_KEY = "plan_project_daily_logs_v2";

export function DailyLogPanel() {
  const [entries, setEntries] = React.useState<LogEntry[]>(initialEntries);
  const [logText, setLogText] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<string[]>(["#code"]);
  const [savedSuccess, setSavedSuccess] = React.useState(false);
  const [syncingGit, setSyncingGit] = React.useState(false);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(PROJECT_LOGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load project logs from localStorage:", e);
    }
  }, []);

  const saveEntriesToStorage = (newEntries: LogEntry[]) => {
    setEntries(newEntries);
    try {
      localStorage.setItem(PROJECT_LOGS_STORAGE_KEY, JSON.stringify(newEntries));
    } catch (e) {
      console.warn("Failed to save project logs to localStorage:", e);
    }
  };

  const availableTags = ["#code", "#hardware", "#meeting", "#testing", "#docs"];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSyncLatestCommit = async () => {
    setSyncingGit(true);
    try {
      const res = await fetch("/api/github/repos?username=Rayirth556");
      if (res.ok) {
        const data = await res.json();
        const repos = data.repositories || [];
        const latestRepo = repos[0];
        if (latestRepo?.latestCommit) {
          const commitMsg = latestRepo.latestCommit.message;
          const commitSha = latestRepo.latestCommit.sha;
          const repoName = latestRepo.name;
          const content = `[${repoName} (${commitSha})] ${commitMsg}`;
          setLogText(content);
          setSelectedTags(["#code"]);
        }
      }
    } catch (err) {
      console.warn("Failed to sync git commit:", err);
    } finally {
      setSyncingGit(false);
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!logText.trim()) return;

    const newEntry: LogEntry = {
      id: `entry-${Date.now()}`,
      dateLabel: "Just now",
      hoursLogged: "1.5 hrs logged",
      content: logText.trim(),
      tags: selectedTags.map((t) => t.replace("#", "")),
      dotColorClass: "bg-[var(--primary)]",
    };

    saveEntriesToStorage([newEntry, ...entries]);
    setLogText("");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <section
      aria-label="Daily Work Log"
      className="p-5 md:p-6 rounded-[var(--radius-card)] bg-[var(--bg-surface)] shadow-none border border-[var(--border-subtle)] flex flex-col gap-5 transition-all"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--primary-fixed)] flex items-center justify-center text-[var(--primary)] shrink-0">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Daily Log
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Engineering Lab Notebook
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-[var(--radius-md)] bg-[var(--bg-high)] text-xs font-semibold text-[var(--text-primary)]">
            {entries.length} Logs
          </span>
          <button
            type="button"
            aria-label="Filter logs"
            className="p-1 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--bg-high)] transition-colors"
          >
            <Calendar className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Note Creation Form */}
      <div className="p-4 rounded-2xl bg-[var(--bg-subdued)] flex flex-col gap-2.5 border border-[var(--border-subtle)] focus-within:bg-[var(--bg-surface)] focus-within:shadow-[0_4px_16px_rgba(94,92,230,0.12)] transition-all">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            <span>Today&apos;s Log — Thu, 22 Oct</span>
          </label>

          {/* Sync Latest Git Commit Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSyncLatestCommit}
            disabled={syncingGit}
            className="h-6 px-2 text-[11px] font-mono text-[var(--primary)] hover:bg-[var(--primary-fixed)]/40 rounded-[var(--radius-md)] gap-1"
          >
            <GitCommit className="h-3 w-3" />
            <span>{syncingGit ? "Syncing..." : "Sync Latest Commit"}</span>
          </Button>
        </div>

        <textarea
          value={logText}
          onChange={(e) => setLogText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What did you get done today? (Or click 'Sync Latest Commit' to pull from @Rayirth556)"
          rows={3}
          className="w-full bg-transparent text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none resize-none leading-relaxed"
        />

        {/* Quick Tags Row */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mr-0.5">
            Tags:
          </span>
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn(
                "px-2 py-0.5 rounded-[var(--radius-md)] text-[10px] font-medium transition-colors",
                selectedTags.includes(tag)
                  ? "bg-[var(--primary)] text-[var(--on-primary)]"
                  : "bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Footer & Submit */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-[10px] text-[var(--text-secondary)]">
            Press ⌘cmd + Enter to save
          </span>
          <Button
            type="button"
            onClick={() => handleSave()}
            disabled={!logText.trim()}
            size="sm"
            className="rounded-[var(--radius-md)] text-xs font-medium px-4 h-7"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-[var(--on-primary)]" />
                <span>Saved ✓</span>
              </>
            ) : (
              <span>Save Entry</span>
            )}
          </Button>
        </div>
      </div>

      {/* Previous Entries Timeline */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Previous Entries
        </h3>

        <div className="flex flex-col gap-4">
          {entries.map((entry, idx) => (
            <article key={entry.id} className="relative pl-4 flex flex-col gap-1.5 group">
              {/* Timeline vertical connector */}
              {idx !== entries.length - 1 && (
                <div className="absolute left-[3px] top-2.5 bottom-0 w-0.5 bg-[var(--border-subtle)]" />
              )}
              {/* Dot marker */}
              <div
                className={cn(
                  "absolute left-0 top-1.5 w-2 h-2 rounded-full ring-4 ring-[var(--bg-surface)]",
                  entry.dotColorClass
                )}
              />

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {entry.dateLabel}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-[var(--radius-md)] bg-[var(--bg-subdued)] text-[var(--text-secondary)]">
                  {entry.hoursLogged}
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {entry.content}
              </p>

              <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                {entry.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.2 rounded-[var(--radius-md)] bg-[var(--bg-subdued)] text-[10px] font-medium text-[var(--text-secondary)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
