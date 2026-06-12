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
    <div className="flex h-full w-full flex-col">
      <div className="shrink-0">
        <p className="text-sm font-semibold text-foreground">
          Status Operacional das Máquinas
        </p>
        <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
          Atualizado em tempo real
        </p>
      </div>

      <div className="mt-4 min-h-0 flex-1">
        <CustomPieChart
          data={chartData}
          config={maquinaStatusConfig}
          dataKey="value"
          nameKey="name"
          showOuterLabels
          outerLabelLayout="sides"
        />
      </div>
    </div>
  );
}
