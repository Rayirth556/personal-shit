"use client";

import * as React from "react";
import { Task, mockTop3Tasks } from "@/lib/mock-data";

export interface TaskStoreContextType {
  tasks: Task[];
  top3Tasks: Task[];
  addTask: (task: Omit<Task, "id"> & { id?: string }) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  toggleTopPriority: (id: string) => void;
  setTop3Priorities: (taskIds: string[]) => void;
  reorderTasks: (reorderedTasks: Task[]) => void;
  stats: {
    total: number;
    completed: number;
    remaining: number;
    percentage: number;
    top3Remaining: number;
  };
}

const TaskContext = React.createContext<TaskStoreContextType | null>(null);

const STORAGE_KEY = "plan_app_tasks_v3";

const initialDefaultTasks: Task[] = [
  {
    id: "task-fla-chart",
    title: "FLA: Draft chart outline & state diagrams",
    category: "project",
    priority: "high",
    status: "todo",
    isTopPriorityToday: true,
    dueLabel: "due Tue, 27 Oct • Team Chart Presentation & Viva",
    subtitle: "Prepare transition chart with team before presentation in class",
  },
  {
    id: "task-bde-review",
    title: "Big Data: Check pipeline & milestone demo",
    category: "assignment",
    priority: "high",
    status: "todo",
    isTopPriorityToday: true,
    dueLabel: "due Wed, 28 Oct • In-Class Project Review",
    subtitle: "Verify MapReduce / PySpark scripts and review presentation",
  },
  {
    id: "task-dm-unit4",
    title: "Discrete Math: Practice Unit 4 recurrence relations",
    category: "exam",
    priority: "high",
    status: "todo",
    isTopPriorityToday: true,
    dueLabel: "due Mon, 02 Nov • FT-IV Exam (Units 4 & 5)",
    subtitle: "Solve 5 generating function & homogeneous recurrence problems",
  },
  {
    id: "task-lct-llt",
    title: "Linux & Containers: Practice namespace veth pairs for LLT",
    category: "exam",
    priority: "medium",
    status: "todo",
    isTopPriorityToday: false,
    dueLabel: "due Tue, 03 Nov • LLT Examination",
    subtitle: "Hands-on Docker networking & namespace isolation experiments",
  },
  {
    id: "task-cn-lab",
    title: "Computer Networks: Review socket programming & Wireshark",
    category: "assignment",
    priority: "medium",
    status: "done",
    isTopPriorityToday: false,
    dueLabel: "Lab 4 Completed • TCP/IP handshake capture",
  },
];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = React.useState<Task[]>(initialDefaultTasks);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load from localStorage safely on client mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load tasks from localStorage:", e);
    }
    setIsLoaded(true);
  }, []);

  // Sync with localStorage only after client-side load is confirmed
  React.useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn("Failed to save tasks to localStorage:", e);
    }
  }, [tasks, isLoaded]);

  const addTask = React.useCallback(
    (newTaskData: Omit<Task, "id"> & { id?: string }) => {
      const newTask: Task = {
        ...newTaskData,
        id: newTaskData.id || `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        status: newTaskData.status || "todo",
        priority: newTaskData.priority || "medium",
        category: newTaskData.category || "assignment",
      };

      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    },
    []
  );

  const updateTask = React.useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
    );
  }, []);

  const deleteTask = React.useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTask = React.useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isDone = t.status === "done";
          const newStatus = isDone ? "todo" : "done";
          return {
            ...t,
            status: newStatus,
            completedAt: !isDone ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  }, []);

  const toggleTopPriority = React.useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return { ...t, isTopPriorityToday: !t.isTopPriorityToday };
        }
        return t;
      })
    );
  }, []);

  const setTop3Priorities = React.useCallback((taskIds: string[]) => {
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        isTopPriorityToday: taskIds.includes(t.id),
      }))
    );
  }, []);

  const reorderTasks = React.useCallback((reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
  }, []);

  // Compute Top 3 and stats
  const top3Tasks = React.useMemo(() => {
    const designated = tasks.filter((t) => t.isTopPriorityToday);
    if (designated.length > 0) return designated.slice(0, 3);
    return tasks.slice(0, 3);
  }, [tasks]);

  const stats = React.useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "done").length;
    const remaining = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const top3Remaining = top3Tasks.filter((t) => t.status !== "done").length;

    return {
      total,
      completed,
      remaining,
      percentage,
      top3Remaining,
    };
  }, [tasks, top3Tasks]);

  const value = React.useMemo(
    () => ({
      tasks,
      top3Tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      toggleTopPriority,
      setTop3Priorities,
      reorderTasks,
      stats,
    }),
    [
      tasks,
      top3Tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      toggleTopPriority,
      setTop3Priorities,
      reorderTasks,
      stats,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = React.useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
