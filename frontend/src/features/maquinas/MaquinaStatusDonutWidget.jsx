"use client";
import { CustomPieChart } from "@/components/ui/charts/components/PieChart";
import { useMaquinaStatus } from "./hooks/useMaquinaStatus";
import { maquinaStatusConfig } from "./config/maquinaChartConfig";

export function MaquinaStatusDonutWidget({ setorId }) {
  const { data, loading, error } = useMaquinaStatus(setorId);

  if (loading) return <p className="text-xs text-muted-foreground">Carregando...</p>;
  if (error) return <p className="text-xs text-red-500">Erro ao carregar dados.</p>;
  if (!data) return <p className="text-xs text-muted-foreground">Nenhum dado encontrado.</p>;
  if (Array.isArray(data) && data.length === 0) {
    return <p className="text-xs text-muted-foreground">Nenhum registro disponível.</p>;
  }

  const chartData = data.map((item) => ({
    name: String(item.name || item.status || "desconhecido").toLowerCase(),
    value: Number(item.value ?? item.total) || 0,
  }));

  if (chartData.length === 0) {
    return <p className="text-xs text-muted-foreground">Sem máquinas neste setor.</p>;
  }

  return (
    <>
      <p className="text-sm font-semibold text-black self-start">
        Status Operacional das Máquinas
      </p>
      <p className="text-xs text-gray-400 font-semibold mt-1 self-start mb-2">
        *Atualizado em tempo real
      </p>
      <CustomPieChart
        data={chartData}
        config={maquinaStatusConfig}
        dataKey="value"
      />
    </>
  );
}
