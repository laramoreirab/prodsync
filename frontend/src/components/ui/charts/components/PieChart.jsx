"use client";

import { Cell, Pie, PieChart as RechartsPieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function CustomPieChart({ data, config, title, dataKey = "value", children }) {
  if (!data?.length) return null;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {title && <h3 className="text-sm font-medium mb-3 self-start">{title}</h3>}
      
      <ChartContainer config={config} className="h-[280px] w-[280px]">
        <RechartsPieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={90}
            outerRadius={125}
            startAngle={90}
            endAngle={-270}
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={config[entry.name]?.color || "#ccc"} 
              />
            ))}
          </Pie>
        </RechartsPieChart>
      </ChartContainer>

      {/* Renderiza o texto centralizado se houver children */}
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
          {children}
        </div>
      )}
    </div>
  );
}