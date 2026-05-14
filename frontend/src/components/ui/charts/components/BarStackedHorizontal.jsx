"use client";

import {
    Bar,
    BarChart,
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
//  BAR CHART STACKED HORIZONTAL (Defeitos por Setor)
// ============================================================
// stackId="a" agrupa as barras em pilha.



export function BarStackedHorizontal({ data, config, title }) {
  return (
    <div>
      {title && <h3 className="text-sm font-medium mb-3">{title}</h3>}
      <ChartContainer config={config} className="h-[220px] w-full">
        <BarChart data={data} layout="vertical">
          <YAxis
            dataKey="setor"
            type="category"
            tickLine={false}
            axisLine={false}
            width={90}
            tick={{ fontSize: 12 }}
          />
          <XAxis
            type="number"
            tickFormatter={(v) => `${v}%`}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {/* Mesmo stackId = mesma pilha. Ordem define qual fica na base. */}
          <Bar dataKey="produzidas" stackId="stack1" fill="var(--color-produzidas)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="defeito" stackId="stack1" fill="var(--color-defeito)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}