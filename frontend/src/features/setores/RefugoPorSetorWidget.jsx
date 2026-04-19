"use client";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useRefugoPorSetor } from "./hooks/useRefugoPorSetor";
import { refugoSetorConfig } from "./config/setoresChartConfig";

export function RefugoPorSetorWidget() {
  const { data, loading, error } = useRefugoPorSetor();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-sm text-destructive">Erro ao carregar refugo.</p>;

  return (
    <div className="p-5 h-full">
      <p className="text-sm font-semibold text-black">Setores com mais produção de peças em refugo</p>
      <p className="text-xs text-gray-400 font-semibold mt-1">
        *Atualizado em tempo real
      </p>

      <ChartContainer config={refugoSetorConfig} className="h-[180px] w-full mt-4">
        <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
          <YAxis
            dataKey="setor"
            type="category"
            tickLine={false}
            axisLine={false}
            width={85}
            tick={{ fontSize: 12 }}
          />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="refugo"
            fill="#23304c"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}