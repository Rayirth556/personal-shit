"use client";

import * as React from "react";
import {
  Check,
  Plus,
  Trash2,
  Clock,
  GitBranch,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTasks } from "@/lib/task-store";

interface Top3CardProps {
  density?: "comfortable" | "compact";
  showAll?: boolean;
  showCompleted?: boolean;
  selectedCategories?: string[];
}

export function Top3Card({
  density = "comfortable",
  showCompleted = true,
  selectedCategories = ["exam", "assignment", "project", "personal"],
}: Top3CardProps) {
  const { tasks, top3Tasks, toggleTask, deleteTask, addTask, toggleTopPriority, stats } =
    useTasks();

  const [newTitle, setNewTitle] = React.useState("");
  const [newCategory, setNewCategory] = React.useState<
    "exam" | "assignment" | "project" | "personal"
  >("assignment");
  const [showInput, setShowInput] = React.useState(false);
  const [viewAll, setViewAll] = React.useState(false);

  const baseTasks = viewAll ? tasks : top3Tasks;
  const displayedTasks = baseTasks.filter((task) => {
    if (!showCompleted && task.status === "done") return false;
    if (selectedCategories && selectedCategories.length > 0) {
      if (!selectedCategories.includes(task.category)) return false;
    }
    return true;
  });

  const handleInlineAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle.trim(),
      category: newCategory,
      priority: "high",
      status: "todo",
      isTopPriorityToday: true,
      dueLabel: "Added today",
    });

    setNewTitle("");
    setShowInput(false);
  };

  return (
    <section className="bg-[var(--bg-surface)] rounded-[var(--radius-card)] p-5 sm:p-6 shadow-none border border-[var(--border-subtle)] transition-all flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-end justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <h2 className="text-[15px] font-medium text-[var(--text-primary)]">
            {viewAll ? "All active tasks" : "Top priorities"}
          </h2>
          <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
            {stats.top3Remaining} remaining · {stats.completed} done
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setViewAll(!viewAll)}
            className="text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {viewAll ? "Top 3 only" : `All (${tasks.length})`}
          </button>

          <span className="tnum font-mono text-[11px] text-[var(--text-tertiary)]">
            {stats.percentage}%
          </span>
        </div>
      </div>

      {/* Task Rows List */}
      <div className="flex flex-col divide-y divide-[var(--border-subtle)]/30">
        {displayedTasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--text-secondary)]">
            No priority tasks for today. Add one below!
          </div>
        ) : (
          displayedTasks.map((task) => {
            const isDone = task.status === "done";

            return (
              <div
                key={task.id}
                className={cn(
                  "group flex items-start justify-between gap-3 px-1.5 rounded-xl transition-all duration-150 hover:bg-[var(--bg-subdued)]/40",
                  density === "compact" ? "py-2" : "py-3"
                )}
              >
                {/* Left check + text */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Square checkbox — a planner, not a to-do app */}
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    aria-label={`Mark "${task.title}" as ${isDone ? "incomplete" : "complete"}`}
                    className={cn(
                      "mt-[3px] flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[3px] border transition-colors cursor-pointer",
                      isDone
                        ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--on-primary)]"
                        : "border-[var(--text-tertiary)] bg-transparent text-transparent hover:border-[var(--text-primary)]"
                    )}
                  >
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </button>

                  {/* Task Title & Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span
                        className={cn(
                          "text-[14px] leading-snug transition-colors",
                          isDone
                            ? "line-through text-[var(--text-tertiary)]"
                            : "text-[var(--text-primary)]"
                        )}
                      >
                        {task.title}
                      </span>

                      <span className="inline-flex items-center gap-1 shrink-0">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: `var(--${task.category})` }}
                        />
                        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                          {task.category}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[var(--text-tertiary)]">
                      {task.category === "project" ? (
                        <GitBranch className="h-2.5 w-2.5 shrink-0" />
                      ) : (
                        <Clock className="h-2.5 w-2.5 shrink-0" />
                      )}
                      <span className="truncate">{task.dueLabel || task.subtitle}</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions: Star as Top Priority + Delete */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleTopPriority(task.id)}
                    title={task.isTopPriorityToday ? "Remove from Top 3" : "Pin to Top 3"}
                    className={cn(
                      "p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--bg-high)] transition-colors",
                      task.isTopPriorityToday ? "text-amber-500 fill-amber-500" : "text-[var(--text-secondary)]"
                    )}
                  >
                    <Star
                      className={cn(
                        "h-3.5 w-3.5",
                        task.isTopPriorityToday && "fill-amber-400 text-amber-400"
                      )}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    title="Delete task"
                    className="p-1.5 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Inline Quick Add Task Field */}
      {showInput ? (
        <form onSubmit={handleInlineAdd} className="mt-2 flex flex-col gap-2 pt-2 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What needs focus today? (e.g. Solve Discrete Math assignment problem 4)"
              className="flex-1 h-9 px-3.5 rounded-[var(--radius-md)] bg-[var(--bg-subdued)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all border border-transparent focus:border-[var(--border-subtle)]"
            />
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="px-3.5 h-9 rounded-[var(--radius-md)] bg-[var(--primary)] text-[var(--on-primary)] text-xs font-semibold shadow-xs disabled:opacity-40"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowInput(false)}
              className="px-3 h-9 rounded-[var(--radius-md)] text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-subdued)]"
            >
              Cancel
            </button>
          </div>

          <div className="flex items-center gap-1.5 pl-1">
            <span className="text-[10px] text-[var(--text-secondary)]">Category:</span>
            {(["assignment", "exam", "project", "personal"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setNewCategory(cat)}
                className={cn(
                  "px-2 py-0.5 rounded-[var(--radius-md)] text-[10px] font-medium capitalize transition-all",
                  newCategory === cat
                    ? "bg-[var(--primary)] text-[var(--on-primary)] font-semibold"
                    : "bg-[var(--bg-subdued)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowInput(true)}
          className="mt-1 w-full py-2.5 rounded-xl border border-dashed border-[var(--border-subtle)]/70 hover:border-[var(--primary)]/50 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subdued)]/50 transition-all flex items-center justify-center gap-1.5 font-medium"
        >
          <Plus className="h-3.5 w-3.5 text-[var(--primary)]" />
          <span>Add a task for today...</span>
        </button>
      )}
    </section>
  );
}
