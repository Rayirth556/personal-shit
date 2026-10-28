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
import { Plus } from "lucide-react";
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

function localIso(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const CATEGORIES = [
  { id: "exam", label: "Exam", token: "--exam" },
  { id: "assignment", label: "Assignment", token: "--assignment" },
  { id: "project", label: "Project", token: "--project" },
  { id: "personal", label: "Study", token: "--personal" },
] as const;

const FIELD =
  "w-full h-9 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2.5 text-[12.5px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-colors focus:border-[var(--text-secondary)] focus:outline-none";

const LABEL =
  "mb-1 block font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]";

export function NewEventModal({ open, onOpenChange, onAddEvent }: NewEventModalProps) {
  const { addTask } = useTasks();
  const [tab, setTab] = React.useState<"manual" | "paste">("manual");
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState<"exam" | "assignment" | "project" | "personal">("exam");
  const [date, setDate] = React.useState(() => localIso());
  const [startTime, setStartTime] = React.useState("10:00");
  const [endTime, setEndTime] = React.useState("12:30");
  const [location, setLocation] = React.useState("");
  const [generateRunway, setGenerateRunway] = React.useState(true);
  const [pastedNotice, setPastedNotice] = React.useState("");

  const parseNotice = (text: string) => {
    let detectedTitle = "";
    let detectedType: "exam" | "assignment" | "project" | "personal" = "exam";
    let detectedDate = localIso();
    let detectedLocation = "";

    const lower = text.toLowerCase();

    if (lower.includes("fla") || lower.includes("formal language") || lower.includes("automata")) {
      detectedTitle = "Formal Language & Automata — Chart Prep & Viva";
      detectedType = "project";
      detectedLocation = "CLS1020";
    } else if (lower.includes("discrete") || lower.includes("ft-iv") || lower.includes("ft4")) {
      detectedTitle = "Discrete Mathematics — FT-IV Exam (Unit 4 & 5)";
      detectedType = "exam";
      detectedLocation = "CLS1020";
    } else if (lower.includes("llt") || lower.includes("linux")) {
      detectedTitle = "Linux & Container Technologies — LLT Exam";
      detectedType = "exam";
      detectedLocation = "LH204";
    } else if (lower.includes("big data")) {
      detectedTitle = "Big Data Essentials — Project Review";
      detectedType = "assignment";
      detectedLocation = "CLS1020";
    } else if (lower.includes("network")) {
      detectedTitle = "Computer Networks — Assessment";
      detectedType = "assignment";
      detectedLocation = "CLS1020";
    } else {
      detectedTitle = text.slice(0, 45).replace(/\[.*?\]/g, "").trim() || "Deadline";
    }

    const ddmmyyyyMatch = text.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
    if (ddmmyyyyMatch) {
      const day = ddmmyyyyMatch[1].padStart(2, "0");
      const month = ddmmyyyyMatch[2].padStart(2, "0");
      const year = ddmmyyyyMatch[3];
      detectedDate = `${year}-${month}-${day}`;
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

      if (milestones.length > 0) {
        const step1 = milestones[0];
        addTask({
          title: step1.title,
          category: type,
          priority: "high",
          status: "todo",
          isTopPriorityToday: true,
          dueLabel: `Prep · deadline ${date}`,
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <div className="flex items-baseline justify-between gap-3">
            <DialogTitle>New event</DialogTitle>

            <div className="flex items-center gap-3">
              {(["manual", "paste"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-[0.06em] transition-colors",
                    tab === t
                      ? "text-[var(--text-primary)] underline decoration-1 underline-offset-4"
                      : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                  )}
                >
                  {t === "manual" ? "Form" : "Paste"}
                </button>
              ))}
            </div>
          </div>
          <DialogDescription>Exam, assignment, or project milestone.</DialogDescription>
        </DialogHeader>

        {tab === "paste" ? (
          <div className="flex flex-col gap-3 py-1">
            <p className="rounded-[var(--radius-sm)] border border-[var(--border-subtle)] px-3 py-2 text-[11px] leading-relaxed text-[var(--text-secondary)]">
              Paste the notice text — WhatsApp, email, or portal — and it will fill the form.
            </p>

            <textarea
              value={pastedNotice}
              onChange={(e) => setPastedNotice(e.target.value)}
              placeholder="Paste announcement here…"
              rows={5}
              className={cn(FIELD, "h-auto resize-none py-2 leading-relaxed")}
            />

            <Button
              type="button"
              onClick={handleApplyParsedNotice}
              disabled={!pastedNotice.trim()}
              className="text-[11px] font-medium"
            >
              Parse notice
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-1 flex flex-col gap-4">
            <div>
              <label className={LABEL}>Title</label>
              <input
                type="text"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Discrete Math FT-IV Exam"
                className={FIELD}
              />
            </div>

            <div>
              <label className={LABEL}>Category</label>
              <div className="grid grid-cols-4 gap-1.5">
                {CATEGORIES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-[var(--radius-sm)] border py-1.5 text-[10px] transition-colors",
                      type === item.id
                        ? "border-[var(--text-primary)] text-[var(--text-primary)]"
                        : "border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                    )}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: `var(${item.token})` }}
                    />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={FIELD}
                />
              </div>
              <div>
                <label className={LABEL}>Time</label>
                <div className="flex items-center gap-1">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={FIELD}
                  />
                  <span className="text-[var(--text-tertiary)]">–</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={FIELD}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={LABEL}>Room</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. CLS1020"
                className={FIELD}
              />
            </div>

            <label className="flex items-center gap-2.5 py-1 text-[11px] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={generateRunway}
                onChange={(e) => setGenerateRunway(e.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--text-primary)]"
              />
              <span className="text-[var(--text-secondary)]">
                Generate a reverse runway for this deadline
              </span>
            </label>

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim()}>
                <Plus className="h-3.5 w-3.5" />
                <span>Save</span>
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
