"use client";

import * as React from "react";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";
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
    <section className="bg-[var(--bg-surface)] rounded-[var(--radius-card)] p-5 shadow-none border border-[var(--border-subtle)]">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <h2 className="text-[15px] font-medium text-[var(--text-primary)]">
          Check-in
        </h2>
        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
          private
        </span>
      </div>

      <p className="mt-0.5 mb-3 text-[11px] text-[var(--text-secondary)]">
        What moved today, and what got in the way.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="relative">
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            disabled={isSubmitted}
            placeholder="What moved today? What blocked you?"
            rows={3}
            className="w-full resize-none rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-2.5 text-[12.5px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-colors focus:bg-[var(--bg-surface)] focus:outline-none focus:border-[var(--text-secondary)]"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10.5px] text-[var(--text-tertiary)]">
            <Lock className="h-3 w-3" />
            <span>Local only, never synced</span>
          </div>

          <Button
            type="submit"
            disabled={!reflection.trim() || isSubmitted}
            size="sm"
            className="px-3 text-[11px] font-medium"
          >
            {isSubmitted ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-[var(--on-primary)]" />
                <span>Saved</span>
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
