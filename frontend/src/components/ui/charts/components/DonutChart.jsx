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


export function DonutChart({ data, config, title, dataKey, nameKey }) {
  if (!data?.length) return null;
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Quantidade de Usuários</h3>
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
            outerRadius={70}label={({ [nameKey]: name, [dataKey]: value }) => `${name} ${value}%`}
            
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
