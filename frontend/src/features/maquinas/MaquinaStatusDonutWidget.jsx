"use client";
import { DonutChart } from "@/components/ui/charts/components/DonutChart";
import { useMaquinaStatus } from "./hooks/useMaquinaStatus";
import { maquinaStatusConfig } from "./config/maquinaChartConfig";

export function MaquinaStatusDonutWidget() {
  const { data, loading, error } = useMaquinaStatus();

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  return (
    <><p className="text-sm font-semibold text-black self-start">
      Status Operacional das Máquinas
    </p>
      <p className="text-xs text-gray-400 font-semibold mt-1 self-start mb-2">
        *Atualizado em tempo real
      </p>
      <DonutChart
        data={data}
        config={maquinaStatusConfig}
        dataKey="value"
        nameKey="name"
      /></>


  );
}