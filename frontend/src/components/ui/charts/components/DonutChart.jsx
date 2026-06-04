"use client";

import {
  Cell,
  Pie,
  PieChart,
} from "recharts";

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
  compact = false,
  valueFormatter,
  chartClassName = "h-[180px] w-full",
  cy = "50%",
}) {
  if (!data?.length) return null;

  const formatValue = (value) => valueFormatter ? valueFormatter(value) : value;

  return (
    <div>
      {title && <h3 className="text-sm font-medium mb-3">{title}</h3>}
      <ChartContainer config={config} className={chartClassName}>
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name, item) => {
                  const label = config?.[item?.payload?.[nameKey]]?.label ?? name;

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
            label={compact ? false : ({ [nameKey]: name, [dataKey]: value }) => `${name}: ${formatValue(value)}`}
          >
            {data.map((entry) => {
              const entryKey = entry[nameKey];
              const fillColor = config?.[entryKey]?.color ?? `var(--color-${entryKey})`;
              return <Cell key={entryKey} fill={fillColor} />;
            })}
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
