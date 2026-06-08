"use client";

import { Cell, Pie, PieChart as RechartsPieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function CustomPieChart({ data, config, title, dataKey = "value", children }) {
  if (!data?.length) return null;

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {title && (
        <div className="absolute top-0 left-0 z-10 text-left">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
        </div>
      )}
      
      {/* Relative wrapper holding both the chart and the absolute center text */}
      <div className="relative flex items-center justify-center h-[180px] w-[320px] pt-10">
        <ChartContainer config={config} className="h-full w-full">
          <RechartsPieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55} 
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
              className="stroke-background"
              
              // ATIVA AS "SETAS"/LINHAS:
              // labelLine={{ stroke: "#94a3b8", strokeWidth: 1 }}
              // label={({ name, cx, x, y, textAnchor }) => {
              //   const color = config[name]?.color || "currentColor";
              //   return (
              //     <text
              //       cx={cx}
              //       x={x}
              //       y={y}
              //       textAnchor={textAnchor}
              //       className="text-xs font-medium dynamic-label"
              //       fill={color}
              //     >
              //       {config[name]?.label || name}
              //     </text>
              //   );
              // }}
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