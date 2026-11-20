import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "gold";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    // Base styles with smooth tactile elevation and active feedback
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg cursor-pointer select-none touch-manipulation active:scale-[0.98]";

    // Variant styles with realistic colors and ambient light glow without coordinate movement on hover
    const variantStyles = {
      primary:
        "bg-emerald-700 text-white border border-emerald-600/40 shadow-xs hover:bg-emerald-600 hover:border-emerald-500 hover:shadow-[0_4px_16px_rgba(21,128,61,0.35)] active:bg-emerald-800 focus-visible:ring-emerald-700",
      gold:
        "bg-amber-500 text-slate-950 font-bold border border-amber-400/60 shadow-xs hover:bg-amber-400 hover:border-amber-300 hover:shadow-[0_4px_16px_rgba(245,158,11,0.4)] active:bg-amber-600 focus-visible:ring-amber-500",
      secondary:
        "bg-slate-100 text-slate-900 border border-slate-200 shadow-xs hover:bg-slate-200/90 hover:border-slate-300 active:bg-slate-300 focus-visible:ring-slate-400",
      outline:
        "border border-slate-300 bg-white text-slate-700 hover:bg-emerald-50/70 hover:text-emerald-800 hover:border-emerald-600 active:bg-emerald-100 focus-visible:ring-emerald-700",
      ghost:
        "text-slate-700 hover:bg-slate-100 hover:text-slate-950 active:bg-slate-200 focus-visible:ring-slate-400",
      destructive:
        "bg-red-600 text-white border border-red-500/50 shadow-xs hover:bg-red-500 hover:shadow-[0_4px_16px_rgba(220,38,38,0.35)] active:bg-red-700 focus-visible:ring-red-600",
    };

    const sizeStyles = {
      sm: "h-9 px-3 text-xs gap-1.5",
      md: "h-10 px-4 py-2 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
