// src/features/eventos/TopMotivosTempoWidget.jsx
"use client";

import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTopMotivosTempo } from "./hooks/useTopMotivosTempo";

const config = {
  minutos: {
    label: "Duração (min)",
    color: "#7d95c6",
  },
};

export function TopMotivosTempoWidget() {
  const { data, loading, error } = useTopMotivosTempo();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar motivos.</p>;

  return (
    <div>
      <p className="text-sm font-semibold text-black">
        Top 3 Motivos de Parada (Tempo)
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <ChartContainer config={config} className="h-[200px] w-full mt-2">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 72 }}>
          <YAxis
            dataKey="motivo"
            type="category"
            tickLine={false}
            axisLine={false}
            width={120}
            tick={{ fontSize: 12 }}
          />
          <XAxis type="number" hide />

          <ChartTooltip
            content={<ChartTooltipContent />}
            formatter={(value) => [`${value} min`, "Duração"]}
          />

          <Bar
            dataKey="minutos"
            fill="var(--color-minutos)"
            radius={[0, 4, 4, 0]}
          >
            <LabelList
              dataKey="tempo"
              position="right"
              style={{ fontSize: 13, fontWeight: 600, fill: "#545454" }}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}