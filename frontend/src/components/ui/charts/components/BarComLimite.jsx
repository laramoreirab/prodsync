"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// ============================================================
//  BAR COM LINHA DE REFERÊNCIA 
// ============================================================


export function BarComLimite({data, config, title}) {
  if (!data?.length) return null;

  const dataKey = Object.keys(config)[0];
 
  return (
    <div className="relative">
      {title && (
        <div className="absolute top-0 left-0 z-10 text-left">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Atualizado em tempo real</p>
        </div>
      )}
      <ChartContainer config={config} className="h-[220px] w-full pt-10">
        <BarChart data={data} margin={{ top: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="setor" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey={dataKey} fill={`var(--color-${dataKey})`} radius={[4, 4, 0, 0]} />
          <ReferenceLine
            y={60}
            stroke="red"
            strokeDasharray="4 4"
            label={{
              value: "Limite: 60%",
              position: "insideTopRight",
              fontSize: 11,
              fill: "red",
            }}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
