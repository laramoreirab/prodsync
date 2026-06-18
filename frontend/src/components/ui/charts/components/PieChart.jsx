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
  const hasLegend = legendItems.length > 0;
  const chartHeightClass = hasLegend && !title ? "h-[178px]" : "h-[220px]";
  const chartPaddingClass = title ? "pt-10" : "pt-0";
  const chartMargin = hasLegend
    ? { top: 4, right: 16, bottom: 4, left: 16 }
    : { top: 14, right: 16, bottom: 8, left: 16 };

  return (
    <div className="relative flex flex-col items-center justify-center w-full ">
      {title && (
        <div className="absolute top-0 left-0 z-10 text-left p-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-md text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
        </div>
      )}
      
      {/* Relative wrapper holding both the chart and the absolute center text */}
      <div className={`relative box-border flex ${chartHeightClass} w-full max-w-[520px] items-center justify-center ${chartPaddingClass}`}>
        <ChartContainer config={config} className="h-full w-full">
          <RechartsPieChart
            className="overflow-visible"
            margin={chartMargin}
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
