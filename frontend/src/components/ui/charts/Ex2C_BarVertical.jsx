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
// EXEMPLO 2C — BAR CHART VERTICAL SIMPLES (Motivos de Parada)
// ============================================================
// Quando usar: comparação direta de poucos itens com label no eixo X.

const motivosParadaData = [
  { motivo: "Manutenção", ocorr: 45 },
  { motivo: "Falta Material", ocorr: 32 },
  { motivo: "Limpeza", ocorr: 28 },
];

const motivosParadaConfig = {
  ocorr: { label: "Ocorrências", color: "hsl(var(--chart-1))" },
};

export function Ex2C_BarVertical() {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Motivos de Parada Frequentes</h3>
      <ChartContainer config={motivosParadaConfig} className="h-[200px] w-full">
        <BarChart data={motivosParadaData} margin={{ top: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="motivo" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <YAxis hide />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="ocorr" fill="var(--color-ocorr)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}