"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Calendar,
  Grid3X3,
  History,
  BarChart3,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onQuickAddOpen?: () => void;
}

export function Sidebar({ onQuickAddOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
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
      title: "Calendar",
      href: "/calendar",
      icon: Calendar,
      isActive: pathname.startsWith("/calendar"),
    },
  ];

  const projectItems = [
    {
      title: "Final-year project",
      href: "/projects/final-year-project",
      colorClass: "bg-[var(--primary)]",
      isActive: pathname === "/projects/final-year-project",
    },
    {
      title: "Portfolio website",
      href: "/projects/portfolio-website",
      colorClass: "bg-[var(--secondary)]",
      isActive: pathname === "/projects/portfolio-website",
    },
  ];

  const bottomNavItems = [
    {
      title: "History",
      href: "/history",
      icon: History,
      isActive: pathname.startsWith("/history"),
    },
    {
      title: "Insights",
      href: "/insights",
      icon: BarChart3,
      isActive: pathname.startsWith("/insights"),
    },
  ];

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-60 z-50 flex-col justify-between frosted-glass border-r border-[var(--border-subtle)]/40 px-4 py-5 md:flex">
      <div className="flex flex-col gap-6">
        {/* Brand / Logo */}
        <Link
          href="/today"
          className="flex items-center gap-2.5 px-1 py-0.5 group transition-transform active:scale-[0.98]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-[0_2px_8px_rgba(94,92,230,0.3)] transition-transform group-hover:scale-105">
            <CheckCircle2 className="h-[18px] w-[18px]" />
          </div>
          <span className="text-[22px] font-semibold tracking-tight text-[var(--text-primary)]">
            Plan
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-150",
                  item.isActive
                    ? "bg-[var(--primary)] text-white shadow-[0_2px_8px_rgba(94,92,230,0.25)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-high)] hover:text-[var(--text-primary)]"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}

          {/* Projects Submenu */}
          <div className="pt-3 pb-1 px-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              Projects
            </span>
          </div>

          <div className="flex flex-col gap-1 pl-1">
            {projectItems.map((proj) => (
              <Link
                key={proj.href}
                href={proj.href}
                prefetch={true}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150",
                  proj.isActive
                    ? "bg-[var(--primary)] text-white shadow-[0_2px_8px_rgba(94,92,230,0.25)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-high)] hover:text-[var(--text-primary)]"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    proj.isActive ? "bg-white" : proj.colorClass
                  )}
                />
                <span className="truncate">{proj.title}</span>
              </Link>
            ))}
          </div>

          <div className="pt-2" />

          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-150",
                  item.isActive
                    ? "bg-[var(--primary)] text-white shadow-[0_2px_8px_rgba(94,92,230,0.25)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-high)] hover:text-[var(--text-primary)]"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Quick Add Pill Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={onQuickAddOpen}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-full bg-[var(--primary)] text-white text-sm font-medium shadow-[0_4px_16px_rgba(94,92,230,0.25)] hover:opacity-95 active:scale-[0.97] transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Quick add</span>
        </button>
      </div>
    </aside>
  );
}
