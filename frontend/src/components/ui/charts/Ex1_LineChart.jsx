"use client";

import { useState } from "react";

import {
    CartesianGrid,
    Line,
    LineChart,
    XAxis,
    YAxis,
  } from "recharts";
  
  import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart";

// ============================================================
// LINE CHART 
// ============================================================

export function LineChartBase({
  title,
  description,
  data,
  xKey,
  yKey,
  config,
}) {
  return (
    <div>
      <h3 className="text-sm font-medium mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
      )}

      <ChartContainer config={config} className="h-[200px] w-full">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} />
          <YAxis hide />
          <ChartTooltip content={<ChartTooltipContent />} />

          <Line
            type="monotone"
            dataKey={yKey}
            stroke={`var(--color-${yKey})`}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
