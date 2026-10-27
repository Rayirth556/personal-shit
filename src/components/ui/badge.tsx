import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Badges are labels, not candy. Small caps, hairline, no fill — the category
// colour lives in the dot that accompanies them.
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-[3px] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] transition-colors",
  {
    variants: {
      variant: {
        default:
          "text-[var(--text-secondary)]",
        subtle:
          "bg-[var(--bg-subdued)] text-[var(--text-secondary)]",
        outline:
          "border border-[var(--border-subtle)] text-[var(--text-secondary)]",
        exam:
          "text-[var(--exam-text)] bg-[var(--exam-tint)]",
        assignment:
          "text-[var(--assignment-text)] bg-[var(--assignment-tint)]",
        project:
          "text-[var(--project-text)] bg-[var(--project-tint)]",
        personal:
          "text-[var(--personal-text)] bg-[var(--personal-tint)]",
        high:
          "text-[var(--exam-text)] bg-[var(--exam-tint)]",
        medium:
          "text-[var(--project-text)] bg-[var(--project-tint)]",
        low:
          "text-[var(--text-secondary)] bg-[var(--bg-subdued)]",
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
