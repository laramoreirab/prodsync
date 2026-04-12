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

export function CustomPieChart({ data, config, title, dataKey = "value" }) {
  if (!data?.length) return null;

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
              <Cell
                key={entry.name}
                fill={config[entry.name]?.color}
              />
            ))}
          </Pie>
        </RechartsPieChart>
      </ChartContainer>
    </div>
  );
}