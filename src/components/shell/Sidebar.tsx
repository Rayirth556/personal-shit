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
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onQuickAddOpen?: () => void;
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      className={cn(
        "group flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2 py-1.5 text-[13px] transition-colors duration-100",
        active
          ? "bg-[var(--bg-subdued)] font-medium text-[var(--text-primary)]"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-subdued)]/60 hover:text-[var(--text-primary)]"
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "h-3.5 w-3.5 shrink-0",
            active ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"
          )}
        />
      )}
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function Sidebar({ onQuickAddOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { title: "Today", href: "/today", icon: CalendarDays },
    { title: "Timetable", href: "/timetable", icon: Grid3X3 },
    { title: "Calendar", href: "/calendar", icon: Calendar },
  ];

  const projectItems = [
    { title: "Final-year project", href: "/projects/final-year-project" },
    { title: "Portfolio website", href: "/projects/portfolio-website" },
  ];

  const bottomNavItems = [
    { title: "History", href: "/history", icon: History },
    { title: "Insights", href: "/insights", icon: BarChart3 },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-56 flex-col justify-between border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-4 md:flex">
      <div className="flex flex-col gap-5">
        {/* Wordmark */}
        <Link href="/today" className="flex items-baseline gap-2 px-2 pt-1">
          <span className="display text-[26px] leading-none text-[var(--text-primary)]">
            Plan
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            sem 5
          </span>
        </Link>

        <nav className="flex flex-col gap-0.5">
          <span className="px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            Workspace
          </span>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.title}
              icon={item.icon}
              active={isActive(item.href)}
            />
          ))}

          <span className="px-2 pb-1 pt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            Projects
          </span>
          {projectItems.map((proj) => (
            <NavLink
              key={proj.href}
              href={proj.href}
              label={proj.title}
              active={isActive(proj.href)}
            />
          ))}

          <div className="my-3 h-px bg-[var(--border-subtle)]" />

          {bottomNavItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.title}
              icon={item.icon}
              active={isActive(item.href)}
            />
          ))}
        </nav>
      </div>

      <button
        type="button"
        onClick={onQuickAddOpen}
        className="flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--primary)] px-3 py-2 text-[13px] font-medium text-[var(--on-primary)] transition-colors duration-100 hover:bg-[var(--primary-hover)]"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>New task</span>
      </button>
    </aside>
  );
}
