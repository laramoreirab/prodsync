"use client";

import { useState } from "react";

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    Line,
    LineChart,
    Pie,
    PieChart,
    RadialBar,
    RadialBarChart,
    ReferenceLine,
    XAxis,
    YAxis,
  } from "recharts";
  
  import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart";

  // ============================================================
// EXEMPLO 2B — PIE CHART (Status das Máquinas)
// ============================================================
// Quando usar: proporção entre partes de um todo (não use com muitas fatias).

const statusMaquinasData = [
  { name: "Produzindo", value: 75 },
  { name: "Paradas", value: 10 },
  { name: "Setup", value: 15 },
];

const statusMaquinasConfig = {
  Produzindo: { label: "Produzindo", color: "hsl(var(--chart-1))" },
  Paradas: { label: "Paradas", color: "hsl(var(--chart-2))" },
  Setup: { label: "Setup", color: "hsl(var(--chart-3))" },
};

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