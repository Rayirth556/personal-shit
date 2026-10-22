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
import { Calendar, Sparkles, Plus } from "lucide-react";

interface QuickAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask?: (task: {
    title: string;
    category: "exam" | "assignment" | "project" | "personal";
    dueDate?: string;
  }) => void;
}

export function QuickAddModal({
  open,
  onOpenChange,
  onAddTask,
}: QuickAddModalProps) {
  const [input, setInput] = React.useState("");
  const [category, setCategory] = React.useState<
    "exam" | "assignment" | "project" | "personal"
  >("assignment");
  const [isManualCategory, setIsManualCategory] = React.useState(false);

  // Simple smart natural language parser
  const parseInput = (text: string) => {
    let detectedCategory: "exam" | "assignment" | "project" | "personal" = category;
    let dueString = "";

    const lower = text.toLowerCase();
    if (
      lower.includes("exam") ||
      lower.includes("midterm") ||
      lower.includes("quiz") ||
      lower.includes("test") ||
      lower.includes("ft-iv") ||
      lower.includes("ft4") ||
      lower.includes("llt")
    ) {
      detectedCategory = "exam";
    } else if (
      lower.includes("assignment") ||
      lower.includes("homework") ||
      lower.includes("problem set") ||
      lower.includes("review") ||
      lower.includes("ps")
    ) {
      detectedCategory = "assignment";
    } else if (
      lower.includes("project") ||
      lower.includes("capstone") ||
      lower.includes("repo") ||
      lower.includes("chart") ||
      lower.includes("presentation") ||
      lower.includes("pr")
    ) {
      detectedCategory = "project";
    } else if (
      lower.includes("gym") ||
      lower.includes("read") ||
      lower.includes("girlfriend") ||
      lower.includes("date") ||
      lower.includes("run")
    ) {
      detectedCategory = "personal";
    }

    const dateMatch = text.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/);
    if (dateMatch) {
      dueString = `${dateMatch[1]}/${dateMatch[2]}`;
    } else if (lower.includes("friday")) dueString = "Friday";
    else if (lower.includes("saturday") || lower.includes("sat")) dueString = "Saturday";
    else if (lower.includes("tomorrow")) dueString = "Tomorrow";
    else if (lower.includes("today")) dueString = "Today";
    else if (lower.includes("wednesday") || lower.includes("wed")) dueString = "Wednesday";
    else if (lower.includes("tuesday") || lower.includes("tue")) dueString = "Tuesday";
    else if (lower.includes("27th") || lower.includes("27 oct")) dueString = "27 Oct";
    else if (lower.includes("28th") || lower.includes("28 oct")) dueString = "28 Oct";
    else if (lower.includes("nov 2") || lower.includes("02/11")) dueString = "02 Nov";
    else if (lower.includes("nov 3") || lower.includes("03/11")) dueString = "03 Nov";

    return { detectedCategory, dueString };
  };

  const parsed = parseInput(input);
  const activeCategory = isManualCategory ? category : parsed.detectedCategory;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    onAddTask?.({
      title: input.trim(),
      category: activeCategory,
      dueDate: parsed.dueString || undefined,
    });

    setInput("");
    setIsManualCategory(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary-fixed)] text-[var(--primary)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <DialogTitle>Quick Add</DialogTitle>
          </div>
          <DialogDescription>
            Type naturally with simple date hints (e.g. &ldquo;DBMS assignment friday&rdquo;).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="relative">
            <input
              type="text"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Finish Theory of Computation quiz tomorrow"
              className="w-full h-11 px-4 rounded-full bg-[var(--bg-high)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:bg-[var(--bg-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
            />
          </div>

          {/* Smart Parse Preview Chip */}
          {input.trim().length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-subdued)] text-xs text-[var(--text-secondary)]">
              <Calendar className="h-3.5 w-3.5 text-[var(--primary)]" />
              <span>
                Detected: <strong className="text-[var(--text-primary)] capitalize">{parsed.detectedCategory}</strong>
                {parsed.dueString && <span> • Due: <strong className="text-[var(--text-primary)]">{parsed.dueString}</strong></span>}
              </span>
            </div>
          )}

          {/* Category Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-[var(--text-secondary)] mr-1">Category:</span>
            {(["assignment", "exam", "project", "personal"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  setIsManualCategory(true);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "bg-[var(--bg-high)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="subtle"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!input.trim()}>
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
