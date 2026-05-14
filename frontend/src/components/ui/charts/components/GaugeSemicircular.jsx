"use client";

import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

export function GaugeSemicircular({ data, config, title, size = "default" }) {
  if (!data?.length) return null;

  const dataKey = Object.keys(config)[0];

  const sizes = {
    default: {
      container: "h-[180px] w-[180px]",
      innerRadius: 60,
      outerRadius: 85,
      barSize: 20,
      overlay: "pt-14",
      valueText: "text-3xl",
      labelText: "text-sm",
    },
    lg: {
      container: "h-[240px] w-[240px]",
      innerRadius: 85,
      outerRadius: 115,
      barSize: 26,
      overlay: "pt-20",
      valueText: "text-5xl",
      labelText: "text-sm",
    },
  };

  const s = sizes[size];

  return (
    <div className={`relative flex ${s.container} items-center justify-center`}>
      <ChartContainer config={config} className={`${s.container}`}>
        <RadialBarChart
          data={data}
          startAngle={180}
          endAngle={0}
          innerRadius={s.innerRadius}
          outerRadius={s.outerRadius}
          barSize={s.barSize}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar dataKey="value" background={{ fill: "var(--chart-accent)" }} cornerRadius={6} />
        </RadialBarChart>
      </ChartContainer>

      <div className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center ${s.overlay}`}>
        <span className={`${s.valueText} font-bold leading-none`}>
          {data[0].value}%
        </span>
        <span className={`${s.labelText} uppercase tracking-wider text-muted-foreground font-medium mt-1`}>
          {config[dataKey]?.label || "Gauge"}
        </span>
      </div>
    </div>
  );
}
