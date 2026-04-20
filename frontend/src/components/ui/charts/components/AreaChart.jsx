"use client";

import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
  } from "recharts";
  
  import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart";

  function useChart(config, key) {
    const item = config?.[key];
  
    return {
      color: item?.color || "var(--primary)",
    };
  }

// ============================================================
// AREA CHART (variação do LineChart com área preenchida)
// ============================================================

export function AreaChartBase({
  title,
  description,
  data,
  xKey,
  yKey,
  config,
}) {
  const { color } = useChart(config, yKey);
  const gradientId = `grad-${yKey}`;

  return (
    <div>
      <h3 className="text-sm font-medium mb-1">{title}</h3>

      {description && (
        <p className="text-xs text-muted-foreground mb-3">
          {description}
        </p>
      )}

      <ChartContainer config={config} className="h-[200px] w-full">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId}>
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} />
          <YAxis hide />

          <ChartTooltip content={<ChartTooltipContent />} />

          <Area
            type="monotone"
            dataKey={yKey}
            stroke={color}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

// <AreaChartBase
//       title="Tendência de Refugo"
//       data={data}
//       xKey="dia"
//       yKey="refugo"
//       config={refugoConfig}
//     />