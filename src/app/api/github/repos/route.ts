import { NextResponse } from "next/server";

export interface GitHubRepoCommit {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  forks: number;
  language: string | null;
  languageColor: string;
  defaultBranch: string;
  pushedAt: string;
  timeAgo: string;
  latestCommit?: {
    message: string;
    sha: string;
    author: string;
    date: string;
  };
}

interface GitHubApiRawRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  default_branch: string;
  pushed_at: string;
  owner: {
    login: string;
  };
}

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Rust: "#DEA584",
  "C++": "#F34B7D",
  C: "#555555",
  Java: "#B07219",
  Go: "#00ADD8",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Shell: "#89E051",
};

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

let memoryCache: { timestamp: number; username: string; data: unknown } | null = null;
const CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes cache

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "Rayirth556";

  if (
    memoryCache &&
    memoryCache.username === username &&
    Date.now() - memoryCache.timestamp < CACHE_TTL_MS
  ) {
    return NextResponse.json(memoryCache.data);
  }

  try {
    const headers: Record<string, string> = {
      "User-Agent": "PlanStudentPlanner/1.0",
      Accept: "application/vnd.github.v3+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&direction=desc&per_page=6`,
      {
        headers,
        signal: AbortSignal.timeout(8000),
      }
    );

    // No fixtures. If GitHub says no, the UI says no.
    if (!res.ok) {
      return NextResponse.json({
        username,
        source: "unavailable",
        reason:
          res.status === 403 || res.status === 429
            ? "GitHub API rate limit reached. Add a GITHUB_TOKEN to raise it."
            : `GitHub API returned ${res.status}.`,
        repositories: [],
      });
    }

    const reposData = await res.json();
    if (!Array.isArray(reposData)) {
      return NextResponse.json({
        username,
        source: "unavailable",
        reason: "Unexpected GitHub response.",
        repositories: [],
      });
    }

    const enhancedRepos: GitHubRepoCommit[] = await Promise.all(
      reposData.slice(0, 5).map(async (repo: GitHubApiRawRepo) => {
        let latestCommit: GitHubRepoCommit["latestCommit"] = undefined;

        try {
          const commitRes = await fetch(
            `https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?per_page=1`,
            { headers, next: { revalidate: 60 } }
          );
          if (commitRes.ok) {
            const commitData = await commitRes.json();
            if (Array.isArray(commitData) && commitData.length > 0) {
              const c = commitData[0];
              latestCommit = {
                message: c.commit.message.split("\n")[0],
                sha: c.sha.substring(0, 7),
                author: c.commit.author?.name || c.author?.login || username,
                date: c.commit.author?.date || repo.pushed_at,
              };
            }
          }
        } catch {
          // Commit enrichment is optional; leaving it undefined hides the row
          // rather than inventing a commit that never happened.
          latestCommit = undefined;
        }

        const lang = repo.language || "TypeScript";
        return {
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          htmlUrl: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          languageColor: LANGUAGE_COLORS[lang] || "#5E5CE6",
          defaultBranch: repo.default_branch || "main",
          pushedAt: repo.pushed_at,
          timeAgo: formatTimeAgo(repo.pushed_at),
          latestCommit,
        };
      })
    );

    const responsePayload = {
      username,
      source: "github_api",
      repositories: enhancedRepos,
    };

    memoryCache = {
      timestamp: Date.now(),
      username,
      data: responsePayload,
    };

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return NextResponse.json({
      username,
      source: "unavailable",
      reason: "Could not reach GitHub.",
      repositories: [],
    });
  }
}
