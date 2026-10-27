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
    <section className="bg-[var(--bg-surface)] rounded-[20px] p-5 shadow-[var(--shadow-card)] transition-all flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]/40">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[var(--bg-subdued)] flex items-center justify-center text-[var(--text-primary)] shrink-0 shadow-xs border border-[var(--border-subtle)]/40">
            <GitHubIcon className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
                GitHub Projects
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
                    className="text-[10px] bg-[var(--primary)] text-white px-2 py-0.5 rounded-md font-semibold"
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
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-0.5 rounded hover:bg-[var(--bg-subdued)]"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Sorted by latest commits &amp; pushes
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || isFetching}
          aria-label="Refresh GitHub commits"
          className="p-1.5 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-subdued)] hover:text-[var(--text-primary)] transition-colors"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", (loading || isFetching) && "animate-spin")} />
        </button>
      </div>

      {/* Repositories List */}
      <div className="flex flex-col divide-y divide-[var(--border-subtle)]/50">
        {loading && repos.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--text-secondary)] flex flex-col items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-[var(--primary)]" />
            <span>Fetching latest repositories and commits...</span>
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
              className="py-3 flex flex-col gap-1.5 group hover:bg-[var(--bg-subdued)]/30 px-2 rounded-xl transition-colors -mx-2"
            >
              {/* Repo Name + Time Ago */}
              <div className="flex items-center justify-between gap-2">
                <a
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors flex items-center gap-1.5 truncate"
                >
                  <span className="truncate">{repo.name}</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-70 transition-opacity shrink-0" />
                </a>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-[var(--text-secondary)] bg-[var(--bg-subdued)] px-2 py-0.5 rounded-full">
                    {repo.timeAgo}
                  </span>
                </div>
              </div>

              {/* Latest Commit Message & Hash */}
              {repo.latestCommit && (
                <div className="flex items-start gap-1.5 text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-subdued)]/50 p-2 rounded-lg border border-[var(--border-subtle)]/30">
                  <GitCommit className="h-3.5 w-3.5 text-[var(--primary)] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[var(--text-primary)] font-medium truncate">
                      {repo.latestCommit.message}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-[var(--text-secondary)]">
                      <span className="font-semibold text-[var(--primary)]">
                        {repo.latestCommit.sha}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <GitBranch className="h-2.5 w-2.5" />
                        {repo.defaultBranch}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer row: Language, Stars */}
              <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: repo.languageColor }}
                  />
                  <span>{repo.language || "Code"}</span>
                </div>

                {repo.stars > 0 && (
                  <div className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{repo.stars}</span>
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
        className="text-center text-xs font-medium text-[var(--primary)] hover:underline flex items-center justify-center gap-1 pt-1 border-t border-[var(--border-subtle)]/40"
      >
        <span>View all repositories on GitHub</span>
        <ExternalLink className="h-3 w-3" />
      </a>
    </section>
  );
}
