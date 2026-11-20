import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 - 100
  barColor?: string;
}

export function Progress({ value, className, barColor = "bg-emerald-600", ...props }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn("relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100", className)}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-300 ease-in-out", barColor)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
