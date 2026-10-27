"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  GitCommit,
  GitBranch,
  Star,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { GitHubRepoCommit } from "@/app/api/github/repos/route";
import { cn } from "@/lib/utils";

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

interface GitHubProjectsCardProps {
  initialUsername?: string;
}

export function GitHubProjectsCard({
  initialUsername = "Rayirth556",
}: GitHubProjectsCardProps) {
  const [username, setUsername] = React.useState(initialUsername);
  const [isEditingUsername, setIsEditingUsername] = React.useState(false);
  const [inputVal, setInputVal] = React.useState(initialUsername);

  const {
    data,
    isLoading: loading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["github-repos", username],
    queryFn: async () => {
      const res = await fetch(
        `/api/github/repos?username=${encodeURIComponent(username)}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch repositories");
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });

  const repos: GitHubRepoCommit[] = data?.repositories || [];

  const handleRefresh = () => {
    refetch();
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setUsername(inputVal.trim());
    setIsEditingUsername(false);
  };

  return (
    <section className="bg-[var(--bg-surface)] rounded-[var(--radius-card)] p-5 shadow-none border border-[var(--border-subtle)] flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)]">
        <div className="flex items-baseline gap-2 min-w-0">
          <h3 className="text-[15px] font-medium text-[var(--text-primary)]">
            Repositories
          </h3>
              {isEditingUsername ? (
                <form onSubmit={handleUsernameSubmit} className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    autoFocus
                    placeholder="GitHub username"
                    className="h-6 px-2 rounded-md bg-[var(--bg-subdued)] text-xs font-mono text-[var(--text-primary)] border border-[var(--primary)] outline-none"
                  />
                  <button
                    type="submit"
                    className="text-[10px] bg-[var(--primary)] text-[var(--on-primary)] px-2 py-0.5 rounded-md font-semibold"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <div className="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsEditingUsername(true)}
                    title="Click to change GitHub username"
                    className="text-xs font-mono text-[var(--primary)] hover:underline flex items-center gap-0.5"
                  >
                    @{username}
                  </button>
                  <a
                    href={`https://github.com/${encodeURIComponent(username)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open @${username} on GitHub`}
                    className="text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || isFetching}
          aria-label="Refresh GitHub commits"
          className="p-1 text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", (loading || isFetching) && "animate-spin")} />
        </button>
      </div>

      {/* Repositories List */}
      <div className="flex flex-col divide-y divide-[var(--border-subtle)]">
        {loading && repos.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-[11px] text-[var(--text-tertiary)]">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span>Fetching repositories…</span>
          </div>
        ) : repos.length === 0 ? (
          <div className="py-6 px-2 text-center text-xs text-[var(--text-secondary)] flex flex-col items-center gap-2">
            <span>
              {data?.source === "unavailable"
                ? (data?.reason ?? "GitHub is unreachable right now.")
                : `No public repositories found for @${username}.`}
            </span>
            {data?.source === "unavailable" && (
              <button
                type="button"
                onClick={handleRefresh}
                className="text-[11px] font-semibold text-[var(--primary)] hover:underline"
              >
                Try again
              </button>
            )}
          </div>
        ) : (
          repos.slice(0, 4).map((repo) => (
            <div
              key={repo.id}
              className="group flex flex-col gap-1 py-2.5 transition-colors hover:bg-[var(--bg-subdued)]/50"
            >
              {/* Repo name + last push */}
              <div className="flex items-baseline justify-between gap-2">
                <a
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 truncate font-mono text-[12px] text-[var(--text-primary)] transition-colors hover:text-[var(--secondary)]"
                >
                  <span className="truncate">{repo.name}</span>
                  <ExternalLink className="h-2.5 w-2.5 shrink-0 text-[var(--text-tertiary)] opacity-0 transition-opacity group-hover:opacity-100" />
                </a>

                <span className="tnum shrink-0 font-mono text-[10px] text-[var(--text-tertiary)]">
                  {repo.timeAgo}
                </span>
              </div>

              {/* Last commit */}
              {repo.latestCommit && (
                <div className="flex items-start gap-1.5">
                  <GitCommit className="mt-[3px] h-3 w-3 shrink-0 text-[var(--text-tertiary)]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] leading-relaxed text-[var(--text-secondary)]">
                      {repo.latestCommit.message}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[9.5px] text-[var(--text-tertiary)]">
                      <span>{repo.latestCommit.sha}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <GitBranch className="h-2 w-2" />
                        {repo.defaultBranch}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Language + stars */}
              <div className="flex items-center justify-between pt-0.5 text-[10px] text-[var(--text-tertiary)]">
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: repo.languageColor }}
                  />
                  <span className="font-mono uppercase tracking-[0.06em]">
                    {repo.language || "Code"}
                  </span>
                </div>

                {repo.stars > 0 && (
                  <div className="flex items-center gap-1 font-mono">
                    <Star className="h-2.5 w-2.5" />
                    <span className="tnum">{repo.stars}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer link to view all on GitHub */}
      <a
        href={`https://github.com/${encodeURIComponent(username)}?tab=repositories`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-center text-xs font-medium text-[var(--primary)] hover:underline flex items-center justify-center gap-1 pt-1 border-t border-[var(--border-subtle)]"
      >
        <span>View all repositories on GitHub</span>
        <ExternalLink className="h-3 w-3" />
      </a>
    </section>
  );
}
