"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DonutLegend } from "./DonutLegend";

// ============================================================
// DONUT CHART
// ============================================================

export function DonutChart({
  data,
  config,
  title,
  dataKey,
  nameKey,
  description,
  compact = false,
  valueFormatter,
  cy = "50%",
  showOuterLabels = !compact,
  showLegend = showOuterLabels,
  innerRadius = 45,
  outerRadius = 70,
  maxSlices = 6,
}) {
  if (!data?.length) return null;

  const formatValue = (value) =>
    valueFormatter ? valueFormatter(value) : value;

  const getLabel = (key) =>
    String(config?.[key]?.label ?? key).replace(/:\s*$/, "");

  const positiveData = data.filter((entry) => Number(entry[dataKey]) > 0);
  const chartData = maxSlices ? positiveData.slice(0, maxSlices) : positiveData;
  const legendItems = showLegend
    ? chartData.map((entry, index) => {
        const entryKey = entry[nameKey];

        return {
          key: `${entryKey}-${index}`,
          color: config?.[entryKey]?.color ?? entry.fill ?? `var(--color-${entryKey})`,
          label: getLabel(entryKey),
        };
      })
    : [];
  const hasLegend = legendItems.length > 0;
  const chartMargin = hasLegend
    ? { top: 4, right: 16, bottom: 4, left: 16 }
    : { top: 14, right: 16, bottom: 8, left: 16 };

  return (
    <div className="flex flex-col w-full h-full">
      {/* ── Header ── */}
      {(title || description) && (
        <div className="shrink-0 text-left mb-2">
          {title && (
            <h3 className="text-sm font-semibold text-foreground leading-tight">
              {title}
            </h3>
          )}
          {title && (
            <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
              Atualizado em tempo real
            </p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}

      <div className="relative flex min-h-0 flex-1 flex-col w-full">
        <div className="min-h-0 flex-1 w-full">
          <ChartContainer config={config} className="w-full h-full">
            <PieChart margin={chartMargin}>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name, item) => {
                      const entryKey = item?.payload?.[nameKey] ?? name;
                      const label = getLabel(entryKey);
                      const color =
                        config?.[entryKey]?.color ?? item?.payload?.fill ?? `var(--color-${entryKey})`;

                      return (
                        <div className="flex w-full items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span
                              className="h-2 w-2 rounded-[2px]"
                              style={{ backgroundColor: color }}
                              aria-hidden="true"
                            />
                            {label}
                          </span>
                          <span className="font-mono font-medium text-foreground tabular-nums">
                            {formatValue(value)}
                          </span>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                labelLine={false}
                label={false}
              >
                {chartData.map((entry) => {
                  const entryKey = entry[nameKey];
                  const fillColor =
                    config?.[entryKey]?.color ?? `var(--color-${entryKey})`;
                  return <Cell key={entryKey} fill={fillColor} />;
                })}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        <DonutLegend items={legendItems} className="mt-1" />
      </div>
    </div>
  );
}
