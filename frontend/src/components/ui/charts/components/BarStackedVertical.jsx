"use client";

import { useState } from "react";

import {
    Bar,
    BarChart,
    LabelList,
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
//  BAR CHART STACKED VERTICAL COM % (Status por Turno)
// ============================================================
// LabelList dentro de Bar mostra o valor dentro da barra.

const statusTurnoData = [
  { turno: "Manhã", ativas: 80, paradas: 12, manutencao: 8 },
  { turno: "Tarde", ativas: 72, paradas: 18, manutencao: 10 },
  { turno: "Noite", ativas: 65, paradas: 20, manutencao: 15 },
];

const statusTurnoConfig = {
  ativas: { label: "Ativas", color: "hsl(var(--chart-1))" },
  paradas: { label: "Paradas", color: "hsl(var(--chart-2))" },
  manutencao: { label: "Em Manutenção", color: "hsl(var(--chart-3))" },
};

export function Ex3B_BarStackedVertical() {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Status das Máquinas por Turno</h3>
      <ChartContainer config={statusTurnoConfig} className="h-[250px] w-full">
        <BarChart data={statusTurnoData} margin={{ top: 10 }}>
          <XAxis dataKey="turno" tickLine={false} axisLine={false} />
          <YAxis tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="ativas" stackId="turno" fill="var(--color-ativas)">
            <LabelList
              dataKey="ativas"
              position="center"
              formatter={(v) => `${v}%`}
              style={{ fill: "white", fontSize: 11, fontWeight: 600 }}
            />
          </Bar>
          <Bar dataKey="paradas" stackId="turno" fill="var(--color-paradas)">
            <LabelList
              dataKey="paradas"
              position="center"
              formatter={(v) => `${v}%`}
              style={{ fill: "white", fontSize: 11, fontWeight: 600 }}
            />
          </Bar>
          <Bar dataKey="manutencao" stackId="turno" fill="var(--color-manutencao)" radius={[4, 4, 0, 0]}>
            <LabelList
              dataKey="manutencao"
              position="center"
              formatter={(v) => `${v}%`}
              style={{ fill: "white", fontSize: 11, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

