"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-focus)] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary-hover)]",
        secondary:
          "bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-subdued)] border border-[var(--border-subtle)]",
        glass:
          "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-subdued)]",
        ghost:
          "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subdued)]",
        subtle:
          "bg-[var(--bg-subdued)] text-[var(--text-primary)] hover:bg-[var(--bg-high)]",
        outline:
          "border border-[var(--border-subtle)] bg-transparent hover:bg-[var(--bg-subdued)] text-[var(--text-primary)]",
      },
      size: {
        default: "h-9 px-3.5 py-2 rounded-[var(--radius-md)]",
        sm: "h-7 px-2.5 text-xs rounded-[var(--radius-sm)]",
        lg: "h-10 px-5 text-sm rounded-[var(--radius-md)] font-semibold",
        icon: "h-9 w-9 rounded-[var(--radius-md)]",
        "icon-sm": "h-7 w-7 rounded-[var(--radius-sm)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
