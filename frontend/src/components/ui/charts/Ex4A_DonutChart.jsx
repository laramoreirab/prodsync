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
// EXEMPLO 4A — DONUT CHART (Quantidade de Usuários)
// ============================================================
// Quando usar: proporção com buraco no meio (innerRadius).

const usuariosData = [
  { perfil: "Operadores", qtd: 91.7 },
  { perfil: "Gestores", qtd: 8.3 },
];

const usuariosConfig = {
  Operadores: { label: "Operadores", color: "hsl(var(--chart-1))" },
  Gestores: { label: "Gestores", color: "hsl(var(--chart-2))" },
};

export function Ex4A_DonutChart() {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Quantidade de Usuários</h3>
      <ChartContainer config={usuariosConfig} className="h-[180px] w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={usuariosData}
            dataKey="qtd"
            nameKey="perfil"
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            label={({ perfil, qtd }) => `${perfil} ${qtd}%`}
          >
            {usuariosData.map((entry) => (
              <Cell key={entry.perfil} fill={`var(--color-${entry.perfil})`} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
