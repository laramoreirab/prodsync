"use client";

import { Cell, Pie, PieChart as RechartsPieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DonutLegend } from "./DonutLegend";

export function CustomPieChart({
  data,
  config,
  title,
  dataKey = "value",
  nameKey = "name",
  children,
  showLegend,
  showOuterLabels = Boolean(showLegend),
  startAngle = 90,
  endAngle = -270,
}) {
  if (!data?.length) return null;

  const getLabel = (key) =>
    String(config?.[key]?.label ?? key).replace(/:\s*$/, "");

  const formatValue = (value) =>
    typeof value === "number" ? value.toLocaleString("pt-BR") : value;

  const positiveData = data.filter((entry) => Number(entry[dataKey]) > 0);

  const legendItems = (showLegend || showOuterLabels)
    ? positiveData
        .map((entry, index) => {
          const entryKey = entry[nameKey];

          return {
            key: `${entryKey}-${index}`,
            color: config?.[entryKey]?.color || entry.fill || "#7d95c6",
            label: getLabel(entryKey),
          };
        })
    : [];

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {title && (
        <div className="absolute top-0 left-0 z-10 text-left">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
        </div>
      )}
      
      {/* Relative wrapper holding both the chart and the absolute center text */}
      <div className="relative flex h-[220px] w-full max-w-[520px] items-center justify-center pt-10">
        <ChartContainer config={config} className="h-full w-full">
          <RechartsPieChart
            className="overflow-visible"
            margin={{ top: 14, right: 16, bottom: 8, left: 16 }}
          >
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item) => {
                    const entryKey = item?.payload?.[nameKey] ?? item?.payload?.name ?? name;
                    const color = config?.[entryKey]?.color || item?.payload?.fill || "#7d95c6";

                    return (
                      <div className="flex items-center gap-1.5 text-foreground">
                        <span
                          className="h-2 w-2 rounded-[2px]"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-medium">
                          {getLabel(entryKey)}: {formatValue(value)}
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              innerRadius={55} 
              outerRadius={80}
              startAngle={startAngle}
              endAngle={endAngle}
              strokeWidth={0}
              className="stroke-background"
              labelLine={false}
              label={false}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={config?.[entry[nameKey]]?.color || entry.fill || "#ccc"} 
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

      <DonutLegend items={legendItems} className="mt-2" />
    </div>
  );
}
