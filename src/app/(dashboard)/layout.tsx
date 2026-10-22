"use client";

import * as React from "react";
import { Sidebar } from "@/components/shell/Sidebar";
import { Header } from "@/components/shell/Header";
import { MobileTabBar } from "@/components/shell/MobileTabBar";
import { QuickAddModal } from "@/components/shell/QuickAddModal";
import { useTasks } from "@/lib/task-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [quickAddOpen, setQuickAddOpen] = React.useState(false);
  const { addTask } = useTasks();

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Desktop Frosted Sidebar wrapped in Suspense */}
      <React.Suspense fallback={<aside className="fixed left-0 top-0 hidden h-screen w-60 z-50 md:flex" />}>
        <Sidebar onQuickAddOpen={() => setQuickAddOpen(true)} />
      </React.Suspense>

      {/* Top Frosted Header */}
      <Header />

      {/* Main Content Area */}
      <div className="pl-0 md:pl-60 min-h-screen flex flex-col pt-16 pb-20 md:pb-8">
        <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 py-6">
          <React.Suspense fallback={<div className="p-8 text-center text-xs text-[var(--text-secondary)]">Loading...</div>}>
            {children}
          </React.Suspense>
        </main>
      </div>

      {/* Mobile Floating Bottom Bar wrapped in Suspense */}
      <React.Suspense fallback={null}>
        <MobileTabBar onQuickAddOpen={() => setQuickAddOpen(true)} />
      </React.Suspense>

      {/* Quick Add Modal */}
      <QuickAddModal
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
        onAddTask={(task) => {
          addTask({
            title: task.title,
            category: task.category,
            priority: "high",
            status: "todo",
            isTopPriorityToday: true,
            dueLabel: task.dueDate ? `due ${task.dueDate}` : "Scheduled for today",
          });
        }}
      />
    </div>
  );
}
