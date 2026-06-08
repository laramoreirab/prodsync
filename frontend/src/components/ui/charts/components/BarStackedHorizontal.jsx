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




export function BarStackedHorizontal({ data, config, title, xKey = "setor" }) {
  return (
    <div className="relative">
      {title && (
        <div className="absolute top-0 left-0 z-10 text-left">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
        </div>
      )}
      <ChartContainer config={config} className="h-[220px] w-full pt-10">
        <BarChart data={data} layout="vertical">
          <YAxis
            dataKey={xKey}
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
          <Bar dataKey="produzidas" stackId="stack1" fill={config.produzidas?.color || "var(--chart1)"} radius={[0, 0, 0, 0]} />
          <Bar dataKey="defeito" stackId="stack1" fill={config.defeito?.color || "var(--chart2)"} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
