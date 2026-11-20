import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "gold" | "outline" | "success" | "danger";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-emerald-100 text-emerald-800 border-emerald-200",
    secondary: "bg-slate-100 text-slate-800 border-slate-200",
    gold: "bg-amber-100 text-amber-900 border-amber-300 font-semibold",
    outline: "border border-slate-300 text-slate-700 bg-transparent",
    success: "bg-green-100 text-green-800 border-green-300",
    danger: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
