"use client";

import { Cell, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getChartSize } from "./chartSizes";

// ============================================================
// DONUT CHART 
// ============================================================


export function DonutChart({
  data,
  config,
  title,
  dataKey,
  nameKey,
  chartSize = "donutDefault",
  heightClassName,
  compact = false,
}) {
  if (!data?.length) return null;
  return (
    <div className="w-full min-w-0">
      {title && <h3 className="text-sm font-medium mb-3">{title}</h3>}
      <ChartContainer config={config} className={`mx-auto ${getChartSize(chartSize, heightClassName)}`}>
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius="45%"
            outerRadius="78%"
            label={compact ? false : ({ [nameKey]: name, [dataKey]: value }) => `${name} ${value}%`}
          >
            {data.map((entry) => (
              <Cell key={entry[nameKey]} fill={`var(--color-${entry[nameKey]})`} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
