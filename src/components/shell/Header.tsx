"use client";

import * as React from "react";
import { Search, Bell } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockProfile } from "@/lib/mock-data";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] md:left-56">
      <div className="h-14 max-w-[1180px] mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex items-center gap-3 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-tertiary)] pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search tasks, courses, notes"
              className="w-full h-8 pl-8 pr-3 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] text-[13px] transition-colors focus:bg-[var(--bg-surface)] focus:outline-none focus:border-[var(--text-secondary)]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Notifications"
            className="relative p-1.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subdued)] transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--exam)]" />
          </button>

          <ThemeToggle />

          <div className="mx-1 h-4 w-px bg-[var(--border-subtle)]" />

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[13px] text-[var(--text-secondary)]">
              {mockProfile.fullName}
            </span>
            <Avatar className="h-7 w-7 border border-[var(--border-subtle)]">
              <AvatarImage src={mockProfile.avatarUrl} alt={mockProfile.fullName} />
              <AvatarFallback className="bg-[var(--bg-subdued)] text-[10px] font-medium text-[var(--text-secondary)]">
                RM
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
