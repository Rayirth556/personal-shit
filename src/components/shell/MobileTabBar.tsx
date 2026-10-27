"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Grid3X3,
  Calendar,
  FolderGit2,
  History,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileTabBarProps {
  onQuickAddOpen?: () => void;
}

export function MobileTabBar({ onQuickAddOpen }: MobileTabBarProps) {
  const pathname = usePathname();

  const items = [
    {
      title: "Today",
      href: "/today",
      icon: CalendarDays,
      isActive: pathname === "/" || pathname === "/today",
    },
    {
      title: "Timetable",
      href: "/timetable",
      icon: Grid3X3,
      isActive: pathname.startsWith("/timetable"),
    },
    {
      title: "Add",
      href: "#",
      icon: Plus,
      isAction: true,
      onClick: onQuickAddOpen,
    },
    {
      title: "Calendar",
      href: "/calendar",
      icon: Calendar,
      isActive: pathname.startsWith("/calendar"),
    },
    {
      title: "Projects",
      href: "/projects/final-year-project",
      icon: FolderGit2,
      isActive: pathname.startsWith("/projects"),
    },
    {
      title: "History",
      href: "/history",
      icon: History,
      isActive: pathname.startsWith("/history"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] md:hidden">
      <div className="flex items-stretch justify-around px-2">
        {items.map((item, index) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key={index}
                type="button"
                onClick={item.onClick}
                aria-label="Quick add task"
                className="my-1.5 flex h-9 w-9 items-center justify-center self-center rounded-[var(--radius-sm)] bg-[var(--primary)] text-[var(--on-primary)] transition-colors hover:bg-[var(--primary-hover)]"
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 font-mono text-[9px] uppercase tracking-[0.06em] transition-colors",
                item.isActive
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-tertiary)]"
              )}
            >
              <Icon className={cn("h-4 w-4", item.isActive && "stroke-[2.25]")} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
