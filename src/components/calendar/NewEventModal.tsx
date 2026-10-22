"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Sparkles, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTasks } from "@/lib/task-store";
import { generateRunwayMilestones } from "@/lib/runway-generator";

interface NewEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEvent?: (event: {
    title: string;
    type: "exam" | "assignment" | "project" | "personal";
    date: string;
    startTime: string;
    endTime: string;
    location?: string;
  }) => void;
}

export function NewEventModal({
  open,
  onOpenChange,
  onAddEvent,
}: NewEventModalProps) {
  const { addTask } = useTasks();
  const [tab, setTab] = React.useState<"manual" | "paste">("manual");
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState<
    "exam" | "assignment" | "project" | "personal"
  >("exam");
  const [date, setDate] = React.useState("2026-10-28");
  const [startTime, setStartTime] = React.useState("10:00");
  const [endTime, setEndTime] = React.useState("12:30");
  const [location, setLocation] = React.useState("CLS1020");
  const [generateRunway, setGenerateRunway] = React.useState(true);
  const [pastedNotice, setPastedNotice] = React.useState("");

  // Natural Language / WhatsApp Notice Parser
  const parseNotice = (text: string) => {
    let detectedTitle = "";
    let detectedType: "exam" | "assignment" | "project" | "personal" = "exam";
    let detectedDate = "2026-10-28";
    let detectedLocation = "CLS1020";

    const lower = text.toLowerCase();

    // 1. Course Detection
    if (lower.includes("fla") || lower.includes("formal language") || lower.includes("automata")) {
      detectedTitle = "Formal Language & Automata: Chart Prep & Viva";
      detectedType = "project";
      detectedLocation = "CLS1020";
    } else if (lower.includes("discrete") || lower.includes("ft-iv") || lower.includes("ft4")) {
      detectedTitle = "Discrete Mathematics: FT-IV Exam (Unit 4 & 5)";
      detectedType = "exam";
      detectedLocation = "CLS1020";
    } else if (lower.includes("llt") || lower.includes("linux")) {
      detectedTitle = "Linux & Container Technologies: LLT Exam";
      detectedType = "exam";
      detectedLocation = "LH204";
    } else if (lower.includes("big data")) {
      detectedTitle = "Big Data Essentials: Project Review";
      detectedType = "assignment";
      detectedLocation = "CLS1020";
    } else if (lower.includes("network")) {
      detectedTitle = "Computer Networks: Assessment";
      detectedType = "assignment";
      detectedLocation = "CLS1020";
    } else {
      detectedTitle = text.slice(0, 45).replace(/\[.*?\]/g, "").trim() || "Academic Deadline";
    }

    // 2. Date Extraction (e.g. 02/11/2026, 27.10.2026, 28th)
    const ddmmyyyyMatch = text.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
    if (ddmmyyyyMatch) {
      const day = ddmmyyyyMatch[1].padStart(2, "0");
      const month = ddmmyyyyMatch[2].padStart(2, "0");
      const year = ddmmyyyyMatch[3];
      detectedDate = `${year}-${month}-${day}`;
    } else if (lower.includes("27") || lower.includes("27th")) {
      detectedDate = "2026-10-27";
    } else if (lower.includes("28") || lower.includes("28th")) {
      detectedDate = "2026-10-28";
    } else if (lower.includes("02/11") || lower.includes("2/11") || lower.includes("nov 2")) {
      detectedDate = "2026-11-02";
    } else if (lower.includes("03/11") || lower.includes("3/11") || lower.includes("nov 3")) {
      detectedDate = "2026-11-03";
    }

    return { detectedTitle, detectedType, detectedDate, detectedLocation };
  };

  const handleApplyParsedNotice = () => {
    if (!pastedNotice.trim()) return;
    const res = parseNotice(pastedNotice);
    setTitle(res.detectedTitle);
    setType(res.detectedType);
    setDate(res.detectedDate);
    setLocation(res.detectedLocation);
    setTab("manual");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEvent?.({
      title: title.trim(),
      type,
      date,
      startTime,
      endTime,
      location: location.trim() || undefined,
    });

    // Optionally auto-generate staged reverse runway tasks
    if (generateRunway) {
      const milestones = generateRunwayMilestones({
        id: `custom-dl-${Date.now()}`,
        title: title.trim(),
        courseCode: "SEM5",
        courseName: title.trim(),
        category: type,
        targetDate: date,
        targetTime: startTime,
        location: location.trim(),
      });

      // Add the first actionable milestone to Today's tasks
      if (milestones.length > 0) {
        const step1 = milestones[0];
        addTask({
          title: step1.title,
          category: type,
          priority: "high",
          status: "todo",
          isTopPriorityToday: true,
          dueLabel: `Runway Milestone • ${step1.stageLabel} (Deadline ${date})`,
          subtitle: step1.actionableStep,
        });
      }
    }

    setTitle("");
    setPastedNotice("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary-fixed)] text-[var(--primary)]">
                <Calendar className="h-4 w-4" />
              </div>
              <DialogTitle>New Event or Assessment</DialogTitle>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center p-0.5 bg-[var(--bg-subdued)] rounded-full text-xs">
              <button
                type="button"
                onClick={() => setTab("manual")}
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all",
                  tab === "manual" ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs" : "text-[var(--text-secondary)]"
                )}
              >
                Form
              </button>
              <button
                type="button"
                onClick={() => setTab("paste")}
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all flex items-center gap-1",
                  tab === "paste" ? "bg-[var(--bg-surface)] text-[var(--primary)] shadow-xs font-semibold" : "text-[var(--text-secondary)]"
                )}
              >
                <Sparkles className="h-3 w-3 text-[var(--primary)]" />
                <span>Paste Notice</span>
              </button>
            </div>
          </div>
          <DialogDescription>
            Schedule upcoming exams, project milestones, or deadlines with reverse runway planning.
          </DialogDescription>
        </DialogHeader>

        {/* TAB 1: PASTE WHATSAPP / PROFESSOR NOTICE */}
        {tab === "paste" ? (
          <div className="flex flex-col gap-3 py-2 animate-in fade-in duration-150">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-[var(--text-secondary)]">
              Paste raw text from WhatsApp, email, or campus portal (e.g. &ldquo;The FT-IV exam is rescheduled to 02/11/2026&rdquo;). We&apos;ll auto-extract course, date, and time.
            </div>

            <textarea
              value={pastedNotice}
              onChange={(e) => setPastedNotice(e.target.value)}
              placeholder="Paste announcement here..."
              rows={5}
              className="w-full p-3 rounded-xl bg-[var(--bg-subdued)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] border border-[var(--border-subtle)]/50 focus:bg-[var(--bg-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 leading-relaxed"
            />

            <Button
              type="button"
              onClick={handleApplyParsedNotice}
              disabled={!pastedNotice.trim()}
              className="rounded-full gap-1.5 text-xs font-semibold"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Smart Extract &amp; Populate Form</span>
            </Button>
          </div>
        ) : (
          /* TAB 2: MANUAL / VERIFIED FORM */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-1">
            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                Event Title
              </label>
              <input
                type="text"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Discrete Math FT-IV Exam"
                className="w-full h-10 px-4 rounded-full bg-[var(--bg-subdued)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:bg-[var(--bg-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all border border-transparent focus:border-[var(--border-subtle)]"
              />
            </div>

            {/* Event Category Type */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: "exam", label: "Exam", color: "bg-[var(--exam)]" },
                  { id: "assignment", label: "Assign", color: "bg-[var(--assignment)]" },
                  { id: "project", label: "Project", color: "bg-[var(--project)]" },
                  { id: "personal", label: "Study", color: "bg-[var(--personal)]" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setType(item.id as "exam" | "assignment" | "project" | "personal")
                    }
                    className={`py-2 px-1 rounded-xl text-xs font-medium border text-center transition-all flex flex-col items-center gap-1 ${
                      type === item.id
                        ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-semibold shadow-xs"
                        : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-subdued)]"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-full bg-[var(--bg-subdued)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                  Time Window
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full h-10 px-2 rounded-full bg-[var(--bg-subdued)] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                  <span className="text-xs text-[var(--text-secondary)]">–</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full h-10 px-2 rounded-full bg-[var(--bg-subdued)] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                Location / Room
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. CLS1020"
                className="w-full h-10 px-4 rounded-full bg-[var(--bg-subdued)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>

            {/* Auto Reverse Deadline Runway Checkbox */}
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-subdued)]/60 border border-[var(--border-subtle)]/40 text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={generateRunway}
                onChange={(e) => setGenerateRunway(e.target.checked)}
                className="rounded accent-[var(--primary)] h-4 w-4"
              />
              <div className="flex-1">
                <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1">
                  <Compass className="h-3.5 w-3.5 text-[var(--primary)]" />
                  <span>Generate Reverse Deadline Runway</span>
                </span>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  Creates staged T-5, T-3, T-1 milestone tasks to prevent cramming.
                </p>
              </div>
            </label>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="subtle"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim()}>
                <Plus className="h-4 w-4" />
                <span>Save Event &amp; Runway</span>
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
