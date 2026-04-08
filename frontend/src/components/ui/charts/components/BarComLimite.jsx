"use client";

import { useState } from "react";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ReferenceLine,
    XAxis,
    YAxis,
  } from "recharts";
  
  import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart";

// ============================================================
//  BAR COM LINHA DE REFERÊNCIA (Sobrecarga de Máquina)
// ============================================================


export function Ex4B_BarComLimite() {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Indicador de Sobrecarga por Setor</h3>
      <ChartContainer config={sobrecargaConfig} className="h-[220px] w-full">
        <BarChart data={sobrecargaData} margin={{ top: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="setor" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="carga" fill="var(--color-carga)" radius={[4, 4, 0, 0]} />
          <ReferenceLine
            y={60}
            stroke="red"
            strokeDasharray="4 4"
            label={{
              value: "Limite: 60%",
              position: "insideTopRight",
              fontSize: 11,
              fill: "red",
            }}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
