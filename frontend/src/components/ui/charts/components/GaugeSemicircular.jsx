"use client";

import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

export function GaugeSemicircular({ data, config, title }) {
  if (!data?.length) return null;

  const dataKey = Object.keys(config)[0]; 

  return (
    <div className="flex flex-col items-center">
      {/* 1. Aumentado de 120px para 180px */}
      <ChartContainer config={config} className="h-[180px] w-[180px]">
        <RadialBarChart
          data={data}
          startAngle={180}
          endAngle={0}
          // 2. Aumentado os raios para preencher o novo espaço
          innerRadius={60}
          outerRadius={85}
          barSize={20}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            dataKey="value"
            background={{ fill: "#7D95C6" }} 
            cornerRadius={6}
          />
        </RadialBarChart>
      </ChartContainer>

      {/* 3. Ajustado a margem negativa para o novo centro do gráfico maior */}
      <div className="flex flex-col items-center -mt-30">
        <span className="text-3xl font-bold leading-none">
          {data[0].value}%
        </span>
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium mt-1">
          {config[dataKey]?.label || "Gauge"}
        </span>
      </div>
    </div>
  );
}