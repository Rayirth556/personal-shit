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
    <header className="fixed top-0 left-0 right-0 md:left-60 h-16 z-40 frosted-glass border-b border-[var(--border-subtle)]/30 transition-all">
      <div className="h-16 max-w-[1240px] mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)] pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search agenda, notes, courses..."
              className="w-full h-9 pl-9 pr-4 rounded-full bg-[var(--bg-high)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] text-sm transition-all focus:bg-[var(--bg-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
        </div>

        {/* Action Controls & Avatar */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-high)] transition-colors relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--exam)]" />
          </button>

          <ThemeToggle />

          <Avatar className="h-8 w-8 ring-2 ring-[var(--bg-surface)] shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
            <AvatarImage src={mockProfile.avatarUrl} alt={mockProfile.fullName} />
            <AvatarFallback className="bg-[var(--primary-fixed)] text-[11px] font-semibold text-[var(--on-primary-fixed)]">
              RM
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
