// src/components/ui/charts/BarHorizontal.jsx
"use client";

import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts";
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
export function BarHorizontal({
  data,
  config,
  title,
  yKey = "setor",
  yAxisWidth = 90,
  chartSize = "default",
  heightClassName,
  paddingTopClassName = "pt-16",
  showValueLabels = false,
  colorKey,
}) {
  if (!data?.length) return null;

  const dataKey = Object.keys(config)[0]; // pega a primeira chave do config
  const gradientId = `barGradient-${dataKey}`; // ID único para o gradiente baseado na chave
  const xDomain = showValueLabels
    ? [
        0,
        (dataMax) => {
          if (!Number.isFinite(dataMax) || dataMax <= 0) return 1;
          return dataMax * 1.12;
        },
      ]
    : undefined;

  return (
    <div className="relative">
      {title && (
        <div className="absolute top-0 left-0 z-10 text-left">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
        </div>
      )}
      <ChartContainer config={config} className={`${heightClassName || "h-[200px]"} w-full ${paddingTopClassName}`}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: showValueLabels ? 24 : 0 }}>
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
            width={yAxisWidth}
            tick={{ fontSize: 12 }}
          />
          <XAxis type="number" hide domain={xDomain} />
          <ChartTooltip content={<ChartTooltipContent />} />
          
          {/* Aplicação do gradiente no fill */}
          <Bar
            dataKey={dataKey}
            fill={colorKey ? undefined : `url(#${gradientId})`}
            radius={[0, 4, 4, 0]}
          >
            {colorKey && data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry[colorKey] || `var(--color-${dataKey})`}
              />
            ))}

            {showValueLabels && (
              <LabelList
                dataKey={dataKey}
                position="right"
                className="fill-gray-700 text-xs font-semibold"
              />
            )}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
