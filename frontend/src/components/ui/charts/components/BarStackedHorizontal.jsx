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


function CategoryTick({ x = 0, y = 0, payload }) {
  const label = String(payload?.value ?? "");

  return (
    <g transform={`translate(${x},${y})`}>
      <title>{label}</title>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="end"
        className="fill-muted-foreground text-[12px] font-medium"
      >
        {label}
      </text>
    </g>
  );
}


export function BarStackedHorizontal({
  data,
  config,
  title,
  xKey = "setor",
  limit = 5,
  heightClassName = "h-[320px]",
  yAxisWidth = 170,
  barSize = 22,
}) {
  const chartData = Array.isArray(data)
    ? data.slice(0, limit)
    : [];

  return (
    <div className="relative">
      {title && (
        <div className="absolute top-0 left-0 z-10 text-left">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
        </div>
      )}
      <ChartContainer config={config} className={`${heightClassName} aspect-auto w-full pt-3`}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 16, right: 28, bottom: 12, left: 8 }}
          barCategoryGap={12}
        >
          <YAxis
            dataKey={xKey}
            type="category"
            tickLine={false}
            axisLine={false}
            interval={0}
            width={yAxisWidth}
            tick={<CategoryTick />}
          />
          <XAxis
            type="number"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(v) => `${v}%`}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="produzidas" stackId="stack1" barSize={barSize} fill={config.produzidas?.color || "var(--chart1)"} radius={[0, 0, 0, 0]} />
          <Bar dataKey="defeito" stackId="stack1" barSize={barSize} fill={config.defeito?.color || "var(--chart2)"} radius={[0, 5, 5, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
