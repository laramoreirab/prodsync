"use client";

import {
    Cell,
    Pie,
    PieChart as RechartsPieChart,
  } from "recharts";
  
  import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart";

// ============================================================
// PIE CHART 
// ============================================================

export function CustomPieChart({ data, config, title }) {
    if (!data?.length) return null;

  const dataKey = Object.keys(config)[0]; // pega a primeira chave do config
  return (
    <div>
      {title && <h3 className="text-sm font-medium mb-3">{title}</h3>}
      <ChartContainer config={config} className="h-[200px] w-full">
        <RechartsPieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, value }) => `${name} ${value}%`}
            labelLine={true}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={`var(--color-${entry.name})`} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ChartContainer>
    </div>
  );
}