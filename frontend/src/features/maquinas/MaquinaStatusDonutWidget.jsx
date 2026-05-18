"use client";
import { DonutChart } from "@/components/ui/charts/components/DonutChart";
import { useMaquinaStatus } from "./hooks/useMaquinaStatus";
import { maquinaStatusConfig } from "./config/maquinaChartConfig";

export function MaquinaStatusDonutWidget({ setorId }) {
  const { data, loading, error } = useMaquinaStatus(setorId);

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;

  const chartData = data
    .filter(item => !setorId || item.setorId === setorId)
    .map((item) => ({
      ...item,
      // Garantimos que o name seja uma string válida para o DonutChart não quebrar
      name: item.name ? item.name.toLowerCase() : "desconhecido",
      value: Number(item.value) || 0
    }));

  if (chartData.length === 0) {
    return <p className="text-xs text-muted-foreground">Sem máquinas neste setor.</p>;
  }

  return (
    <><p className="text-sm font-semibold text-black self-start">
      Status Operacional das Máquinas
    </p>
      <p className="text-xs text-gray-400 font-semibold mt-1 self-start mb-2">
        *Atualizado em tempo real
      </p>
      <DonutChart
        data={chartData}
        config={maquinaStatusConfig}
        dataKey="value"
        nameKey="name"
        chartSize="donutDefault"
      />
      </>
  );
}