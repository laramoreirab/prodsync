"use client";

import { useState } from "react";

import {
    Bar,
    BarChart,
    Cell,
    LabelList,
    XAxis,
    YAxis,
  } from "recharts";
  
  import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart";

// ============================================================
//  BAR COM VALOR NO TOPO + CORES MISTAS (Produção média)
// ============================================================

const producaoMediaData = [
  { setor: "Engrenagens", media: 56 },
  { setor: "Turbinas", media: 48 },
  { setor: "Válvulas", media: 35 },
  { setor: "Compressores", media: 29 },
];

const CORES_BARRA = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

const producaoMediaConfig = {
  media: { label: "Média/dia", color: "hsl(var(--chart-1))" },
};

export function Ex4C_BarComValorETopo() {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Produção Média de Usuário por Dia</h3>
      <ChartContainer config={producaoMediaConfig} className="h-[220px] w-full">
        <BarChart data={producaoMediaData} margin={{ top: 20 }}>
          <XAxis dataKey="setor" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="media" radius={[4, 4, 0, 0]}>
            <LabelList
              dataKey="media"
              position="top"
              style={{ fontSize: 12, fontWeight: 700 }}
            />
            {producaoMediaData.map((_, index) => (
              <Cell key={index} fill={CORES_BARRA[index % CORES_BARRA.length]} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
