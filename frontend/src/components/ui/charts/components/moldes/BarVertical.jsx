"use client";

import { useState } from "react";

import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
  } from "recharts";
  
  import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart";

// ============================================================
//  BAR CHART VERTICAL SIMPLES (Motivos de Parada)
// ============================================================
// Quando usar: comparação direta de poucos itens com label no eixo X.



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