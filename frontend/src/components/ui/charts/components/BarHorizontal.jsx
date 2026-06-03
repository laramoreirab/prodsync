// src/components/ui/charts/BarHorizontal.jsx
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
export function BarHorizontal({ data, config, title, yKey = "setor", chartSize = "default", heightClassName }) {
  if (!data?.length) return null;

  const dataKey = Object.keys(config)[0]; // pega a primeira chave do config
  const gradientId = `barGradient-${dataKey}`; // ID único para o gradiente baseado na chave

  return (
    <div>
      {title && <h3 className="text-sm font-medium mb-3">{title}</h3>}
      <ChartContainer config={config} className="h-[200px] w-full">
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          {/* Definição do Gradiente SVG */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={`var(--color-${dataKey})`} stopOpacity={0.4} />
              <stop offset="100%" stopColor={`var(--color-${dataKey})`} stopOpacity={1} />
            </linearGradient>
          </defs>

          <YAxis
            dataKey={yKey}
            type="category"
            tickLine={false}
            axisLine={false}
            width={90}
            tick={{ fontSize: 12 }}
          />
          <XAxis type="number" hide />
          <ChartTooltip content={<ChartTooltipContent />} />
          
          {/* Aplicação do gradiente no fill */}
          <Bar 
            dataKey={dataKey} 
            fill={`url(#${gradientId})`} 
            radius={[0, 4, 4, 0]} 
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}