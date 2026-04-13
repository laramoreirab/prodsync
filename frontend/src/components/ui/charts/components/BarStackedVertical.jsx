"use client";

import {
    Bar,
    BarChart,
    LabelList,
    XAxis,
    YAxis,
  } from "recharts";
  
  import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart";

// ============================================================
//  BAR CHART STACKED VERTICAL COM % (Status por Turno)
// ============================================================
// LabelList dentro de Bar mostra o valor dentro da barra.

export function BarStackedVertical({ data, config, title }) {
  return (
    <div>
      {title && <h3 className="text-sm font-medium mb-3">{title}</h3>}
      <ChartContainer config={config} className="h-[250px] w-full">
        <BarChart data={data} margin={{ top: 10 }}>
          <XAxis dataKey="turno" tickLine={false} axisLine={false} />
          <YAxis tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="ativas" stackId="turno" fill="var(--color-ativas)">
            <LabelList
              dataKey="ativas"
              position="center"
              formatter={(v) => `${v}%`}
              style={{ fill: "white", fontSize: 11, fontWeight: 600 }}
            />
          </Bar>
          <Bar dataKey="paradas" stackId="turno" fill="var(--color-paradas)">
            <LabelList
              dataKey="paradas"
              position="center"
              formatter={(v) => `${v}%`}
              style={{ fill: "white", fontSize: 11, fontWeight: 600 }}
            />
          </Bar>
          <Bar dataKey="manutencao" stackId="turno" fill="var(--color-manutencao)" radius={[4, 4, 0, 0]}>
            <LabelList
              dataKey="manutencao"
              position="center"
              formatter={(v) => `${v}%`}
              style={{ fill: "white", fontSize: 11, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

