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
    <nav className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
      <div className="frosted-glass rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[var(--border-subtle)]/50 px-2 py-1.5 flex items-center justify-around">
        {items.map((item, index) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key={index}
                type="button"
                onClick={item.onClick}
                aria-label="Quick Add Task"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-[0_2px_10px_rgba(94,92,230,0.35)] active:scale-95 transition-transform"
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
                "flex flex-col items-center justify-center py-1 px-2 rounded-full text-[10px] font-medium transition-colors",
                item.isActive
                  ? "text-[var(--primary)] font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="mt-0.5">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
