"use client";

import { cn } from "@/lib/utils";

export function DonutLegend({ items, className }) {
  if (!items?.length) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-2 text-[13px] font-medium leading-tight text-foreground",
        className
      )}
    >
      {items.map((item, index) => (
        <div
          key={item.key ?? `${item.label}-${index}`}
          className="flex min-w-0 max-w-full items-center gap-2"
        >
          <span
            className="h-3.5 w-3.5 shrink-0 rounded-[2px]"
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
          <span className="min-w-0 max-w-[12rem] break-words">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
