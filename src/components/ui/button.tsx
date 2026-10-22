"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-white hover:opacity-95 shadow-[0_4px_16px_rgba(94,92,230,0.25)]",
        secondary:
          "bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-subdued)] border border-[var(--border-subtle)] shadow-[0_1px_3px_rgba(0,0,0,0.03)]",
        glass:
          "bg-[var(--bg-glass)] text-[var(--text-primary)] backdrop-blur-xl border border-[var(--border-glass)] hover:bg-[var(--bg-high)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
        ghost:
          "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subdued)]",
        subtle:
          "bg-[var(--bg-high)] text-[var(--text-primary)] hover:bg-[var(--bg-highest)]",
        outline:
          "border border-[var(--border-subtle)] bg-transparent hover:bg-[var(--bg-subdued)] text-[var(--text-primary)]",
      },
      size: {
        default: "h-9 px-4 py-2 rounded-full",
        sm: "h-7 px-3 text-xs rounded-full",
        lg: "h-11 px-6 rounded-full font-semibold",
        icon: "h-9 w-9 rounded-full",
        "icon-sm": "h-7 w-7 rounded-full",
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
