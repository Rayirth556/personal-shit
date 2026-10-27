"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Filter, ArrowUpDown, Calendar, CheckCircle2 } from "lucide-react";
import { Task } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface KanbanBoardProps {
  initialTasks: {
    todo: Task[];
    doing: Task[];
    done: Task[];
  };
  onAddTask?: (column: "todo" | "doing" | "done") => void;
}

function TaskCard({ task, isOverlay = false }: { task: Task; isOverlay?: boolean }) {
  const isDone = task.status === "done";

  let priorityColor = "bg-[var(--text-secondary)]";
  let priorityLabel = "Low";

  if (task.priority === "high") {
    priorityColor = "bg-[var(--exam)]";
    priorityLabel = "High Priority";
  } else if (task.priority === "medium") {
    priorityColor = "bg-[var(--secondary)]";
    priorityLabel = "Medium";
  }

  return (
    <article
      className={cn(
        "group relative p-3.5 rounded-2xl bg-[var(--bg-surface)] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all cursor-grab active:cursor-grabbing flex flex-col gap-2.5 border border-[var(--border-subtle)]",
        isOverlay && "rotate-2 scale-105 shadow-[0_12px_28px_rgba(0,0,0,0.15)] ring-2 ring-[var(--primary)]",
        isDone && "opacity-85 hover:opacity-100"
      )}
    >
      {/* Priority indicator & Due Date */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className={cn("w-2 h-2 rounded-full", priorityColor)} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            {priorityLabel}
          </span>
        </div>

        {task.dueDate && (
          <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
            {isDone ? (
              <CheckCircle2 className="h-3 w-3 text-[var(--primary)]" />
            ) : (
              <Calendar className="h-3 w-3 text-[var(--text-secondary)]" />
            )}
            <span className={cn(isDone ? "text-[10px] uppercase font-bold" : "")}>
              {task.dueDate}
            </span>
          </span>
        )}
      </div>

      {/* Title */}
      <h4
        className={cn(
          "text-sm font-semibold leading-snug",
          isDone ? "line-through text-[var(--text-secondary)]" : "text-[var(--text-primary)]"
        )}
      >
        {task.title}
      </h4>

      {/* Subtitle / Description if present */}
      {task.subtitle && !isDone && (
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
          {task.subtitle}
        </p>
      )}

      {/* Subtask Progress Bar (if present) */}
      {task.subtasksTotal && task.subtasksTotal > 0 && (
        <div className="flex flex-col gap-1 py-0.5">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            <span>Subtasks</span>
            <span className="text-[var(--text-primary)]">
              {task.subtasksCompleted} / {task.subtasksTotal} completed
            </span>
          </div>
          <div className="w-full h-1.5 rounded-[var(--radius-md)] bg-[var(--bg-subdued)] overflow-hidden">
            <div
              className="h-full bg-[var(--secondary)] rounded-[var(--radius-md)] transition-all"
              style={{
                width: `${((task.subtasksCompleted || 0) / task.subtasksTotal) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Tags and Assignee Avatar */}
      <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {task.tags?.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-[var(--radius-md)] bg-[var(--bg-subdued)] text-[10px] font-medium text-[var(--text-secondary)]"
            >
              {t}
            </span>
          ))}
        </div>

        {task.assigneeInitials && (
          <div className="w-6 h-6 rounded-[var(--radius-md)] bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)] text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
            {task.assigneeInitials}
          </div>
        )}
      </div>
    </article>
  );
}

function SortableItem({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
    </div>
  );
}

function DroppableColumn({
  id,
  children,
  className,
  "aria-label": ariaLabel,
}: {
  id: "todo" | "doing" | "done";
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <section
      ref={setNodeRef}
      aria-label={ariaLabel}
      className={cn(className, isOver && "ring-2 ring-[var(--primary)]/50 bg-[var(--bg-subdued)]/90")}
    >
      {children}
    </section>
  );
}

export function KanbanBoard({ initialTasks, onAddTask }: KanbanBoardProps) {
  const [columns, setColumns] = React.useState(initialTasks);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findColumn = (id: string): "todo" | "doing" | "done" | null => {
    if (id === "todo" || id === "doing" || id === "done") return id;
    if (columns.todo.some((t) => t.id === id)) return "todo";
    if (columns.doing.some((t) => t.id === id)) return "doing";
    if (columns.done.some((t) => t.id === id)) return "done";
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeCol = findColumn(String(active.id));
    if (activeCol) {
      const task = columns[activeCol].find((t) => t.id === active.id) || null;
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeCol = findColumn(String(active.id));
    const overCol = findColumn(String(over.id));

    if (!activeCol || !overCol) return;

    if (activeCol === overCol) {
      const oldIndex = columns[activeCol].findIndex((t) => t.id === active.id);
      const newIndex = columns[overCol].findIndex((t) => t.id === over.id);

      if (oldIndex !== newIndex && newIndex !== -1) {
        setColumns((prev) => ({
          ...prev,
          [activeCol]: arrayMove(prev[activeCol], oldIndex, newIndex),
        }));
      }
    } else {
      // Move between columns
      const task = columns[activeCol].find((t) => t.id === active.id);
      if (!task) return;

      const updatedTask: Task = {
        ...task,
        status: overCol,
      };

      const overIndex = columns[overCol].findIndex((t) => t.id === over.id);

      setColumns((prev) => {
        const nextOver = [...prev[overCol]];
        if (overIndex >= 0) {
          nextOver.splice(overIndex, 0, updatedTask);
        } else {
          nextOver.push(updatedTask);
        }

        return {
          ...prev,
          [activeCol]: prev[activeCol].filter((t) => t.id !== active.id),
          [overCol]: nextOver,
        };
      });
    }
  };

  return (
    <DndContext
      id="kanban-board-dnd"
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-4">
        {/* Board Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold tracking-[-0.015em] text-[var(--text-primary)]">
              Deliverables Board
            </h3>
            <span className="px-2.5 py-0.5 rounded-[var(--radius-md)] bg-[var(--bg-high)] text-xs font-medium text-[var(--text-secondary)]">
              Active Sprint 4
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1 rounded-[var(--radius-md)] bg-[var(--bg-surface)] hover:bg-[var(--bg-high)] text-xs font-medium text-[var(--text-secondary)] border border-[var(--border-subtle)] flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Filter</span>
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-[var(--radius-md)] bg-[var(--bg-surface)] hover:bg-[var(--bg-high)] text-xs font-medium text-[var(--text-secondary)] border border-[var(--border-subtle)] flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>Sort</span>
            </button>
          </div>
        </div>

        {/* 3-Column Kanban Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* COLUMN 1: TO DO */}
          <DroppableColumn
            id="todo"
            aria-label="To Do Tasks"
            className="flex flex-col gap-3 bg-[var(--bg-subdued)]/60 p-3.5 rounded-[var(--radius-card)] border border-[var(--border-subtle)] min-h-[400px]"
          >
            <div className="flex items-center justify-between px-1 py-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--text-secondary)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  To do
                </h4>
                <span className="px-2 py-0.2 rounded-[var(--radius-md)] bg-[var(--bg-high)] text-[11px] font-semibold text-[var(--text-secondary)]">
                  {columns.todo.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onAddTask?.("todo")}
                className="p-1 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <SortableContext items={columns.todo.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-3 flex-1">
                {columns.todo.map((task) => (
                  <SortableItem key={task.id} task={task} />
                ))}
                {columns.todo.length === 0 && (
                  <div className="flex-1 min-h-[120px] flex items-center justify-center border-2 border-dashed border-[var(--border-subtle)] rounded-xl p-4 text-xs text-[var(--text-secondary)] select-none">
                    Drop tasks here
                  </div>
                )}
              </div>
            </SortableContext>

            <button
              type="button"
              onClick={() => onAddTask?.("todo")}
              className="w-full py-2 rounded-xl bg-transparent hover:bg-[var(--bg-surface)]/80 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium transition-all flex items-center justify-center gap-1 border border-dashed border-[var(--border-subtle)]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add deliverable</span>
            </button>
          </DroppableColumn>

          {/* COLUMN 2: DOING */}
          <DroppableColumn
            id="doing"
            aria-label="In Progress Tasks"
            className="flex flex-col gap-3 bg-[var(--bg-subdued)]/60 p-3.5 rounded-[var(--radius-card)] border border-[var(--border-subtle)] min-h-[400px]"
          >
            <div className="flex items-center justify-between px-1 py-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Doing
                </h4>
                <span className="px-2 py-0.2 rounded-[var(--radius-md)] bg-[var(--primary-fixed)] text-[11px] font-semibold text-[var(--on-primary-fixed)]">
                  {columns.doing.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onAddTask?.("doing")}
                className="p-1 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <SortableContext items={columns.doing.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-3 flex-1">
                {columns.doing.map((task) => (
                  <SortableItem key={task.id} task={task} />
                ))}
                {columns.doing.length === 0 && (
                  <div className="flex-1 min-h-[120px] flex items-center justify-center border-2 border-dashed border-[var(--border-subtle)] rounded-xl p-4 text-xs text-[var(--text-secondary)] select-none">
                    Drop tasks here
                  </div>
                )}
              </div>
            </SortableContext>
          </DroppableColumn>

          {/* COLUMN 3: DONE */}
          <DroppableColumn
            id="done"
            aria-label="Completed Tasks"
            className="flex flex-col gap-3 bg-[var(--bg-subdued)]/60 p-3.5 rounded-[var(--radius-card)] border border-[var(--border-subtle)] min-h-[400px]"
          >
            <div className="flex items-center justify-between px-1 py-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--personal)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Done
                </h4>
                <span className="px-2 py-0.2 rounded-[var(--radius-md)] bg-[var(--bg-high)] text-[11px] font-semibold text-[var(--text-secondary)]">
                  {columns.done.length}
                </span>
              </div>
              <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" />
            </div>

            <SortableContext items={columns.done.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-3 flex-1">
                {columns.done.map((task) => (
                  <SortableItem key={task.id} task={task} />
                ))}
                {columns.done.length === 0 && (
                  <div className="flex-1 min-h-[120px] flex items-center justify-center border-2 border-dashed border-[var(--border-subtle)] rounded-xl p-4 text-xs text-[var(--text-secondary)] select-none">
                    Drop tasks here
                  </div>
                )}
              </div>
            </SortableContext>

            <button
              type="button"
              className="mt-1 py-1.5 text-center text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              + 5 older completed items
            </button>
          </DroppableColumn>
        </div>
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
