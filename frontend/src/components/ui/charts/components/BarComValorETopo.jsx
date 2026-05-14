"use client";

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
// BAR COM VALOR NO TOPO (Vertical)
// ============================================================

export function BarComValorETopo({ data, config, title }) {
  if (!data?.length || !config) return null;


  const dataKey = Object.keys(config)[0];
  const labelKey = data[0].setor ? "setor" : Object.keys(data[0]).find(key => key !== dataKey);

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-medium mb-3">{title}</h3>}
      <ChartContainer config={config} className="h-[250px] w-full">
        <BarChart
          data={data}
          margin={{ top: 30, right: 10, left: 10, bottom: 5 }}
        >
          <XAxis
            dataKey={labelKey}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "hsl(var(--secondary-foreground))" }}
          />
          <YAxis hide />
          <ChartTooltip
            cursor={{ fill: "transparent" }}
            content={<ChartTooltipContent hideLabel />}
          />

          <Bar
            dataKey={dataKey}
            radius={[4, 4, 0, 0]}
            fill={`var(--color-${dataKey})`}
          >
            <LabelList
              dataKey={dataKey}
              position="top"
              offset={10}
              style={{ fontSize: 12, fontWeight: 600, fill: "var(--foreground)" }}
              formatter={(value) => value.toLocaleString()}
            />

            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`var(--color-${dataKey})`}
                fillOpacity={1 - (index * 0.1)} 
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}