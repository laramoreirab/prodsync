"use client";

import { useState } from "react";

import {
    Cell,
    Pie,
    PieChart,
  } from "recharts";
  
  import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart";

// ============================================================
// DONUT CHART 
// ============================================================


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
