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
import { Badge } from "@/components/ui/badge";
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
    <section className="bg-[var(--bg-surface)] rounded-[20px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[var(--border-subtle)]/40 transition-all flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]/40">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] ring-4 ring-[var(--primary)]/15" />
          <div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--text-primary)]">
              {viewAll ? "All Active Tasks" : "Top Priorities for Today"}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {stats.top3Remaining} remaining • {stats.completed} completed today
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewAll(!viewAll)}
            className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subdued)] px-3 py-1 rounded-full transition-colors"
          >
            {viewAll ? "Show Top 3 Only" : `View All (${tasks.length})`}
          </button>

          <span className="text-xs font-semibold text-[var(--primary)] bg-[var(--primary-fixed)] px-2.5 py-0.5 rounded-full">
            {stats.percentage}% done
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
                  {/* Circular Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    aria-label={`Mark "${task.title}" as ${isDone ? "incomplete" : "complete"}`}
                    className={cn(
                      "mt-0.5 w-[22px] h-[22px] rounded-full flex items-center justify-center transition-all shrink-0 active:scale-90 cursor-pointer",
                      isDone
                        ? "bg-[var(--primary)] text-white shadow-xs ring-1 ring-[var(--primary)]"
                        : "bg-[var(--bg-subdued)] hover:bg-[var(--bg-high)] text-transparent hover:text-[var(--text-secondary)]/40 border border-[var(--border-subtle)]"
                    )}
                  >
                    <Check
                      className={cn(
                        "h-3.5 w-3.5 transition-transform stroke-[2.5]",
                        isDone ? "scale-100" : "scale-75 opacity-0 group-hover:opacity-100"
                      )}
                    />
                  </button>

                  {/* Task Title & Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          "text-[14px] sm:text-[15px] font-medium leading-snug transition-all",
                          isDone
                            ? "line-through text-[var(--text-secondary)] opacity-60"
                            : "text-[var(--text-primary)]"
                        )}
                      >
                        {task.title}
                      </span>

                      <Badge
                        variant={task.category}
                        className="text-[10px] px-2 py-0.2 capitalize shrink-0 font-medium"
                      >
                        {task.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[var(--text-secondary)]">
                      {task.category === "project" ? (
                        <GitBranch className="h-3 w-3 shrink-0 opacity-70" />
                      ) : (
                        <Clock className="h-3 w-3 shrink-0 opacity-70" />
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
                      "p-1.5 rounded-full hover:bg-[var(--bg-high)] transition-colors",
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
                    className="p-1.5 rounded-full text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
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
        <form onSubmit={handleInlineAdd} className="mt-2 flex flex-col gap-2 pt-2 border-t border-[var(--border-subtle)]/40">
          <div className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What needs focus today? (e.g. Solve Discrete Math assignment problem 4)"
              className="flex-1 h-9 px-3.5 rounded-full bg-[var(--bg-subdued)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all border border-transparent focus:border-[var(--border-subtle)]"
            />
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="px-3.5 h-9 rounded-full bg-[var(--primary)] text-white text-xs font-semibold shadow-xs disabled:opacity-40"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowInput(false)}
              className="px-3 h-9 rounded-full text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-subdued)]"
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
                  "px-2 py-0.5 rounded-full text-[10px] font-medium capitalize transition-all",
                  newCategory === cat
                    ? "bg-[var(--primary)] text-white font-semibold"
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
