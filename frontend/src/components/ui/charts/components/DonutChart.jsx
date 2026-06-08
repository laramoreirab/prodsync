"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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
}) {
  if (!data?.length) return null;

  const formatValue = (value) =>
    valueFormatter ? valueFormatter(value) : value;

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

      <div className="flex-1 min-h-0 w-full">
        <ChartContainer config={config} className="w-full h-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item) => {
                    const label =
                      config?.[item?.payload?.[nameKey]]?.label ?? name;

                    return (
                      <div className="flex w-full items-center justify-between gap-3">
                        <span className="text-muted-foreground">{label}</span>
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
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy={cy}
              innerRadius={45}
              outerRadius={70}
              label={
                compact
                  ? false
                  : ({ [nameKey]: name, [dataKey]: value }) =>
                      `${name}: ${formatValue(value)}`
              }
            >
              {data.map((entry) => {
                const entryKey = entry[nameKey];
                const fillColor =
                  config?.[entryKey]?.color ?? `var(--color-${entryKey})`;
                return <Cell key={entryKey} fill={fillColor} />;
              })}
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
}