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
      mt: "-mt-30",
      valueText: "text-3xl",
      labelText: "text-sm",
    },
    lg: {
      container: "h-[240px] w-[240px]",
      innerRadius: 85,
      outerRadius: 115,
      barSize: 26,
      mt: "-mt-36",
      valueText: "text-5xl",
    },
  };

  const s = sizes[size];

  return (
    <div className="flex flex-col items-center">
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
          <RadialBar dataKey="value" background={{ fill: "#7D95C6" }} cornerRadius={6} />
        </RadialBarChart>
      </ChartContainer>

      <div className={`flex flex-col items-center ${s.mt}`}>
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