"use client";

import {
  Cell,
  Pie,
  PieChart,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// ============================================================
// DONUT CHART 
// ============================================================


export function DonutChart({ data, config, title, dataKey, nameKey, compact = false }) {
  if (!data?.length) return null;
  return (
    <div>
      {title && <h3 className="text-sm font-medium mb-3">{title}</h3>}
      <ChartContainer config={config} className="h-[180px] w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70} label={compact ? false : ({ [nameKey]: name, [dataKey]: value }) => `${name}: ${value}`}
          >
            {data.map((entry) => {
              const entryKey = entry[nameKey];
              const fillColor = config?.[entryKey]?.color ?? `var(--color-${entryKey})`;
              return <Cell key={entryKey} fill={fillColor} />;
            })}
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
