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
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart";

// ============================================================
// LINE CHART COM MÚLTIPLAS SÉRIES (Rotatividade)
// ============================================================

const rotatividadeData = [
  { mes: "Abr", novos: 18, desligados: 15 },
  { mes: "Mai", novos: 20, desligados: 13 },
  { mes: "Jun", novos: 17, desligados: 16 },
  { mes: "Jul", novos: 22, desligados: 14 },
  { mes: "Ago", novos: 19, desligados: 17 },
  { mes: "Set", novos: 25, desligados: 15 },
];

const rotatividadeConfig = {
  novos: { label: "Novos", color: "hsl(var(--chart-1))" },
  desligados: { label: "Desligados", color: "hsl(var(--chart-2))" },
};

export function Ex4D_LineMultiplasSeries() {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Rotatividade de Usuários</h3>
      <ChartContainer config={rotatividadeConfig} className="h-[200px] w-full">
        <LineChart data={rotatividadeData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="mes" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            type="monotone"
            dataKey="novos"
            stroke="var(--color-novos)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="desligados"
            stroke="var(--color-desligados)"
            strokeWidth={2}
            dot={{ r: 3 }}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
