"use client";

import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const baseIconClass =
  "absolute h-5 w-5 transition-all duration-300 ease-out motion-reduce:transition-none";

export function PlusChevronToggleIcon({ open, className }) {
  const isControlled = typeof open === "boolean";

  return (
    <span
      className={cn(
        "relative inline-flex h-5 w-5 shrink-0 items-center justify-center",
        className
      )}
      aria-hidden="true"
    >
      <Plus
        strokeWidth={2.5}
        className={cn(
          baseIconClass,
          isControlled
            ? open
              ? "rotate-90 scale-75 opacity-0"
              : "rotate-0 scale-100 opacity-100"
            : "rotate-0 scale-100 opacity-100 [[data-state=open]_&]:rotate-90 [[data-state=open]_&]:scale-75 [[data-state=open]_&]:opacity-0"
        )}
      />

      <ChevronDown
        strokeWidth={2.5}
        className={cn(
          baseIconClass,
          isControlled
            ? open
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-75 opacity-0"
            : "-rotate-90 scale-75 opacity-0 [[data-state=open]_&]:rotate-0 [[data-state=open]_&]:scale-100 [[data-state=open]_&]:opacity-100"
        )}
      />
    </span>
  );
}
