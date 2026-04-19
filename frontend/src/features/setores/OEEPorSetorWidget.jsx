"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useOEEPorSetor } from "./hooks/ueseOEEPorSetor";
import { oeeSetorConfig } from "./config/setoresChartConfig";

export function OEEPorSetorWidget() {
  const { data, loading, error } = useOEEPorSetor();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar OEE.</p>;

  return (
    <div className=" p-1">
      <p className="text-sm font-semibold text-black">OEE Médio por Setor</p>
      <p className="text-xs font-semibold text-gray-400 mb-3">Atualizado em tempo real</p>

      <ChartContainer config={oeeSetorConfig} className="h-[180px] w-full">
        <BarChart data={data} margin={{ top: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="setor"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={v => `${v}`}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            formatter={(value) => [`${value}%`, " do OEE"]}
          />
          <Bar
            dataKey="oee"
            fill="var(--secondary-foreground)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}