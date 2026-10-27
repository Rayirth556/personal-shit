export default function DashboardLoading() {
  return (
    <div className="flex flex-col w-full gap-7 animate-in fade-in duration-150">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 rounded-[var(--radius-md)] bg-[var(--bg-subdued)]" />
          <div className="h-8 w-64 rounded-xl bg-[var(--bg-subdued)]" />
          <div className="h-3.5 w-48 rounded-[var(--radius-md)] bg-[var(--bg-subdued)]/70" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 rounded-[var(--radius-md)] bg-[var(--bg-subdued)]" />
          <div className="h-8 w-24 rounded-[var(--radius-md)] bg-[var(--bg-subdued)]" />
        </div>
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="h-56 rounded-[var(--radius-card)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 flex flex-col gap-4">
            <div className="h-5 w-40 rounded-[var(--radius-md)] bg-[var(--bg-subdued)]" />
            <div className="h-4 w-full rounded-lg bg-[var(--bg-subdued)]/60" />
            <div className="h-4 w-3/4 rounded-lg bg-[var(--bg-subdued)]/60" />
            <div className="h-10 w-full rounded-xl bg-[var(--bg-subdued)]/40 mt-auto" />
          </div>

          <div className="h-72 rounded-[var(--radius-card)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 flex flex-col gap-4">
            <div className="h-5 w-48 rounded-[var(--radius-md)] bg-[var(--bg-subdued)]" />
            <div className="flex flex-col gap-2.5 mt-2">
              <div className="h-12 w-full rounded-xl bg-[var(--bg-subdued)]/60" />
              <div className="h-12 w-full rounded-xl bg-[var(--bg-subdued)]/60" />
              <div className="h-12 w-full rounded-xl bg-[var(--bg-subdued)]/60" />
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div className="h-48 rounded-[var(--radius-card)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5 flex flex-col gap-3">
            <div className="h-4 w-28 rounded-[var(--radius-md)] bg-[var(--bg-subdued)]" />
            <div className="h-28 rounded-xl bg-[var(--bg-subdued)]/50" />
          </div>

          <div className="h-48 rounded-[var(--radius-card)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-5 flex flex-col gap-3">
            <div className="h-4 w-32 rounded-[var(--radius-md)] bg-[var(--bg-subdued)]" />
            <div className="h-28 rounded-xl bg-[var(--bg-subdued)]/50" />
          </div>
        </aside>
      </div>
    </div>
  );
}
