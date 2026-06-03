"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Table({
  className,
  ...props
}) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-[#1d2d49] dark:bg-[#07101f]"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm sm:text-base", className)}
        {...props} />
    </div>
  );
}

function TableHeader({
  className,
  ...props
}) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b bg-gray-50/90 sticky top-0 z-[1] dark:bg-[#101b31]", className)}
      {...props} />
  );
}

function TableBody({
  className,
  ...props
}) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0 bg-white [&_tr:nth-child(even)]:bg-gray-50/35 dark:bg-[#07101f] dark:[&_tr:nth-child(even)]:bg-[#0f1a2d]", className)}
      {...props} />
  );
}

function TableFooter({
  className,
  ...props
}) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t font-medium [&>tr]:last:border-b-0", className)}
      {...props} />
  );
}

function TableRow({
  className,
  children,
  ...props
}) {
  const cleanChildren = React.Children.toArray(children).filter(
    (child) => !(typeof child === "string" && child.trim() === "")
  );

  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-gray-100 transition-colors hover:bg-[#f8fbff] has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted dark:border-[#1d2d49] dark:hover:bg-[#17253f] dark:has-aria-expanded:bg-[#17253f] dark:data-[state=selected]:bg-[#17345f]",
        className
      )}
      {...props}>
      {cleanChildren}
    </tr>
  );
}

function TableHead({
  className,
  ...props
}) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-11 p-3 sm:p-4 text-left align-middle font-semibold whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props} />
  );
}

function TableCell({
  className,
  ...props
}) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "py-2.5 sm:py-3 px-3 sm:px-4 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props} />
  );
}

function TableCaption({
  className,
  ...props
}) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props} />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
