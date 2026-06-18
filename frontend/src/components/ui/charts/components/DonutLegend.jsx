"use client";

import { cn } from "@/lib/utils";

export function DonutLegend({ items, className, maxItems = 6 }) {
  if (!items?.length) return null;

  const visibleItems = maxItems ? items.slice(0, maxItems) : items;

  return (
    <div
      className={cn(
        "flex w-full shrink-0 flex-wrap items-center justify-center gap-x-5 gap-y-1 px-2 text-xs font-medium leading-tight text-foreground",
        className
      )}
    >
      {visibleItems.map((item, index) => (
        <div
          key={item.key ?? `${item.label}-${index}`}
          className="flex min-w-0 max-w-full items-center gap-2"
        >
          <span
            className="h-3 w-3 shrink-0 rounded-[2px]"
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
