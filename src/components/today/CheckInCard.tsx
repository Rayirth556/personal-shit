"use client";

import * as React from "react";
import { Flame, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckInCardProps {
  onReflect?: (reflection: string) => void;
}

export function CheckInCard({ onReflect }: CheckInCardProps) {
  const [reflection, setReflection] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflection.trim()) return;

    onReflect?.(reflection.trim());
    setIsSubmitted(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsSubmitted(false);
      setReflection("");
    }, 4000);
  };

  return (
    <section className="bg-[var(--bg-surface)] rounded-[20px] p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[var(--border-subtle)]/40 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
          <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
            End-of-day check-in
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] bg-[var(--bg-subdued)] px-3 py-1 rounded-full">
          <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
          <span className="font-semibold text-[var(--text-primary)]">5-day streak</span>
        </div>
      </div>

      <p className="text-xs text-[var(--text-secondary)] mb-4">
        Take a calm moment to capture your progress, hurdles, and takeaways.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            disabled={isSubmitted}
            placeholder="What did you get done today? (e.g. Mastered Chomsky Normal Form, closed 2 PRs...)"
            rows={3}
            className="w-full bg-[var(--bg-subdued)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] p-3.5 rounded-xl text-sm transition-all focus:outline-none focus:bg-[var(--bg-surface)] focus:ring-2 focus:ring-[var(--primary)]/20 resize-none border border-transparent focus:border-[var(--border-subtle)]"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <Lock className="h-3.5 w-3.5" />
            <span>Private to your student journal</span>
          </div>

          <Button
            type="submit"
            disabled={!reflection.trim() || isSubmitted}
            size="sm"
            className="rounded-full px-4 text-xs font-medium"
          >
            {isSubmitted ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                <span>Saved to Journal</span>
              </>
            ) : (
              <>
                <span>Reflect</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}
