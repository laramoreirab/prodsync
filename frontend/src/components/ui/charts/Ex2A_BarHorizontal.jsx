"use client";

import { useState } from "react";

import {
    Bar,
    BarChart,
    XAxis,
    YAxis,
  } from "recharts";
  
  import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart";

// ============================================================
// BAR CHART HORIZONTAL
// ============================================================
// layout="vertical" inverte os eixos => barra fica horizontal.



export function Ex2A_BarHorizontal() {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Produção por Setor</h3>
      <ChartContainer config={producaoSetorConfig} className="h-[200px] w-full">
        <BarChart data={producaoSetorData} layout="vertical" margin={{ left: 10 }}>
          <YAxis
            dataKey="setor"
            type="category"
            tickLine={false}
            axisLine={false}
            width={90}
            tick={{ fontSize: 12 }}
          />
          <XAxis type="number" hide />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="qtd" fill="var(--color-qtd)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}