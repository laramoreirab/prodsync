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
// BÔNUS — AREA CHART (variação do LineChart com área preenchida)
// ============================================================
// Quando usar: enfatizar volume/magnitude ao longo do tempo.

const areaData = [
  { dia: "Seg", refugo: 200 },
  { dia: "Ter", refugo: 350 },
  { dia: "Qua", refugo: 420 },
  { dia: "Qui", refugo: 380 },
  { dia: "Sex", refugo: 550 },
  { dia: "Sab", refugo: 480 },
  { dia: "Dom", refugo: 420 },
];

const areaConfig = {
  refugo: { label: "Refugo", color: "hsl(var(--chart-1))" },
};

export function Bonus_AreaChart() {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Tendência de Refugo</h3>
      <ChartContainer config={areaConfig} className="h-[200px] w-full">
        <AreaChart data={areaData}>
          <defs>
            <linearGradient id="gradRefugo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-refugo)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-refugo)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="dia" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="refugo"
            stroke="var(--color-refugo)"
            strokeWidth={2}
            fill="url(#gradRefugo)"
            fillOpacity={1}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
