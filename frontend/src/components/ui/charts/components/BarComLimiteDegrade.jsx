"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
//  BAR COM LINHA DE REFERÊNCIA E DEGRADÊ
// ============================================================

export function BarComLimiteDegrade({ data, config, title }) {
  if (!data?.length) return null;

  const dataKey = Object.keys(config)[0];

  return (
    <div>
      {title && <h3 className="text-sm font-medium mb-3">{title}</h3>}
      <ChartContainer config={config} className="h-[220px] w-full">
        <BarChart data={data} margin={{ top: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="setor"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tickLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey={dataKey}
            fill={`var(--color-${dataKey})`}
            radius={[4, 4, 0, 0]}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`var(--color-${dataKey})`}
                fillOpacity={1 - index * 0.1}
              />
            ))}
          </Bar>
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