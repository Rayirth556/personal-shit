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
import { SlidersHorizontal, Check } from "lucide-react";

interface ViewOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  density: "comfortable" | "compact";
  setDensity: (density: "comfortable" | "compact") => void;
  showCompleted: boolean;
  setShowCompleted: (show: boolean) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

export function ViewOptionsModal({
  open,
  onOpenChange,
  density,
  setDensity,
  showCompleted,
  setShowCompleted,
  selectedCategories,
  setSelectedCategories,
}: ViewOptionsModalProps) {
  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary-fixed)] text-[var(--primary)]">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <DialogTitle>View Options</DialogTitle>
          </div>
          <DialogDescription>
            Customize display density, filters, and priority behaviors.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Display Density */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Display Density
            </label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                onClick={() => setDensity("comfortable")}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                  density === "comfortable"
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                    : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-subdued)]"
                }`}
              >
                Comfortable (16px)
              </button>
              <button
                type="button"
                onClick={() => setDensity("compact")}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                  density === "compact"
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                    : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-subdued)]"
                }`}
              >
                Compact (8px)
              </button>
            </div>
          </div>

          {/* Show Completed Tasks */}
          <div className="flex items-center justify-between py-2 border-y border-[var(--border-subtle)]/60">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Show Completed Priorities
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Keep finished items in today&apos;s checklist
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCompleted(!showCompleted)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                showCompleted ? "bg-[var(--primary)]" : "bg-[var(--bg-high)]"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  showCompleted ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Filter Categories */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Category Visibility
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { id: "exam", label: "Exams", color: "bg-[var(--exam)]" },
                { id: "assignment", label: "Assignments", color: "bg-[var(--assignment)]" },
                { id: "project", label: "Projects", color: "bg-[var(--project)]" },
                { id: "personal", label: "Personal / Study", color: "bg-[var(--personal)]" },
              ].map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? "border-[var(--primary)]/40 bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm"
                        : "border-[var(--border-subtle)] text-[var(--text-secondary)] opacity-50"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                    <span>{cat.label}</span>
                    {isSelected && <Check className="h-3 w-3 text-[var(--primary)] ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={() => onOpenChange(false)} size="sm">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
