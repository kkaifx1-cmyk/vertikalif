"use client";

import React from "react";

export function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none bg-slate-50 dark:bg-black transition-colors duration-500"
    />
  );
}
