"use client";
import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { useOEECritico } from "../hooks/useOEECritico";

const gaugeConfig = {
  value: { label: "OEE Crítico", color: "#004aad" },
};

export function OEECriticoWidget() {
  const { data, loading, error } = useOEECritico();

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;
  if (error)   return <p className="text-sm text-destructive">Erro ao carregar OEE crítico.</p>;

  const gaugeData = [{ value: data.oee, fill: "#004aad" }];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col h-full">
      <p className="text-sm font-medium text-slate-700">Setor com OEE mais crítico</p>
      <p className="text-[11px] text-gray-400 mb-2">Atualizado em tempo real</p>

      <div className="flex-1 flex flex-col items-center justify-center">
        <ChartContainer config={gaugeConfig} className="h-[160px] w-[200px]">
          <RadialBarChart
            data={gaugeData}
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={90}
            barSize={22}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar dataKey="value" background={{ fill: "#e2e8f0" }} cornerRadius={6} />
          </RadialBarChart>
        </ChartContainer>

        {/* Valor e label centralizados abaixo do gauge */}
        <div className="flex flex-col items-center -mt-14">
          <span className="text-4xl font-semibold text-slate-900">{data.oee}%</span>
          <span className="text-sm font-medium text-slate-600 mt-1">{data.setor}</span>
        </div>
      </div>
    </div>
  );
}