"use client";

import { useState } from "react";

import {
    Cell,
    Pie,
    PieChart,
  } from "recharts";
  
  import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart";

// ============================================================
// PIE CHART 
// ============================================================




export function Ex2B_PieChart() {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Status das Máquinas</h3>
      <ChartContainer config={statusMaquinasConfig} className="h-[200px] w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={statusMaquinasData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, value }) => `${name} ${value}%`}
            labelLine={true}
          >
            {statusMaquinasData.map((entry) => (
              <Cell key={entry.name} fill={`var(--color-${entry.name})`} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}