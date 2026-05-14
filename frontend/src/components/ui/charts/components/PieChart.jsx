"use client";

import { Cell, Pie, PieChart as RechartsPieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { getChartSize } from "./chartSizes";

export function CustomPieChart({
  data,
  config,
  title,
  dataKey = "value",
  children,
  chartSize = "compact",
  chartClassName,
  showLabels = true,
  compact = false,
}) {
  if (!data?.length) return null;

  return (
    <div className="flex w-full min-w-0 flex-col items-center justify-center">
      {title && <h3 className="text-sm font-medium mb-3 self-start">{title}</h3>}

      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
        <ChartContainer config={config} className={getChartSize(chartSize, chartClassName)}>
          <RechartsPieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="82%"
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
              label={!compact && showLabels ? ({ name, value }) => `${name}: ${value}` : false}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={config[entry.name]?.color || "var(--chart-fallback)"}
                />
              ))}
            </Pie>
          </RechartsPieChart>
        </ChartContainer>

        {children && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
