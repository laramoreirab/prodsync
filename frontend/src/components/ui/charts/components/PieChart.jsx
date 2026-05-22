"use client";

import { Cell, Pie, PieChart as RechartsPieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function CustomPieChart({ data, config, title, dataKey = "value", children }) {
  if (!data?.length) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Title sits cleanly outside the chart positioning logic */}
      {title && <h3 className="text-sm font-medium mb-3 self-start">{title}</h3>}
      
      {/* Relative wrapper holding both the chart and the absolute center text */}
      <div className="relative flex items-center justify-center h-[180px] w-[580px]">
        <ChartContainer config={config} className="h-full w-full">
          <RechartsPieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55} // Donut
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
              className="stroke-background"
              
              // ATIVA AS "SETAS"/LINHAS:
              labelLine={{ stroke: "#94a3b8", strokeWidth: 1 }}
              label={({ name, cx, x, y, textAnchor }) => {
                const color = config[name]?.color || "currentColor";
                return (
                  <text
                    cx={cx}
                    x={x}
                    y={y}
                    textAnchor={textAnchor}
                    className="text-xs font-medium dynamic-label"
                    fill={color}
                  >
                    {config[name]?.label || name}
                  </text>
                );
              }}
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

        {children && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}