"use client";

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

import { barHorizontalConfig } from "../config/barHorizontalConfig"; // <= import da config
import { useBarHorizontal } from "../hooks/useBarHorizontal";     // <= import do hook

// ============================================================
// BAR CHART HORIZONTAL
// ============================================================
// layout="vertical" inverte os eixos => barra fica horizontal.

export function BarHorizontal() {
  const { data, loading, error } = useBarHorizontal();
 
  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar dados.</p>;
 
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Produção por Setor</h3>
      <ChartContainer config={barHorizontalConfig} className="h-[200px] w-full">
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
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