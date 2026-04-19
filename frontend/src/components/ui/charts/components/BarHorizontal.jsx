// src/components/ui/charts/BarHorizontal.jsx
//Componente burro/visual, só recebe os dados e o config formatados e monta o gráfico. Ele é genérico, pode ser usado para qualquer gráfico de barras horizontal, desde que os dados estejam no formato esperado e o config tenha a chave correta.
"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// ============================================================
// BAR CHART HORIZONTAL
// ============================================================
// layout="vertical" inverte os eixos => barra fica horizontal.

// Componente genérico 
export function BarHorizontal({ data, config, title }) {
  if (!data?.length) return null;

  const dataKey = Object.keys(config)[0]; // pega a primeira chave do config

  return (
    <div>
      {title && <h3 className="text-sm font-medium mb-3">{title}</h3>}
      <ChartContainer config={config} className="h-[200px] w-full">
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
          <Bar dataKey={dataKey} fill={`var(--color-${dataKey})`} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}