import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)]",
        subtle:
          "bg-[var(--bg-subdued)] text-[var(--text-secondary)]",
        outline:
          "border border-[var(--border-subtle)] text-[var(--text-secondary)]",
        exam:
          "bg-[var(--exam-tint)] text-[var(--exam-text)] font-semibold",
        assignment:
          "bg-[var(--assignment-tint)] text-[var(--assignment-text)] font-semibold",
        project:
          "bg-[var(--project-tint)] text-[var(--project-text)] font-semibold",
        personal:
          "bg-[var(--personal-tint)] text-[var(--personal-text)] font-semibold",
        high:
          "bg-red-500/12 text-red-600 dark:text-red-400 font-semibold",
        medium:
          "bg-blue-500/12 text-blue-600 dark:text-blue-400 font-semibold",
        low:
          "bg-zinc-500/12 text-zinc-600 dark:text-zinc-400 font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
