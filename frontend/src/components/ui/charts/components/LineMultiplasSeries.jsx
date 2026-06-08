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

export function LineMultiplasSeries({ data, config, title }) {
  if (!data?.length) return null;

  const dataKey = Object.keys(config)[0]; // pega a primeira chave do config

  return (
    <div className="relative">
      {title && (
        <div className="absolute top-0 left-0 z-10 text-left">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
        </div>
      )}
      <ChartContainer config={config} className="h-[200px] w-full pt-10">
        <LineChart data={data}>
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
