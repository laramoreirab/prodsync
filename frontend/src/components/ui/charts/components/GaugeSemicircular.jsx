"use client";

import { RadialBar, RadialBarChart } from "recharts";

import { ChartContainer } from "@/components/ui/chart";

// ============================================================
// RADIAL BAR (Gauge semicircular)
// ============================================================

export function GaugeSemicircular({ data, config, title }) {
  if (!data?.length) return null;

  const dataKey = Object.keys(config)[0]; // pega a primeira chave do config

  return (
    <div className="flex flex-col items-center">
      <ChartContainer config={config} className="h-[120px] w-[120px]">
        <RadialBarChart
          data={data}
          startAngle={180}
          endAngle={0}
          innerRadius={40}
          outerRadius={60}
          barSize={16}
        >
          <RadialBar dataKey="value" background={false} cornerRadius={4} />
        </RadialBarChart>
      </ChartContainer>

      <span className="text-2xl font-bold -mt-6">{data[0][dataKey]}%</span>
      <span className="text-xs text-muted-foreground mt-1">{config[dataKey]?.label || "Gauge"}</span>
    </div>
  );
}
